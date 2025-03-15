import { BitArray } from "../src/bitArray";

interface InvisCharsDBRow {
  id: number;
  charCode: number;
  ua: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const ua = context.request.headers.get("user-agent");
  if (!ua) {
    return new Response(null, { status: 400 });
  }

  const upgradeHeader = context.request.headers.get("Upgrade");
  if (upgradeHeader !== "websocket") {
    return new Response("Expected Upgrade: websocket", { status: 426 });
  }

  if (context.env.DISABLE_INVIS_CHARS_ENDPOINT) {
    return new Response(null, { status: 200 });
  }

  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);

  server.accept();

  const insertStmt = context.env.InvisCharsDB.prepare(
    "INSERT INTO chars (charCode, ua) VALUES (?, ?);",
  );

  server.addEventListener("message", async (e) => {
    if (typeof e.data === "string") {
      server.close(4000);
      return;
    }

    const data = new Uint8Array(e.data);

    // Last two bytes 16 and 17 are the char code
    const charCode = BigInt(data[16]) | (BigInt(data[17]) << 8n);

    if (charCode % 128n) {
      server.close(4000);
      return;
    }

    // TODO: is slice necessary?
    const chars = BitArray.fromUint8Array(data.slice(0, 16));

    for (let i = 0n; i < 128n; i++) {
      const char = chars.get(i);

      if (char) {
        // TODO: batch insert
        console.log(await insertStmt.bind(charCode + i, ua).run());
      }
    }
  });

  // https://developers.cloudflare.com/workers/observability/errors/#cause-2-websocket-connections-that-are-never-closed
  server.addEventListener("close", () => {
    server.close();
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
};

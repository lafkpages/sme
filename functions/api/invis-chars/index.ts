import { serialize } from "../../../node_modules/cookie/dist/index";
import { UAParser } from "../../../node_modules/ua-parser-js/src/main/ua-parser";
import { parseCookies } from "../../../src/functions/utils";
import { BitArray } from "../../../src/shared/bitArray";

interface InvisCharsDBCharsRow {
  testId: number;
  charCode: number;
}

interface InvisCharsDBTestsRow {
  testId: number;
  timestamp: number;
  browserName: string | null;
  cpuArchitecture: string | null;
  deviceModel: string | null;
  deviceVendor: string | null;
  engineName: string | null;
  osName: string | null;
  userAgent: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.env.DISABLE_INVIS_CHARS_ENDPOINT) {
    return new Response(null, { status: 503 });
  }

  if (context.request.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  const uaString = context.request.headers.get("user-agent");
  if (!uaString) {
    return new Response(null, { status: 400 });
  }

  const cookies = parseCookies(context.request);

  if (cookies["charTestId"]) {
    return new Response(null, { status: 400 });
  }

  const data = await context.request.bytes();

  if (data.byteLength !== 8192) {
    return new Response(null, { status: 400 });
  }

  const chars = BitArray.fromUint8Array(data);

  if (!chars.buffer) {
    return new Response(null, { status: 400 });
  }

  const ua = new UAParser(uaString);
  const uaBrowser = ua.getBrowser();
  const uaCPU = ua.getCPU();
  const uaDevice = ua.getDevice();
  const uaEngine = ua.getEngine();
  const uaOS = ua.getOS();

  const testResult = await context.env.InvisCharsDB.prepare(
    "INSERT INTO tests (timestamp, browserName, cpuArchitecture, deviceModel, deviceVendor, engineName, osName, userAgent) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING testId",
  )
    .bind(
      Date.now(),
      uaBrowser.name || null,
      uaCPU.architecture || null,
      uaDevice.model || null,
      uaDevice.vendor || null,
      uaEngine.name || null,
      uaOS.name || null,
      ua.getUA(),
    )
    .run<InvisCharsDBTestsRow>();

  console.debug("INSERT INTO tests:", testResult);

  const testId = testResult.results[0].testId;

  const statements: D1PreparedStatement[] = [];
  for (let i = 0; i < 0xffff; i++) {
    if (chars.get(BigInt(i))) {
      statements.push(
        context.env.InvisCharsDB.prepare(
          "INSERT INTO chars (testId, charCode) VALUES (?, ?)",
        ).bind(testId, i),
      );
    }
  }

  await context.env.InvisCharsDB.batch<InvisCharsDBCharsRow>(statements);

  return new Response(null, {
    status: 201,
    headers: {
      "set-cookie": serialize("charTestId", testId.toString()),
    },
  });
};

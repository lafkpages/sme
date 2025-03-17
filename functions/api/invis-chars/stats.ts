// TODO: fix this import
import { encode } from "@msgpack/msgpack";

import { ensureAuthed } from "../../../src/functions/utils";

type StatsKey = (typeof keys)[number];
const keys = [
  "browserNameCount",
  "cpuArchitectureCount",
  "deviceModelCount",
  "deviceVendorCount",
  "engineNameCount",
  "osNameCount",
] as const;

const _onRequest: PagesFunction<Env> = async (context) => {
  if (context.env.DISABLE_INVIS_CHARS_ENDPOINT) {
    return new Response(null, { status: 503 });
  }

  const { authError } = ensureAuthed(context);
  if (authError) {
    return authError;
  }

  const { testsCount } = (await context.env.InvisCharsDB.prepare(
    "SELECT count(*) AS testsCount FROM tests",
  ).first<{ testsCount: number }>())!;

  const statements: D1PreparedStatement[] = [];
  for (const key of keys) {
    statements.push(
      context.env.InvisCharsDB.prepare(
        `--sql
        SELECT charCode, ${key} FROM charsStats WHERE ${key} > 0 ORDER BY ${key} DESC
        `,
      ),
    );
  }

  const statsResults = await context.env.InvisCharsDB.batch<{
    [K in "charCode" | StatsKey]: number;
  }>(statements);

  // @ts-expect-error
  const stats: Record<StatsKey, [number, number][]> = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const results = statsResults[i].results;

    if (!results.length) {
      console.warn("No stats results for", key);
      continue;
    }

    stats[key] = [];

    for (const row of results) {
      stats[key].push([row.charCode, row[key]]);
    }
  }

  return new Response(encode({ testsCount, stats }), {
    headers: {
      "content-type": "application/json",
    },
  });
};

const enableCache = false;
export const onRequest: PagesFunction<Env> = async (context) => {
  if (enableCache) {
    const cached = await caches.default.match(context.request);

    if (cached) {
      return cached;
    }
  }

  const response = await _onRequest(context);

  if (enableCache) {
    await caches.default.put(context.request, response.clone());
  }

  return response;
};

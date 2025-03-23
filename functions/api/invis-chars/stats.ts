// TODO: fix this import
import { encode } from "@msgpack/msgpack";

import { ensureAuthed } from "../../../src/functions/utils";

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

  const { results: stats } = await context.env.InvisCharsDB.prepare(
    `--sql
          SELECT
            charCode,
            browserNameCount,
            cpuArchitectureCount,
            deviceModelCount,
            deviceVendorCount,
            engineNameCount,
            osNameCount,
            (browserNameCount + cpuArchitectureCount + deviceModelCount + deviceVendorCount + engineNameCount + osNameCount) AS totalCount,
            (browserNameCount * 3 + osNameCount * 2 + deviceModelCount) AS score
          FROM charsStats WHERE totalCount > 0 ORDER BY charCode ASC
        `,
  ).all<{
    charCode: number;
    browserNameCount: number;
    cpuArchitectureCount: number;
    deviceModelCount: number;
    deviceVendorCount: number;
    engineNameCount: number;
    osNameCount: number;
    totalCount: number;
    score: number;
  }>();

  return new Response(encode({ testsCount, stats }));
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

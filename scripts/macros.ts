import { readdirSync, readFileSync } from "node:fs";

export function getDistChunks() {
  return readdirSync(`dist/chunks`).map((asset) => `/chunks/${asset}`);
}

export function getBuildTimestamp() {
  const buildTimestamp = parseInt(
    readFileSync("dist/.build-timestamp.txt", "utf-8"),
  );

  if (!buildTimestamp) {
    console.error(new Error("BUILD_TIMESTAMP is not set"));
    process.exit(1);
  }

  return buildTimestamp;
}

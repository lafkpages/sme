/// <reference lib="WebWorker" />

import {
  getBuildTimestamp,
  getDistChunks,
} from "../scripts/macros" with { type: "macro" };

declare var self: ServiceWorkerGlobalScope;

const buildTimestamp = getBuildTimestamp();
const cacheName = `sme-${buildTimestamp}`;

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      cache.addAll([
        "/",
        ...getDistChunks(),
        "/manifest.json",
        "/assets/favicon96.png",
        "/assets/favicon512.png",
      ]);
    }),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();

      for (const key of keys) {
        const timestamp = parseInt(key.match(/^sme-(\d+)$/)?.[1] || "0");

        if (isNaN(timestamp) || timestamp < buildTimestamp) {
          console.log("Clearing cache:", key);
          await caches.delete(key);
        }
      }
    })(),
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);

      console.log("Fetching", e.request.url);

      if (r && !navigator.onLine) {
        return r;
      }

      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);

      console.log("Caching", e.request.url);

      cache.put(e.request, response.clone());

      return response;
    })(),
  );
});

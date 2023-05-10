const cacheName = "secret-message-encoder";

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      cache.addAll([
        "/",
        "/src/style.css",
        "/src/script.js",
        "/src/encoders.js",
        "/src/sw.js",
        "/manifest.json",
        "/favicon96.png",
        "/favicon512.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);

      console.log("Fetching", e.request.url);

      if (r && !navigator.onLine) return r;

      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);

      console.log("Caching", e.request.url);

      cache.put(e.request, response.clone());

      return response;
    })()
  );
});

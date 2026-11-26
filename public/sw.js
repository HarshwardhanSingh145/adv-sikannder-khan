const CACHE_NAME = "adv-sikandar-workspace-v3";
const STATIC_ASSETS = ["./", "./index.html", "./manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Serve iOS configuration profiles with Apple's mandatory MIME type so Safari opens the native Profile Installer
  // even when hosted on static hosts like GitHub Pages (which default to application/octet-stream).
  if (url.pathname.toLowerCase().endsWith(".mobileconfig")) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" }).then(async (response) => {
        const buffer = await response.arrayBuffer();
        return new Response(buffer, {
          status: response.status,
          statusText: response.statusText,
          headers: {
            "Content-Type": "application/x-apple-aspen-config",
            "Cache-Control": "no-store",
          },
        });
      })
    );
    return;
  }

  // Bypass Service Worker for HTTP Range requests (e.g. iOS Safari <video> streaming) and large binaries
  if (
    event.request.headers.has("range") ||
    url.pathname.toLowerCase().endsWith(".mp4") ||
    url.pathname.toLowerCase().endsWith(".apk")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
  );
});

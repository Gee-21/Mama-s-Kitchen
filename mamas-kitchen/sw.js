/* Service worker: cache the app shell so the menu still opens on a shaky network. */
const CACHE = "mamas-kitchen-v1";
const PRECACHE = [
  "./",
  "./index.html",
  "./menu.html",
  "./cart.html",
  "./checkout.html",
  "./confirmation.html",
  "./contact.html",
  "./offline.html",
  "./css/styles.css",
  "./js/data.js",
  "./js/app.js",
  "./js/home.js",
  "./js/menu.js",
  "./js/cart-page.js",
  "./js/checkout.js",
  "./js/confirmation.js",
  "./js/contact.js",
  "./manifest.webmanifest",
  "./assets/icons/icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith(
    (async () => {
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(CACHE);
        cache.put(request, fresh.clone());
        return fresh;
      } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") return caches.match("./offline.html");
        return new Response("", { status: 408 });
      }
    })()
  );
});

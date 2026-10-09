/* Broker Book service worker: works offline, picks up new versions automatically */
const VERSION = "bb-2026-10-07-12";
const SHELL = [
  "./", "./index.html", "./manifest.json",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-192.png", "./icons/maskable-512.png", "./icons/icon-180.png", "./icons/icon-32.png"
];
const CDN = ["https://cdnjs.cloudflare.com", "https://fonts.googleapis.com", "https://fonts.gstatic.com"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // The app page: try the network first so updates show up, fall back to the saved copy offline
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put("./index.html", copy));
        return res;
      }).catch(() => caches.match("./index.html").then((r) => r || caches.match("./")))
    );
    return;
  }

  // Fonts and the Excel library: serve saved copy, refresh it in the background
  if (CDN.some((h) => req.url.startsWith(h))) {
    e.respondWith(
      caches.open(VERSION).then((c) => c.match(req).then((hit) => {
        const net = fetch(req).then((res) => { if (res.ok || res.type === "opaque") c.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      }))
    );
    return;
  }

  // Own files (icons, manifest): saved copy first
  if (url.origin === self.location.origin) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) caches.open(VERSION).then((c) => c.put(req, res.clone()));
      return res;
    })));
  }
});

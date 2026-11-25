const CACHE_NAME = 'annual-apps-studio-v1'

const PRECACHE = [
  '/',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/pwa-192.png',
  '/pwa-512.png',
  '/fonts/lxgw-regular.woff2',
  '/fonts/lxgw-medium.woff2',
  '/backgrounds/bg_forest.webp',
  '/backgrounds/bg_bay.webp',
  '/backgrounds/bg_night.webp',
  '/icons/localsend.webp',
  '/icons/faststone.webp',
  '/icons/typeless.webp',
  '/icons/wetype.webp',
  '/icons/doubao_ime.webp',
  '/icons/v2rayn.webp',
  '/icons/trae.webp',
  '/icons/workbuddy.webp',
  '/icons/claude_code.webp',
  '/icons/hermes.webp',
  '/icons/deepseek_harness.webp',
  '/icons/notepadpp.webp',
  '/icons/obsidian.webp',
  '/icons/typora.webp',
  '/icons/feishu.webp',
  '/icons/chrome.webp',
  '/icons/edge.webp',
  '/icons/douyin.webp',
  '/icons/yuanbao.webp',
  '/icons/wechat.webp',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      await cache.addAll(PRECACHE)
      const html = await fetch('/').then((response) => response.text())
      const assets = Array.from(html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)).map(
        (match) => match[1],
      )
      if (assets.length) {
        await cache.addAll(assets)
      }
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put('/', copy))
          return response
        })
        .catch(() => caches.match('/', { ignoreVary: true })),
    )
    return
  }

  event.respondWith(
    caches.match(request, { ignoreVary: true }).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => cached)
      return cached || network
    }),
  )
})

import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  CacheFirst,
  ExpirationPlugin,
  NetworkFirst,
  NetworkOnly,
  Serwist,
  StaleWhileRevalidate,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: any;

// fetch() rejects requests with mode "navigate", so convert it before
// the SW re-fetches a navigation request internally
const fixNavigateMode = {
  requestWillFetch: async ({ request }: { request: Request }) => {
    if (request.mode === "navigate") {
      return new Request(request.url, {
        method: request.method,
        headers: request.headers,
        mode: "same-origin",
        credentials: request.credentials,
        redirect: request.redirect,
        referrer: request.referrer,
        integrity: request.integrity,
      });
    }
    return request;
  },
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  runtimeCaching: [
    // 1. Bypass SW for analytics — must not be cached
    {
      matcher: ({ url }) =>
        url.hostname === "www.googletagmanager.com" ||
        url.hostname === "www.google-analytics.com",
      handler: new NetworkOnly(),
    },

    // 2. Google Fonts — Cache-First for webfonts, StaleWhileRevalidate for stylesheets
    {
      matcher: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      handler: new CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 8,
            maxAgeSeconds: 365 * 24 * 60 * 60,
          }),
        ],
      }),
    },
    {
      matcher: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      handler: new StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 8,
            maxAgeSeconds: 7 * 24 * 60 * 60,
          }),
        ],
      }),
    },

    // 3. App Shell — Cache-First for static assets from same origin
    {
      matcher: ({ request, sameOrigin }) =>
        sameOrigin &&
        (request.destination === "style" ||
          request.destination === "script" ||
          request.destination === "font"),
      handler: new CacheFirst({
        cacheName: "app-shell",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 80,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          }),
        ],
      }),
    },
    {
      matcher: ({ request, sameOrigin }) =>
        sameOrigin && request.destination === "image",
      handler: new CacheFirst({
        cacheName: "app-shell-images",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 80,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          }),
        ],
      }),
    },

    // 4. Same-origin navigations — Network-First with 3s timeout
    {
      matcher: ({ request, sameOrigin }) =>
        sameOrigin &&
        (request.mode === "navigate" || request.destination === "document"),
      handler: new NetworkFirst({
        cacheName: "pages",
        networkTimeoutSeconds: 3,
        plugins: [
          fixNavigateMode,
          new ExpirationPlugin({
            maxEntries: 30,
            maxAgeSeconds: 24 * 60 * 60,
          }),
        ],
      }),
    },

    // 5. Same-origin requests (excluding API) — Network-First
    {
      matcher: ({ sameOrigin, url }) =>
        sameOrigin && !url.pathname.startsWith("/api/"),
      handler: new NetworkFirst({
        cacheName: "same-origin",
        plugins: [
          fixNavigateMode,
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60,
          }),
        ],
      }),
    },

    // 6. Cross-origin requests — Network-First with longer timeout
    {
      matcher: ({ sameOrigin }) => !sameOrigin,
      handler: new NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          fixNavigateMode,
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 60 * 60,
          }),
        ],
      }),
    },
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher: ({ request }) =>
          request.mode === "navigate" || request.destination === "document",
      },
    ],
  },
});

serwist.addEventListeners();

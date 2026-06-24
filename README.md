# WindowSmash 🪟

A mobile-first DoorDash-style experience without the calories. Browse real nearby restaurants via Google Maps, build a cart, and feel the dopamine hit of ordering — nothing is sent to any restaurant.

**Live:** [glmorris1.github.io/WindowSmash](https://glmorris1.github.io/WindowSmash/)

## Setup

1. Create a [Google Cloud](https://console.cloud.google.com/) project
2. Enable **Places API (New)** and **Geocoding API**
3. Create an API key (restrict to your domain for production)
4. Either:
   - Paste the key in the app on first visit (saved in localStorage), or
   - Add `GOOGLE_MAPS_API_KEY` as a GitHub repo secret for CI builds

## Local dev

```bash
npm install
npm run dev
```

## Deploy

Pushes to `main` auto-deploy via GitHub Actions. Enable Pages under repo Settings → Pages → Source: GitHub Actions.
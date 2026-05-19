# ProductiQuest

ProductiQuest is now scaffolded as a real app project instead of a CDN-only HTML preview.

## What This Runs On

- Local browser development: Vite dev server.
- Windows desktop app: Electron.
- Android app: Capacitor Android.
- iOS app: Capacitor iOS. iOS builds require macOS, Xcode, and an Apple developer setup.

## First-Time Setup

Install Node.js LTS from https://nodejs.org, then run:

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Then open the local URL Vite prints, usually `http://127.0.0.1:5173/`.

## Windows Desktop

```bash
npm run desktop
```

To create a Windows installer:

```bash
npm run desktop:package
```

## Android

Install Android Studio first, then:

```bash
npm run build
npx cap add android
npm run android
```

## iOS

Run this on a Mac with Xcode installed:

```bash
npm run build
npx cap add ios
npm run ios
```

# space/ — Passport Integration Layer

This folder is the bridge between the main website and the cloud-passport app.
It never imports from `cloud-passport/` directly. All communication happens via URL params and `window.postMessage`.

## File Map

```
src/space/
├── index.js                    ← Barrel export — import everything from here
│
├── config/
│   └── passportLinks.js        ← All passport app URLs (register, login, dashboard, profile)
│
├── auth/
│   └── passportBridge.js       ← goToPassport(), onPassportMessage(), postToPassport()
│
├── hooks/
│   └── usePassportStatus.js    ← React hook: checks URL params for active passport session
│
├── components/
│   └── PassportBadge.jsx       ← Navbar badge shown when user has an active passport
│
└── utils/
    └── passportHelpers.js      ← getPassportFromURL(), formatXP(), getTierLabel(), hasActivePassport()
```

## How to use

Always import from the barrel:
```js
import { PASSPORT_LINKS, usePassportStatus, PassportBadge, getPassportFromURL } from '../space'
```

## Passport URL Params

When a user returns from the passport app, the URL will contain:
- `?passport_token=xxx`   — session token
- `?passport_user=xxx`    — username
- `?passport_xp=xxx`      — XP count
- `?passport_tier=xxx`    — tier number (1–5)

## Tier System

| Tier | Label              |
|------|--------------------|
| 1    | NOVICE BUILDER     |
| 2    | CLOUD EXPLORER     |
| 3    | AWS PRACTITIONER   |
| 4    | CLOUD ARCHITECT    |
| 5    | MASTER BUILDER     |

## Environment Variable

Set `VITE_PASSPORT_URL` in your `.env` to point to the passport app.
Defaults to `http://localhost:3001` in development.

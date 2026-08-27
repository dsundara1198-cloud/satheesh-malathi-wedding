# Satheesh Arul & Malathi Vasudevan — Wedding Invitation

A mobile-first, static wedding invitation built with plain HTML, CSS and JavaScript. It is designed to reproduce the premium interaction flow of the supplied reference reel while using an original visual design and the supplied wedding images.

## Features

- Animated envelope + seal opening gate
- Invitation cover with beach-inspired hero
- Touch/mouse scratch-to-reveal card
- Couple introduction with supplied couple image
- Live countdown to 13 September 2026, 7:30 AM IST
- Haldi & Mehendi, Reception, and Wedding/Muhurtham timeline
- Beach venue section with supplied beach image
- Google Maps directions button
- WhatsApp RSVP / wishes with pre-filled message
- Scroll reveals, floating petals, responsive layouts, reduced-motion support
- No backend and no database; easy to host free

## Folder structure

```text
wedding-invitation/
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
    ├── couple.jpg
    ├── haldi.jpg
    ├── reception.jpg
    ├── wedding.jpg
    └── beach.jpg
```

## Run locally

Because this is a static site, you can double-click `index.html`, but a local server is recommended:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Free hosting — GitHub Pages

1. Create a GitHub account if you do not have one.
2. Create a new public repository, e.g. `satheesh-malathi-wedding`.
3. Upload **everything inside this folder**, including the `assets` folder.
4. Open repository **Settings → Pages**.
5. Under deployment/source, select **Deploy from a branch**.
6. Select the `main` branch and `/ (root)`, then save.
7. GitHub will publish a public URL for the invitation.
8. Share that URL through WhatsApp.

## Important customizations

All wedding details are already filled in `index.html` and `script.js`.

- WhatsApp number: `9514216803` (the code uses international format `919514216803` for WhatsApp)
- Directions: `https://share.google/BQaY31mBCdPCMj4sA`
- Countdown: `2026-09-13T07:30:00+05:30`

The supplied reference reel is **not** included in the deployed site because it is only used as visual/interaction reference.

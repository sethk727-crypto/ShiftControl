# ShiftControl
Ai Automation

Marketing site for **SK ShiftControl** — operational automation for hospitality and retail operators.

## Stack

Zero-framework, zero-build static site engineered for speed:

- `index.html` — agency homepage (CRM / data / AI systems positioning, Calendly booking)
- `venues.html` — hospitality & retail vertical landing page (original ShiftControl offer)
- `docs/site-blueprint.md` — full website blueprint: section copy, CRO rationale, and bracketed slots to fill in
- `styles.css` — token-driven design system (color, type, spacing, motion all bound to `:root` variables)
- `script.js` — behavior layer (tabs, live dashboard, modals, mobile menu, scroll reveal)
- `server.js` — minimal Express static server for local dev / hosting

## Run locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

Any static host (Vercel, Netlify, GitHub Pages) can serve the site directly — no build step required.

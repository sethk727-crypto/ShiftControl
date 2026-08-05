# SK ShiftControl — Conversion & Intent-Routing Playbook

Principal-designer overhaul of the marketing + onboarding engine.
Companion to `docs/site-blueprint.md` (design system) and
`docs/sales-playbook.md` (call scripts). Sections marked **SHIPPED** are
live on the site; everything else is the standing spec to build toward.

**Integrity rule (non-negotiable):** no fabricated logos, review badges,
star ratings, or testimonial metrics — ever. Every trust slot below
defines what activates it. Empty slots stay invisible, not faked.

---

## (A) Hero & Sub-Hero — SHIPPED

**Conversion objective (singular):** book the Systems Audit.
Everything else on the page exists to make that one click feel safe.
The demo is the *evaluation path* for not-yet-ready visitors — it feeds
the same objective, one visit later.

| Element | Copy | Why |
|---|---|---|
| Headline | **Every Call Answered. Every Follow-Up Sent. Nothing Slips.** | Concrete outcomes, ~5th-grade words, passes the 5-second test. The old "Scale Faster. See Clearer. Carry Less." was rhythm without a picture — a first-time visitor couldn't say what we do. |
| Subhead | "SK ShiftControl builds AI agents that run your front office — the phones, the follow-ups, the scheduling, the pipeline. Your team stops drowning in busywork. You finally see every number in one place. We build it, deploy it, and train your people — most floors go live in weeks, not months." | The three-part formula in order: what you get → why it matters → how it works. Grade ~6 reading level. |
| Primary CTA | **Book the Systems Audit** + micro: "30 minutes · Free · You keep the map either way" | Friction-reversal lives *adjacent to the button*, not in a paragraph three scrolls away. |
| Secondary CTA | **Try the Live Demo →** + micro: "No signup · No credit card · Sample data" | Dual-intent: evaluators get a zero-risk product path. One click — no login-page detour (see TTV below). |

**Reading-level rule for future copy:** every new headline ≤ 12 words;
every sentence ≤ 20 words; if a 7th-grader can't repeat the promise
back, rewrite it. Voice-protected blocks (the six industry pitches, the
mission statement, the venues page) are exempt — they are the brand's
spoken voice, not conversion furniture.

## Time-to-Value — SHIPPED

The straight line: **click → workspace.**

- `data-demo-launch` links seed the demo session and land directly in
  `crm.html`. The old path (hero → login page → find the demo button →
  CRM) had two red lights; it's now one green one.
- First quick win inside the product: the industry picker seeds a
  familiar-looking floor in one click; the **Next Best Action** card
  gives a single obvious button ("Fire the follow-up sequence") — the
  Aha! moment is < 60 seconds from the homepage.
- No email gate, no activation step, no credit card anywhere in the
  evaluation path. Keep it that way: an email wall in front of the demo
  would cost roughly a quarter of entrants before they ever see it.

---

## (B) Structural Layout — SHIPPED (order) / spec (slots)

Narrative flow: **Understand → Evaluate → Trust → Decide.**

1. **Header** — logo, 4 anchors, Login, hotline, one high-contrast CTA. (unchanged)
2. **Hero** — dual CTA + adjacent microcopy. *Understand.*
3. **Trust strip** (new) — four real, low-contrast signals above the fold:
   live client (Tiger Roofing & Masonry → #proof), 6 industry builds,
   ZDR security, direct line. **Logo-bar slot:** when 3+ clients consent
   to name/logo use, this strip becomes the logo bar. **Ratings slot:**
   when a real G2/Capterra listing has ≥ 5 reviews, its stars + badge
   join this strip and the #book slab. Until then: nothing invented.
4. **Product bento** (new, #product) — *Evaluate.* One wide card: a real
   screenshot of the live CRM (`demo-dashboard.png`, badged "Live
   Simulation // Sample Data", annotated with the NBA cue, whole card
   launches the demo). Four outcome cards: Phones / Follow-ups /
   Pipeline / Sync — scannable on mobile (2-col → 1-col), each ≤ 2
   sentences, **bold outcome first**, mechanism second.
5. **#security → #current → #mission → #transformations → #reality →
   #industries** — the persuasion spine, order unchanged.
6. **#engagement → #process** — *Decide* scaffolding.
7. **#proof** — the real case file; grows one card per real client.
   Testimonial rule: attributed, specific, and metric-bearing only when
   the client supplies the metric ("X handled our calls and set the
   appointments" beats an invented "45% faster").
8. **#faq → #book (Calendly + one-pager handoff) → #callback → footer.**

**Aesthetic position (why this doesn't look like AI slop):** no Inter,
no purple gradient, no stock 3D blobs. Identity = obsidian/paper fields,
one emerald action color reserved for primary actions, mono kickers as
wayfinding, native-stack typography (SF Pro/Segoe — fast, unthemed),
real product screenshots over illustration, and motion that only ever
supports comprehension (12px reveals, line-up hero, nothing looping).

---

## (C) CRM Data-Capture & Intent Routing

### Intent signals — SHIPPED (client side)

`script.js` keeps a per-session **intent trail** (`sk_intent`,
sessionStorage, capped at 40 events):

| Signal | Event | Weight |
|---|---|---|
| Hero "Book" click | `cta_book` | High |
| Hero demo launch | `cta_demo` | Medium |
| Bento demo launch | `bento_demo` | Medium |
| Booking section viewed | `viewed_book` | High |
| Callback section viewed | `viewed_callback` | High |
| Any form submitted | `submit_<form>` | Highest |

Every form submission (`pilot`, `callback`, `checklist`) calls
`captureLead(form, fields)`, which attaches the full trail + page +
timestamp.

### Webhook wiring — SHIPPED (constant), one paste to activate

`script.js` → `N8N_WEBHOOK_URL`. While empty, nothing is transmitted
(same honest pattern as `PORTAL_URL`). Paste the n8n production webhook
URL and every capture POSTs:

```json
{
  "form": "callback",
  "fields": { "name": "…", "phone": "…" },
  "intent": [[1723845600000, "cta_demo"], [1723845660000, "viewed_book"]],
  "page": "/",
  "submittedAt": "2026-08-05T14:00:00Z"
}
```

### n8n routing flow (build this in n8n)

```
Webhook (POST /shiftcontrol-lead)
 → Set: score = weights over intent[] (callback/pilot form: +50,
   viewed_book: +20, cta_book: +20, demo events: +10 each)
 → IF phone present OR score ≥ 50            [HIGH INTENT]
     → Twilio/voice API: fire the instant-callback dial
     → SMS + push to Seth: name, form, trail summary
     → Google Sheets/CRM append (source of truth)
     → Calendly invite email fallback if the call doesn't connect
 → ELSE                                       [SELF-SERVE]
     → CRM append, tag "nurture"
     → Trigger the 4-step nurture (below)
```

Enterprise enrichment (reverse-IP/company size) is a later add-on: bolt
a Clearbit/RB2B-class node before the IF and add `score += 25` for
50-seat-plus companies; route those alerts as calls, not emails.

### Self-serve nurture track (templates — load into the email tool)

1. **Welcome (T+0, plain text, from Seth):** "You grabbed the checklist
   — here's what it will show you, and the one thing to look at first.
   Reply to this email and a person answers." No design, no images —
   deliverability and founder-tone beat pretty.
2. **Usage tip (T+2d, only if no demo launch yet):** one link straight
   into the live demo ("60 seconds, no signup") + one sentence on the
   Next Best Action button.
3. **Sales touch (triggered the day a demo session fires):** "You saw
   the floor run itself. The audit maps YOUR floor — 30 minutes, and
   the map is yours either way." → Calendly.
4. **Expiry/urgency:** the demo never expires, so anchor urgency to the
   real scarce thing — audit slots: "Two builds run at a time; the
   audit calendar closes when a build starts."

### Data hygiene

Trail lives in sessionStorage (dies with the tab), captures only what
the visitor typed plus their own click history, and transmits nothing
until `N8N_WEBHOOK_URL` is set. When it goes live, add one line to the
Privacy Protocol modal naming the processor (n8n, self-hosted or cloud).

---

## Activation checklist (owner)

- [ ] Deploy n8n → paste `N8N_WEBHOOK_URL` in `script.js`
- [ ] Build the routing flow above; test with a real phone
- [ ] Load the 4 nurture templates; wire trigger 3 to demo-launch events
- [ ] 3+ client consents → convert trust strip to logo bar
- [ ] Real G2/Capterra listing (≥ 5 reviews) → add stars to strip + #book
- [ ] Each new client: one attributed sentence + one real number → #proof card

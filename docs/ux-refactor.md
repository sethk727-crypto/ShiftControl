# UX-Law Refactor — Audit Log & Styling Directives

Applied against the 7 core UX laws (Krug, Hick, Maeda/SHE, Jakob,
Tesler, Fitts, Doherty). Companion to `docs/conversion-playbook.md`.
Everything here is SHIPPED unless marked otherwise.

## Friction audit → what changed

| Violation | Law | Fix |
|---|---|---|
| "Engagement" nav label — a question mark, not a destination | Krug #1 | Renamed **Plans** (anchor unchanged) |
| Callback lede opened with a negation ("Do not schedule…") | Krug | "Drop your number. The intake agent calls back within five minutes." |
| "Initiate Instant Callback" — system language | Krug | **"Call Me in 5 Minutes"** — outcome language |
| Two always-open capture forms competing at page bottom | Hick #2 | Footer checklist now SHE-hidden in a `<details>` — one visible action band (#callback) remains |
| #book lede: 60 words where 30 carry it | Krug (omit) | Halved; promise intact |
| 1px borders as default separation everywhere | Mandate 1 | Border-reduction pass (below) |
| Hover effects on non-clickable cards (false affordance) | Krug ("what's clickable?") | Static cards (panel/cap) no longer react; only real links/controls elevate on hover |
| Table numbers left-aligned | Mandate 3 | Contacts **Value** column right-aligned, tabular-nums |
| Empty kanban column = dead space, drag feature invisible | Mandate 4 | Dashed **"Drag a lead here"** marker; lights emerald on drag-over |

Already compliant (kept, cited): top-right login + bottom footer
(Jakob); pre-seeded demo data, remembered login identifier, pre-filled
lead value (Tesler); large CTAs + thumb-zone mobile dock (Fitts);
Calendly skeleton loader, optimistic CONNECTING state, instant
sessionStorage demo (Doherty ≤ 400ms); FAQ accordion + BA switcher
already progressive disclosure (SHE-hide).

## Elevation & separation directives (the system)

**One implicit light source, directly above.** Tokens in `:root`:

```css
--elev-1: 0 1px 2px rgba(10,10,12,.04), 0 2px 8px rgba(10,10,12,.05);  /* resting cards */
--elev-2: 0 2px 4px rgba(10,10,12,.05), 0 10px 24px rgba(10,10,12,.09); /* raised / hover  */
--elev-3: 0 8px 16px rgba(10,10,12,.1), 0 28px 70px rgba(10,10,12,.22); /* modals, drawer  */
```

Rules:
- Cards separate by **background delta + elev-1**, not borders
  (`border-color: transparent` across the light-theme card family and
  CRM surfaces). Kanban columns are recessed tint wells — no border, no
  shadow.
- **Hover elevation = clickable.** Interactive cards rise to elev-2 and
  keep the emerald hairline; static cards do nothing.
- Buttons catch light on top (`inset 0 1px 0 rgba(255,255,255,.4)`) and
  cast a small offset shadow **below only** — never a symmetric glow.
- Modals + drawer float at elev-3. Nothing else may use it.
- Borders that remain are *meaning*, not decoration: connected-state
  hairlines, dashed empty-state targets, table header rules, focus
  rings.

## Typography & spacing (standing rules)

- Hierarchy by **weight + color, not size stacking**: ink (#0b0b0c
  equivalents) for titles at 700–800, muted for body, faint mono
  uppercase for kickers. New font sizes require deleting one.
- Copy left-aligned; numbers right-aligned with `tabular-nums`.
- Spacing over dividers: sections breathe on the `--space-*` scale; if
  a divider seems needed, add space or a tint band instead.
- Reading level: new furniture copy ≤ grade 7; voice-protected blocks
  (industry pitches, mission, venues) exempt.

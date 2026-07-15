# SK ShiftControl — Agency Website Blueprint

> **Revision 2 (perception-engineering pass):** The live homepage has evolved past v1 of this document. It now runs a bright "panoramic" light theme with obsidian slab anchors, sells three named AI-Agent transformations (Current State → Future State), presents a three-tier "Choice of Yeses" engagement section, and uses VAK/comparative-deletion copy patterns throughout. The seller-side framework (why-ladder, ROI pricing, proposal structure) lives in `docs/sales-playbook.md`. Sections below remain valid for structure and for the bracketed fill-in slots (case studies, Calendly event URL, checklist wiring).

**Positioning:** AI Automation Agency (AIAA) for mid-market operators.
**Conversion goal:** One goal per page — a booked Calendly consultation (the Systems Audit).
**Architecture decision:** Single-scroll homepage. Mid-market owners don't browse agency sites like catalogs; they skim one page and decide whether you sound competent. Every section below exists to move them one step closer to the calendar embed at the bottom. The hospitality/retail offer lives on its own vertical landing page (`venues.html`) with its original copy untouched.

---

# 1. Homepage — Structure & Copy

## 1.1 Hero Section

**Eyebrow badge:** `AI Automation Agency` (with live status dot — carries the brand's "systems online" motif)

**H1:**
> Your Team Is Too Expensive to Be Doing Data Entry.

**H2 (subheadline):**
> SK ShiftControl engineers custom CRM, data, and AI systems that take manual operations off your payroll — designed around your competitive strategy, and built so your people actually use them.

**Primary CTA button:** `Book a Systems Audit` → scrolls to the embedded Calendly section (`#book`)
**CTA micro-trust line:** "30 minutes. Leave with a map of your operational leaks — keep it either way."
**Secondary (ghost) CTA:** `Review the process` → `#process`

*CRO rationale: The H1 attacks cost, not technology — owners buy margin, not automation. The micro-trust line de-risks the click by promising a takeaway independent of purchase. One primary action, one color.*

> [INSERT: If you want a different audit length/framing (e.g., 45 min, paid diagnostic), adjust the micro-trust line and your Calendly event to match.]

## 1.2 Problem / Agitation — "The Diagnosis"

**H2:**
> Manual Operations Don't Show Up on Your P&L. They Show Up Everywhere Else.

**Four agitation cards:**

1. **Re-Keyed Data** — The same transaction gets typed into three systems by three people. Every keystroke is payroll spent manufacturing error risk.
2. **Scattered Databases** — Sales lives in the CRM, orders in spreadsheets, invoices in email. Nobody trusts any single number, so decisions wait.
3. **The Rolodex CRM** — You pay monthly for a CRM that stores contacts and does nothing. Follow-ups depend on memory. Deals die quietly.
4. **Month-End Archaeology** — Reporting means excavating last month by hand. You steer the business looking thirty days backward.

**Section closer (punch line):**
> None of this is a people problem. It's an architecture problem.

*CRO rationale: Four named pains matching the target profile (ops managers, sales directors, owners). The closer absolves the reader — blame the system, not them — which keeps them reading instead of getting defensive.*

## 1.3 The Strategic Edge

**H2:**
> Anyone Can Connect Apps. We Engineer Advantage.

**Intro:**
> Automation that ignores strategy just helps you do the wrong things faster. Every system we build is grounded in the frameworks serious operators run companies on.

**Three pillars:**

1. **Strategy-First Architecture** — Before a single workflow is built, your operation is mapped against Hambrick & Fredrickson's Strategic Diamond and Porter's Five Forces. We automate where it compounds your differentiator and hardens your margin — not just where it's easy.
2. **Data as the Operating System** — Scattered transactional records become consolidated master tables with live reporting. You stop arguing about whose spreadsheet is right and start deciding from a single source of truth.
3. **Psychology-Driven Adoption** — Systems fail when people route around them. We apply psychological modeling and NLP principles to interface and workflow design, so the automated path is the path of least resistance — for your team and your customers.

*CRO rationale: This is the differentiation section — it converts "another Zapier freelancer" into "strategic partner." Frameworks are name-dropped precisely once each; more would read as lecture.*

## 1.4 Core Services Breakdown

**H2:**
> Three Ways We Take Work Off Your Payroll.

1. **`[01 // Revenue Infrastructure]` — CRM Architecture & Automation**
   Setup, integration, and automation that turns your CRM into the engine of your revenue: pipelines that advance themselves, follow-ups that fire on behavior, and zero leads lost to human memory.

2. **`[02 // Single Source of Truth]` — Data Entry Automation & Database Consolidation**
   Manual transactional entry replaced with automated capture. Fragmented records unified into master tables that feed live dashboards — month-end reporting becomes a real-time instrument panel.

3. **`[03 // Force Multiplication]` — Custom AI Workflows & Bottleneck Removal**
   Purpose-built AI systems aimed at your slowest, most expensive process steps: document processing, voice-to-structured-data, intelligent routing, decision support. Where off-the-shelf ends, we build.

*CRO rationale: Benefit-first descriptions; each ends on capability ("we build") rather than features. The mono-tagged numbering carries the terminal aesthetic from the brand system.*

## 1.5 Social Proof / Authority — "Case Files"

**H2:**
> Measured Outcomes or It Didn't Happen.

**Intro:**
> Every deployment is instrumented from day one. Hours reclaimed, error rates, adoption, and dollars recovered are tracked against the baseline captured in your audit — and published here as case files.

**Three placeholder cards (styled as dashed "pending" slots):**

- `CASE FILE 001` — [Client name / industry] — [Headline metric, e.g., "22 hrs/week of manual entry eliminated"] — [One-sentence outcome summary]
- `CASE FILE 002` — [Client name / industry] — [Headline metric] — [Summary]
- `CASE FILE 003` — [Client name / industry] — [Headline metric] — [Summary]

> [INSERT: Real client results as they land. **Replace or hide these slots before heavy paid-traffic campaigns** — pending slots are honest and on-brand for launch, but real numbers convert harder. Never publish invented metrics.]

*CRO rationale: The intro converts a weakness (no case studies yet) into a strength (a measurement discipline). The empty slots signal confidence that results are coming.*

---

# 2. The Process Section — "The Protocol"

**H2:**
> From Audit to Autonomy in Four Moves.

1. **`01` — The Systems Audit** — A structured diagnostic of your tools, data flows, and process costs. You leave with a bottleneck map and an ROI model that prices every leak.
2. **`02` — Consolidation** — Scattered records are unified into clean master tables — the foundation layer. Nothing gets automated on top of dirty data.
3. **`03` — Build & Staged Deployment** — Systems are built, tested against your live operation, and rolled out in stages. Your business never stops while its backend is being replaced.
4. **`04` — Training & Compounding** — Your team is trained on systems designed to be adopted, not tolerated. Then we monitor, tune, and expand — automation that compounds instead of decaying.

*CRO rationale: Four steps is the ceiling before a process reads as slow. Step 1 is deliberately identical to the CTA — booking the audit IS starting the process.*

---

# 3. Technical Architecture & Tech Stack — "Tooling"

**H2:**
> Vendor-Agnostic. Outcome-Locked.

**Intro:**
> We integrate what you already run and build what doesn't exist. No platform loyalty — the stack serves the strategy.

**Categories (grid):**

| Category | Platforms |
|---|---|
| CRM Platforms | HubSpot · Pipedrive · GoHighLevel · Zoho |
| Orchestration | Zapier · Make · n8n |
| Custom Engineering | Python · Node.js · REST APIs |
| AI Layer | Claude & GPT-class LLM APIs · OCR · Voice-to-Text |
| Payments & Billing | Square · Stripe |
| Scheduling & Comms | Calendly · Twilio · Slack · Gmail |
| Data & Reporting | Google Sheets · PostgreSQL · Looker Studio |

> [INSERT: Trim each row to the platforms you genuinely deploy. Listing tools you can't demo in a sales call is a credibility risk.]

---

# 4. Booking Section + Footer & Lead Capture

## 4.1 Booking Section (the conversion endpoint)

**H2:**
> Book the Systems Audit.

**Copy:**
> Thirty minutes. Bring nothing but a description of how work gets done today. You leave with a map of where your operation leaks time and money — and exactly what we'd build to stop it. Keep the map either way.

**Embed:** Calendly inline widget → `https://calendly.com/sethk727`
- Implemented via **Method 1 (inline embed)**, lazy-loaded only when the visitor scrolls near it (protects page-speed scores; Calendly's script is ~80KB+).
- A plain fallback link ("Open the scheduling page →") renders beneath it for no-JS/blocked-script cases.

> [INSERT: To point at a specific event type instead of your profile, change the `data-url` in `index.html` to e.g. `https://calendly.com/sethk727/30min`.]
> [FUTURE — Method 2 "pay first, then book": once your Square recurring-subscription repo is live, move the Calendly injection into the payment success callback exactly as drafted, and set this section's CTA to the payment page. Keep the free-audit embed for top-of-funnel either way.]

## 4.2 Footer Lead Magnet

**H3:**
> The Operations Leak Checklist

**Copy:**
> A 12-point self-audit that locates the manual processes silently taxing your margin. One email. No sequence, no spam.

**Form:** email field + button `Send Me the Checklist`
**Success state:** "Checklist inbound. Check your email."

> [INSERT: Wire this form to your email tool (the front-end success state is currently simulated). And produce the actual checklist PDF — 12 points is a placeholder count; match it to the real asset.]

## 4.3 Footer

- Brand mark + line: "Custom CRM, data, and AI systems for operators."
- Legal/system modals: Privacy Protocol · Terms of Service · System Status (copy carried over verbatim)
- Vertical link: **"Industry build: ShiftControl for Venues →"** (`venues.html` — the original hospitality/retail page, copy untouched)

---

# Page Map

| URL | Purpose |
|---|---|
| `/` (`index.html`) | Agency homepage (this blueprint) — converts to Calendly audit |
| `/venues` (`venues.html`) | Hospitality & retail vertical — original ShiftControl offer, verbatim copy, converts to pilot form |

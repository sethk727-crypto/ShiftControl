# SK ShiftControl — Sales Playbook

**Private, seller-side document.** The website gets prospects to one action — booking the Systems Audit. Everything after that call runs on this playbook: what you sell (transformations, not deliverables), how you price (value, not hours), and how you propose (a choice of yeses, never a yes/no).

---

## Part 1 — What You Sell: Three Transformations

You do not sell n8n workflows, chatbots, or integrations. Those are deliverables — commodities a client can price-shop. You sell the **state change** between a painful Current State and a profitable Future State. The deliverable is just the vehicle.

### Offer 1 — The Revenue Recovery Agent `[Pipeline]`
- **Current State (their pain):** Follow-up depends on individual willpower. Leads cool in the CRM, lapsed accounts drift to competitors, and nobody notices until the quarter is already quiet.
- **Future State (what they buy):** An autonomous agent — memory of every account's history, tools to act in the CRM/email/SMS, judgment about when and how to re-engage — working every lead and watching every account continuously.
- **Where the value lives:** Recovered revenue that was already theirs. In the audit, quantify: leads per month × current follow-up loss rate × average deal value.

### Offer 2 — The Intake & Routing Agent `[Operations]`
- **Current State:** Skilled employees hand-triage inboxes, tickets, and requests. Response times stretch with volume; context gets lost between departments.
- **Future State:** Every inbound read, understood, classified, and routed with prior-interaction memory before a human touches it — humans handle only what genuinely needs judgment beyond the agent's.
- **Where the value lives:** Loaded labor hours redirected + retention from faster response. Quantify: hours/week spent on triage × loaded hourly cost, plus churn attributable to slow response.

### Offer 3 — The Intelligence Agent `[Command]`
- **Current State:** Data scattered across systems; reporting assembled manually at month-end; decisions made late on numbers nobody fully trusts.
- **Future State:** Master tables consolidated in real time, anomaly flags the hour they appear, an automatic operating brief. Decisions move up 30 days.
- **Where the value lives:** Cost of delayed/wrong decisions + analyst hours. Hardest to quantify — anchor it to one concrete recent example from their own history ("what did catching X a month late cost you?").

**Rule:** In every conversation and proposal, name the offer by its outcome, never its mechanism. "We recover revenue your pipeline is currently leaking" — not "we build an n8n workflow with an LLM node."

---

## Part 2 — How You Sell

### Step 1 — Diagnose before you prescribe (the audit call)
Never accept the stated request at face value. The client arrives with a *want* ("we need a chatbot"). Your job is to walk them down to the *need* — the *Value Distance* between the two is what justifies your fee.

**The Why-Ladder (run it live on the call):**
1. "You said you want [X]. Why that, and why now?" → surfaces the trigger event.
2. "What does [the trigger problem] actually cost you in a normal month?" → forces quantification. Wait through the silence; let them do the math out loud.
3. "And if nothing changes for 12 months, where does that leave you?" → prices the status quo.
4. "If this were solved completely, what does that unlock that you can't do today?" → prices the future state (this number is almost always bigger than the cost number).
5. Reflect it back: "So this isn't a chatbot project. This is [customer retention / pipeline recovery / decision speed]. Agreed?" → the reframe, in their own numbers.

The gap between answer 3 and answer 4 **is** the engagement value. Write it down on the call — it becomes the ROI model in the proposal.

### Step 2 — Price against the ROI model, never hours
- Fee = a defensible fraction of first-year value created. Working band: aim for the client to see **3–10× return** on your fee against *their own numbers* from the Why-Ladder. (Value $200K/yr → fees in the $20–60K range are self-evidently cheap.)
- Never quote before the audit is done. "I don't know what it's worth to you yet, and I only price against worth" is a position of strength.
- Never itemize hours, day-rates, or tool costs in a proposal. The moment hours appear, you're a vendor being compared per-hour; incentives also invert (hourly rewards slowness — fixed-fee-for-outcome aligns you with speed).
- Payment structure: 50% to commence, 50% on deployment (Option 3: thirds). No "pay when satisfied" — satisfaction is measured by the instrumented baseline-vs-after delta defined up front.

### Step 3 — Propose a Choice of Yeses (three options, one page each)
Structure every proposal with three options of increasing value, so the buying question shifts from *"should we hire them?"* to *"which way should we hire them?"*

- **Option 1 — Diagnose+** (meets the basic stated objective): the audit deliverables plus a build-ready specification of the single highest-ROI agent. Lowest fee. Fully useful standalone — it must never feel like a decoy.
- **Option 2 — Deploy** (the likely buy): Option 1 + the highest-value agent built, deployed, instrumented (baseline vs. after), and the team trained.
- **Option 3 — Command** (deliberately exceeds their stated budget): everything + full data consolidation, all relevant agents staged over the engagement, quarterly strategy reviews. Price it above the number they told you — it anchors Option 2 as reasonable, and a meaningful share of buyers "find" the extra budget when the value is overwhelming.

**Rules for the proposal document:**
- One situation summary up top **in their own words and numbers** from the Why-Ladder — this is the reframe doing the selling.
- Each option: outcome, scope, timeline, fixed fee, and its ROI multiple against their numbers. Nothing hourly, nothing itemized.
- All three options are real offers you'd happily deliver. Present all three every time; never present one price.
- Expiration: proposals hold for 30 days (numbers go stale, and it creates a legitimate reason to decide).

### Step 4 — Handle the two predictable objections
- **"Can you do it cheaper?"** → Reduce *scope*, never *rate*: "We can remove the training layer and the instrumentation — though that's usually where adoption is won. Which outcome are you comfortable giving up?" A fee cut without scope cut reprices your value to zero.
- **"We could build this in-house."** → Agree, then reprice their time: "You could. The audit gives you the exact spec either way. The question is whether your team's next two quarters are best spent on this — that cost is in the model too."

---

## Guardrails (non-negotiable)

- **Never invent numbers.** Every figure in a proposal traces to the client's own answers or your instrumented measurements. The entire authority position ("measured outcomes or it didn't happen") dies the first time a number turns out to be decorative.
- **Case files publish real results only**, with client permission, or they stay as pending slots.
- Comparative site copy ("scale faster," "see clearer") is aspiration/positioning; **claims** (specific dollars, hours, percentages) only ever come from real measurement.
- If the audit shows automation *isn't* worth it for them, say so and take the audit fee only. One honest "no" generates more referrals than any funnel.

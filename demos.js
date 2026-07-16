/* ==========================================================================
   SK SHIFTCONTROL — OPS-CONSOLE DEMO ENGINE
   One timeline runtime drives every vertical's live simulation. Each demo
   declares steps as [msFromStart, fn]; the engine starts when the console
   scrolls into view, loops with a clean reset, and honors reduced motion
   by jumping straight to the finished state.
   ========================================================================== */
(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (root, sel) => root.querySelector(sel);
  const $$ = (root, sel) => Array.from(root.querySelectorAll(sel));
  const on = (el) => el && el.classList.add("on");

  function runTimeline(root, steps, { loopAfter = 4000, reset } = {}) {
    let timers = [];
    const clear = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };

    const playOnce = () => {
      steps.forEach(([t, fn]) => timers.push(setTimeout(fn, t)));
    };

    if (reduced) {
      // Static finished state: run everything instantly, once.
      steps.forEach(([, fn]) => fn());
      return;
    }

    const total = steps.length ? steps[steps.length - 1][0] : 0;
    const cycle = () => {
      playOnce();
      timers.push(
        setTimeout(() => {
          clear();
          if (reset) reset();
          timers.push(setTimeout(cycle, 700));
        }, total + loopAfter),
      );
    };

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      cycle();
    };

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            start();
            io.disconnect();
          }
        },
        { threshold: 0.3 },
      );
      io.observe(root);
    } else {
      start();
    }
  }

  /* ---- Counter helper: eased count-up on a stat tile ---- */
  function countUp(el, target, { fmt = (v) => String(Math.round(v)), ms = 900 } = {}) {
    if (!el) return;
    if (reduced) {
      el.textContent = fmt(target);
      return;
    }
    const start = performance.now();
    const frame = (now) => {
      const t = Math.min((now - start) / ms, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt(target * eased);
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /* ==================================================================
     MEDICAL & DENTAL — Chair-Fill Recovery
     ================================================================== */
  const med = document.getElementById("demo-medical");
  if (med) {
    const slot = $(med, "[data-slot-target]");
    const badge = $(slot, ".k-badge");
    const who = $(slot, ".who");
    const feed = $$(med, ".feed-line");
    const sms = $$(med, ".sms");
    const vac = $(med, "[data-stat-vacancy]");
    const filled = $(med, "[data-stat-filled]");

    let vacTimer = null;
    let vacSec = 0;
    const fmtVac = (s) =>
      `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;

    const startVacancy = () => {
      vacSec = 0;
      vac.textContent = "0m 00s";
      vac.classList.remove("glow");
      vacTimer = setInterval(() => {
        // Simulation clock runs faster than real time
        vacSec += 17;
        vac.textContent = fmtVac(vacSec);
      }, 300);
    };

    const stopVacancy = () => {
      clearInterval(vacTimer);
      vacSec = 252;
      vac.textContent = fmtVac(vacSec);
      vac.classList.add("glow");
    };

    runTimeline(
      med,
      [
        [400, () => on(feed[0])],
        [
          900,
          () => {
            slot.classList.add("is-canceled");
            badge.textContent = "CANCELED";
            startVacancy();
          },
        ],
        [1600, () => on(feed[1])],
        [2400, () => on(sms[0])],
        [4200, () => on(sms[1])],
        [5000, () => on(feed[2])],
        [
          5800,
          () => {
            slot.classList.remove("is-canceled");
            slot.classList.add("is-filled");
            who.textContent = "R. Alvarez (waitlist)";
            badge.textContent = "REBOOKED";
            stopVacancy();
            countUp(filled, 3, { fmt: (v) => Math.round(v) + " this week" });
          },
        ],
        [6300, () => on(feed[3])],
      ],
      {
        reset: () => {
          clearInterval(vacTimer);
          feed.forEach((l) => l.classList.remove("on"));
          sms.forEach((b) => b.classList.remove("on"));
          slot.classList.remove("is-canceled", "is-filled");
          badge.textContent = "CONFIRMED";
          who.textContent = "M. Okafor";
          vac.textContent = "0m 00s";
          vac.classList.remove("glow");
          filled.textContent = "—";
        },
      },
    );
  }

  /* ==================================================================
     REAL ESTATE — Speed-to-Lead
     ================================================================== */
  const rea = document.getElementById("demo-realestate");
  if (rea) {
    const time = $(rea, "[data-watch]");
    const steps = $$(rea, ".pipe-step");
    const feed = $$(rea, ".feed-line");
    let watchTimer = null;
    let elapsed = 0;

    const startWatch = () => {
      elapsed = 0;
      time.textContent = "0.0s";
      watchTimer = setInterval(() => {
        elapsed += 0.1;
        time.textContent = elapsed.toFixed(1) + "s";
      }, 100);
    };

    const stopWatch = () => {
      clearInterval(watchTimer);
      elapsed = 8.4;
      time.textContent = "8.4s";
    };

    runTimeline(
      rea,
      [
        [
          400,
          () => {
            on(steps[0]);
            startWatch();
            on(feed[0]);
          },
        ],
        [2200, () => { on(steps[1]); on(feed[1]); }],
        [4200, () => { on(steps[2]); on(feed[2]); }],
        [6600, () => { on(steps[3]); on(feed[3]); }],
        [
          8800,
          () => {
            stopWatch();
            on(feed[4]);
          },
        ],
      ],
      {
        reset: () => {
          clearInterval(watchTimer);
          time.textContent = "0.0s";
          steps.forEach((s) => s.classList.remove("on"));
          feed.forEach((l) => l.classList.remove("on"));
        },
      },
    );
  }

  /* ==================================================================
     E-COMMERCE — Support Triage
     ================================================================== */
  const eco = document.getElementById("demo-ecommerce");
  if (eco) {
    const cards = $$(eco, ".tix-card");
    const resolved = $(eco, "[data-stat-resolved]");
    const escalated = $(eco, "[data-stat-escalated]");
    const reviews = $(eco, "[data-stat-reviews]");
    let resolvedCount = 0;

    const landCard = (i) => on(cards[i]);
    const tagCard = (i) => on($(cards[i], ".tix-tag"));
    const resolveCard = (i, auto = true) => {
      on($(cards[i], ".tix-res"));
      if (auto) {
        resolvedCount += 1;
        resolved.textContent = String(resolvedCount);
        resolved.classList.add("glow");
      } else {
        escalated.textContent = "1";
      }
    };

    runTimeline(
      eco,
      [
        [400, () => landCard(0)],
        [1300, () => tagCard(0)],
        [2100, () => resolveCard(0)],
        [2900, () => landCard(1)],
        [3800, () => tagCard(1)],
        [4600, () => resolveCard(1)],
        [5400, () => landCard(2)],
        [6300, () => tagCard(2)],
        [7100, () => resolveCard(2)],
        [7900, () => landCard(3)],
        [8800, () => tagCard(3)],
        [9400, () => resolveCard(3, false)],
        [10200, () => countUp(reviews, 12, { fmt: (v) => Math.round(v) + " queued" })],
      ],
      {
        reset: () => {
          resolvedCount = 0;
          cards.forEach((c) => {
            c.classList.remove("on");
            $(c, ".tix-tag").classList.remove("on");
            $(c, ".tix-res").classList.remove("on");
          });
          resolved.textContent = "0";
          resolved.classList.remove("glow");
          escalated.textContent = "0";
          reviews.textContent = "—";
        },
      },
    );
  }

  /* ==================================================================
     VENUES — Night Closeout Agent
     ================================================================== */
  const ven = document.getElementById("demo-venues");
  if (ven) {
    const feed = $$(ven, ".feed-line");
    const task = (name) => $(ven, `[data-task="${name}"]`);
    const setTask = (name, state, label) => {
      const slot = task(name);
      slot.classList.remove("is-canceled", "is-filled");
      if (state) slot.classList.add(state);
      $(slot, ".k-badge").textContent = label;
    };
    const admin = $(ven, "[data-stat-admin]");
    const leaks = $(ven, "[data-stat-leaks]");
    const night = $(ven, "[data-stat-night]");
    let leakCount = 0;

    runTimeline(
      ven,
      [
        [400, () => on(feed[0])],
        [
          1800,
          () => {
            on(feed[1]);
            setTask("log", "is-filled", "DONE");
          },
        ],
        [
          3000,
          () => {
            on(feed[2]);
            setTask("register", "is-canceled", "FLAGGED");
            leakCount += 1;
            leaks.textContent = String(leakCount);
          },
        ],
        [
          4200,
          () => {
            on(feed[3]);
            setTask("supply", "is-filled", "PO DRAFTED");
            leakCount += 1;
            leaks.textContent = String(leakCount);
          },
        ],
        [
          5400,
          () => {
            on(feed[4]);
            setTask("roster", "is-filled", "SYNCED");
          },
        ],
        [
          6600,
          () => {
            on(feed[5]);
            setTask("brief", "is-filled", "SENT");
            admin.textContent = "60 seconds";
            night.textContent = "Empty";
          },
        ],
      ],
      {
        reset: () => {
          leakCount = 0;
          feed.forEach((l) => l.classList.remove("on"));
          ["log", "register", "supply", "roster", "brief"].forEach((n) =>
            setTask(n, null, "PENDING"),
          );
          admin.textContent = "—";
          leaks.textContent = "0";
          night.textContent = "—";
        },
      },
    );
  }

  /* ==================================================================
     LEGAL — Intake & Drafting Agent
     ================================================================== */
  const leg = document.getElementById("demo-legal");
  if (leg) {
    const steps = $$(leg, ".pipe-step");
    const feed = $$(leg, ".feed-line");
    const response = $(leg, "[data-stat-response]");
    const docketed = $(leg, "[data-stat-docketed]");

    runTimeline(
      leg,
      [
        [400, () => on(feed[0])],
        [1600, () => { on(steps[0]); on(feed[1]); }],
        [3200, () => { on(steps[1]); on(feed[2]); }],
        [4800, () => { on(steps[2]); on(feed[3]); }],
        [
          6400,
          () => {
            on(steps[3]);
            on(feed[4]);
            response.textContent = "3m 40s";
            response.classList.add("glow");
            countUp(docketed, 4, { fmt: (v) => String(Math.round(v)) });
          },
        ],
      ],
      {
        reset: () => {
          steps.forEach((s) => s.classList.remove("on"));
          feed.forEach((l) => l.classList.remove("on"));
          response.textContent = "—";
          response.classList.remove("glow");
          docketed.textContent = "—";
        },
      },
    );
  }

  /* ==================================================================
     TRADES & FIELD SERVICES — Dispatch Command
     ================================================================== */
  const tra = document.getElementById("demo-trades");
  if (tra) {
    const feed = $$(tra, ".feed-line");
    const jobPin = $(tra, ".job-pin");
    const route = $(tra, ".route");
    const tech = $(tra, "[data-tech-active]");
    const ring = $(tra, "[data-tech-ring]");
    const eta = $(tra, "[data-stat-eta]");
    const invoice = $(tra, "[data-stat-invoice]");

    runTimeline(
      tra,
      [
        [400, () => on(feed[0])],
        [1400, () => on(feed[1])],
        [
          2400,
          () => {
            jobPin.classList.add("on");
            on(feed[2]);
          },
        ],
        [
          3600,
          () => {
            tech.classList.add("is-active");
            ring.classList.add("is-active");
            on(feed[3]);
          },
        ],
        [
          4600,
          () => {
            route.classList.add("on");
            eta.textContent = "38 min";
            eta.classList.add("glow");
          },
        ],
        [6400, () => on(feed[4])],
        [
          7400,
          () => {
            invoice.textContent = "Texted ✓";
            invoice.classList.add("glow");
            on(feed[5]);
          },
        ],
      ],
      {
        reset: () => {
          feed.forEach((l) => l.classList.remove("on"));
          jobPin.classList.remove("on");
          route.classList.remove("on");
          tech.classList.remove("is-active");
          ring.classList.remove("is-active");
          eta.textContent = "—";
          eta.classList.remove("glow");
          invoice.textContent = "—";
          invoice.classList.remove("glow");
        },
      },
    );
  }
})();

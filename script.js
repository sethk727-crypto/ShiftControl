/* ==========================================================================
   SK SHIFTCONTROL — BEHAVIOR LAYER
   Loaded with `defer`; DOM is parsed by the time this runs.
   Each module is isolated and null-safe so a missing element can never
   take down the rest of the page.
   ========================================================================== */
(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ------------------------------------------------------------------
     1. LOGO FALLBACK — swap to the wordmark if the image fails
     ------------------------------------------------------------------ */
  const logo = document.getElementById("logo");
  const fallbackLogo = document.getElementById("fallback-logo");

  function showFallbackLogo() {
    if (!logo || !fallbackLogo) return;
    logo.style.display = "none";
    fallbackLogo.style.display = "block";
    fallbackLogo.removeAttribute("aria-hidden");
  }

  if (logo) {
    logo.addEventListener("error", showFallbackLogo);
    if (logo.complete && logo.naturalWidth === 0) showFallbackLogo();
  }

  /* ------------------------------------------------------------------
     2. NAV SCROLL STATE — solidify the header once the page moves
     ------------------------------------------------------------------ */
  const siteNav = document.getElementById("site-nav");
  let scrollTicking = false;

  function updateNavState() {
    siteNav.classList.toggle("is-scrolled", window.scrollY > 8);
    scrollTicking = false;
  }

  if (siteNav) {
    window.addEventListener(
      "scroll",
      () => {
        if (!scrollTicking) {
          scrollTicking = true;
          requestAnimationFrame(updateNavState);
        }
      },
      { passive: true },
    );
    updateNavState();
  }

  /* ------------------------------------------------------------------
     3. SCROLL REVEAL — sections enter as they reach the viewport
     ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ------------------------------------------------------------------
     4. SECTION SPY — highlight the nav link for the section in view
     ------------------------------------------------------------------ */
  const navLinks = Array.from(
    document.querySelectorAll('.nav-links a[href^="#"]:not(.nav-cta)'),
  );

  if ("IntersectionObserver" in window && navLinks.length) {
    const sectionFor = new Map(
      navLinks
        .map((link) => [document.querySelector(link.getAttribute("href")), link])
        .filter(([section]) => section),
    );

    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = sectionFor.get(entry.target);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((a) => a.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sectionFor.forEach((_, section) => spyObserver.observe(section));
  }

  /* ------------------------------------------------------------------
     5. CONTROL CENTER TABS — ARIA-compliant with arrow-key support
     ------------------------------------------------------------------ */
  const tabBtns = Array.from(document.querySelectorAll(".tab-btn"));
  const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));

  function activateTab(btn) {
    tabBtns.forEach((b) => {
      const selected = b === btn;
      b.classList.toggle("active", selected);
      b.setAttribute("aria-selected", String(selected));
      b.tabIndex = selected ? 0 : -1;
    });
    tabPanels.forEach((p) => {
      p.classList.toggle("active", p.id === btn.dataset.target);
    });
  }

  tabBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => activateTab(btn));
    btn.addEventListener("keydown", (e) => {
      let next = null;
      if (e.key === "ArrowRight") next = tabBtns[(index + 1) % tabBtns.length];
      if (e.key === "ArrowLeft")
        next = tabBtns[(index - 1 + tabBtns.length) % tabBtns.length];
      if (e.key === "Home") next = tabBtns[0];
      if (e.key === "End") next = tabBtns[tabBtns.length - 1];
      if (next) {
        e.preventDefault();
        next.focus();
        activateTab(next);
      }
    });
  });

  /* ------------------------------------------------------------------
     6. LIVE REVENUE RECOVERY DASHBOARD — sliders + animated counters
     ------------------------------------------------------------------ */
  const guestSlider = document.getElementById("slider-guests");
  const billSlider = document.getElementById("slider-bill");
  const guestVal = document.getElementById("val-guests");
  const billVal = document.getElementById("val-bill");
  const outIncome = document.getElementById("out-income");
  const outLabor = document.getElementById("out-labor");
  const outTotal = document.getElementById("out-total");

  const counters = new WeakMap();

  function animateValue(el, target) {
    const from = counters.get(el) ?? 0;
    counters.set(el, target);

    if (prefersReducedMotion) {
      el.textContent = "+$" + Math.round(target).toLocaleString();
      return;
    }

    const start = performance.now();
    const duration = 500;

    function frame(now) {
      // Bail out if a newer target superseded this animation
      if (counters.get(el) !== target) return;
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const value = from + (target - from) * eased;
      el.textContent = "+$" + Math.round(value).toLocaleString();
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function paintSliderFill(slider) {
    const pct =
      ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty("--fill", pct + "%");
  }

  function calculateProfits() {
    const guests = parseInt(guestSlider.value, 10);
    const billSize = parseInt(billSlider.value, 10);

    guestVal.textContent = guests.toLocaleString();
    billVal.textContent = "$" + billSize;
    paintSliderFill(guestSlider);
    paintSliderFill(billSlider);

    // Illustrative model for the live simulation
    const weeklyRev = guests * billSize;
    const missedIncome = weeklyRev * 0.18; // ~18% bump from retention
    const laborSaved = guests * 0.5; // ~$0.50 saved per guest in error catching

    animateValue(outIncome, missedIncome);
    animateValue(outLabor, laborSaved);
    animateValue(outTotal, missedIncome + laborSaved);
  }

  if (guestSlider && billSlider) {
    guestSlider.addEventListener("input", calculateProfits);
    billSlider.addEventListener("input", calculateProfits);
    calculateProfits();
  }

  /* ------------------------------------------------------------------
     7. PILOT FORM — simulated submission with success state
     ------------------------------------------------------------------ */
  const pilotForm = document.getElementById("pilot-form");
  const successMessage = document.getElementById("success-message");

  if (pilotForm && successMessage) {
    pilotForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = pilotForm.querySelector("button[type=submit]");
      btn.textContent = "Processing...";
      btn.disabled = true;

      setTimeout(() => {
        successMessage.classList.add("active");
      }, 1000);
    });
  }

  /* ------------------------------------------------------------------
     5b. BEFORE/AFTER SWITCHER — the interactive reality engine
     ------------------------------------------------------------------ */
  const baTabs = Array.from(document.querySelectorAll(".ba-tab"));
  const baPanes = Array.from(document.querySelectorAll(".ba-pane"));

  function activateBaTab(btn) {
    baTabs.forEach((b) => {
      const selected = b === btn;
      b.setAttribute("aria-selected", String(selected));
      b.tabIndex = selected ? 0 : -1;
    });
    baPanes.forEach((p) => {
      p.classList.toggle("active", p.id === btn.dataset.baTarget);
    });
  }

  baTabs.forEach((btn, index) => {
    btn.addEventListener("click", () => activateBaTab(btn));
    btn.addEventListener("keydown", (e) => {
      let next = null;
      if (e.key === "ArrowRight") next = baTabs[(index + 1) % baTabs.length];
      if (e.key === "ArrowLeft")
        next = baTabs[(index - 1 + baTabs.length) % baTabs.length];
      if (next) {
        e.preventDefault();
        next.focus();
        activateBaTab(next);
      }
    });
  });

  /* ------------------------------------------------------------------
     7a2. INSTANT CALLBACK — simulated capture; wire to the real
     callback queue (e.g., n8n webhook + voice API) before launch
     ------------------------------------------------------------------ */
  const callbackForm = document.getElementById("callback-form");
  const callbackSuccess = document.getElementById("callback-success");

  if (callbackForm && callbackSuccess) {
    callbackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = callbackForm.querySelector("button[type=submit]");
      btn.textContent = "Queuing...";
      btn.disabled = true;

      setTimeout(() => {
        callbackSuccess.classList.add("active");
      }, 800);
    });
  }

  /* ------------------------------------------------------------------
     7b. CHECKLIST OPT-IN — simulated submission with success state
     ------------------------------------------------------------------ */
  const checklistForm = document.getElementById("checklist-form");
  const checklistSuccess = document.getElementById("checklist-success");

  if (checklistForm && checklistSuccess) {
    checklistForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = checklistForm.querySelector("button[type=submit]");
      btn.textContent = "Sending...";
      btn.disabled = true;

      setTimeout(() => {
        checklistSuccess.classList.add("active");
      }, 800);
    });
  }

  /* ------------------------------------------------------------------
     7c. CALENDLY — lazy-load the widget script as the booking section
     approaches the viewport, so it never taxes initial page load
     ------------------------------------------------------------------ */
  const calendlyWidget = document.querySelector(".calendly-inline-widget");
  let calendlyLoaded = false;

  function loadCalendly() {
    if (calendlyLoaded) return;
    calendlyLoaded = true;
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    document.head.appendChild(s);

    // Fade the loading skeleton once the widget's iframe actually renders
    const wrap = document.querySelector(".calendly-wrap");
    if (wrap) {
      const started = performance.now();
      const poll = setInterval(() => {
        if (wrap.querySelector("iframe")) {
          wrap.classList.add("is-loaded");
          clearInterval(poll);
        } else if (performance.now() - started > 20000) {
          clearInterval(poll);
        }
      }, 300);
    }
  }

  if (calendlyWidget) {
    if ("IntersectionObserver" in window) {
      const calendlyObserver = new IntersectionObserver(
        (entries, observer) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            loadCalendly();
            observer.disconnect();
          }
        },
        { rootMargin: "800px 0px" },
      );
      calendlyObserver.observe(calendlyWidget);
    } else {
      loadCalendly();
    }
    // Any "book" CTA click loads it immediately so the calendar is
    // rendering while the smooth-scroll travels down the page
    document.querySelectorAll('a[href="#book"]').forEach((cta) => {
      cta.addEventListener("click", loadCalendly);
    });
  }

  /* ------------------------------------------------------------------
     8. MODALS — focus-managed dialogs (backdrop click + Escape close)
     ------------------------------------------------------------------ */
  let lastFocused = null;

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    const closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModals() {
    const wasOpen = document.querySelector(".modal-overlay.active");
    document
      .querySelectorAll(".modal-overlay.active")
      .forEach((m) => m.classList.remove("active"));
    if (wasOpen) {
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }
  }

  document.querySelectorAll("[data-modal-open]").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(trigger.dataset.modalOpen);
    });
  });

  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModals();
    });
  });

  document.querySelectorAll("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", closeModals);
  });

  /* ------------------------------------------------------------------
     9. MOBILE MENU — slide-in overlay with state sync
     ------------------------------------------------------------------ */
  const mobileMenu = document.getElementById("mobile-menu");
  const hamburger = document.getElementById("hamburger");
  const mobileMenuClose = document.getElementById("mobile-menu-close");

  function setMenu(open) {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle("open", open);
    if (hamburger) hamburger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      mobileMenuClose?.focus();
    } else {
      hamburger?.focus();
    }
  }

  hamburger?.addEventListener("click", () => setMenu(true));
  mobileMenuClose?.addEventListener("click", () => setMenu(false));

  document.querySelectorAll("[data-menu-link]").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu?.classList.remove("open");
      hamburger?.setAttribute("aria-expanded", "false");
      // Keep scroll locked if this link just opened a modal on top
      if (!document.querySelector(".modal-overlay.active")) {
        document.body.style.overflow = "";
      }
    });
  });

  /* ==================================================================
     LIGHT-THEME PAGE SYSTEMS — progress bar, command palette, CTA dock.
     Gated so the dark venues page stays byte-identical in behavior.
     ================================================================== */
  const isLightPage = document.body.classList.contains("theme-light");

  /* ---- Scroll progress bar ---- */
  let progressBar = null;
  if (isLightPage) {
    progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.setAttribute("aria-hidden", "true");
    document.body.appendChild(progressBar);

    let progressTicking = false;
    const paintProgress = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      progressBar.style.transform = `scaleX(${ratio})`;
      progressTicking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!progressTicking) {
          progressTicking = true;
          requestAnimationFrame(paintProgress);
        }
      },
      { passive: true },
    );
    paintProgress();
  }

  /* ---- Command palette (⌘K / Ctrl+K) ---- */
  let paletteOverlay = null;

  if (isLightPage) {
    const onHome = !!document.querySelector("#transformations");
    const prefix = onHome ? "" : "index.html";
    const PALETTE_ITEMS = [
      { group: "Sections", label: "Transformations", href: prefix + "#transformations" },
      { group: "Sections", label: "Industries", href: prefix + "#industries" },
      { group: "Sections", label: "Engagement — A Choice of Yeses", href: prefix + "#engagement" },
      { group: "Sections", label: "Process — The Protocol", href: prefix + "#process" },
      { group: "Sections", label: "Proof — Case Files", href: prefix + "#proof" },
      { group: "Sections", label: "FAQ — Straight Answers", href: prefix + "#faq" },
      { group: "Pages", label: "ShiftControl for Venues", href: "venues.html" },
      { group: "Pages", label: "AI Automation for Law Firms", href: "legal.html" },
      { group: "Pages", label: "Clinics & Practices — Chair-Fill Demo", href: "medical.html" },
      { group: "Pages", label: "Brokerages & Teams — Speed-to-Lead Demo", href: "realestate.html" },
      { group: "Pages", label: "Stores & Brands — Support Triage Demo", href: "ecommerce.html" },
      { group: "Pages", label: "Contractors & Crews — Dispatch Demo", href: "trades.html" },
      { group: "Actions", label: "Book the Systems Audit", href: prefix + "#book", hint: "30 min" },
      { group: "Actions", label: "Request an Instant Callback", href: prefix + "#callback" },
      { group: "Actions", label: "Call the Direct Hotline", href: "tel:+12674554075", hint: "(267) 455-4075" },
      { group: "Actions", label: "Client Login — Portal", href: "login.html", hint: "portal" },
    ];

    paletteOverlay = document.createElement("div");
    paletteOverlay.className = "pal-overlay";
    paletteOverlay.innerHTML =
      '<div class="pal-box" role="dialog" aria-modal="true" aria-label="Quick navigation">' +
      '<input class="pal-input" type="text" placeholder="Jump to a section, page, or action…" ' +
      'aria-label="Search site" autocomplete="off" spellcheck="false" />' +
      '<div class="pal-list" role="listbox"></div></div>';
    document.body.appendChild(paletteOverlay);

    const palInput = paletteOverlay.querySelector(".pal-input");
    const palList = paletteOverlay.querySelector(".pal-list");
    let palIndex = 0;
    let palMatches = [];

    function renderPalette(query) {
      const q = (query || "").trim().toLowerCase();
      palMatches = PALETTE_ITEMS.filter(
        (item) => !q || item.label.toLowerCase().includes(q),
      );
      palIndex = Math.min(palIndex, Math.max(palMatches.length - 1, 0));
      if (!palMatches.length) {
        palList.innerHTML =
          '<div class="pal-empty">No matches. Try "book", "venues", or "faq".</div>';
        return;
      }
      let html = "";
      let lastGroup = null;
      palMatches.forEach((item, i) => {
        if (item.group !== lastGroup) {
          html += `<div class="pal-group">${item.group}</div>`;
          lastGroup = item.group;
        }
        html +=
          `<button type="button" class="pal-item${i === palIndex ? " is-active" : ""}" data-pal-index="${i}" role="option" aria-selected="${i === palIndex}">` +
          `${item.label}${item.hint ? `<span class="pal-hint">${item.hint}</span>` : ""}</button>`;
      });
      palList.innerHTML = html;
    }

    function openPalette() {
      palIndex = 0;
      palInput.value = "";
      renderPalette("");
      paletteOverlay.classList.add("active");
      // Focus can no-op until the overlay finishes leaving
      // visibility:hidden — try now, next frame, and post-transition
      palInput.focus();
      requestAnimationFrame(() => palInput.focus());
      setTimeout(() => palInput.focus(), 220);
    }

    // Any printable keystroke while the palette is open routes into the
    // filter input, wherever focus happens to be
    document.addEventListener("keydown", (e) => {
      if (!paletteOverlay.classList.contains("active")) return;
      if (document.activeElement === palInput) return;
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        palInput.focus();
      } else if (["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
        palInput.focus();
      }
    });

    function closePalette() {
      paletteOverlay.classList.remove("active");
    }

    function activatePaletteItem(i) {
      const item = palMatches[i];
      if (!item) return;
      closePalette();
      if (item.href.startsWith("tel:")) {
        window.location.href = item.href;
      } else if (item.href.startsWith("#")) {
        document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = item.href;
      }
    }

    palInput.addEventListener("input", () => {
      palIndex = 0;
      renderPalette(palInput.value);
    });

    palInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        palIndex = Math.min(palIndex + 1, palMatches.length - 1);
        renderPalette(palInput.value);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        palIndex = Math.max(palIndex - 1, 0);
        renderPalette(palInput.value);
      } else if (e.key === "Enter") {
        e.preventDefault();
        activatePaletteItem(palIndex);
      }
    });

    palList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-pal-index]");
      if (btn) activatePaletteItem(parseInt(btn.dataset.palIndex, 10));
    });

    paletteOverlay.addEventListener("click", (e) => {
      if (e.target === paletteOverlay) closePalette();
    });

    document.querySelectorAll("[data-palette-open]").forEach((btn) => {
      btn.addEventListener("click", openPalette);
    });

    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (paletteOverlay.classList.contains("active")) closePalette();
        else openPalette();
      }
    });
  }

  /* ---- Mobile CTA dock: appears after the hero, retires at booking ---- */
  const ctaDock = document.getElementById("cta-dock");
  if (ctaDock && "IntersectionObserver" in window) {
    let pastHero = false;
    let bookInView = false;
    const syncDock = () => {
      const show = pastHero && !bookInView;
      ctaDock.classList.toggle("is-visible", show);
      ctaDock.setAttribute("aria-hidden", String(!show));
    };
    const hero = document.querySelector(".hero");
    const bookSection = document.getElementById("book");
    if (hero) {
      new IntersectionObserver(
        (entries) => {
          pastHero = !entries[0].isIntersecting;
          syncDock();
        },
        { threshold: 0.05 },
      ).observe(hero);
    }
    if (bookSection) {
      new IntersectionObserver(
        (entries) => {
          bookInView = entries[0].isIntersecting;
          syncDock();
        },
        { threshold: 0.15 },
      ).observe(bookSection);
    }
  }

  /* ------------------------------------------------------------------
     EXIT-INTENT — one tasteful checklist offer per session (desktop)
     ------------------------------------------------------------------ */
  const exitModal = document.getElementById("modal-exit");
  if (exitModal && window.matchMedia("(min-width: 901px)").matches) {
    let armed = true;
    try {
      if (sessionStorage.getItem("sk_exit_shown")) armed = false;
    } catch {}
    document.addEventListener("mouseout", (e) => {
      if (!armed) return;
      if (e.relatedTarget || e.clientY > 24) return;
      if (document.querySelector(".modal-overlay.active, .pal-overlay.active"))
        return;
      armed = false;
      try {
        sessionStorage.setItem("sk_exit_shown", "1");
      } catch {}
      exitModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  /* ------------------------------------------------------------------
     GLOBAL — Escape closes the topmost open layer
     ------------------------------------------------------------------ */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (paletteOverlay?.classList.contains("active")) {
      paletteOverlay.classList.remove("active");
      return;
    }
    if (mobileMenu?.classList.contains("open")) {
      setMenu(false);
      return;
    }
    closeModals();
  });
})();

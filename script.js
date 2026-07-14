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

  /* ------------------------------------------------------------------
     GLOBAL — Escape closes any open layer
     ------------------------------------------------------------------ */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (mobileMenu?.classList.contains("open")) {
      setMenu(false);
      return;
    }
    closeModals();
  });
})();

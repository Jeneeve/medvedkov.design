console.log("main.js loaded");

// CSS flag
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const scroller = document.querySelector(".snap");
  const root = scroller || null;

  // ===== Smooth in-container nav =====
  document.querySelectorAll('.nav a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // ===== Pause marquee on hover (optional) =====
  document.querySelectorAll(".marquee__track").forEach((track) => {
    track.addEventListener("mouseenter", () => (track.style.animationPlayState = "paused"));
    track.addEventListener("mouseleave", () => (track.style.animationPlayState = "running"));
  });

  // ===== Typewriter =====
  const blocks = document.querySelectorAll("[data-typewriter]");

  let allowStart = false;
  const enableStart = () => {
    allowStart = true;
    (scroller || window).removeEventListener("scroll", enableStart);
    (scroller || window).removeEventListener("wheel", enableStart);
    (scroller || window).removeEventListener("touchmove", enableStart);
    window.removeEventListener("keydown", enableStart);
  };

  (scroller || window).addEventListener("scroll", enableStart, { passive: true });
  (scroller || window).addEventListener("wheel", enableStart, { passive: true });
  (scroller || window).addEventListener("touchmove", enableStart, { passive: true });
  window.addEventListener("keydown", enableStart);

  const runTypewriter = (el) => {
    if (el.dataset.ran === "1") return;
    el.dataset.ran = "1";

    const chunks = Array.from(el.querySelectorAll(".type__chunk"));
    if (!chunks.length) return;

    chunks.forEach((chunk) => {
      const len = (chunk.textContent || "").trim().length;
      chunk.style.setProperty("--chars", Math.max(8, len));
    });

    let i = 0;
    const durationMs = 600;
    const gapMs = 220;

    const typeNext = () => {
      if (i > 0) {
        chunks[i - 1].classList.remove("is-typing");
        chunks[i - 1].classList.add("is-done");
      }

      if (i >= chunks.length) return;

      const cur = chunks[i];
      cur.classList.add("is-typing");

      setTimeout(() => {
        i += 1;
        if (i >= chunks.length) {
          cur.classList.remove("is-typing");
          cur.classList.add("is-done");
          return;
        }
        typeNext();
      }, durationMs + gapMs);
    };

    typeNext();
  };

  if (blocks.length) {
    const typeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!allowStart) return;
          if (entry.isIntersecting) runTypewriter(entry.target);
        });
      },
      { root, threshold: 0.55, rootMargin: "0px 0px -10% 0px" }
    );

    blocks.forEach((b) => typeObserver.observe(b));
  }

  // ===== Reveal on scroll =====
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = Number(el.dataset.revealDelay || 0);
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.classList.add("is-inview");
          obs.unobserve(el);
        });
      },
      { root, threshold: 0, rootMargin: "0px 0px -35% 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  // ===== SKILLS accordion + line draw =====

const skillsRoot = document.querySelector("[data-skills]");

if (skillsRoot) {
  const items = Array.from(skillsRoot.querySelectorAll(".skill"));

  const DATA = {
    "product-ux": {
      text: "I design user-centered digital products with a strong focus on structure, usability, and visual clarity — from the first sketch to a working prototype.",
      img: "./images/Product-UX.png",
    },

    ecommerce: {
      text: "I create conversion-focused layouts and user flows for e-commerce platforms, connecting user experience with business goals.",
      img: "./images/E-commerce.png",
    },

    "design-systems": {
      text: "I understand how to build scalable and consistent design systems — ensuring a product always looks professional and cohesive.",
      img: "./images/Design.png",
    },

    visual: {
      text: "I develop visual concepts, brand identity, and storytelling across different media — from logos to complete brand books.",
      img: "./images/Visual.png",
    },

    "product-visual": {
      text: "I communicate ideas clearly through structured layouts and visual storytelling — whether for client presentations or academic projects.",
      img: "./images/Product-Visual.png",
    },
  };

  const closeAll = () => {
    items.forEach((item) => {
      const btn = item.querySelector(".skill__row");
      const panel = item.querySelector(".skill__panel");

      if (!btn || !panel) return;

      btn.setAttribute("aria-expanded", "false");
      item.classList.remove("is-open");

      panel.addEventListener(
        "transitionend",
        () => {
          if (!item.classList.contains("is-open")) {
            panel.hidden = true;
          }
        },
        { once: true }
      );
    });
  };

  items.forEach((item) => {
    const key = item.dataset.skill;

    const btn = item.querySelector(".skill__row");
    const panel = item.querySelector(".skill__panel");
    const text = item.querySelector(".skill__text");
    const img = item.querySelector(".skill__img");

    if (!btn || !panel || !text || !img) return;

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      closeAll();

      if (isOpen) return;

      const conf = DATA[key];

      if (conf?.text) {
        text.textContent = conf.text;
      }

      img.src = conf?.img || "";
      img.alt = "";
      img.setAttribute("aria-hidden", "true");

      btn.setAttribute("aria-expanded", "true");

      panel.hidden = false;

      item.classList.add("is-open");

      item.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  });

  const skillsSection = document.querySelector("#skills");

  if (skillsSection) {
    const linesObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;

          skillsSection.classList.add("lines-on");

          obs.unobserve(skillsSection);
        });
      },
      {
        root,
        threshold: 0.55,
      }
    );

    linesObserver.observe(skillsSection);
  }
}
});
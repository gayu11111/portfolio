// Tells CSS that JavaScript is running (used for scroll animations)
document.documentElement.classList.add("js");

// ---------- Helpers ----------
function showToast(text) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(t._hide);
  t._hide = setTimeout(() => t.classList.remove("show"), 1800);
}

// ---------- Mobile menu ----------
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

// ---------- Scroll progress bar + back-to-top button ----------
const progressBar = document.createElement("div");
progressBar.className = "progress";
document.body.appendChild(progressBar);

const topBtn = document.createElement("button");
topBtn.className = "to-top";
topBtn.setAttribute("aria-label", "Back to top");
topBtn.innerHTML = "&uarr;";
document.body.appendChild(topBtn);

topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  topBtn.classList.toggle("show", window.scrollY > 300);
});

// ---------- Reveal on scroll ----------
const revealEls = document.querySelectorAll(
  ".card, .cta-banner, .c-card, .form-box, .stat, main > h2"
);
revealEls.forEach((el) => el.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add("show");
          io.unobserve(el);
          // remove helper classes after the animation so hover effects work
          setTimeout(() => {
            el.classList.remove("reveal", "show");
            el.style.transitionDelay = "";
          }, 900);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 0.08 + "s";
    io.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.remove("reveal"));
}

// ---------- Home: typing effect ----------
const typingEl = document.getElementById("typing");

if (typingEl) {
  const roles = ["Python Full-Stack Developer", "Flask Web Developer", "Problem Solver"];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const word = roles[roleIndex];
    typingEl.textContent = word.substring(0, charIndex);

    if (!deleting && charIndex < word.length) {
      charIndex++;
      setTimeout(type, 90);
    } else if (!deleting) {
      deleting = true;
      setTimeout(type, 1400);
    } else if (charIndex > 0) {
      charIndex--;
      setTimeout(type, 45);
    } else {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, 300);
    }
  }
  type();
}

// ---------- Projects: filter + search ----------
const filterBtns = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".project");
const searchBox = document.getElementById("searchBox");
const countEl = document.getElementById("projectCount");
const emptyMsg = document.getElementById("emptyMsg");
let currentFilter = "all";

function applyProjectFilters() {
  const q = searchBox ? searchBox.value.trim().toLowerCase() : "";
  let shown = 0;

  projects.forEach((p) => {
    const text = (
      p.querySelector("h3").textContent +
      " " +
      p.querySelector(".desc").textContent +
      " " +
      p.querySelector(".t-tags").textContent
    ).toLowerCase();

    const typeOk = currentFilter === "all" || p.dataset.type === currentFilter;
    const textOk = text.includes(q);
    const visible = typeOk && textOk;

    p.classList.toggle("hidden", !visible);
    if (visible) shown++;
  });

  if (countEl) countEl.textContent = "Showing " + shown + " of " + projects.length + " projects";
  if (emptyMsg) emptyMsg.classList.toggle("show", shown === 0);
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    applyProjectFilters();
  });
});

if (searchBox) searchBox.addEventListener("input", applyProjectFilters);
if (projects.length) applyProjectFilters();

// ---------- Projects: details popup ----------
const modal = document.getElementById("modal");

if (modal) {
  const mBadge = document.getElementById("mBadge");
  const mTitle = document.getElementById("mTitle");
  const mDesc = document.getElementById("mDesc");
  const mTags = document.getElementById("mTags");
  const mLink = document.getElementById("mLink");

  function openModal(card) {
    mBadge.textContent = card.querySelector(".type-badge").textContent;
    mTitle.textContent = card.querySelector("h3").textContent;
    mDesc.textContent = card.querySelector(".desc").textContent;
    mTags.innerHTML = card.querySelector(".t-tags").innerHTML;
    mLink.href = card.querySelector(".gh-link").href;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".details-btn").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.closest(".project")));
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("modal-close")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

// ---------- Contact: copy buttons ----------
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const text = btn.dataset.copy;

    function done() {
      btn.textContent = "Copied!";
      showToast("Copied to clipboard");
      setTimeout(() => (btn.textContent = "Copy"), 1500);
    }

    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        done();
      } catch (err) {
        showToast("Could not copy");
      }
      document.body.removeChild(ta);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(fallback);
    } else {
      fallback();
    }
  });
});

// ---------- Contact: form ----------
const form = document.getElementById("contactForm");

if (form) {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const counter = document.getElementById("msgCount");
  const msg = document.getElementById("formMsg");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const rules = {
    name: () => nameInput.value.trim() !== "",
    email: () => emailPattern.test(emailInput.value.trim()),
    message: () => messageInput.value.trim().length >= 10,
  };

  // live check while typing (stays neutral while the field is empty)
  function liveCheck(input, ok) {
    const empty = input.value.trim() === "";
    input.classList.toggle("valid", ok && !empty);
    input.classList.toggle("invalid", !ok && !empty);
  }

  // strict check on submit
  function markField(input, ok) {
    input.classList.toggle("valid", ok);
    input.classList.toggle("invalid", !ok);
  }

  function updateCounter() {
    counter.textContent = messageInput.value.length + " / 500 (minimum 10)";
  }

  nameInput.addEventListener("input", () => liveCheck(nameInput, rules.name()));
  emailInput.addEventListener("input", () => liveCheck(emailInput, rules.email()));
  messageInput.addEventListener("input", () => {
    liveCheck(messageInput, rules.message());
    updateCounter();
  });

  // quick message buttons
  document.querySelectorAll(".quick button").forEach((btn) => {
    btn.addEventListener("click", () => {
      messageInput.value = btn.dataset.text;
      messageInput.dispatchEvent(new Event("input"));
      messageInput.focus();
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const okName = rules.name();
    const okEmail = rules.email();
    const okMessage = rules.message();

    markField(nameInput, okName);
    markField(emailInput, okEmail);
    markField(messageInput, okMessage);

    if (!okName || !okEmail || !okMessage) {
      msg.textContent =
        "Please enter your name, a valid email and a message (at least 10 characters).";
      msg.className = "error";
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    msg.textContent = "Thanks, " + name + "! Your message is ready to send.";
    msg.className = "success";

    const subject = encodeURIComponent("Portfolio message from " + name);
    const body = encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")");
    window.location.href =
      "mailto:gayathriraj282004@gmail.com?subject=" + subject + "&body=" + body;

    form.reset();
    [nameInput, emailInput, messageInput].forEach((i) => i.classList.remove("valid", "invalid"));
    updateCounter();
  });

  updateCounter();
}

// ---------- About: tabs ----------
const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabBtns.forEach((b) => b.classList.remove("active"));
    tabPanels.forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// ---------- About: number counters ----------
document.querySelectorAll(".num").forEach((el) => {
  const target = Number(el.dataset.target);
  let count = 0;
  const step = Math.max(1, Math.ceil(target / 40));

  const timer = setInterval(() => {
    count += step;
    if (count >= target) {
      count = target;
      clearInterval(timer);
    }
    el.textContent = count;
  }, 30);
});
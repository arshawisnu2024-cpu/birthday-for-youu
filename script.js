const startBtn = document.getElementById("startBtn");
const letterBtn = document.getElementById("letterBtn");
const letterModal = document.getElementById("letterModal");
const closeLetter = document.getElementById("closeLetter");
const replayBtn = document.getElementById("replayBtn");
const memoryTrack = document.getElementById("memoryTrack");
const dots = document.getElementById("dots");
const toast = document.getElementById("toast");

// ===== TAMBAHAN SOUNDTRACK =====
const bgMusic = document.getElementById("bgMusic");

startBtn.addEventListener("click", () => {
  bgMusic.volume = 0.35;
  bgMusic.play().catch(() => {});
});
// ===== END TAMBAHAN SOUNDTRACK =====

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

startBtn.addEventListener("click", () => {
  scrollToId("story");
  showToast("Selamat menikmati cerita kecil ini ❤️");
  createHearts(10);
});

letterBtn.addEventListener("click", () => {
  letterBtn.classList.toggle("open");
  if (letterBtn.classList.contains("open")) {
    setTimeout(() => {
      letterModal.classList.add("show");
      letterModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }, 450);
  }
});

function closeModal() {
  letterModal.classList.remove("show");
  letterModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  letterBtn.classList.remove("open");
}
closeLetter.addEventListener("click", closeModal);
document.querySelector(".modal-backdrop").addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

replayBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  createHearts(18);
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3000);
}

function createHearts(count = 1) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = Math.random() > .3 ? "♥" : "♡";
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.fontSize = `${10 + Math.random() * 20}px`;
    heart.style.animationDuration = `${4 + Math.random() * 4}s`;
    heart.style.animationDelay = `${Math.random() * .7}s`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 9000);
  }
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const cards = [...document.querySelectorAll(".memory-card")];
cards.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `Lihat kenangan ${index + 1}`);
  dot.addEventListener("click", () => cards[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }));
  dots.appendChild(dot);
});

function updateDots() {
  if (!cards.length || window.innerWidth > 760) return;
  const center = memoryTrack.scrollLeft + memoryTrack.clientWidth / 2;
  let closest = 0;
  let distance = Infinity;
  cards.forEach((card, i) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const d = Math.abs(center - cardCenter);
    if (d < distance) { distance = d; closest = i; }
  });
  [...dots.children].forEach((dot, i) => dot.classList.toggle("active", i === closest));
}
memoryTrack.addEventListener("scroll", updateDots, { passive: true });
window.addEventListener("resize", updateDots);
updateDots();

document.addEventListener("click", (e) => {
  if (e.target.closest(".primary-btn, .envelope, .ghost-btn")) return;
  if (Math.random() < .06) createHearts(1);
});
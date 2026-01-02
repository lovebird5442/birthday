// GSAP plugin
gsap.registerPlugin(ScrollTrigger);

/* -----------------------
   PASSCODE LANDING PAGE
------------------------*/
const CORRECT_PASSCODE = "2004"; // Change this to your desired 4-digit code
const passcodeScreen = document.getElementById("passcodeScreen");
const mainContent = document.getElementById("mainContent");
const passcodeDots = document.querySelectorAll(".passcode-dot");
const keypadBtns = document.querySelectorAll(".keypad-btn[data-number]");
const clearBtn = document.getElementById("clearBtn");
const submitBtn = document.getElementById("submitBtn");
const passcodeError = document.getElementById("passcodeError");
const snowContainer = document.getElementById("snowContainer");

let enteredCode = "";

// Create snowflakes
function createSnowflakes() {
  const snowflakeSymbols = ["❄", "❅", "❆", "✻", "✼"];
  const numFlakes = 50;

  for (let i = 0; i < numFlakes; i++) {
    const flake = document.createElement("div");
    flake.className = "snowflake";
    flake.textContent = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
    flake.style.left = Math.random() * 100 + "%";
    flake.style.animationDuration = (Math.random() * 3 + 2) + "s";
    flake.style.animationDelay = Math.random() * 2 + "s";
    flake.style.opacity = Math.random() * 0.5 + 0.5;
    flake.style.fontSize = (Math.random() * 10 + 10) + "px";
    snowContainer.appendChild(flake);
  }
}

// Update dots display
function updateDots() {
  passcodeDots.forEach((dot, index) => {
    if (index < enteredCode.length) {
      dot.classList.add("filled");
    } else {
      dot.classList.remove("filled");
    }
  });
}

// Handle number input
keypadBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (enteredCode.length < 4) {
      enteredCode += btn.getAttribute("data-number");
      updateDots();
      passcodeError.classList.remove("show");
      
      // Button press animation
      gsap.to(btn, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
    }
  });
});

// Clear button
clearBtn.addEventListener("click", () => {
  enteredCode = "";
  updateDots();
  passcodeError.classList.remove("show");
  
  gsap.to(clearBtn, {
    scale: 0.9,
    duration: 0.1,
    yoyo: true,
    repeat: 1
  });
});

// Submit button
submitBtn.addEventListener("click", () => {
  if (enteredCode.length === 4) {
    if (enteredCode === CORRECT_PASSCODE) {
      // Correct passcode - unlock the site
      gsap.to(passcodeScreen, {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: "power2.in",
        onComplete: () => {
          passcodeScreen.style.display = "none";
          mainContent.style.display = "block";
          gsap.to(mainContent, {
            opacity: 1,
            duration: 1,
            ease: "power2.out"
          });
          // Initialize main site animations
          initMainSite();
        }
      });
    } else {
      // Wrong passcode
      enteredCode = "";
      updateDots();
      passcodeError.classList.add("show");
      
      // Shake animation
      gsap.to(passcodeScreen, {
        x: -10,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => {
          gsap.set(passcodeScreen, { x: 0 });
        }
      });
    }
  }
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (passcodeScreen.style.display !== "none") {
    if (e.key >= "0" && e.key <= "9" && enteredCode.length < 4) {
      enteredCode += e.key;
      updateDots();
      passcodeError.classList.remove("show");
    } else if (e.key === "Backspace" || e.key === "Delete") {
      enteredCode = "";
      updateDots();
      passcodeError.classList.remove("show");
    } else if (e.key === "Enter" && enteredCode.length === 4) {
      submitBtn.click();
    }
  }
});

// Initialize snow and passcode screen
createSnowflakes();

// Function to initialize main site (called after passcode is correct)
function initMainSite() {
  // All the existing main site code will run here
  // This ensures animations only start after passcode is entered
  
/* Smooth scroll for anchors (if any) */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 60, behavior: "smooth" });
    }
  });
});

/* Background particles */
const particleContainer = document.getElementById("particles");
const particleCount = 60;

for (let i = 0; i < particleCount; i++) {
  const el = document.createElement("div");
  const isHeart = Math.random() < 0.35;

  el.classList.add("particle");
  if (isHeart) el.classList.add("heart");

  const size = isHeart ? (Math.random() * 8 + 8) : (Math.random() * 5 + 3);
  el.style.width = size + "px";
  el.style.height = size + "px";

  const left = Math.random() * 100;
  el.style.left = left + "vw";

  const duration = 18 + Math.random() * 14;
  el.style.animationDuration = duration + "s";
  el.style.animationDelay = (-duration * Math.random()) + "s";

  particleContainer.appendChild(el);
}

/* Music toggle */
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
let isPlaying = false;

(async () => {
  try {
    music.volume = 0.7;
    await music.play();
    music.muted = true;
  } catch (e) {
    // Autoplay may fail
  }
})();

musicToggle.addEventListener("click", async () => {
  try {
    if (!isPlaying) {
      await music.play();
      music.muted = false;
      isPlaying = true;
      musicToggle.querySelector("span").textContent = "Pause music";
      musicToggle.querySelector("i").classList.remove("fa-music");
      musicToggle.querySelector("i").classList.add("fa-pause");
    } else {
      music.pause();
      isPlaying = false;
      musicToggle.querySelector("span").textContent = "Play music";
      musicToggle.querySelector("i").classList.remove("fa-pause");
      musicToggle.querySelector("i").classList.add("fa-music");
    }
  } catch (e) {
    console.log("Music play prevented:", e);
  }
});

/* Hero animations */
gsap.from(".hero-tag", {
  y: 20,
  opacity: 0,
  duration: 0.7,
  ease: "power3.out"
});

gsap.from(".hero-title", {
  y: 30,
  opacity: 0,
  duration: 1,
  delay: 0.1,
  ease: "power3.out"
});

gsap.from(".hero-sub", {
  y: 30,
  opacity: 0,
  duration: 0.9,
  delay: 0.3,
  ease: "power3.out"
});

gsap.from(".hero-heartline", {
  y: 30,
  opacity: 0,
  duration: 0.9,
  delay: 0.5,
  ease: "power3.out"
});

gsap.from(".hero-badge", {
  y: 24,
  opacity: 0,
  duration: 0.9,
  delay: 0.7,
  ease: "power3.out",
  stagger: 0.1
});

/* Typewriter effect */
const typewriterEl = document.getElementById("typewriter");
const typewriterPhrases = [
  "You are my home, even when everything else feels uncertain.",
  "You are my safe place, from class 10 & class 9 to now.",
  "You are my forever, Ayushma.",
  "You are my favorite hello after long nursing shifts and my hardest goodbye.",
  "You are the love story I never thought I deserved, but somehow got anyway."
];

let twIndex = 0;
let charIndex = 0;
let deleting = false;

function typeWriterLoop() {
  const current = typewriterPhrases[twIndex];
  const speed = deleting ? 45 : 70;

  if (!deleting) {
    typewriterEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeWriterLoop, 1600);
      return;
    }
  } else {
    typewriterEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      twIndex = (twIndex + 1) % typewriterPhrases.length;
    }
  }
  setTimeout(typeWriterLoop, speed);
}

ScrollTrigger.create({
  trigger: "#who-you-are",
  start: "top 70%",
  once: true,
  onEnter: () => typeWriterLoop()
});

/* Floating words parallax */
gsap.utils.toArray(".floating-word").forEach((word, i) => {
  gsap.fromTo(word,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      delay: i * 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#who-you-are",
        start: "top 60%",
        toggleActions: "play none none reverse"
      }
    }
  );

  gsap.to(word, {
    y: "+=8",
    duration: 3 + Math.random() * 2,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut"
  });
});

/* Nickname tags floating animation */
gsap.utils.toArray(".nickname-tag").forEach((tag, i) => {
  gsap.from(tag, {
    opacity: 0,
    y: 20,
    scale: 0.9,
    duration: 0.9,
    delay: i * 0.08,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#first-things",
      start: "top 70%",
      once: true
    }
  });

  gsap.to(tag, {
    y: "+=" + (6 + Math.random() * 6),
    x: "+=" + (Math.random() * 6 - 3),
    duration: 3 + Math.random() * 2,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut"
  });
});

/* First cards reveal */
gsap.utils.toArray(".first-card").forEach((card, i) => {
  gsap.from(card, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    delay: i * 0.08,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#first-things",
      start: "top 75%",
      once: true
    }
  });
});

/* Timeline animations */
gsap.from("#timeline .section-title, #timeline .section-subtitle", {
  opacity: 0,
  y: 30,
  duration: 0.9,
  ease: "power3.out",
  scrollTrigger: {
    trigger: "#timeline",
    start: "top 75%",
    once: true
  }
});

gsap.utils.toArray(".timeline-year").forEach((year, i) => {
  gsap.from(year, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    delay: i * 0.06,
    ease: "power3.out",
    scrollTrigger: {
      trigger: year,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });
});

/* Little things cards */
gsap.utils.toArray(".love-card").forEach((card, i) => {
  gsap.from(card, {
    opacity: 0,
    y: 30,
    duration: 0.9,
    delay: i * 0.06,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#little-things",
      start: "top 75%",
      once: true
    }
  });
});

/* Love letter line-by-line */
const letterLines = gsap.utils.toArray(".letter-line");

ScrollTrigger.create({
  trigger: "#love-letter",
  start: "top 65%",
  once: true,
  onEnter: () => {
    letterLines.forEach((line, i) => {
      gsap.to(line, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay: i * 0.6,
        ease: "power3.out"
      });
    });

    if (!music.muted && isPlaying) {
      gsap.to(music, {
        volume: 0.95,
        duration: 2
      });
    }
  }
});

/* 20 reasons hearts */
const reasons = [
  "You love with your whole heart, even when you’re scared and tired.",
  "You make my worst days feel survivable just by saying, “It’s okay, I’m here.”",
  "You’re the girl I met when I was in class 10 and you were in class 9, and I still can’t believe I got to keep you.",
  "You listen—even to the things I don’t know how to say properly—and somehow still understand me.",
  "You believe in me more than I believe in myself, and that gives me strength.",
  "You make the most ordinary days—bus rides, phone calls, random evenings—feel a little bit magical.",
  "You make me laugh when I’m trying my hardest to stay upset, and I secretly love that you do.",
  "You see my flaws, my mistakes, my weakest sides, and still decide I’m worth loving.",
  "You care deeply about people, the way a nurse does—quietly, fiercely, with so much heart.",
  "You’re strong in ways you don’t even notice: showing up, studying, fighting your battles, and still choosing kindness.",
  "You’re soft in ways that make this world kinder—your words, your hugs, your late-night messages.",
  "You’re patient with me, even when I overthink, shut down, or don’t know how to express myself.",
  "You remember the little things I say and surprise me with them later, like you’ve written my heart in your notebook.",
  "You’re beautiful—inside, outside, in your nursing uniform, in your pajamas, in every single version of you.",
  "You challenge me to grow instead of letting me stay stuck in my comfort zones.",
  "You hold my hand through every version of “hard” — every fight, every distance, every misunderstanding.",
  "You make love feel safe, not like a tragedy from a story, but like something that survives the bad days too.",
  "You make my future feel less frightening and more like a home I’m excited to build with you.",
  "You’re my favorite person to tell good news to, and the only person I want beside me in bad news.",
  "You are, simply, you — Ayushma Regmi — and that alone is enough to make my whole world softer."
];

const reasonsGrid = document.getElementById("reasonsGrid");

reasons.forEach((text, index) => {
  const card = document.createElement("div");
  card.className = "reason-heart";

  const number = document.createElement("div");
  number.className = "reason-number";
  number.textContent = index + 1 < 10 ? "0" + (index + 1) : (index + 1);

  const txt = document.createElement("div");
  txt.className = "reason-text";
  txt.textContent = text;

  card.appendChild(number);
  card.appendChild(txt);
  reasonsGrid.appendChild(card);

  gsap.from(card, {
    opacity: 0,
    scale: 0.8,
    y: 30,
    duration: 0.7,
    delay: index * 0.03,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: "#reasons",
      start: "top 80%",
      once: true
    }
  });

  card.addEventListener("click", () => {
    card.classList.add("open");
    gsap.fromTo(card,
      { scale: 0.9 },
      { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" }
    );

    if (index === reasons.length - 1) {
      launchConfetti();
    }
  });
});

/* Confetti */
const confettiContainer = document.getElementById("confetti");

function launchConfetti() {
  const pieces = 80;
  for (let i = 0; i < pieces; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    confettiContainer.appendChild(el);

    const x = Math.random() * 100;
    const delay = Math.random() * 0.6;
    const duration = 2 + Math.random() * 1.5;
    const rotate = (Math.random() - 0.5) * 720;

    gsap.set(el, {
      left: x + "vw",
      top: "-10px",
      opacity: 1,
      background: `linear-gradient(180deg,
        ${Math.random() > 0.5 ? "#ff8fb7" : "#f9d976"},
        ${Math.random() > 0.5 ? "#c8a3ff" : "#ffffff"})`
    });

    gsap.to(el, {
      y: "110vh",
      rotation: rotate,
      duration,
      ease: "power2.in",
      delay,
      onComplete: () => el.remove()
    });
  }
}

/* Future – shooting stars */
gsap.utils.toArray("#future .shooting-star").forEach((star, i) => {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 + Math.random() * 3 });
  tl.fromTo(star,
    { xPercent: -20, opacity: 0 },
    { xPercent: 130, opacity: 1, duration: 1.6 + Math.random(), ease: "power2.out" }
  );
  tl.to(star, { opacity: 0, duration: 0.4 }, "-=0.2");
});

gsap.from("#future .future-quote, #future .future-note", {
  opacity: 0,
  y: 30,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: "#future",
    start: "top 75%",
    once: true
  }
});

/* Finale – heart burst */
const surpriseBtn = document.getElementById("surpriseBtn");
const surpriseMessage = document.getElementById("surpriseMessage");
const heartBurstContainer = document.getElementById("heartBurst");

function burstHearts() {
  const total = 70;
  for (let i = 0; i < total; i++) {
    const heart = document.createElement("div");
    heart.className = "burst-heart";
    heart.textContent = "❤️";

    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;

    gsap.set(heart, {
      left: startX + "px",
      top: startY + "px",
      fontSize: 16 + Math.random() * 16
    });

    heartBurstContainer.appendChild(heart);

    const angle = (Math.PI * 2 * i) / total;
    const distance = 80 + Math.random() * 220;

    const targetX = startX + Math.cos(angle) * distance;
    const targetY = startY + Math.sin(angle) * distance;

    gsap.to(heart, {
      x: targetX - startX,
      y: targetY - startY,
      opacity: 1,
      duration: 0.9,
      ease: "power2.out"
    });

    gsap.to(heart, {
      opacity: 0,
      duration: 0.7,
      delay: 0.9,
      ease: "power2.in",
      onComplete: () => heart.remove()
    });
  }
}

const surpriseModal = document.getElementById("surpriseModal");
const surpriseClose = document.getElementById("surpriseClose");

surpriseBtn.addEventListener("click", () => {
  burstHearts();

  // Show the surprise card modal
  surpriseModal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Animate the card entrance
  gsap.fromTo(".surprise-card",
    { scale: 0.8, opacity: 0, y: 30 },
    { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }
  );

  gsap.to(surpriseMessage, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out"
  });

  gsap.fromTo(surpriseBtn,
    { scale: 1 },
    { scale: 1.05, duration: 0.3, ease: "elastic.out(1, 0.4)" }
  );
});

// Close modal functions
function closeSurpriseModal() {
  gsap.to(".surprise-card", {
    scale: 0.8,
    opacity: 0,
    y: 30,
    duration: 0.4,
    ease: "back.in(1.7)",
    onComplete: () => {
      surpriseModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

surpriseClose.addEventListener("click", closeSurpriseModal);

surpriseModal.addEventListener("click", (e) => {
  if (e.target === surpriseModal || e.target.classList.contains("surprise-modal-overlay")) {
    closeSurpriseModal();
  }
});

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && surpriseModal.classList.contains("active")) {
    closeSurpriseModal();
  }
});

gsap.from("#finale .finale-title, #finale .finale-sub, #finale .surprise-btn", {
  opacity: 0,
  y: 40,
  duration: 1,
  ease: "power3.out",
  stagger: 0.15,
  scrollTrigger: {
    trigger: "#finale",
    start: "top 75%",
    once: true
  }
});

/* -----------------------
   DRAGGABLE PAPERS (BONUS)
------------------------*/
let highestZ = 10;

class DragPaper {
  constructor(el) {
    this.el = el;
    this.dragging = false;
    this.currentX = 0;
    this.currentY = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.rotation = Math.random() * 30 - 15;

    this.el.style.transform = `translateX(0px) translateY(0px) rotateZ(${this.rotation}deg)`;

    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);

    this.el.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);

    // Prevent right-click menu on papers
    this.el.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  onPointerDown(e) {
    this.dragging = true;
    this.el.setPointerCapture(e.pointerId);
    this.prevX = e.clientX;
    this.prevY = e.clientY;
    highestZ += 1;
    this.el.style.zIndex = highestZ;
  }

  onPointerMove(e) {
    if (!this.dragging) return;
    const dx = e.clientX - this.prevX;
    const dy = e.clientY - this.prevY;
    this.prevX = e.clientX;
    this.prevY = e.clientY;

    this.currentX += dx;
    this.currentY += dy;

    this.el.style.transform = `translateX(${this.currentX}px) translateY(${this.currentY}px) rotateZ(${this.rotation}deg)`;
  }

  onPointerUp(e) {
    this.dragging = false;
    this.el.releasePointerCapture(e.pointerId);
  }
}

window.addEventListener("load", () => {
  const paperEls = document.querySelectorAll(".papers-board .paper");
  paperEls.forEach((p) => new DragPaper(p));
});

} // End of initMainSite function
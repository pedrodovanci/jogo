const questionEl = document.getElementById("question");
const arenaEl = document.getElementById("arena");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const giftEmojiBtn = document.getElementById("giftEmojiBtn");
const photoWrap = document.getElementById("photoWrap");
const photoEl = document.getElementById("photo");
const photoHint = document.getElementById("photoHint");

const steps = [
  { question: "Você gosta de rosas?" },
  { question: "Você gosta de morenos?" },
];

let currentStep = 0;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function revealPhoto() {
  questionEl.hidden = true;
  arenaEl.hidden = true;
  giftEmojiBtn.hidden = true;
  photoWrap.hidden = false;
  photoHint.hidden = true;
}

function setStep(step) {
  currentStep = step;
  questionEl.hidden = false;
  questionEl.textContent = steps[currentStep].question;
  giftEmojiBtn.hidden = true;
  photoWrap.hidden = true;
  photoHint.hidden = true;
  arenaEl.hidden = false;
  noBtn.style.left = "";
  noBtn.style.top = "";
  noBtn.style.right = "";
  noBtn.style.bottom = "";
}

function px(n) {
  return `${Math.round(n)}px`;
}

function moveNoButton() {
  if (arenaEl.hidden) return;
  const arenaRect = arenaEl.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();

  const pad = 10;
  const maxX = Math.max(pad, arenaRect.width - noRect.width - pad);
  const maxY = Math.max(pad, arenaRect.height - noRect.height - pad);

  const tryCount = 14;
  for (let i = 0; i < tryCount; i += 1) {
    const x = pad + Math.random() * (maxX - pad);
    const y = pad + Math.random() * (maxY - pad);

    const candidate = {
      left: arenaRect.left + x,
      top: arenaRect.top + y,
      right: arenaRect.left + x + noRect.width,
      bottom: arenaRect.top + y + noRect.height,
    };

    const overlaps =
      !(candidate.right < yesRect.left ||
        candidate.left > yesRect.right ||
        candidate.bottom < yesRect.top ||
        candidate.top > yesRect.bottom);

    if (!overlaps || i === tryCount - 1) {
      noBtn.style.left = px(x);
      noBtn.style.top = px(y);
      noBtn.style.right = "auto";
      noBtn.style.bottom = "auto";
      return;
    }
  }
}

function setGiftStage() {
  questionEl.hidden = true;
  arenaEl.hidden = true;
  giftEmojiBtn.hidden = false;
  photoWrap.hidden = true;
  photoHint.hidden = true;
}

function init() {
  setStep(0);

  yesBtn.addEventListener("click", () => {
    if (currentStep === 0) {
      setStep(1);
      return;
    }
    setGiftStage();
  });

  const evade = (event) => {
    event.preventDefault();
    moveNoButton();
  };

  noBtn.addEventListener("pointerdown", evade);
  noBtn.addEventListener("click", evade);
  noBtn.addEventListener("pointerenter", moveNoButton);
  noBtn.addEventListener("focus", moveNoButton);
  noBtn.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") evade(event);
  });

  giftEmojiBtn.addEventListener("click", async () => {
    giftEmojiBtn.disabled = true;
    await sleep(280);
    revealPhoto();
  });

  photoEl.addEventListener("error", () => {
    photoEl.style.display = "none";
    photoHint.hidden = false;
  });
}

init();

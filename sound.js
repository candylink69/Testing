// ==== AUDIO CONFIG ====
window.BUBBLE_SOUND_ENABLED = true;

// ==== POP SOUNDS (4 random) ====
const sounds = {
  s1: new Audio("DATA_URI_1"), // Tera audio 1
  s2: new Audio("DATA_URI_2"), // Tera audio 2
  s3: new Audio("DATA_URI_3"), // Tera audio 3
  s4: new Audio("DATA_URI_4")  // Tera audio 4
};

// ==== KISS SOUND (Heart full reward) ====
const kissSound = new Audio("data:audio/wav;base64,UklGRlwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVoAAACAgICAf39/f39/f39/f3+AgICAf39/f39/f39/f3+AgICAf39/f39/f39/f3+AgICAf39/f39/f39/f38=");

// ==== AUDIO SETTINGS ====
Object.values(sounds).forEach(audio => {
  audio.preload = "auto";
  audio.volume = 0.8;
});
kissSound.preload = "auto";
kissSound.volume = 0.9;

// ==== PLAY FUNCTIONS ====
function playSound(type) {
  if (!window.BUBBLE_SOUND_ENABLED) return;
  const audio = sounds[type];
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function playRandomPopSound() {
  const keys = ["s1", "s2", "s3", "s4"];
  const random = keys[Math.floor(Math.random() * keys.length)];
  playSound(random);
}

function playKissSound() {
  if (!window.BUBBLE_SOUND_ENABLED) return;
  kissSound.currentTime = 0;
  kissSound.play().catch(() => {});
}

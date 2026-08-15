const SCREEN_MUSIC = Object.freeze({
  interview: new URL("../sound/interview.mp3", import.meta.url).href,
  deduction: new URL("../sound/ask.mp3", import.meta.url).href,
  result: new URL("../sound/result.mp3", import.meta.url).href,
});

const MESSAGE_SOUNDS = Object.freeze({
  cat1: new URL("../sound/cat1.mp3", import.meta.url).href,
  cat2: new URL("../sound/cat2.mp3", import.meta.url).href,
  computer: new URL("../sound/computer.mp3", import.meta.url).href,
  message1: new URL("../sound/message1.mp3", import.meta.url).href,
  message2: new URL("../sound/message2.mp3", import.meta.url).href,
  message3: new URL("../sound/message3.mp3", import.meta.url).href,
  space10: new URL("../sound/space.mp3", import.meta.url).href,
});

const DECISION_SOUND = new URL("../assets/cutin/decision.mp3", import.meta.url).href;
const NORMAL_DECISION_SOUND = new URL(
  "../assets/cutin/decision_normal.mp3",
  import.meta.url,
).href;
const CHOICE_SOUND = new URL("../sound/choice.mp3", import.meta.url).href;

const musicPlayer = new Audio();
musicPlayer.loop = true;
musicPlayer.preload = "auto";

let activeTrack = null;
let requestedTrack = null;
let musicGain = 1;
let musicFadeFrame = null;
let musicTransitionId = 0;
let musicStopInProgress = false;

const MUSIC_VOLUME = 0.34;
const MUSIC_FADE_OUT_MS = 400;
const MUSIC_FADE_IN_MS = 560;

const messagePlayer = new Audio();
messagePlayer.loop = true;
messagePlayer.preload = "auto";

let masterVolume = 1;

const decisionPlayer = new Audio();
decisionPlayer.preload = "auto";

const choicePlayer = new Audio();
choicePlayer.preload = "auto";

function applyMusicVolume() {
  musicPlayer.volume = MUSIC_VOLUME * masterVolume * musicGain;
}

function cancelMusicFade() {
  if (musicFadeFrame !== null) {
    window.cancelAnimationFrame(musicFadeFrame);
    musicFadeFrame = null;
  }
}

function fadeMusicTo(targetGain, duration, transitionId, onComplete) {
  cancelMusicFade();
  const startGain = musicGain;
  const startedAt = performance.now();

  const step = (now) => {
    if (transitionId !== musicTransitionId) return;
    const progress = duration <= 0 ? 1 : Math.min(1, (now - startedAt) / duration);
    musicGain = startGain + (targetGain - startGain) * progress;
    applyMusicVolume();
    if (progress < 1) {
      musicFadeFrame = window.requestAnimationFrame(step);
      return;
    }
    musicFadeFrame = null;
    onComplete?.();
  };

  musicFadeFrame = window.requestAnimationFrame(step);
}

function startTrack(nextTrack, transitionId) {
  if (transitionId !== musicTransitionId) return;
  musicStopInProgress = false;
  musicPlayer.pause();
  musicPlayer.src = nextTrack;
  musicPlayer.currentTime = 0;
  activeTrack = nextTrack;
  musicGain = 0;
  applyMusicVolume();
  if (masterVolume <= 0) return;
  musicPlayer.play().catch(() => {
    // 自動再生が制限された場合は、次のプレイヤー操作時に再試行する。
  });
  fadeMusicTo(1, MUSIC_FADE_IN_MS, transitionId);
}

export function setAudioVolume(volume) {
  const nextVolume = Number.isFinite(volume)
    ? Math.min(1, Math.max(0, volume))
    : 1;
  const wasMuted = masterVolume <= 0;
  masterVolume = nextVolume;
  applyMusicVolume();
  messagePlayer.volume = 0.5 * masterVolume;
  decisionPlayer.volume = 0.7 * masterVolume;
  choicePlayer.volume = 0.56 * masterVolume;

  if (masterVolume <= 0) {
    musicTransitionId += 1;
    cancelMusicFade();
    musicPlayer.pause();
    messagePlayer.pause();
    decisionPlayer.pause();
    choicePlayer.pause();
    if (!requestedTrack) {
      musicStopInProgress = false;
      musicPlayer.removeAttribute("src");
      musicPlayer.load();
      activeTrack = null;
      musicGain = 1;
      applyMusicVolume();
    }
    return;
  }

  if (wasMuted && requestedTrack) {
    const transitionId = ++musicTransitionId;
    if (activeTrack !== requestedTrack) {
      startTrack(requestedTrack, transitionId);
      return;
    }
    musicGain = 0;
    applyMusicVolume();
    musicPlayer.play().catch(() => {});
    fadeMusicTo(1, MUSIC_FADE_IN_MS, transitionId);
  }
}

setAudioVolume(masterVolume);

export function playScreenMusic(screen) {
  const nextTrack = SCREEN_MUSIC[screen];
  if (!nextTrack) return stopScreenMusic();
  const shouldStartImmediately =
    musicStopInProgress || requestedTrack === null || musicPlayer.paused;
  musicStopInProgress = false;
  requestedTrack = nextTrack;

  const transitionId = ++musicTransitionId;
  cancelMusicFade();

  if (masterVolume <= 0) {
    musicPlayer.pause();
    musicPlayer.src = nextTrack;
    musicPlayer.currentTime = 0;
    activeTrack = nextTrack;
    musicGain = 0;
    applyMusicVolume();
    return;
  }

  if (shouldStartImmediately) {
    startTrack(nextTrack, transitionId);
    return;
  }

  if (activeTrack === nextTrack) {
    if (masterVolume <= 0) return;
    if (musicPlayer.paused) musicPlayer.play().catch(() => {});
    fadeMusicTo(1, MUSIC_FADE_IN_MS, transitionId);
    return;
  }

  if (!activeTrack || !musicPlayer.src) {
    startTrack(nextTrack, transitionId);
    return;
  }

  fadeMusicTo(0, MUSIC_FADE_OUT_MS, transitionId, () => {
    if (requestedTrack !== nextTrack) return;
    startTrack(nextTrack, transitionId);
  });
}

export function stopScreenMusic() {
  if (musicStopInProgress) return;
  requestedTrack = null;
  const transitionId = ++musicTransitionId;
  cancelMusicFade();
  if (!activeTrack || musicPlayer.paused || masterVolume <= 0) {
    musicPlayer.pause();
    musicPlayer.removeAttribute("src");
    musicPlayer.load();
    activeTrack = null;
    musicStopInProgress = false;
    musicGain = 1;
    applyMusicVolume();
    return;
  }

  musicStopInProgress = true;
  fadeMusicTo(0, MUSIC_FADE_OUT_MS, transitionId, () => {
    if (transitionId !== musicTransitionId) return;
    musicPlayer.pause();
    musicPlayer.removeAttribute("src");
    musicPlayer.load();
    activeTrack = null;
    musicStopInProgress = false;
    musicGain = 1;
    applyMusicVolume();
  });
}

export function startMessageSound(soundId, playbackRate = 1, loop = true) {
  if (masterVolume <= 0) {
    stopMessageSound();
    return;
  }
  const nextSound = MESSAGE_SOUNDS[soundId] ?? MESSAGE_SOUNDS.message1;
  const nextPlaybackRate = Number.isFinite(playbackRate)
    ? Math.min(1.5, Math.max(0.75, playbackRate))
    : 1;
  messagePlayer.pause();
  messagePlayer.src = nextSound;
  messagePlayer.loop = loop !== false;
  messagePlayer.playbackRate = nextPlaybackRate;
  messagePlayer.currentTime = 0;
  messagePlayer.play().catch(() => {
    // 音声再生が制限された環境でも文字送りは継続する。
  });
}

export function stopMessageSound() {
  messagePlayer.pause();
  messagePlayer.removeAttribute("src");
  messagePlayer.load();
}

export function playDecisionSound(cutin = "rainbow") {
  if (masterVolume <= 0) return;
  const decisionSound = ["blue", "gold"].includes(cutin)
    ? NORMAL_DECISION_SOUND
    : DECISION_SOUND;
  decisionPlayer.pause();
  decisionPlayer.src = decisionSound;
  decisionPlayer.currentTime = 0;
  decisionPlayer.play().catch(() => {
    // 音声再生が制限された環境でも演出は表示する。
  });
}

export function playChoiceSound() {
  playChoiceSoundAtVolume(1);
}

export function playQuestionSound() {
  playChoiceSoundAtVolume(0.58);
}

function playChoiceSoundAtVolume(volumeScale) {
  if (masterVolume <= 0) return;
  choicePlayer.pause();
  choicePlayer.src = CHOICE_SOUND;
  choicePlayer.volume = 0.56 * masterVolume * volumeScale;
  choicePlayer.currentTime = 0;
  choicePlayer.play().catch(() => {
    // 音声再生が制限された環境でも選択操作は継続する。
  });
}

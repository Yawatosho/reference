const SCREEN_MUSIC = Object.freeze({
  interview: new URL("../sound/interview.mp3", import.meta.url).href,
  deduction: new URL("../sound/ask.mp3", import.meta.url).href,
  result: new URL("../sound/result.mp3", import.meta.url).href,
});
const ENDING_MUSIC = new URL("../sound/ending.mp3", import.meta.url).href;

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
let musicFadeTimer = null;
let musicRetryTimer = null;
let musicTransitionId = 0;
let musicStopInProgress = false;
let activeTrackLoops = true;
let requestedTrackLoops = true;
let nonLoopTrackEnded = false;

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
  if (musicFadeTimer !== null) {
    window.clearTimeout(musicFadeTimer);
    musicFadeTimer = null;
  }
}

function cancelMusicRetry() {
  if (musicRetryTimer !== null) {
    window.clearTimeout(musicRetryTimer);
    musicRetryTimer = null;
  }
}

function fadeMusicTo(targetGain, duration, transitionId, onComplete) {
  cancelMusicFade();
  const startGain = musicGain;
  const startedAt = performance.now();
  let completed = false;

  const finish = () => {
    if (completed || transitionId !== musicTransitionId) return;
    completed = true;
    if (musicFadeFrame !== null) {
      window.cancelAnimationFrame(musicFadeFrame);
      musicFadeFrame = null;
    }
    if (musicFadeTimer !== null) {
      window.clearTimeout(musicFadeTimer);
      musicFadeTimer = null;
    }
    musicGain = targetGain;
    applyMusicVolume();
    onComplete?.();
  };

  const step = (now) => {
    if (transitionId !== musicTransitionId) return;
    const progress = duration <= 0 ? 1 : Math.min(1, (now - startedAt) / duration);
    musicGain = startGain + (targetGain - startGain) * progress;
    applyMusicVolume();
    if (progress < 1) {
      musicFadeFrame = window.requestAnimationFrame(step);
      return;
    }
    finish();
  };

  musicFadeFrame = window.requestAnimationFrame(step);
  musicFadeTimer = window.setTimeout(finish, duration + 120);
}

function attemptMusicPlay(transitionId, retryIndex = 0) {
  cancelMusicRetry();
  if (
    transitionId !== musicTransitionId ||
    masterVolume <= 0 ||
    !requestedTrack ||
    nonLoopTrackEnded
  ) {
    return;
  }

  const playPromise = musicPlayer.play();
  if (!playPromise?.catch) return;
  playPromise.catch(() => {
    if (
      transitionId !== musicTransitionId ||
      masterVolume <= 0 ||
      !requestedTrack
    ) {
      return;
    }
    const retryDelays = [140, 420, 1000];
    const delay = retryDelays[retryIndex];
    if (delay === undefined) return;
    musicRetryTimer = window.setTimeout(() => {
      musicRetryTimer = null;
      attemptMusicPlay(transitionId, retryIndex + 1);
    }, delay);
  });
}

function startTrack(
  nextTrack,
  transitionId,
  { audibleStart = false, loop = true } = {},
) {
  if (transitionId !== musicTransitionId) return;
  musicStopInProgress = false;
  const canReuseTrack =
    activeTrack === nextTrack &&
    activeTrackLoops === loop &&
    Boolean(musicPlayer.src);
  if (!canReuseTrack) {
    musicPlayer.pause();
    musicPlayer.src = nextTrack;
  }
  musicPlayer.loop = loop;
  activeTrackLoops = loop;
  nonLoopTrackEnded = false;
  try {
    musicPlayer.currentTime = 0;
  } catch {
    // 読み込み前でシークできない環境では、そのまま再生開始する。
  }
  activeTrack = nextTrack;
  musicGain = audibleStart ? 0.18 : 0;
  applyMusicVolume();
  if (masterVolume <= 0) return;
  attemptMusicPlay(transitionId);
  fadeMusicTo(1, MUSIC_FADE_IN_MS, transitionId);
}

function retryMusicFromInteraction() {
  if (
    masterVolume <= 0 ||
    !requestedTrack ||
    activeTrack !== requestedTrack ||
    !musicPlayer.paused ||
    nonLoopTrackEnded
  ) {
    return;
  }
  attemptMusicPlay(musicTransitionId);
}

musicPlayer.addEventListener("ended", () => {
  if (!musicPlayer.loop) nonLoopTrackEnded = true;
});

document.addEventListener("pointerup", retryMusicFromInteraction, true);
document.addEventListener("keydown", retryMusicFromInteraction, true);

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
    cancelMusicRetry();
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

  if (wasMuted && requestedTrack && !nonLoopTrackEnded) {
    const transitionId = ++musicTransitionId;
    if (activeTrack !== requestedTrack) {
      startTrack(requestedTrack, transitionId, { loop: requestedTrackLoops });
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
  const nextTrack = screen === "ending" ? ENDING_MUSIC : SCREEN_MUSIC[screen];
  const nextTrackLoops = screen !== "ending";
  if (!nextTrack) return stopScreenMusic();
  if (
    nextTrack === requestedTrack &&
    nextTrack === activeTrack &&
    !nextTrackLoops &&
    nonLoopTrackEnded
  ) {
    return;
  }
  const shouldStartImmediately =
    musicStopInProgress || requestedTrack === null || musicPlayer.paused;
  musicStopInProgress = false;
  requestedTrack = nextTrack;
  requestedTrackLoops = nextTrackLoops;

  const transitionId = ++musicTransitionId;
  cancelMusicFade();
  cancelMusicRetry();

  if (masterVolume <= 0) {
    musicPlayer.pause();
    musicPlayer.src = nextTrack;
    musicPlayer.loop = nextTrackLoops;
    musicPlayer.currentTime = 0;
    activeTrack = nextTrack;
    activeTrackLoops = nextTrackLoops;
    nonLoopTrackEnded = false;
    musicGain = 0;
    applyMusicVolume();
    return;
  }

  if (shouldStartImmediately) {
    startTrack(nextTrack, transitionId, {
      audibleStart: true,
      loop: nextTrackLoops,
    });
    return;
  }

  if (activeTrack === nextTrack && activeTrackLoops === nextTrackLoops) {
    if (masterVolume <= 0) return;
    attemptMusicPlay(transitionId);
    fadeMusicTo(1, MUSIC_FADE_IN_MS, transitionId);
    return;
  }

  if (!activeTrack || !musicPlayer.src) {
    startTrack(nextTrack, transitionId, { loop: nextTrackLoops });
    return;
  }

  fadeMusicTo(0, MUSIC_FADE_OUT_MS, transitionId, () => {
    if (requestedTrack !== nextTrack) return;
    startTrack(nextTrack, transitionId, { loop: nextTrackLoops });
  });
}

export function stopScreenMusic() {
  if (musicStopInProgress) return;
  requestedTrack = null;
  requestedTrackLoops = true;
  const transitionId = ++musicTransitionId;
  cancelMusicFade();
  cancelMusicRetry();
  if (!activeTrack || musicPlayer.paused || masterVolume <= 0) {
    musicPlayer.pause();
    musicPlayer.removeAttribute("src");
    musicPlayer.load();
    activeTrack = null;
    activeTrackLoops = true;
    nonLoopTrackEnded = false;
    musicPlayer.loop = true;
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
    activeTrackLoops = true;
    nonLoopTrackEnded = false;
    musicPlayer.loop = true;
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

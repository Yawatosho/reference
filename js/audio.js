const SCREEN_MUSIC = Object.freeze({
  interview: new URL("../sound/interview.mp3", import.meta.url).href,
  deduction: new URL("../sound/ask.mp3", import.meta.url).href,
  result: new URL("../sound/result.mp3", import.meta.url).href,
});

const MESSAGE_SOUNDS = Object.freeze({
  message1: new URL("../sound/message1.mp3", import.meta.url).href,
  message2: new URL("../sound/message2.mp3", import.meta.url).href,
  message3: new URL("../sound/message3.mp3", import.meta.url).href,
});

const DECISION_SOUND = new URL("../assets/cutin/decision.mp3", import.meta.url).href;
const ANSWER_SOUNDS = Object.freeze({
  type: new URL("../assets/cutin/type.mp3", import.meta.url).href,
  answer: new URL("../assets/cutin/answer.mp3", import.meta.url).href,
});

const musicPlayer = new Audio();
musicPlayer.loop = true;
musicPlayer.preload = "auto";

let activeTrack = null;

const messagePlayer = new Audio();
messagePlayer.loop = true;
messagePlayer.preload = "auto";

let masterVolume = 1;

const decisionPlayer = new Audio();
decisionPlayer.preload = "auto";

const answerEffectPlayer = new Audio();
answerEffectPlayer.preload = "auto";

export function setAudioVolume(volume) {
  const nextVolume = Number.isFinite(volume)
    ? Math.min(1, Math.max(0, volume))
    : 1;
  masterVolume = nextVolume;
  musicPlayer.volume = 0.34 * masterVolume;
  messagePlayer.volume = 0.5 * masterVolume;
  decisionPlayer.volume = 0.7 * masterVolume;
  answerEffectPlayer.volume = 0.72 * masterVolume;
}

setAudioVolume(masterVolume);

export function playScreenMusic(screen) {
  const nextTrack = SCREEN_MUSIC[screen];
  if (!nextTrack) return stopScreenMusic();

  if (activeTrack === nextTrack) {
    if (musicPlayer.paused) musicPlayer.play().catch(() => {});
    return;
  }

  musicPlayer.pause();
  musicPlayer.src = nextTrack;
  musicPlayer.currentTime = 0;
  activeTrack = nextTrack;
  musicPlayer.play().catch(() => {
    // 自動再生が制限された場合は、次のプレイヤー操作時に再試行する。
  });
}

export function stopScreenMusic() {
  musicPlayer.pause();
  musicPlayer.removeAttribute("src");
  musicPlayer.load();
  activeTrack = null;
}

export function startMessageSound(soundId) {
  const nextSound = MESSAGE_SOUNDS[soundId] ?? MESSAGE_SOUNDS.message1;
  messagePlayer.pause();
  messagePlayer.src = nextSound;
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

export function playDecisionSound() {
  decisionPlayer.pause();
  decisionPlayer.src = DECISION_SOUND;
  decisionPlayer.currentTime = 0;
  decisionPlayer.play().catch(() => {
    // 音声再生が制限された環境でも演出は表示する。
  });
}

export function startAnswerTypingSound() {
  answerEffectPlayer.pause();
  answerEffectPlayer.loop = true;
  answerEffectPlayer.src = ANSWER_SOUNDS.type;
  answerEffectPlayer.currentTime = 0;
  answerEffectPlayer.play().catch(() => {
    // 音声再生が制限された環境でも文字送りは継続する。
  });
}

export function stopAnswerTypingSound() {
  answerEffectPlayer.pause();
  answerEffectPlayer.removeAttribute("src");
  answerEffectPlayer.load();
}

export function playAnswerRevealSound() {
  answerEffectPlayer.pause();
  answerEffectPlayer.loop = false;
  answerEffectPlayer.src = ANSWER_SOUNDS.answer;
  answerEffectPlayer.currentTime = 0;
  answerEffectPlayer.play().catch(() => {
    // 音声再生が制限された環境でも全文表示は継続する。
  });
}

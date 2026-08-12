import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = Object.fromEntries(
  await Promise.all(
    [
      "index.html",
      "site.webmanifest",
      "css/style.css",
      "css/responsive.css",
      "data/cases.js",
      "data/additional-cases.js",
      "data/extra-case.js",
      "js/app.js",
      "js/analytics.js",
      "js/audio.js",
      "js/game.js",
      "js/scoring.js",
      "js/storage.js",
      "js/ui.js",
    ].map(async (path) => [path, await readFile(new URL(`../${path}`, import.meta.url), "utf8")]),
  ),
);

const socialAndIconAssets = Object.fromEntries(
  await Promise.all(
    [
      "assets/ogp/ogp.png",
      "assets/icons/favicon.ico",
      "assets/icons/favicon-16x16.png",
      "assets/icons/favicon-32x32.png",
      "assets/icons/apple-touch-icon.png",
      "assets/icons/icon-192.png",
      "assets/icons/icon-512.png",
    ].map(async (path) => [
      path,
      await readFile(new URL(`../${path}`, import.meta.url)),
    ]),
  ),
);

const characterImages = Object.fromEntries(
  await Promise.all(
    [
      "librarian.webp",
      "title-librarian.webp",
      "title.png",
      "patron-01.webp",
      "patron-02.webp",
      "patron-03.webp",
      "patron-04.webp",
      "patron-05.webp",
      ...Array.from({ length: 10 }, (_, index) =>
        ["high", "medium", "low"].map(
          (level) => `patron-${String(index + 1).padStart(2, "0")}-reaction-${level}.webp`,
        ),
      ).flat(),
      ...Array.from(
        { length: 5 },
        (_, index) => `patron-${String(index + 6).padStart(2, "0")}.webp`,
      ),
      "extra-detective-icon.webp",
      "extra-librarian.webp",
      "extra-librarian-reaction-high.webp",
      "extra-librarian-reaction-medium.webp",
      "extra-librarian-reaction-low.webp",
      "extra-librarian-portrait.webp",
      "extra-librarian-reaction-high-portrait.webp",
      "extra-librarian-reaction-medium-portrait.webp",
      "extra-librarian-reaction-low-portrait.webp",
      "extra-detective-reaction-high-portrait.webp",
      "extra-detective-reaction-medium-portrait.webp",
      "extra-detective-reaction-low-portrait.webp",
    ].map(async (filename) => [
      filename,
      await readFile(
        new URL(`../assets/characters/${filename}`, import.meta.url),
      ),
    ]),
  ),
);

const audioFiles = Object.fromEntries(
  await Promise.all(
    [
      "interview.mp3",
      "ask.mp3",
      "result.mp3",
      "message1.mp3",
      "message2.mp3",
      "message3.mp3",
    ].map(async (filename) => [
      filename,
      await readFile(new URL(`../sound/${filename}`, import.meta.url)),
    ]),
  ),
);

test("GitHub Pagesのサブディレクトリで動く相対パスだけを使う", () => {
  assert.match(files["index.html"], /href="\.\/css\/style\.css(?:\?[^\"]+)?"/);
  assert.match(files["index.html"], /src="\.\/js\/app\.js(?:\?[^\"]+)?"/);
  assert.doesNotMatch(files["index.html"], /(?:src|href)="\/(?!\/)/);
  assert.doesNotMatch(files["css/style.css"], /https?:\/\//);
  assert.doesNotMatch(files["css/responsive.css"], /https?:\/\//);
  assert.doesNotMatch(files["js/app.js"], /fetch\s*\(|XMLHttpRequest/);
});

test("Google Analyticsで初回表示とゲーム内の仮想画面を計測する", () => {
  assert.match(
    files["index.html"],
    /googletagmanager\.com\/gtag\/js\?id=G-J6NS8CCNWN/,
  );
  assert.match(
    files["index.html"],
    /gtag\("config", "G-J6NS8CCNWN", \{ send_page_view: false \}\)/,
  );
  assert.match(files["js/analytics.js"], /GA_MEASUREMENT_ID = "G-J6NS8CCNWN"/);
  assert.match(files["js/analytics.js"], /window\.gtag\("event", "page_view", parameters\)/);
  assert.match(files["js/analytics.js"], /virtualPath === previousVirtualPath/);
  assert.match(files["js/analytics.js"], /page_referrer/);
  assert.match(files["js/app.js"], /trackPageView\("title"/);
  assert.match(files["js/app.js"], /trackPageView\("cases"/);
  assert.match(files["js/app.js"], /cases\/\$\{currentCase\.id\}\/interview/);
  assert.match(files["js/app.js"], /cases\/\$\{currentCase\.id\}\/answer/);
  assert.match(files["js/app.js"], /cases\/\$\{currentCase\.id\}\/result/);
  assert.doesNotMatch(files["js/analytics.js"], /conversation|answerText|selection/);
});

test("公開URLをcanonicalとSNSメタデータへ絶対URLで設定する", () => {
  assert.match(
    files["index.html"],
    /rel="canonical" href="https:\/\/yawatosho\.github\.io\/reference\/"/,
  );
  assert.match(
    files["index.html"],
    /property="og:url" content="https:\/\/yawatosho\.github\.io\/reference\/"/,
  );
  assert.match(
    files["index.html"],
    /property="og:image" content="https:\/\/yawatosho\.github\.io\/reference\/assets\/ogp\/ogp\.png\?v=20260812-full"/,
  );
  assert.match(
    files["index.html"],
    /name="twitter:image" content="https:\/\/yawatosho\.github\.io\/reference\/assets\/ogp\/ogp\.png\?v=20260812-full"/,
  );
});

test("遊び方にGoogle Analyticsの利用と送信しない情報を明記する", () => {
  assert.match(files["js/ui.js"], /Google Analyticsを使用して匿名の利用状況を計測/);
  assert.match(files["js/ui.js"], /会話内容・回答内容・個人を特定する情報は送信しません/);
});

test("画面に合わせて軽量BGMを切り替え、タイトルとケース一覧では停止する", () => {
  assert.match(files["js/audio.js"], /interview:\s*new URL\("\.\.\/sound\/interview\.mp3"/);
  assert.match(files["js/audio.js"], /deduction:\s*new URL\("\.\.\/sound\/ask\.mp3"/);
  assert.match(files["js/audio.js"], /result:\s*new URL\("\.\.\/sound\/result\.mp3"/);
  assert.match(files["js/audio.js"], /musicPlayer\.loop\s*=\s*true/);
  assert.match(files["js/audio.js"], /export function setAudioVolume/);
  assert.match(files["js/ui.js"], /data-action="sound-toggle"/);
  assert.match(files["js/app.js"], /progress = setVolume/);
  assert.match(files["js/app.js"], /function renderInterview[\s\S]*?playScreenMusic\("interview"\)/);
  assert.match(files["js/app.js"], /function renderDeduction[\s\S]*?playScreenMusic\("deduction"\)/);
  assert.match(files["js/app.js"], /function renderResult[\s\S]*?playScreenMusic\("result"\)/);
  assert.match(files["js/app.js"], /function renderTop[\s\S]*?stopScreenMusic\(\)/);
  assert.match(files["js/app.js"], /function renderCases[\s\S]*?stopScreenMusic\(\)/);
  Object.entries(audioFiles).forEach(([filename, contents]) => {
    assert.ok(contents.byteLength < 2_100_000, `${filename}: optimized size`);
    for (const metadata of [
      "katharine1515",
      "made with suno",
      "Dust and Whispers",
      "The Missing Piece",
      "The Chapter Unlocked",
      "2026-08-11T02:",
    ]) {
      assert.equal(contents.includes(Buffer.from(metadata)), false, `${filename}: no embedded metadata`);
    }
  });
});

test("文字送り中のセリフ音を話者とケースデータで切り替える", () => {
  assert.match(files["data/cases.js"], /defaultPatron:\s*"message1"/);
  assert.match(files["data/cases.js"], /librarian:\s*"message2"/);
  assert.match(files["data/cases.js"], /id:\s*"case02"[\s\S]*?messageSound:\s*"message2"/);
  assert.match(files["data/cases.js"], /id:\s*"case05"[\s\S]*?name:\s*"探偵さん"[\s\S]*?messageSound:\s*"message3"/);
  assert.match(files["data/additional-cases.js"], /id:\s*"case06"[\s\S]*?messageSound:\s*"message3"/);
  assert.match(files["js/audio.js"], /message1:\s*new URL\("\.\.\/sound\/message1\.mp3"/);
  assert.match(files["js/audio.js"], /message2:\s*new URL\("\.\.\/sound\/message2\.mp3"/);
  assert.match(files["js/audio.js"], /message3:\s*new URL\("\.\.\/sound\/message3\.mp3"/);
  assert.match(files["js/ui.js"], /data-message-sound=/);
  assert.match(files["js/app.js"], /startMessageSound\(messages\[targetIndex\]\?\.dataset\.messageSound\)/);
  assert.match(files["js/app.js"], /characterIndex >= characters\.length[\s\S]*?stopMessageSound\(\)/);
});

test("ゲーム本体にケースID固有の分岐がない", () => {
  for (const path of ["js/app.js", "js/game.js", "js/ui.js", "js/scoring.js"]) {
    assert.doesNotMatch(files[path], /case(?:0[1-9]|10)/, path);
    assert.doesNotMatch(files[path], /caseId\s*===/, path);
  }
});

test("ケースカードに利用者の顔を表示し、追加ケースの表示条件をデータで判定する", () => {
  assert.match(files["js/ui.js"], /class="case-card__portrait"/);
  assert.match(files["js/ui.js"], /data\.patron\.cardPortraitPosition/);
  assert.match(files["js/ui.js"], /data\.patron\.cardPortraitScale/);
  assert.match(files["css/style.css"], /object-position:\s*var\(--card-portrait-position, center 12%\)/);
  assert.match(files["css/style.css"], /transform:\s*scale\(var\(--card-portrait-scale, 1\)\)/);
  assert.match(files["js/ui.js"], /data\.patron\.image/);
  assert.match(files["js/ui.js"], /<h2>\$\{escapeHtml\(data\.title\)\}<\/h2>/);
  assert.doesNotMatch(files["js/ui.js"], /cardTitle/);
  assert.match(files["js/ui.js"], /data\.cardOpening \?\? data\.opening/);
  assert.doesNotMatch(files["js/ui.js"], /全ケース解放|data-action="unlock-all"/);
  assert.match(files["js/app.js"], /isCaseVisible\(data, progress\)/);
  assert.match(files["data/additional-cases.js"], /revealAfter:\s*BONUS_UNLOCK_REQUIREMENTS/g);
  assert.match(files["data/extra-case.js"], /revealAfter:\s*EXTRA_UNLOCK_REQUIREMENTS/);
  assert.doesNotMatch(files["js/app.js"], /slice\(0,\s*5\)|index\s*[><=]+\s*5/);
});

test("キーボード・ラベル・色以外の正誤・モーション抑制を備える", () => {
  assert.match(files["index.html"], /class="skip-link"/);
  assert.match(files["css/style.css"], /:focus-visible/);
  assert.match(files["css/style.css"], /prefers-reduced-motion/);
  assert.match(files["js/ui.js"], /<label class="slot-card">/);
  assert.doesNotMatch(
    files["js/ui.js"],
    /一部確認済み|未確認：質問していません|回答に使える情報/,
  );
  assert.match(files["js/ui.js"], /correct: \{ symbol: "○"/);
  assert.match(files["js/ui.js"], /partial: \{ symbol: "△"/);
  assert.match(files["js/ui.js"], /incorrect: \{ symbol: "×"/);
  assert.doesNotMatch(files["js/scoring.js"], /INTERVIEW_POINTS|questionsUsed/);
  assert.doesNotMatch(files["js/ui.js"], /score\.interview|インタビュー \$\{score/);
});

test("375px向けの縦配置と操作幅を定義する", () => {
  assert.match(files["css/responsive.css"], /@media \(max-width: 760px\)/);
  assert.match(files["css/responsive.css"], /\.interview-layout\s*\{[\s\S]*?flex-direction: column/);
  assert.match(files["css/responsive.css"], /\.slot-grid\s*\{[\s\S]*?grid-template-columns: 1fr/);
  assert.match(files["css/responsive.css"], /\.answer-button\s*\{[\s\S]*?width: 100%/);
});

test("判明事項を外し、利用者情報と会話を広い2カラムで表示する", () => {
  assert.match(
    files["css/style.css"],
    /grid-template-columns:\s*260px minmax\(0, 1fr\)/,
  );
  assert.match(
    files["css/responsive.css"],
    /grid-template-columns:\s*220px minmax\(0, 1fr\)/,
  );
  assert.doesNotMatch(files["js/ui.js"], /class="facts-panel"|KNOWN FACTS|判明したこと/);
});

test("枠付きUIの文字・記号に読みやすい内側余白を確保する", () => {
  const stylesheet = files["css/style.css"];
  assert.match(stylesheet, /\.topbar\s*\{[\s\S]*?padding:\s*0 20px/);
  assert.match(stylesheet, /\.segment-result\s*\{[\s\S]*?padding:\s*12px 14px/);
  assert.match(stylesheet, /\.deduction-log__conversation\s*\{[\s\S]*?padding:\s*20px/);
  assert.match(stylesheet, /\.modal__header button\s*\{[\s\S]*?width:\s*40px[\s\S]*?height:\s*40px/);
});

test("回答画面で会話を読み返せ、新着メッセージを1文字ずつ表示する", () => {
  assert.match(files["js/ui.js"], /class="deduction-log__conversation"/);
  assert.match(files["js/ui.js"], /conversationMarkup\(state\.conversation,/);
  assert.match(files["js/ui.js"], /data-typing-text/);
  assert.match(files["js/app.js"], /Array\.from\(target\.dataset\.typingText/);
  assert.match(files["js/app.js"], /setTimeout\(typeNextCharacter, 18\)/);
  assert.match(files["js/app.js"], /prefers-reduced-motion: reduce/);
});

test("インタビューログの利用者の発言左端に顔アイコンを表示する", () => {
  assert.match(files["js/ui.js"], /respondentAvatar = ""/);
  assert.match(files["js/ui.js"], /entry\.speaker === "patron"[\s\S]*?message-patron-icon/);
  assert.match(files["js/ui.js"], /respondentAvatar: patronImage/);
  assert.match(files["js/ui.js"], /respondentAvatar,[\s\S]*?\}\)\}/);
  assert.match(
    files["css/style.css"],
    /\.message--patron p\s*\{[\s\S]*?padding-left:\s*64px[\s\S]*?position:\s*relative/,
  );
  assert.match(
    files["css/style.css"],
    /\.message-patron-icon\s*\{[\s\S]*?left:\s*14px[\s\S]*?border-radius:\s*50%/,
  );
});

test("回答選択時は画面を再描画せず、スクロール位置を維持する", () => {
  assert.match(
    files["js/app.js"],
    /action === "select-slot"[\s\S]*?sentence\.textContent = session\.getDeductionSentence\(\)/,
  );
  assert.match(
    files["js/app.js"],
    /answerButton\.disabled = !session\.isDeductionComplete\(\)/,
  );
  assert.doesNotMatch(
    files["js/app.js"],
    /action === "select-slot"[\s\S]*?renderDeduction\(\)[\s\S]*?return/,
  );
});

test("質問選択時はページ上端へ戻さず、現在のスクロール位置を維持する", () => {
  assert.match(
    files["js/app.js"],
    /const scrollPosition = preserveScroll[\s\S]*?window\.scrollTo\([\s\S]*?scrollPosition/,
  );
  assert.match(
    files["js/app.js"],
    /action === "ask"[\s\S]*?renderInterview\(\{[\s\S]*?preserveScroll: true/,
  );
});

test("スマートフォンでは文字送りを行い、質問後に会話エリアへ移動する", () => {
  assert.match(files["js/app.js"], /mobileInterviewQuery = "\(max-width: 760px\)"/);
  assert.match(
    files["js/app.js"],
    /prefers-reduced-motion: reduce[\s\S]*?!isMobileInterview/,
  );
  assert.match(
    files["js/app.js"],
    /function moveConversationIntoViewOnMobile[\s\S]*?conversation\.scrollIntoView\(\{ block: "start", behavior \}\)/,
  );
  assert.match(
    files["js/app.js"],
    /action === "ask"[\s\S]*?moveToConversation: true/,
  );
});

test("司書の質問が表示し終わってから利用者の返答を表示する", () => {
  assert.match(files["js/app.js"], /messages\.slice\(1\)\.forEach/);
  assert.match(files["js/app.js"], /message\.hidden = true/);
  assert.match(files["js/app.js"], /messages\[targetIndex\]\.hidden = false/);
  assert.match(files["js/app.js"], /\}, 360\)/);
  assert.match(files["css/style.css"], /\.message--turn-enter/);
});

test("利用者が答えている間は次の質問を選択できない", () => {
  assert.match(
    files["js/app.js"],
    /querySelectorAll\("\.question-button:not\(:disabled\)"\)/,
  );
  assert.match(files["js/app.js"], /conversation\.setAttribute\("aria-busy", "true"\)/);
  assert.match(files["js/app.js"], /button\.disabled = true/);
  assert.match(files["js/app.js"], /conversation\.removeAttribute\("aria-busy"\)/);
  assert.match(files["js/app.js"], /button\.disabled = false/);
});

test("新しく解放された質問は利用者の返答後に表示する", () => {
  assert.match(
    files["js/app.js"],
    /querySelectorAll\("\.question-button--new"\)/,
  );
  assert.match(files["js/app.js"], /newQuestionButtons\.forEach[\s\S]*?button\.hidden = true/);
  assert.match(files["js/app.js"], /newQuestionButtons\.forEach[\s\S]*?button\.hidden = false/);
  assert.match(files["css/style.css"], /\.question-button\[hidden\]\s*\{\s*display:\s*none/);
  assert.match(files["css/style.css"], /\.question-button--new[\s\S]*?animation:\s*unlock-in/);
});

test("質問回数の回復案内は利用者の返答が表示し終わってから出す", () => {
  assert.match(
    files["js/ui.js"],
    /data-recovery-notice hidden[\s\S]*?質問できる回数が\$\{escapeHtml\(recoveredQuestions\)\}回分回復しました/,
  );
  assert.match(
    files["js/app.js"],
    /if \(targetIndex >= targets\.length\)[\s\S]*?revealRecoveryNotice\(\)[\s\S]*?button\.disabled = false/,
  );
  assert.match(
    files["js/app.js"],
    /recoveryNotice\.hidden = false[\s\S]*?announce\(/,
  );
  assert.match(
    files["css/style.css"],
    /\.recovery-notice\[hidden\]\s*\{\s*display:\s*none/,
  );
});

test("6問目の回答と時間案内の後は、プレイヤー操作を待って回答画面へ進む", () => {
  assert.doesNotMatch(files["js/app.js"], /setTimeout\s*\(\s*renderDeduction/);
  assert.match(files["js/app.js"], /action === "continue-deduction"/);
  assert.match(files["js/ui.js"], /data-action="\$\{limitNotice \? "continue-deduction"/);
  assert.match(files["js/ui.js"], /最後の言葉を確認したら/);
  assert.match(files["js/game.js"], /patron\.timeLimitLine/);
  assert.match(files["data/cases.js"], /maxQuestions:\s*6/);
});

test("画面上では推理ではなく回答をまとめる表現を使う", () => {
  assert.doesNotMatch(files["js/ui.js"], /推理/);
  assert.doesNotMatch(files["js/app.js"], /推理/);
  assert.match(files["js/ui.js"], /回答をまとめる/);
  assert.match(files["js/ui.js"], /REFERENCE RESPONSE/);
});

test("回答画面の表現を落ち着かせ、画面全体の文字サイズ差を抑える", () => {
  assert.match(files["js/ui.js"], /利用者の依頼を、一文にまとめましょう/);
  assert.doesNotMatch(files["js/ui.js"], /手がかりをつないで、答えを完成/);
  assert.match(files["css/style.css"], /\.hero h1\s*\{[\s\S]*?font-size:\s*clamp\(40px, 4\.4vw, 62px\)/);
  assert.match(files["css/style.css"], /\.page-heading h1\s*\{[\s\S]*?font-size:\s*clamp\(32px, 3\.4vw, 46px\)/);
  assert.match(files["css/style.css"], /\.deduction-heading h1\s*\{[\s\S]*?font-size:\s*clamp\(30px, 3\.2vw, 42px\)/);
  assert.match(files["css/style.css"], /\.result-hero h1\s*\{[\s\S]*?font-size:\s*clamp\(26px, 2\.8vw, 38px\)/);
});

test("結果画面は採点の注記を省き、ランクと点数の領域をコンパクトにする", () => {
  assert.doesNotMatch(files["js/ui.js"], /4文節の回答内容のみで採点しています/);
  assert.match(
    files["css/style.css"],
    /\.result-hero\s*\{[\s\S]*?min-height:\s*270px[\s\S]*?padding:\s*34px 365px 34px 42px/,
  );
  assert.match(
    files["css/responsive.css"],
    /\.result-hero\s*\{[\s\S]*?min-height:\s*300px[\s\S]*?padding:\s*24px calc\(clamp\(138px, 42%, 220px\) \+ 16px\) 120px 20px/,
  );
  assert.match(files["css/responsive.css"], /\.result-hero h1\s*\{[\s\S]*?font-size:\s*19px/);
  assert.match(files["css/responsive.css"], /\.rank-badge strong\s*\{[\s\S]*?font-size:\s*32px/);
  assert.match(files["css/responsive.css"], /\.score-block strong\s*\{[\s\S]*?font-size:\s*34px/);
  assert.match(files["js/ui.js"], /class="result-player-portrait result-player-portrait--\$\{reaction\.level\}"/);
  assert.match(files["css/style.css"], /\.result-player-portrait\s*\{[\s\S]*?inset:\s*0 0 0 auto[\s\S]*?width:\s*180px[\s\S]*?height:\s*100%/);
  assert.match(files["css/style.css"], /\.result-player-portrait img\s*\{[\s\S]*?object-fit:\s*cover/);
  assert.match(files["css/style.css"], /\.rank-badge\s*\{[\s\S]*?right:\s*212px/);
  assert.match(files["css/style.css"], /\.score-block\s*\{[\s\S]*?right:\s*212px/);
  assert.match(files["css/style.css"], /\.patron-reaction\s*\{[\s\S]*?height:\s*270px[\s\S]*?min-height:\s*0/);
  assert.match(files["css/responsive.css"], /\.patron-reaction\s*\{[\s\S]*?height:\s*auto[\s\S]*?min-height:\s*190px/);
});

test("タイトル画像を使い、音声操作とサブタイトルを枠内に整理する", () => {
  assert.match(files["data/cases.js"], /title:\s*"THE REFERENCE INTERVIEW GAME"/);
  assert.match(files["data/cases.js"], /subtitle:\s*"ほんとの質問"/);
  assert.match(files["index.html"], /<title>THE REFERENCE INTERVIEW GAME｜ほんとの質問<\/title>/);
  assert.match(files["js/ui.js"], /聞くことから、/);
  assert.match(files["js/ui.js"], /class="title-cover"/);
  assert.match(files["js/ui.js"], /LISTEN[\s\S]*ASK[\s\S]*SUMMARIZE/);
  assert.doesNotMatch(files["js/ui.js"], /library-lines|floating-note|CONNECT<br/);
  const titleScreenMarkup = files["js/ui.js"].match(
    /export function topScreen\(progress\)[\s\S]*?export function caseSelectScreen/,
  )?.[0] ?? "";
  assert.doesNotMatch(titleScreenMarkup, /GAME_CONFIG\.title\.split/);
  assert.match(titleScreenMarkup, /class="title-cover__logo"><img src="\.\/assets\/characters\/logo\.png"/);
  assert.match(titleScreenMarkup, /alt="\$\{escapeHtml\(GAME_CONFIG\.title\)\}　\$\{escapeHtml\(GAME_CONFIG\.subtitle\)\}"/);
  assert.doesNotMatch(titleScreenMarkup, /class="eyebrow"/);
  assert.match(titleScreenMarkup, /class="title-cover__tagline">聞くことから、レファレンスは始まる。/);
  assert.doesNotMatch(titleScreenMarkup, /あなたは大学図書館の司書さん|title-cover__lead/);
  assert.match(titleScreenMarkup, /header: false, volume: progress\.volume/);
  assert.doesNotMatch(titleScreenMarkup, /hero__rules|QUESTIONS|CASE FILES/);
  assert.match(files["js/ui.js"], /header \? `<header class="topbar">/);
  assert.match(files["css/style.css"], /\.site-shell--headerless\s*\{[\s\S]*?grid-template-rows:\s*1fr auto/);
  assert.match(files["js/ui.js"], /assets\/characters\/title\.png/);
  assert.match(files["js/ui.js"], /assets\/characters\/logo\.png/);
  assert.doesNotMatch(titleScreenMarkup, /title-player-card|title-librarian\.webp/);
  assert.match(files["css/style.css"], /\.title-cover__image[\s\S]*?object-fit:\s*cover/);
  assert.doesNotMatch(files["css/style.css"], /--font-display|Bodoni Moda/);
  assert.doesNotMatch(files["index.html"], /Bodoni\+Moda/);
  assert.match(files["css/style.css"], /\.title-cover__logo\s*\{[\s\S]*?align-self:\s*center/);
  assert.match(files["css/style.css"], /\.title-cover__logo img\s*\{[\s\S]*?width:\s*100%[\s\S]*?height:\s*auto/);
  const titleTaglineRule = files["css/style.css"].match(
    /\.title-cover__tagline\s*\{([^}]*)\}/,
  )?.[1] ?? "";
  assert.doesNotMatch(titleTaglineRule, /border-left|padding-left/);
  assert.match(titleTaglineRule, /font-family:\s*var\(--font-serif-ja\)/);
  assert.match(titleTaglineRule, /align-self:\s*center/);
  assert.match(titleTaglineRule, /text-align:\s*center/);
  assert.doesNotMatch(files["js/ui.js"], /title-cover__ornament--book/);
  assert.match(files["css/style.css"], /\.title-cover__content\s*\{[\s\S]*?transform:\s*translateY\(clamp\(14px, 1\.8vw, 26px\)\)/);
  assert.match(files["css/style.css"], /\.title-cover__actions\s*\{[\s\S]*?width:\s*min\(570px, 100%\)[\s\S]*?grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(files["css/responsive.css"], /\.title-cover__actions\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(files["css/responsive.css"], /\.title-cover__content\s*\{[\s\S]*?transform:\s*none/);
  assert.match(files["css/style.css"], /\.site-shell--headerless > \.sound-toggle\s*\{[\s\S]*?top:\s*44px/);
  assert.match(files["css/responsive.css"], /\.title-cover__image[\s\S]*?position:\s*relative/);
  const titleCoverRule = files["css/style.css"].match(
    /\.title-cover\s*\{([^}]*)\}/,
  )?.[1] ?? "";
  assert.doesNotMatch(titleCoverRule, /box-shadow|gradient/);
});

test("タイトル画像からOGP・ファビコン・ホーム画面アイコンを配信する", () => {
  assert.match(files["index.html"], /property="og:image" content="https:\/\/yawatosho\.github\.io\/reference\/assets\/ogp\/ogp\.png\?v=20260812-full"/);
  assert.match(files["index.html"], /name="twitter:card" content="summary_large_image"/);
  assert.match(files["index.html"], /rel="icon" href="\.\/assets\/icons\/favicon\.ico"/);
  assert.match(files["index.html"], /rel="icon"[^>]+favicon-32x32\.png/);
  assert.match(files["index.html"], /rel="apple-touch-icon"[^>]+apple-touch-icon\.png/);
  assert.match(files["index.html"], /rel="manifest" href="\.\/site\.webmanifest"/);

  const manifest = JSON.parse(files["site.webmanifest"]);
  assert.equal(manifest.start_url, "./");
  assert.equal(manifest.scope, "./");
  assert.deepEqual(
    manifest.icons.map(({ sizes }) => sizes),
    ["192x192", "512x512"],
  );

  assert.deepEqual(
    [...socialAndIconAssets["assets/ogp/ogp.png"].subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
  );
  assert.deepEqual(
    [...socialAndIconAssets["assets/icons/favicon.ico"].subarray(0, 4)],
    [0, 0, 1, 0],
  );
  for (const [path, contents] of Object.entries(socialAndIconAssets)) {
    assert.ok(contents.byteLength > 0, `${path}: generated asset`);
    if (path.endsWith(".png")) {
      assert.deepEqual([...contents.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    }
  }
});

test("ケースカードと次ケースボタンから直接インタビューを開始する", () => {
  assert.match(files["js/ui.js"], /data-action="select-case"/);
  assert.doesNotMatch(files["js/ui.js"], /caseIntroScreen|data-action="start-case"/);
  assert.doesNotMatch(files["js/app.js"], /renderIntro|caseIntroScreen|action === "start-case"/);
  assert.match(
    files["js/app.js"],
    /currentCase = selected;\s*session = createSession\(\);\s*return beginSelectedCase\(\)/,
  );
  assert.match(files["js/app.js"], /action === "next-case"[\s\S]*?return beginSelectedCase\(\)/);
});

test("フラットテーマを一層に整理し、軽量WebP画像だけを配信する", () => {
  assert.doesNotMatch(files["css/style.css"], /Friendly, pop visual theme/);
  assert.doesNotMatch(files["css/style.css"], /Calm translucent refinement/);
  assert.doesNotMatch(files["css/style.css"], /box-shadow:\s*none\s*!important/);
  assert.match(files["css/style.css"], /librarian\.webp/);
  assert.doesNotMatch(files["css/style.css"], /patrons\.webp/);
  const caseDataSource = `${files["data/cases.js"]}\n${files["data/additional-cases.js"]}`;
  for (let index = 1; index <= 10; index += 1) {
    if (index === 5) {
      assert.match(caseDataSource, /extra-detective-reaction-medium-portrait\.webp/);
    } else {
      assert.match(
        caseDataSource,
        new RegExp(`patron-${String(index).padStart(2, "0")}\\.webp`),
      );
    }
  }
  assert.doesNotMatch(files["css/style.css"], /characters\/(?:librarian|patrons)\.png/);
  Object.entries(characterImages).forEach(([filename, contents]) => {
    const limit = filename === "title.png" ? 2_000_000 : 250_000;
    assert.ok(contents.byteLength < limit, `${filename}: optimized size`);
  });
});

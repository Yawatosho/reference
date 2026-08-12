import { createAdditionalCases } from "./additional-cases.js?v=20260812-conversationpaths2";
import { createExtraCases } from "./extra-case.js?v=20260812-resultplayer1";

export const GAME_CONFIG = Object.freeze({
  title: "THE REFERENCE INTERVIEW GAME",
  subtitle: "ほんとの質問",
  maxQuestions: 6,
  totalCases: 11,
  messageSounds: Object.freeze({
    defaultPatron: "message1",
    librarian: "message2",
  }),
  resultPlayer: Object.freeze({
    name: "司書さん",
    portraits: Object.freeze({
      high:
        "./assets/characters/extra-librarian-reaction-high-portrait.webp",
      medium:
        "./assets/characters/extra-librarian-reaction-medium-portrait.webp",
      low:
        "./assets/characters/extra-librarian-reaction-low-portrait.webp",
    }),
  }),
});

export const CASES = [
  {
    id: "case01",
    number: "01",
    title: "昔の記事を探しています",
    cardOpening: "家族の昔の記録を、新聞で探したいんですが……。",
    category: "新聞・地域史",
    difficulty: "INTRODUCTION",
    maxQuestions: GAME_CONFIG.maxQuestions,
    replayVariation: {
      recentHistorySize: 3,
      preferDifferentDimensions: true,
    },
    opening: "昔のことを新聞で確かめたいのですが、探し方を相談できますか？",
    patron: {
      name: "来館者",
      descriptor: "祖父の思い出をたどる人",
      initials: "01",
      accent: "#739b9b",
      image: "./assets/characters/patron-01.webp",
      timeLimitLine: "すみません、そろそろ次の予定の時間で……。ここまでのお話で、必要な資料をまとめていただけますか？",
      reactions: {
        high: {
          image: "./assets/characters/patron-01-reaction-high.webp",
          line: "ありがとうございます！ 探したかったことが、はっきりしました。家族にも伝えられそうです。",
        },
        medium: {
          image: "./assets/characters/patron-01-reaction-medium.webp",
          line: "ありがとうございます。{targetFact}を調べる方向が見えてきました。もう少し家族にも手がかりを聞いてみます。",
        },
        low: {
          image: "./assets/characters/patron-01-reaction-low.webp",
          line: "調べてくださって、ありがとうございます。まだ探していた内容とは少し違うようですが、家族にもう一度手がかりを聞いてみます。",
        },
      },
    },
    facts: {
      period_1970: { label: "時期", display: "昭和40年代・1970年前後" },
      newspaper_unknown: { label: "新聞名", display: "新聞名は分からない" },
      specific_article: { label: "依頼の焦点", display: "店を紹介した記事を確認したい" },
      grandfather_shop: { label: "対象", display: "祖父が経営していた店" },
      family_history: { label: "利用目的", display: "家族の思い出を新聞で裏づけたい" },
      article_content: { label: "紙面", display: "店の開店時に紹介された記事" },
      shop_name: { label: "店名", display: "ひかり洋菓子店" },
      location_nakano: { label: "地域", display: "東京・中野" },
      source_grandmother: { label: "手がかり", display: "祖母から聞いた話" },
      smalltalk_followup: { label: "", display: "" },
    },
    questions: [
      {
        id: "q_period",
        text: "いつ頃の新聞ですか？",
        requiresAll: [],
        requiresAny: [],
        response: "昭和40年代です。たぶん1970年前後だったと思います。",
        responseVariants: ["祖父の話では昭和40年代で、1970年ごろだったそうです。"],
        reveals: ["period_1970"],
      },
      {
        id: "q_newspaper",
        text: "どの新聞をお探しですか？",
        requiresAll: [],
        requiresAny: [],
        response: "新聞名までは分からないんです。地域の新聞だったかもしれません。",
        responseVariants: ["どの新聞かは聞いていなくて、中野周辺の地域紙かもしれません。"],
        reveals: ["newspaper_unknown"],
      },
      {
        id: "q_specific",
        text: "新聞で、どなたのどんな記録を探したいですか？",
        requiresAll: [],
        requiresAny: [],
        response: "祖父がやっていた店について、当時の新聞に残っている記録を探したいんです。",
        responseVariants: ["祖父の店が当時の新聞にどう残っているか、確かめたいんです。"],
        reveals: ["grandfather_shop"],
      },
      {
        id: "q_use",
        text: "何にお使いになりますか？",
        requiresAll: [],
        requiresAny: [],
        response: "家族の記録に残すため、店を紹介した記事を確認したいんです。",
        responseVariants: ["祖父の店のことを家族に伝えるため、掲載された記事を見つけたいんです。"],
        reveals: ["family_history", "specific_article"],
      },
      {
        id: "q_article_detail",
        text: "どんな内容の紙面だったか分かりますか？",
        requiresAll: ["grandfather_shop"],
        requiresAny: [],
        response: "店が開店したときに、写真つきで紹介された記事だと聞きました。",
        responseVariants: ["開店のころ、店の写真と一緒に取り上げられた記事だったそうです。"],
        reveals: ["article_content", "specific_article"],
      },
      {
        id: "q_shop_name",
        text: "お店の名前は分かりますか？",
        requiresAll: ["grandfather_shop"],
        requiresAny: [],
        response: "『ひかり洋菓子店』という名前です。",
        responseVariants: ["店名は『ひかり洋菓子店』だったと聞いています。"],
        reveals: ["shop_name"],
      },
      {
        id: "q_location",
        text: "どの地域にあった店ですか？",
        requiresAll: ["grandfather_shop"],
        requiresAny: [],
        response: "東京の中野にあったそうです。駅から少し歩いた場所だとか。",
        responseVariants: ["中野にあった店で、中野駅から徒歩圏内だったそうです。"],
        reveals: ["location_nakano"],
      },
      {
        id: "q_source",
        text: "その話はどなたから聞きましたか？",
        requiresAll: [],
        requiresAny: ["grandfather_shop", "specific_article", "family_history"],
        response: "祖母からです。ただ、新聞名や正確な日付は覚えていませんでした。",
        responseVariants: ["祖母に聞きました。残念ながら紙名と掲載日は分からないそうです。"],
        reveals: ["source_grandmother", "newspaper_unknown"],
      },
      {
        id: "q01_plausible",
        text: "新聞の紙面は、大判と小型版のどちらがよいですか？",
        requiresAll: [],
        requiresAny: [],
        response: "紙の大きさにはこだわりません。探している内容を確認できれば大丈夫です。",
        responseVariants: [
          "判型はどちらでも構いません。紙面の内容を見つけたいんです。",
          "大きさより、探している記録が載っているかどうかを優先したいです。",
        ],
        reveals: [],
        distractor: "plausible",
      },
      {
        id: "q01_irrelevant",
        text: "お好きな飲み物は何ですか？",
        requiresAll: [],
        requiresAny: [],
        response: "コーヒーです！ 喫茶店巡りも好きで、おすすめの店の話ならいくらでもできますよ。",
        responseVariants: [
          "紅茶です。香りを比べるのが好きなんです。こういう話も楽しいですね。",
          "ほうじ茶です。落ち着く香りが好きで、家族ともよく飲みます。",
        ],
        reveals: ["smalltalk_followup"],
        distractor: "irrelevant",
        distractorTone: "cheerful",
      },
      {
        id: "q01_smalltalk_followup",
        text: "いいですね！ 飲み物を楽しむときは、どんな時間が好きですか？",
        requiresAll: ["smalltalk_followup"],
        requiresAny: [],
        response: "香りを楽しみながら、のんびり話す時間が好きです。つい長居してしまいます。",
        responseVariants: [
          "落ち着いた場所で、ゆっくり一息つく時間が好きです。いい気分転換になります。",
          "家族や友人と、その日の出来事を話しながら飲む時間が好きです。",
        ],
        reveals: [],
        smallTalkFollowUp: true,
      },
    ],
    composition: {
      dimensions: {
        period: [
          {
            optionId: "period_40",
            partialOptionId: "period_old",
            values: {
              periodFact: "昭和40年代・1970年前後",
              periodReply: "昭和40年代です。1970年前後だったと思います。",
              periodReplyAlt: "家族の話では、昭和40年代の初めごろだそうです。",
              periodReplyThird: "店があったのは1970年ごろで、昭和40年代だと聞いています。",
            },
          },
          {
            optionId: "period_50",
            partialOptionId: "period_old",
            values: {
              periodFact: "昭和50年代・1980年前後",
              periodReply: "昭和50年代です。1980年前後だったと思います。",
              periodReplyAlt: "家族の記憶では、昭和50年代の初めごろだそうです。",
              periodReplyThird: "1980年前後、昭和50年代の新聞を見ればよさそうです。",
            },
          },
        ],
        location: [
          {
            optionId: "loc_nakano",
            partialOptionId: "loc_tokyo",
            values: {
              locationFact: "東京・中野",
              locationReply: "東京の中野にあったそうです。駅から少し歩いた場所だとか。",
              locationReplyAlt: "中野にあった店で、中野駅から徒歩圏内だったそうです。",
              locationReplyThird: "東京都中野区にあった店だと、家族から聞いています。",
              newspaperHint: "中野周辺の地域紙",
            },
          },
          {
            optionId: "loc_yokohama",
            partialOptionId: "loc_kanagawa",
            values: {
              locationFact: "神奈川・横浜",
              locationReply: "横浜にあったそうです。古い商店街の近くだと聞きました。",
              locationReplyAlt: "神奈川の横浜です。詳しい町名までは分かりません。",
              locationReplyThird: "場所は横浜市内です。商店街にあった店だそうです。",
              newspaperHint: "横浜で読まれていた地域紙",
            },
          },
        ],
        target: [
          {
            optionId: "target_hikari",
            partialOptionIds: ["target_shop", "target_business"],
            values: {
              targetFact: "祖父の『ひかり洋菓子店』",
              targetPartialFact: "祖父の洋菓子店",
              targetSubject: "祖父の洋菓子店",
              shopNameReply: "『ひかり洋菓子店』という名前です。",
              shopNameReplyAlt: "店名は『ひかり洋菓子店』だったと聞いています。",
              shopNameReplyThird: "家族の記録には『ひかり洋菓子店』と残っています。",
            },
          },
          {
            optionId: "target_shop",
            partialOptionId: "target_business",
            values: {
              targetFact: "店名不明の祖父の洋菓子店",
              targetPartialFact: "祖父の店",
              targetSubject: "祖父の店",
              shopNameReply: "店名は家族も覚えていなくて、洋菓子店だったことだけ分かります。",
              shopNameReplyAlt: "名前までは残っていません。祖父の洋菓子店だったそうです。",
              shopNameReplyThird: "残念ながら店名は不明で、洋菓子店だったことだけ聞いています。",
            },
          },
          {
            optionId: "target_aoba",
            partialOptionId: "target_business",
            values: {
              targetFact: "祖父の『あおば喫茶店』",
              targetPartialFact: "祖父の喫茶店",
              targetSubject: "祖父の喫茶店",
              shopNameReply: "『あおば喫茶店』という名前です。",
              shopNameReplyAlt: "祖父の店は『あおば喫茶店』だったそうです。",
              shopNameReplyThird: "家族の古いメモに『あおば喫茶店』と書かれています。",
            },
          },
        ],
        need: [
          {
            optionId: "need_article",
            partialOptionId: "need_record",
            values: {
              goalFact: "店の掲載記事を確認したい",
              purposeFact: "家族の記録に残すため、店の紹介記事を確認したい",
              articleFact: "開店時に写真つきで紹介された記事",
              useReply: "家族の記録に残すため、店を紹介した記事を確認したいんです。",
              useReplyAlt: "祖父の店のことを家族に伝えるため、掲載された記事を見つけたいんです。",
              useReplyThird: "家族で共有する記録として、店の紹介記事を確かめたいんです。",
              articleReply: "店が開店したときに、写真つきで紹介された記事だと聞きました。",
              articleReplyAlt: "開店のころ、店の写真と一緒に取り上げられた記事だったそうです。",
              articleReplyThird: "開店を紹介する記事で、店主だった祖父の写真も載っていたそうです。",
            },
          },
          {
            optionId: "need_newspaper",
            partialOptionId: "need_record",
            values: {
              goalFact: "店があった当時の街の様子を新聞で調べたい",
              purposeFact: "家族史の参考に、当時の街の様子を新聞で調べたい",
              articleFact: "商店街の記事や店の広告を見たい",
              useReply: "祖父が暮らした街の様子を家族に伝えるため、当時の地域面を読みたいんです。",
              useReplyAlt: "家族史をまとめる参考に、店があったころの街の様子を新聞で調べたいんです。",
              useReplyThird: "家族に当時の街の雰囲気を伝えたくて、地域の記事や広告を見たいんです。",
              articleReply: "記事は決めていません。商店街の記事や店の広告があれば読みたいです。",
              articleReplyAlt: "店の周辺が分かる地域の記事や広告を探してみたいです。",
              articleReplyThird: "特定の記事より、地域面から当時の商店街の様子をたどりたいです。",
            },
          },
          {
            optionId: "need_advertisement",
            partialOptionId: "need_record",
            values: {
              goalFact: "店の開店広告を確認したい",
              purposeFact: "家族の記録に開店時期を残すため、店の開店広告を確認したい",
              articleFact: "開店セールを知らせる新聞広告",
              useReply: "家族の記録に店の開店時期を残すため、開店広告を確認したいんです。",
              useReplyAlt: "祖父の店がいつ開いたか家族で確かめたくて、開店広告を探しています。",
              useReplyThird: "家族に店の始まりを伝えるため、開店を知らせた広告を見つけたいんです。",
              articleReply: "開店日やセールを知らせる、小さな新聞広告だったそうです。",
              articleReplyAlt: "店名と開店記念の案内が載った広告だと聞いています。",
              articleReplyThird: "記事ではなく、開店を知らせる囲み広告だったそうです。",
            },
          },
        ],
      },
      facts: {
        period_1970: "{periodFact}",
        newspaper_unknown: "新聞名は不明・{newspaperHint}かもしれない",
        specific_article: "{goalFact}",
        grandfather_shop: "{targetPartialFact}",
        family_history: "{purposeFact}",
        article_content: "{articleFact}",
        shop_name: "{targetFact}",
        location_nakano: "{locationFact}",
        source_grandmother: "家族から聞いた話",
      },
      questions: {
        q_period: {
          responses: ["{periodReply}", "{periodReplyAlt}", "{periodReplyThird}"],
        },
        q_newspaper: {
          responses: [
            "新聞名は分かりません。{newspaperHint}だったかもしれません。",
            "紙名は聞いていなくて、{newspaperHint}だと思います。",
            "新聞の名前は不明ですが、{newspaperHint}を調べると見つかるかもしれません。",
          ],
        },
        q_specific: {
          responses: [
            "{targetSubject}について、当時の新聞に残っている記録を探したいんです。",
            "{targetSubject}が当時の新聞にどう残っているか、確かめたいんです。",
            "家族から聞いた{targetSubject}について、新聞で調べたいんです。",
          ],
        },
        q_use: {
          responses: ["{useReply}", "{useReplyAlt}", "{useReplyThird}"],
        },
        q_article_detail: {
          responses: ["{articleReply}", "{articleReplyAlt}", "{articleReplyThird}"],
        },
        q_shop_name: {
          responses: ["{shopNameReply}", "{shopNameReplyAlt}", "{shopNameReplyThird}"],
        },
        q_location: {
          responses: ["{locationReply}", "{locationReplyAlt}", "{locationReplyThird}"],
        },
        q_source: {
          responses: [
            "家族から聞きました。新聞名や正確な日付までは分かりません。",
            "家族の思い出話です。紙名は覚えていないそうです。",
            "親族から聞いた話で、新聞名と掲載日は記録に残っていません。",
          ],
        },
      },
      explanation:
        "利用者が必要としているのは、{periodFact}の{locationFact}に関する新聞資料です。調査対象は{targetFact}で、確認したいことは「{goalFact}」でした。時期・地域・対象・確認したいことを分けると、検索できる問いへ変わります。",
    },
    deduction: {
      template: "{slot1}ごろ、{slot2}にあった{slot3}について、{slot4}。",
      slots: [
        {
          id: "period",
          label: "時期",
          requiresAll: ["period_1970"],
          options: [
            { id: "period_30", text: "昭和30年代", score: 0 },
            { id: "period_40", text: "昭和40年代", score: 1 },
            { id: "period_50", text: "昭和50年代", score: 0 },
            { id: "period_old", text: "昭和のいつか", score: 0.5 },
          ],
        },
        {
          id: "location",
          label: "場所",
          requiresAll: ["location_nakano"],
          options: [
            { id: "loc_nakano", text: "東京・中野", score: 1 },
            { id: "loc_tokyo", text: "東京都内", score: 0.5 },
            { id: "loc_yokohama", text: "横浜", score: 0 },
            { id: "loc_kanagawa", text: "神奈川県内", score: 0 },
            { id: "loc_unknown", text: "場所不明", score: 0 },
          ],
        },
        {
          id: "target",
          label: "対象",
          requiresAll: ["shop_name"],
          partialRequiresAll: ["grandfather_shop"],
          options: [
            { id: "target_hikari", text: "祖父の『ひかり洋菓子店』", score: 1 },
            { id: "target_shop", text: "店名不明の祖父の洋菓子店", score: 0.5 },
            { id: "target_aoba", text: "祖父の『あおば喫茶店』", score: 0 },
            { id: "target_business", text: "祖父の店", score: 0.5 },
          ],
        },
        {
          id: "need",
          label: "確認したいこと",
          requiresAll: ["specific_article"],
          options: [
            { id: "need_article", text: "掲載された記事を確認したい", score: 1 },
            { id: "need_newspaper", text: "当時の街の様子を新聞で調べたい", score: 0 },
            { id: "need_advertisement", text: "開店広告を確認したい", score: 0 },
            { id: "need_record", text: "新聞で店の記録を確認したい", score: 0.5 },
          ],
        },
      ],
    },
    correctSentence:
      "昭和40年代ごろ、東京・中野にあった祖父の『ひかり洋菓子店』について、掲載された記事を確認したい。",
    explanation:
      "利用者が探していたのは昔の新聞全般ではなく、祖父の店が載った特定の記事でした。資料名を急いで決める前に、対象・時期・地域・利用目的を確認すると、検索できる問いへ変わります。",
    advice:
      "「何を探しているか」だけでなく、「なぜ必要か」を聞くと、利用者自身も気づいていない焦点が見えます。",
  },
  {
    id: "case02",
    number: "02",
    title: "あの本のような資料を探しています",
    cardOpening: "前に見た、色についての本のような資料を探しているんですが……。",
    category: "図書・主題探索",
    difficulty: "BASIC",
    maxQuestions: GAME_CONFIG.maxQuestions,
    replayVariation: { recentHistorySize: 1 },
    opening: "前に見た、色についての本のような資料を探したいのですが、題名も詳しい内容もうまく思い出せなくて……。",
    patron: {
      name: "学生",
      descriptor: "授業で見た本を探す人",
      initials: "02",
      accent: "#739b9b",
      image: "./assets/characters/patron-02.webp",
      messageSound: "message2",
      timeLimitLine: "あ、もう授業に戻らないと……。ここまでで、探す本をまとめてもらえますか？",
      reactions: {
        high: {
          image: "./assets/characters/patron-02-reaction-high.webp",
          line: "ありがとうございます！ 必要な資料が見つかりそうです。とても助かりました。",
        },
        medium: {
          image: "./assets/characters/patron-02-reaction-medium.webp",
          line: "ありがとうございます。{purposeFact}に向けて、{themePhrase}を調べる方向が見えてきました。教えていただいた資料を比べてみます。",
        },
        low: {
          image: "./assets/characters/patron-02-reaction-low.webp",
          line: "探してくださって、ありがとうございます。必要な内容とは少し違うようなので、利用目的と資料の条件をもう一度整理してみます。",
        },
      },
    },
    facts: {
      author_unknown: { label: "著者", display: "著者名は覚えていない" },
      seen_in_class: { label: "きっかけ", display: "授業中に見た資料" },
      need_color_names: { label: "必要情報", display: "日本の色の名前を確認したい" },
      course_assignment: { label: "利用目的", display: "授業の課題" },
      traditional_colors: { label: "テーマ", display: "日本の伝統色" },
      teacher_book_unknown: { label: "書名", display: "先生も書名は示していない" },
      need_swatches: { label: "必要情報", display: "色名と実際の色見本が必要" },
      flexible_source: { label: "資料条件", display: "特定の本でなくてもよい" },
      page_memory: { label: "", display: "" },
      smalltalk_followup: { label: "", display: "" },
    },
    questions: [
      {
        id: "q02_author",
        text: "書名や著者名について、覚えていることはありますか？",
        requiresAll: [],
        requiresAny: [],
        response: "書名も著者名も覚えていません。ただ、色が並んだページだったのは覚えています。",
        responseVariants: ["題名も著者名も思い出せませんが、色を見比べるようなページがありました。"],
        reveals: ["author_unknown", "page_memory"],
      },
      {
        id: "q02_source",
        text: "どこでその本を知りましたか？",
        requiresAll: [],
        requiresAny: [],
        response: "大学の授業で、先生が開いて見せてくれたんです。",
        responseVariants: ["授業中に先生が資料として見せていた本なんです。"],
        reveals: ["seen_in_class"],
      },
      {
        id: "q02_need",
        text: "その本で何を確認したいですか？",
        requiresAll: [],
        requiresAny: [],
        response: "色の名前と、実際にどんな色なのかを確認したいです。",
        responseVariants: ["色名だけでなく、実際の色合いも見比べたいです。"],
        reveals: ["need_color_names", "need_swatches"],
      },
      {
        id: "q02_use",
        text: "授業や研究でお使いですか？",
        requiresAll: [],
        requiresAny: [],
        response: "はい、授業の課題に使います。",
        responseVariants: ["大学の授業でまとめる課題が出ています。"],
        reveals: ["course_assignment"],
      },
      {
        id: "q02_page",
        text: "どんな内容のページでしたか？",
        requiresAll: [],
        requiresAny: ["seen_in_class", "page_memory"],
        response: "色の名前の横に、その色が大きく印刷されているページでした。",
        responseVariants: ["色名と、その色を実際に見られる大きな見本が並んでいました。"],
        reveals: ["traditional_colors", "need_color_names"],
      },
      {
        id: "q02_teacher",
        text: "先生が紹介した本ですか？",
        requiresAll: ["seen_in_class"],
        requiresAny: [],
        response: "参考に見せてくれただけで、書名を指定されたわけではありません。",
        responseVariants: ["先生が例として開いただけなので、同じ本を使う指定はありません。"],
        reveals: ["teacher_book_unknown", "flexible_source"],
      },
      {
        id: "q02_swatch",
        text: "実際の色見本も必要ですか？",
        requiresAll: [],
        requiresAny: ["need_color_names", "traditional_colors"],
        response: "はい。名前だけでなく、どんな色か見比べられるものが必要です。",
        responseVariants: ["必要です。色名だけではなく、実際の色合いも比較したいです。"],
        reveals: ["need_swatches"],
      },
      {
        id: "q02_exact_book",
        text: "同じ本でなくてもよいですか？",
        requiresAll: [],
        requiresAny: ["need_swatches", "course_assignment"],
        response: "必要な色名と色見本が載っていれば、別の本でも大丈夫です。",
        responseVariants: ["同じ本でなくても、色名と見本の両方が分かれば問題ありません。"],
        reveals: ["flexible_source"],
      },
      {
        id: "q02_plausible",
        text: "本の表紙は何色でしたか？",
        requiresAll: [],
        requiresAny: [],
        response: "表紙の色は覚えていません。必要な内容とは関係なさそうです。",
        responseVariants: ["表紙は思い出せません。中に載っている情報の方が大事です。"],
        reveals: [],
        distractor: "plausible",
      },
      {
        id: "q02_irrelevant",
        text: "今日のお昼ごはんは何でしたか？",
        requiresAll: [],
        requiresAny: [],
        response: "鮭のおにぎりです！ 迷った末に鮭を選んだんですが、大正解でした。",
        responseVariants: ["たまごサンドです。ふわふわでおいしかったですよ。お昼の話までできるとは思いませんでした！"],
        reveals: ["smalltalk_followup"],
        distractor: "irrelevant",
        distractorTone: "cheerful",
      },
      {
        id: "q02_smalltalk_followup",
        text: "それはいいお昼ですね！ どんなところが特によかったですか？",
        requiresAll: ["smalltalk_followup"],
        requiresAny: [],
        response: "手軽に食べられるのに、ちゃんと満足できたところです。午後も頑張れそうです！",
        responseVariants: ["忙しい日でもさっと食べられて、おいしかったところです。いいお昼になりました。"],
        reveals: [],
        smallTalkFollowUp: true,
      },
    ],
    composition: {
      scenarios: [
        {
          id: "traditional-colors-assignment",
          selections: {
            purpose: "purpose_assignment",
            theme: "theme_traditional",
            information: "info_names_swatches",
            source: "source_flexible",
          },
        },
        {
          id: "trend-colors-illustration",
          selections: {
            purpose: "purpose_hobby",
            theme: "theme_fashion",
            information: "info_names",
            source: "source_book",
          },
        },
        {
          id: "accessible-colors-campus-signage",
          selections: {
            purpose: "purpose_signage",
            theme: "theme_accessible",
            information: "info_contrast",
            source: "source_practical",
          },
        },
      ],
      dimensions: {
        purpose: [
          {
            optionId: "purpose_assignment",
            partialOptionId: "purpose_study",
            values: {
              purposeFact: "授業の課題",
              sourceFact: "大学の授業中に見た資料",
              sourceReply: "大学の授業で、先生が開いて見せてくれたんです。",
              sourceReplyAlt: "授業中に先生が資料として見せていた本なんです。",
              useReply: "授業の課題に使います。",
              useReplyAlt: "大学の授業でまとめる課題が出ています。",
              introducerQuestion: "先生が紹介した本ですか？",
              introducerReply: "はい、授業の参考として先生が短く見せてくれた本です。",
              introducerReplyAlt: "はい、授業中に先生が例として開いた本です。",
            },
          },
          {
            optionId: "purpose_hobby",
            partialOptionId: "purpose_study",
            values: {
              purposeFact: "趣味のイラスト制作",
              sourceFact: "書店で見かけた本",
              sourceReply: "書店で立ち読みした本です。題名を控え忘れました。",
              sourceReplyAlt: "少し前に書店で見かけたのですが、詳しく覚えていません。",
              useReply: "趣味で描いているイラストに使います。",
              useReplyAlt: "個人で作る作品の配色を考えるためです。",
              introducerQuestion: "誰かに紹介された本ですか？",
              introducerReply: "いいえ、自分で書店で見つけました。",
              introducerReplyAlt: "人から指定された本ではなく、偶然見かけたものです。",
            },
          },
          {
            optionId: "purpose_signage",
            partialOptionId: "purpose_study",
            values: {
              purposeFact: "大学祭の案内表示づくり",
              sourceFact: "大学の制作室で見た資料",
              sourceReply: "大学祭の制作室で、先輩が参考にしていた資料です。",
              sourceReplyAlt: "学内の案内表示を作る作業中に見かけました。",
              useReply: "大学祭の案内表示を、色の見え方が違う人にも読みやすくするためです。",
              useReplyAlt: "学内イベントの掲示を、誰にでも区別しやすい配色にしたいんです。",
              introducerQuestion: "制作の参考にしていた資料ですか？",
              introducerReply: "はい。先輩が案内表示の配色例を見るために開いていました。",
              introducerReplyAlt: "はい。大学祭の掲示を作るときに、制作室で共有されていた資料です。",
            },
          },
        ],
        theme: [
          {
            optionId: "theme_traditional",
            partialOptionId: "theme_japan",
            values: {
              themeFact: "日本の伝統色",
              themePhrase: "日本の伝統色",
              themePage: "日本の伝統色が紹介されている",
            },
          },
          {
            optionId: "theme_fashion",
            partialOptionId: "theme_japan",
            values: {
              themeFact: "現在の流行色",
              themePhrase: "最近の流行色",
              themePage: "季節ごとの流行色が紹介されている",
            },
          },
          {
            optionId: "theme_accessible",
            partialOptionId: "theme_japan",
            values: {
              themeFact: "色覚の違いに配慮した配色",
              themePhrase: "見分けやすさに配慮した配色",
              themePage: "色覚の違いがあっても情報を区別しやすい配色が紹介されている",
            },
          },
        ],
        information: [
          {
            optionId: "info_names_swatches",
            partialOptionId: "info_overview",
            values: {
              informationFact: "色名と実際の色見本が必要",
              informationPhrase: "色の名前と実際の色見本",
              informationNeedReply: "色の名前と実際の色見本の両方を確認したいです。",
              informationNeedReplyAlt: "色名だけでなく、実際の色合いも見比べたいです。",
              pageDetail: "色名の横に、大きな色見本が載っている",
              swatchReply: "はい。名前だけでなく、どんな色か見比べたいです。",
              swatchReplyAlt: "必要です。色名と実際の色合いの両方を確認したいです。",
            },
          },
          {
            optionId: "info_names",
            partialOptionId: "info_overview",
            values: {
              informationFact: "色の名前が必要・色見本は不要",
              informationPhrase: "色の名前",
              informationNeedReply: "色見本は不要で、色の名前が分かれば十分です。",
              informationNeedReplyAlt: "今回は実際の見本ではなく、使えそうな色名を確認したいです。",
              pageDetail: "色の名前が一覧になっている",
              swatchReply: "今回は色見本がなくても、色の名前が分かれば十分です。",
              swatchReplyAlt: "見本は不要です。使えそうな色名を知りたいです。",
            },
          },
          {
            optionId: "info_contrast",
            partialOptionId: "info_overview",
            values: {
              informationFact: "区別しやすい色の組み合わせと使用例が必要",
              informationPhrase: "区別しやすい色の組み合わせと実際の使用例",
              informationNeedReply: "どの色同士なら見分けやすいか、組み合わせと使用例を確認したいです。",
              informationNeedReplyAlt: "色名より、案内表示で区別しやすい配色例が必要です。",
              pageDetail: "良い配色と見分けにくい配色が並べて示されている",
              swatchReply: "はい。色の見本だけでなく、組み合わせたときの見分けやすさを比べたいです。",
              swatchReplyAlt: "単色の見本より、文字や背景に使った配色例を確認したいです。",
            },
          },
        ],
        source: [
          {
            optionId: "source_flexible",
            partialOptionId: "source_any",
            values: {
              sourceConditionFact: "特定の本でなくてもよい",
              exactBookReply: "必要な情報が載っていれば、別の本や資料でも大丈夫です。",
              exactBookReplyAlt: "同じ本でなくても、内容が確認できれば問題ありません。",
            },
          },
          {
            optionId: "source_book",
            partialOptionId: "source_any",
            values: {
              sourceConditionFact: "ウェブではなく本で確認したい",
              exactBookReply: "同じ題名でなくても構いませんが、今回は本で探したいです。",
              exactBookReplyAlt: "書名にはこだわりません。必要な内容を扱う本が希望です。",
            },
          },
          {
            optionId: "source_practical",
            partialOptionId: "source_any",
            values: {
              sourceConditionFact: "図解と実例がある実用資料を希望",
              exactBookReply: "同じ本でなくても、掲示の図解や実例を見ながら使える資料なら大丈夫です。",
              exactBookReplyAlt: "特定の書名より、実際の案内表示に応用できる図解資料を希望します。",
            },
          },
        ],
      },
      facts: {
        author_unknown: "著者名と正確な書名は分からない",
        seen_in_class: "{sourceFact}",
        need_color_names: "{informationPhrase}を確認したい",
        course_assignment: "{purposeFact}",
        traditional_colors: "{themeFact}",
        teacher_book_unknown: "正確な書名は示されていない",
        need_swatches: "{informationFact}",
        flexible_source: "{sourceConditionFact}",
      },
      questions: {
        q02_author: {
          responses: [
            "書名も著者名も覚えていません。ただ、色が並んだページだったのは覚えています。",
            "題名も著者名も思い出せませんが、色を見比べるようなページがありました。",
          ],
        },
        q02_source: { responses: ["{sourceReply}", "{sourceReplyAlt}"] },
        q02_need: {
          responses: [
            {
              text: "{informationNeedReply}",
              reveals: ["need_color_names", "need_swatches"],
            },
            {
              text: "{informationNeedReplyAlt}",
              reveals: ["need_color_names", "need_swatches"],
            },
          ],
        },
        q02_use: {
          responses: ["{useReply}", "{useReplyAlt}"],
        },
        q02_page: {
          responses: [
            "{themePage}ページでした。{pageDetail}ように見えました。",
            "{pageDetail}ページで、扱っていたのは{themePhrase}だったと思います。",
          ],
        },
        q02_teacher: {
          text: "{introducerQuestion}",
          responses: [
            "{introducerReply} {exactBookReply}",
            "{introducerReplyAlt} {exactBookReplyAlt}",
          ],
        },
        q02_swatch: {
          responses: ["{swatchReply}", "{swatchReplyAlt}"],
        },
        q02_exact_book: {
          responses: ["{exactBookReply}", "{exactBookReplyAlt}"],
        },
      },
      explanation:
        "必要なのは「{purposeFact}」のために、{themeFact}の{informationPhrase}を確認できる資料でした。資料名から利用目的と必要情報へ視点を移すことで、探せる候補が広がります。",
    },
    deduction: {
      template: "{slot1}、{slot2}について、{slot3}を確認できる{slot4}。",
      slots: [
        {
          id: "purpose",
          label: "利用目的",
          requiresAll: ["course_assignment"],
          options: [
            { id: "purpose_assignment", text: "授業の課題のため", score: 1 },
            { id: "purpose_hobby", text: "趣味のため", score: 0 },
            { id: "purpose_signage", text: "大学祭の案内表示を作るため", score: 0 },
            { id: "purpose_study", text: "大学での活動に使うため", score: 0.5 },
          ],
        },
        {
          id: "theme",
          label: "テーマ",
          requiresAll: ["traditional_colors"],
          options: [
            { id: "theme_traditional", text: "日本の伝統色", score: 1 },
            { id: "theme_fashion", text: "流行色", score: 0 },
            { id: "theme_accessible", text: "色覚の違いに配慮した配色", score: 0 },
            { id: "theme_japan", text: "色とデザイン", score: 0.5 },
          ],
        },
        {
          id: "information",
          label: "必要情報",
          requiresAll: ["need_swatches"],
          partialRequiresAll: ["need_color_names"],
          options: [
            { id: "info_names_swatches", text: "色名と実際の色見本", score: 1 },
            { id: "info_names", text: "色の名前", score: 0 },
            { id: "info_contrast", text: "区別しやすい色の組み合わせと使用例", score: 0 },
            { id: "info_overview", text: "色の特徴と使い方", score: 0.5 },
          ],
        },
        {
          id: "source",
          label: "資料条件",
          requiresAll: ["flexible_source"],
          partialRequiresAll: ["seen_in_class"],
          options: [
            { id: "source_flexible", text: "資料を探している", score: 1 },
            { id: "source_book", text: "本を探している", score: 0 },
            { id: "source_practical", text: "図解と実例がある実用資料を探している", score: 0 },
            { id: "source_any", text: "条件に合う資料を探している", score: 0.5 },
          ],
        },
      ],
    },
    correctSentence:
      "授業の課題のため、日本の伝統色について、色名と実際の色見本を確認できる資料を探している。",
    explanation:
      "覚えていた書名は手がかりの一つにすぎませんでした。本当に必要なのは、日本の伝統色の名前と見本を確認できる情報です。資料名から利用目的へ視点を移すことで、候補が大きく広がります。",
    advice:
      "書名が曖昧なときは、書誌情報だけでなく「その本で何を確認したいか」を尋ねるのが有効です。",
  },
  {
    id: "case03",
    number: "03",
    title: "テーマを絞って調べたい",
    cardOpening: "あるテーマについて調べたいのですが、何か資料はありますか？",
    category: "テーマの具体化",
    difficulty: "STANDARD",
    maxQuestions: GAME_CONFIG.maxQuestions,
    replayVariation: { recentHistorySize: 1 },
    opening: "AIについて調べたいのですが、まだテーマがうまくまとまっていなくて……。",
    patron: {
      name: "大学生",
      descriptor: "発表テーマを整理中の人",
      initials: "03",
      accent: "#739b9b",
      image: "./assets/characters/patron-03.webp",
      timeLimitLine: "すみません、次の講義が始まりそうです。ここまでの話で、探す方向をまとめてもらえますか？",
      reactions: {
        high: {
          image: "./assets/characters/patron-03-reaction-high.webp",
          line: "ありがとうございます！ 調べたいことがはっきりしました。これなら資料を集められそうです。",
        },
        medium: {
          image: "./assets/characters/patron-03-reaction-medium.webp",
          line: "ありがとうございます。{purposeFact}に向けて、{themeFact}を調べるヒントになりました。もう少し対象と論点を整理してみます。",
        },
        low: {
          image: "./assets/characters/patron-03-reaction-low.webp",
          line: "一緒に考えてくださって、ありがとうございます。考えていた内容とは少し違うので、利用目的と条件をもう一度整理してみます。",
        },
      },
    },
    facts: {
      generative_ai: { label: "技術", display: "生成AIが中心" },
      class_presentation: { label: "利用目的", display: "大学の授業発表" },
      wants_social_issue: { label: "方向性", display: "技術より社会的な問題に関心" },
      recent_sources: { label: "資料条件", display: "最近の議論が必要" },
      university_students: { label: "対象", display: "大学生" },
      text_generation: { label: "技術", display: "文章生成AI" },
      report_use: { label: "利用場面", display: "生成AIを使った文章の下書き作成" },
      problems_debate: { label: "焦点", display: "問題点や賛否の議論" },
      smalltalk_followup: { label: "", display: "" },
    },
    questions: [
      {
        id: "q03_field",
        text: "AIのことが気になったきっかけは、どんな場面でしたか？",
        requiresAll: [],
        requiresAny: [],
        response: "大学生の間で文章生成AIが使われているという話を聞いたのがきっかけです。",
        responseVariants: ["学生が文章を作るAIを使っていると知って、気になり始めました。"],
        reveals: ["generative_ai", "text_generation", "university_students"],
      },
      {
        id: "q03_use",
        text: "調べたことは、最後にどんな形で使う予定ですか？",
        requiresAll: [],
        requiresAny: [],
        response: "大学の授業で発表します。仕組みの説明より、利用をめぐって意見が分かれるところを示したいです。",
        responseVariants: ["授業発表に使います。便利さの紹介だけでなく、問題や賛否も扱うつもりです。"],
        reveals: ["class_presentation", "wants_social_issue", "problems_debate"],
      },
      {
        id: "q03_technology",
        text: "今いちばん引っかかっているのは、AIそのものですか、それを使う場面ですか？",
        requiresAll: [],
        requiresAny: [],
        response: "AIの仕組みそのものではなく、文章の下書きを作る場面で起きる問題や意見の違いが気になります。",
        responseVariants: ["技術の構造より、生成AIに文章のたたき台を作らせるときの問題点や賛否に関心があります。"],
        reveals: ["report_use", "wants_social_issue", "problems_debate"],
      },
      {
        id: "q03_recent",
        text: "昔からのAIの話と、最近広がった使われ方なら、どちらに近いですか？",
        requiresAll: [],
        requiresAny: [],
        response: "最近広がった文章生成AIの使われ方です。授業発表に使うので、ここ数年の資料を見たいです。",
        responseVariants: ["文章生成AIが広まってからの話です。発表の日が近いので、新しい情報が必要です。"],
        reveals: [
          "recent_sources",
          "generative_ai",
          "text_generation",
          "class_presentation",
        ],
      },
      {
        id: "q03_presentation",
        text: "まとめたものを読む人に、どんな問いを残したいですか？",
        requiresAll: ["class_presentation"],
        requiresAny: [],
        response: "大学生が文章生成AIを使うとき、どんな利点と問題があるのかを考えてほしいです。",
        responseVariants: ["学生による文章生成AIの利用を、便利さと問題の両面から考えてほしいです。"],
        reveals: [
          "generative_ai",
          "text_generation",
          "university_students",
          "wants_social_issue",
          "problems_debate",
        ],
      },
      {
        id: "q03_viewpoint",
        text: "そこでは、どんな点で意見が分かれそうですか？",
        requiresAll: [],
        requiresAny: ["class_presentation", "wants_social_issue"],
        response: "不正利用だけでなく、学習への影響や賛否も比べたいです。",
        responseVariants: ["不正かどうかだけでなく、学習効果を含めた賛成・反対の議論を見たいです。"],
        reveals: ["problems_debate"],
      },
      {
        id: "q03_text_ai",
        text: "そこでいうAIは、何を作るものですか？",
        requiresAll: ["generative_ai"],
        requiresAny: [],
        response: "はい。画像生成ではなく、ChatGPTのような文章生成AIです。",
        responseVariants: ["画像ではなく、文章を作るチャット型の生成AIが中心です。"],
        reveals: ["text_generation"],
      },
      {
        id: "q03_report",
        text: "その人たちがAIを使うのは、具体的にどんな作業ですか？",
        requiresAll: ["university_students"],
        requiresAny: ["generative_ai", "class_presentation"],
        response: "レポートや文書の下書きを、生成AIに作らせる作業です。",
        responseVariants: ["生成AIに文章のたたき台を作ってもらう場面に絞ります。"],
        reveals: ["report_use"],
      },
      {
        id: "q03_plausible",
        text: "AIの本なら、表紙にロボットが描かれている方がよいですか？",
        requiresAll: [],
        requiresAny: [],
        response: "表紙は気にしません。必要なテーマが扱われていれば大丈夫です。",
        responseVariants: ["ロボットの絵がなくても構いません。内容で選びたいです。"],
        reveals: [],
        distractor: "plausible",
      },
      {
        id: "q03_irrelevant",
        text: "普段使っているマグカップは何色ですか？",
        requiresAll: [],
        requiresAny: [],
        response: "白です！ お気に入りで、集中したいときはいつもこれを使っています。いいところに気づきましたね！",
        responseVariants: ["青いカップです。飲み物を入れると少しだけやる気が出るんです。カップ談義も楽しいですね！"],
        reveals: ["smalltalk_followup"],
        distractor: "irrelevant",
        distractorTone: "cheerful",
      },
      {
        id: "q03_smalltalk_followup",
        text: "お気に入りなんですね！ そのカップのどんなところが好きですか？",
        requiresAll: ["smalltalk_followup"],
        requiresAny: [],
        response: "手になじむ形と、机に置くと少し気分が上がるところです。",
        responseVariants: ["ちょうどよい大きさで、長く使っても飽きないところです。"],
        reveals: [],
        smallTalkFollowUp: true,
      },
    ],
    composition: {
      scenarios: [
        {
          id: "student-writing-debate",
          selections: {
            purpose: "purpose_presentation",
            audience: "audience_students",
            theme: "theme_writing",
            focus: "focus_problems",
          },
          values: {
            sceneReply:
              "レポートや授業資料の下書きを、生成AIに作らせる作業です。",
            sceneReplyAlt:
              "生成AIに課題の文章のたたき台を作ってもらう場面に絞ります。",
          },
        },
        {
          id: "company-research-tools",
          selections: {
            purpose: "purpose_job",
            audience: "audience_company",
            theme: "theme_research",
            focus: "focus_tools",
          },
          values: {
            sceneReply:
              "社内情報を集めたり、企画の候補を出したりする作業です。",
            sceneReplyAlt:
              "企業が生成AIから調査の手がかりやアイデアを得る場面に絞ります。",
          },
        },
        {
          id: "teacher-feedback-guidelines",
          selections: {
            purpose: "purpose_policy",
            audience: "audience_teacher",
            theme: "theme_feedback",
            focus: "focus_guidelines",
          },
          values: {
            sceneReply:
              "大学教員が学生の課題へコメント案を作る場面です。",
            sceneReplyAlt:
              "生成AIを使って、提出物へのフィードバックのたたき台を作る場面に絞ります。",
          },
        },
      ],
      dimensions: {
        purpose: [
          {
            optionId: "purpose_presentation",
            partialOptionId: "purpose_class",
            values: {
              purposeFact: "大学の授業発表",
              purposeReply: "大学の授業で発表するためです。",
              purposeReplyAlt: "授業発表のテーマとして調べています。",
              purposeContextReply: "授業発表に使うので",
              purposeContextReplyAlt: "発表の日が近いので",
            },
          },
          {
            optionId: "purpose_job",
            partialOptionId: "purpose_class",
            compatibleWith: { audience: ["audience_company"] },
            values: {
              purposeFact: "就職活動の企業研究",
              purposeReply: "就職活動の企業研究に使います。",
              purposeReplyAlt: "志望する業界を調べるためです。",
              purposeContextReply: "就職活動の企業研究に使うので",
              purposeContextReplyAlt: "企業研究を進めたいので",
            },
          },
          {
            optionId: "purpose_policy",
            partialOptionId: "purpose_class",
            values: {
              purposeFact: "大学の生成AI利用ガイドライン案の作成",
              purposeReply: "学内の生成AI利用ガイドライン案を作るためです。",
              purposeReplyAlt: "大学での適切な利用ルールを提案する資料に使います。",
              purposeContextReply: "ガイドライン案の根拠にするので",
              purposeContextReplyAlt: "学内提案に使うので",
            },
          },
        ],
        audience: [
          {
            optionId: "audience_students",
            partialOptionId: "audience_youth",
            values: {
              audienceFact: "大学生",
              audiencePhrase: "大学生",
              triggerReply:
                "大学生の間で文章生成AIが使われていると知ったのがきっかけです。",
              triggerReplyAlt:
                "学生が文章を作るAIを使っているという話を聞いて、気になり始めました。",
            },
          },
          {
            optionId: "audience_company",
            partialOptionId: "audience_youth",
            values: {
              audienceFact: "企業・職場",
              audiencePhrase: "企業",
              triggerReply:
                "企業で文章生成AIが使われている事例を見たのがきっかけです。",
              triggerReplyAlt:
                "職場に文章を作るAIが広がっていると知って、気になり始めました。",
            },
          },
          {
            optionId: "audience_teacher",
            partialOptionId: "audience_youth",
            values: {
              audienceFact: "大学教員",
              audiencePhrase: "大学教員",
              triggerReply:
                "大学教員が生成AIで学生へのコメント案を作る事例を知ったのがきっかけです。",
              triggerReplyAlt:
                "課題へのフィードバックに生成AIを使う教員がいると聞いて、気になり始めました。",
            },
          },
        ],
        theme: [
          {
            optionId: "theme_writing",
            partialOptionId: "theme_general",
            values: {
              themeFact: "生成AIを使った文章の下書き作成",
              themePhrase: "生成AIを使った文章の下書き作成",
              fieldReply: "生成AIに文章の下書きを作らせることを調べたいです。",
              fieldReplyAlt: "文章生成AIによる下書き作成がテーマです。",
              sceneReply:
                "レポートや文書の下書きを、生成AIに作らせる作業です。",
              sceneReplyAlt:
                "生成AIに文章のたたき台を作ってもらう場面に絞ります。",
            },
          },
          {
            optionId: "theme_research",
            partialOptionId: "theme_general",
            values: {
              themeFact: "生成AIを使った情報収集・アイデア出し",
              themePhrase: "生成AIを使った情報収集・アイデア出し",
              fieldReply: "生成AIを情報収集やアイデア出しに使うことを調べたいです。",
              fieldReplyAlt: "文章生成AIから調べる手がかりを得ることがテーマです。",
              sceneReply:
                "情報を集めたり、考えの候補を出したりする作業です。",
              sceneReplyAlt:
                "生成AIに調べる手がかりやアイデアを出してもらう場面に絞ります。",
            },
          },
          {
            optionId: "theme_feedback",
            partialOptionId: "theme_general",
            values: {
              themeFact: "生成AIを使った課題へのフィードバック作成",
              themePhrase: "生成AIを使った課題へのフィードバック作成",
              fieldReply: "生成AIで学生の課題へのコメント案を作ることを調べたいです。",
              fieldReplyAlt: "教員が生成AIをフィードバック作成に使う場面がテーマです。",
              sceneReply: "大学教員が学生の課題へコメント案を作る場面です。",
              sceneReplyAlt: "提出物へのフィードバックのたたき台を生成AIで作る場面に絞ります。",
            },
          },
        ],
        focus: [
          {
            optionId: "focus_problems",
            partialOptionId: "focus_effect",
            values: {
              focusFact: "問題点や賛否の議論",
              technologyReply: "仕組みより、利用による問題や意見の違いを調べたいです。",
              technologyReplyAlt: "技術の構造ではなく、社会的な問題や賛否に関心があります。",
              viewpointReply: "不正利用だけでなく、影響や賛成・反対の議論も比べたいです。",
              viewpointReplyAlt: "利点と問題点の両方を扱いたいです。",
              focusIntentReply:
                "仕組みの説明より、利用をめぐって意見が分かれるところを示したいです。",
              focusIntentReplyAlt:
                "便利さの紹介だけでなく、問題や賛否も扱うつもりです。",
              focusQuestionReply:
                "どんな利点と問題があるのかを考えてほしいです。",
              focusQuestionReplyAlt:
                "便利さと問題の両面から考えてほしいです。",
            },
          },
          {
            optionId: "focus_tools",
            partialOptionId: "focus_effect",
            values: {
              focusFact: "ツールや活用方法の比較",
              technologyReply: "仕組みより、どのツールが使いやすいかを比べたいです。",
              technologyReplyAlt: "開発方法ではなく、実際の活用方法に関心があります。",
              viewpointReply: "導入事例を見ながら、ツールの特徴や使い方を比較したいです。",
              viewpointReplyAlt: "役立つ機能と具体的な活用例を知りたいです。",
              focusIntentReply:
                "仕組みの説明より、実際の活用方法やツールの違いを比べたいです。",
              focusIntentReplyAlt:
                "技術紹介だけでなく、役立つ使い方を比較するつもりです。",
              focusQuestionReply:
                "どの使い方やツールが役立つのかを考えてほしいです。",
              focusQuestionReplyAlt:
                "具体的な活用方法の違いに注目してほしいです。",
            },
          },
          {
            optionId: "focus_guidelines",
            partialOptionId: "focus_effect",
            values: {
              focusFact: "適切な利用範囲とガイドライン",
              technologyReply: "仕組みより、どこまで使ってよいかという基準を調べたいです。",
              technologyReplyAlt: "技術の構造ではなく、適切な利用範囲に関心があります。",
              viewpointReply: "効率化の利点と、教員が確認すべき責任の境界を比べたいです。",
              viewpointReplyAlt: "任せてよい部分と、人が判断すべき部分を整理したいです。",
              focusIntentReply: "便利さの紹介より、適切な利用範囲を示したいです。",
              focusIntentReplyAlt: "活用例だけでなく、守るべき基準も扱うつもりです。",
              focusQuestionReply: "どこまで生成AIに任せてよいかを考えてほしいです。",
              focusQuestionReplyAlt: "人が確認すべき責任の範囲に注目してほしいです。",
            },
          },
        ],
      },
      facts: {
        generative_ai: "生成AIが中心",
        class_presentation: "{purposeFact}",
        wants_social_issue: "{focusFact}",
        recent_sources: "最近の情報が必要",
        university_students: "{audienceFact}",
        text_generation: "文章生成AI",
        report_use: "{themeFact}",
        problems_debate: "{focusFact}",
      },
      questions: {
        q03_field: {
          text: "AIのことが気になったきっかけは、どんな場面でしたか？",
          responses: [
            {
              text: "{triggerReply}",
              reveals: [
                "generative_ai",
                "text_generation",
                "university_students",
              ],
            },
            {
              text: "{triggerReplyAlt}",
              reveals: [
                "generative_ai",
                "text_generation",
                "university_students",
              ],
            },
          ],
        },
        q03_use: {
          text: "調べたことは、最後にどんな形で使う予定ですか？",
          responses: [
            {
              text: "{purposeReply}{focusIntentReply}",
              reveals: [
                "class_presentation",
                "wants_social_issue",
                "problems_debate",
              ],
            },
            {
              text: "{purposeReplyAlt}{focusIntentReplyAlt}",
              reveals: [
                "class_presentation",
                "wants_social_issue",
                "problems_debate",
              ],
            },
          ],
        },
        q03_technology: {
          text:
            "今いちばん引っかかっているのは、AIそのものですか、それを使う場面ですか？",
          responses: [
            {
              text: "{sceneReply}{technologyReply}",
              reveals: [
                "report_use",
                "wants_social_issue",
                "problems_debate",
              ],
            },
            {
              text: "{sceneReplyAlt}{technologyReplyAlt}",
              reveals: [
                "report_use",
                "wants_social_issue",
                "problems_debate",
              ],
            },
          ],
        },
        q03_recent: {
          text:
            "昔からのAIの話と、最近広がった使われ方なら、どちらに近いですか？",
          responses: [
            {
              text:
                "最近広がった文章生成AIの使われ方です。{purposeContextReply}、ここ数年の資料を見たいです。",
              reveals: [
                "recent_sources",
                "generative_ai",
                "text_generation",
                "class_presentation",
              ],
            },
            {
              text:
                "文章生成AIが広まってからの話です。{purposeContextReplyAlt}、新しい情報が必要です。",
              reveals: [
                "recent_sources",
                "generative_ai",
                "text_generation",
                "class_presentation",
              ],
            },
          ],
        },
        q03_presentation: {
          text: "まとめたものを読む人に、どんな問いを残したいですか？",
          responses: [
            {
              text:
                "{audiencePhrase}が文章生成AIを使うとき、{focusQuestionReply}",
              reveals: [
                "generative_ai",
                "text_generation",
                "university_students",
                "wants_social_issue",
                "problems_debate",
              ],
            },
            {
              text:
                "{audiencePhrase}が文章生成AIを使うとき、{focusQuestionReplyAlt}",
              reveals: [
                "generative_ai",
                "text_generation",
                "university_students",
                "wants_social_issue",
                "problems_debate",
              ],
            },
          ],
        },
        q03_viewpoint: {
          text: "そこでは、どんな点で意見が分かれそうですか？",
          responses: [
            {
              text: "{viewpointReply}",
              reveals: ["wants_social_issue", "problems_debate"],
            },
            {
              text: "{viewpointReplyAlt}",
              reveals: ["wants_social_issue", "problems_debate"],
            },
          ],
        },
        q03_text_ai: {
          text: "そこでいうAIは、何を作るものですか？",
          responses: [
            {
              text: "画像ではなく、文章を作るチャット型の生成AIです。",
              reveals: ["generative_ai", "text_generation"],
            },
            {
              text: "文章作成を助ける生成AIを中心に考えています。",
              reveals: ["generative_ai", "text_generation"],
            },
          ],
        },
        q03_report: {
          text: "その人たちがAIを使うのは、具体的にどんな作業ですか？",
          responses: [
            {
              text: "{sceneReply}",
              reveals: ["report_use"],
            },
            {
              text: "{sceneReplyAlt}",
              reveals: ["report_use"],
            },
          ],
        },
      },
      explanation:
        "「AI」という広い相談を、気になったきっかけ、まとめたものの使い道、利用場面、読者に残したい問いからたどりました。一つの返答に複数の手がかりが含まれるため、会話をつないで「{purposeFact}」「{audienceFact}」「{themeFact}」「{focusFact}」を整理する必要があります。",
    },
    deduction: {
      template: "{slot1}、{slot2}が{slot3}ことについて、{slot4}。",
      slots: [
        {
          id: "purpose",
          label: "利用目的",
          requiresAll: ["class_presentation"],
          options: [
            { id: "purpose_presentation", text: "大学の授業発表のため", score: 1 },
            { id: "purpose_job", text: "就職活動のため", score: 0 },
            { id: "purpose_policy", text: "大学の生成AI利用ガイドライン案を作るため", score: 0 },
            { id: "purpose_class", text: "大学で使う資料のため", score: 0.5 },
          ],
        },
        {
          id: "audience",
          label: "対象",
          requiresAll: ["university_students"],
          options: [
            { id: "audience_students", text: "大学生", score: 1 },
            { id: "audience_company", text: "企業", score: 0 },
            { id: "audience_teacher", text: "大学教員", score: 0 },
            { id: "audience_youth", text: "生成AIを利用する人", score: 0.5 },
          ],
        },
        {
          id: "theme",
          label: "テーマ",
          requiresAll: ["generative_ai"],
          options: [
            { id: "theme_writing", text: "生成AIで文章の下書きを作る", score: 1 },
            { id: "theme_research", text: "生成AIで情報収集・アイデア出しをする", score: 0 },
            { id: "theme_feedback", text: "生成AIで課題へのフィードバックを作る", score: 0 },
            { id: "theme_general", text: "生成AIを利用する", score: 0.5 },
          ],
        },
        {
          id: "focus",
          label: "焦点",
          requiresAll: ["problems_debate"],
          options: [
            { id: "focus_problems", text: "問題点や議論を調べたい", score: 1 },
            { id: "focus_tools", text: "ツールや活用方法を比較したい", score: 0 },
            { id: "focus_guidelines", text: "適切な利用範囲とガイドラインを調べたい", score: 0 },
            { id: "focus_effect", text: "利用による影響を知りたい", score: 0.5 },
          ],
        },
      ],
    },
    correctSentence:
      "大学の授業発表のため、大学生が生成AIで文章の下書きを作ることについて、問題点や議論を調べたい。",
    explanation:
      "「AI」は非常に広いテーマです。利用目的、対象者、AIの種類、利用場面、調べたい観点を分けて聞くことで、発表に使える具体的な調査テーマになりました。",
    advice:
      "広いテーマでは分類項目を順番に聞くだけでなく、気になったきっかけや利用場面、相手に残したい問いを聞くと、一つの返答から複数の手がかりを得られます。",
  },
  {
    id: "case04",
    number: "04",
    title: "昔の場所を確かめたい",
    cardOpening: "昔あった場所を、古い地図で探せますか？",
    category: "地図・地域資料",
    difficulty: "ADVANCED",
    maxQuestions: GAME_CONFIG.maxQuestions,
    replayVariation: { recentHistorySize: 1 },
    opening: "昔の場所を地図で確かめたいのですが、探し方を相談できますか？",
    patron: {
      name: "地域住民",
      descriptor: "家族の記憶を確かめる人",
      initials: "04",
      accent: "#739b9b",
      image: "./assets/characters/patron-04.webp",
      timeLimitLine: "そろそろ家に戻る時間でして。ここまでで、調べる内容をまとめていただけますか？",
      reactions: {
        high: {
          image: "./assets/characters/patron-04-reaction-high.webp",
          line: "ありがとうございます！ 探し方が分かって、ほっとしました。家族にも話してみます。",
        },
        medium: {
          image: "./assets/characters/patron-04-reaction-medium.webp",
          line: "ありがとうございます。{mapTargetFact}を地図で調べる時期と範囲が分かって助かりました。もう少し家族の記憶もたどってみます。",
        },
        low: {
          image: "./assets/characters/patron-04-reaction-low.webp",
          line: "調べていただいて、ありがとうございます。探している場所とは少し違うようなので、家族にも改めて聞いてみますね。",
        },
      },
    },
    facts: {
      showa_30s: { label: "時期", display: "昭和30年代ごろ" },
      current_area: { label: "地域", display: "現在地周辺" },
      wants_location: { label: "目的", display: "なくなった建物の場所を確認" },
      specific_place: { label: "対象", display: "特定の場所を探している" },
      building_cinema: { label: "建物", display: "現在はない映画館" },
      building_type_checked: { label: "", display: "" },
      theater_name: { label: "名称", display: "中央映画劇場" },
      active_period: { label: "手がかり", display: "昭和30年代に営業" },
      grandmother_memory: { label: "きっかけ", display: "祖母から聞いた思い出" },
      smalltalk_followup: { label: "", display: "" },
    },
    questions: [
      {
        id: "q04_period",
        text: "いつ頃の地図をご希望ですか？",
        requiresAll: [],
        requiresAny: [],
        response: "昭和30年代ごろのものがいいです。",
        responseVariants: ["祖母が学生だった、昭和30年代あたりの地図を見たいです。"],
        reveals: ["showa_30s"],
      },
      {
        id: "q04_range",
        text: "どのくらいの範囲が必要ですか？",
        requiresAll: [],
        requiresAny: [],
        response: "この図書館の周辺、歩いて行けるくらいの範囲です。",
        responseVariants: ["現在地から徒歩で回れる、この近所の範囲が分かれば十分です。"],
        reveals: ["current_area"],
      },
      {
        id: "q04_goal",
        text: "地図で何を確認したいですか？",
        requiresAll: [],
        requiresAny: [],
        response: "今はなくなった建物が、どこにあったか確かめたいんです。",
        responseVariants: ["昔存在した建物の正確な場所を地図で確認したいです。"],
        reveals: ["wants_location"],
      },
      {
        id: "q04_place",
        text: "特定の場所を探していますか？",
        requiresAll: [],
        requiresAny: [],
        response: "はい。祖母がよく通ったという場所を探しています。",
        responseVariants: ["祖母の思い出に出てくる、特定の場所を見つけたいです。"],
        reveals: ["specific_place", "grandmother_memory"],
      },
      {
        id: "q04_building",
        text: "どのような建物ですか？",
        requiresAll: [],
        requiresAny: ["specific_place", "wants_location"],
        response: "今はなくなった映画館だそうです。",
        responseVariants: ["祖母が昔通っていた映画館です。今は残っていません。"],
        reveals: ["building_cinema", "building_type_checked"],
      },
      {
        id: "q04_name",
        text: "建物の名前は分かりますか？",
        requiresAll: ["building_type_checked"],
        requiresAny: [],
        response: "『中央映画劇場』という名前だったと聞きました。",
        responseVariants: ["祖母は『中央映画劇場』と呼んでいました。"],
        reveals: ["theater_name"],
      },
      {
        id: "q04_when",
        text: "いつ頃あった映画館ですか？",
        requiresAll: ["building_cinema"],
        requiresAny: [],
        response: "祖母が学生だった昭和30年代には営業していたそうです。",
        responseVariants: ["少なくとも昭和30年代、祖母の学生時代にはあったそうです。"],
        reveals: ["showa_30s", "active_period"],
      },
      {
        id: "q04_reason",
        text: "その場所を知ったきっかけは？",
        requiresAll: [],
        requiresAny: ["specific_place", "wants_location"],
        response: "祖母から、この辺りの『中央映画劇場』へよく通ったという話を聞いたんです。",
        responseVariants: ["祖母の思い出話に『中央映画劇場』という名前が出てきたのがきっかけです。"],
        reveals: ["grandmother_memory", "building_cinema", "theater_name"],
      },
      {
        id: "q04_plausible",
        text: "地図は折りたたみ式のものがよいですか？",
        requiresAll: [],
        requiresAny: [],
        response: "形にはこだわりません。探している場所が確認できれば大丈夫です。",
        responseVariants: ["一枚ものでも冊子でも構いません。場所が分かることが大切です。"],
        reveals: [],
        distractor: "plausible",
      },
      {
        id: "q04_irrelevant",
        text: "今朝は何時に起きましたか？",
        requiresAll: [],
        requiresAny: [],
        response: "7時ごろです。目覚ましを一度で止められたので、今日はいい日です！",
        responseVariants: ["6時半です。朝の静かな時間が好きなので、早起きできるとうれしいんです。"],
        reveals: ["smalltalk_followup"],
        distractor: "irrelevant",
        distractorTone: "cheerful",
      },
      {
        id: "q04_smalltalk_followup",
        text: "早起きが気持ちよかったんですね！ 朝はどんなことをして過ごしますか？",
        requiresAll: ["smalltalk_followup"],
        requiresAny: [],
        response: "家にある古い新聞を少しずつ整理しています。昔の地域のお店の記事や広告が載った号もあったので、調べものに役立てばと思って何部かこちらへ寄贈しました。",
        responseVariants: ["古い新聞を一枚ずつ整理します。地域のお店や街の様子が載っているものは、記録として残した方がよいと思い、こちらに持ってきています。"],
        reveals: [],
        smallTalkFollowUp: true,
      },
    ],
    composition: {
      scenarios: [
        {
          id: "cinema-nearby-location",
          selections: {
            period: "period_30s",
            area: "area_here",
            target: "target_chuo",
            need: "need_location",
          },
        },
        {
          id: "old-library-city-neighborhood",
          selections: {
            period: "period_early",
            area: "area_city",
            target: "target_library",
            need: "need_neighborhood",
          },
        },
        {
          id: "market-station-change",
          selections: {
            period: "period_50s",
            area: "area_station_east",
            target: "target_market",
            need: "need_change",
          },
        },
      ],
      dimensions: {
        period: [
          {
            optionId: "period_30s",
            partialOptionId: "period_showa",
            values: {
              mapPeriodFact: "昭和30年代ごろ",
              mapPeriodReply: "昭和30年代ごろの地図を見たいです。",
              mapPeriodReplyAlt: "家族の話では、昭和30年代あたりだそうです。",
              activePeriodReply: "昭和30年代には使われていたそうです。",
              activePeriodReplyAlt: "少なくとも昭和30年代にはあったと聞きました。",
            },
          },
          {
            optionId: "period_early",
            partialOptionId: "period_showa",
            values: {
              mapPeriodFact: "昭和初期",
              mapPeriodReply: "昭和の初めごろの地図を見たいです。",
              mapPeriodReplyAlt: "戦前の昭和期だったと思います。",
              activePeriodReply: "昭和の初めごろには使われていたそうです。",
              activePeriodReplyAlt: "家族の写真から、戦前の昭和期だと思います。",
            },
          },
          {
            optionId: "period_50s",
            partialOptionId: "period_showa",
            values: {
              mapPeriodFact: "昭和50年代ごろ",
              mapPeriodReply: "昭和50年代ごろの地図を見たいです。",
              mapPeriodReplyAlt: "商店街がにぎわっていた昭和50年代だそうです。",
              activePeriodReply: "昭和50年代には営業していたと聞きました。",
              activePeriodReplyAlt: "家族の写真から、昭和50年代にはあったと分かります。",
            },
          },
        ],
        area: [
          {
            optionId: "area_here",
            partialOptionId: "area_rough",
            values: {
              mapAreaFact: "現在地周辺",
              areaReply: "この図書館の周辺、歩いて行けるくらいの範囲です。",
              areaReplyAlt: "現在地から徒歩で回れる、この近所の範囲が分かれば十分です。",
            },
          },
          {
            optionId: "area_city",
            partialOptionId: "area_rough",
            values: {
              mapAreaFact: "この市内",
              areaReply: "この市内が分かる範囲でお願いします。",
              areaReplyAlt: "市全体の中で、どこにあったか確認したいです。",
            },
          },
          {
            optionId: "area_station_east",
            partialOptionId: "area_rough",
            values: {
              mapAreaFact: "駅東口の旧商店街周辺",
              areaReply: "駅の東口にあった旧商店街の周辺です。",
              areaReplyAlt: "駅東口から続く、昔の商店街の範囲を見たいです。",
            },
          },
        ],
        target: [
          {
            optionId: "target_chuo",
            partialOptionId: "target_oldbuilding",
            values: {
              mapTargetFact: "『中央映画劇場』",
              placeTypeFact: "現在はない映画館",
              placeTypeReply: "今はなくなった映画館だそうです。",
              placeTypeReplyAlt: "祖母が昔通っていた映画館です。今は残っていません。",
              placeNameReply: "『中央映画劇場』という名前だったと聞きました。",
              placeNameReplyAlt: "家族は『中央映画劇場』と呼んでいました。",
              memoryPerson: "祖母",
              memoryPlace: "映画館",
            },
          },
          {
            optionId: "target_library",
            partialOptionId: "target_oldbuilding",
            values: {
              mapTargetFact: "昔の市立図書館",
              placeTypeFact: "現在はない図書館",
              placeTypeReply: "今はなくなった公共図書館の建物だそうです。",
              placeTypeReplyAlt: "市にあった古い図書館で、今は残っていません。",
              placeNameReply: "市立図書館の旧館と呼ばれていたそうです。",
              placeNameReplyAlt: "正式名は不明ですが、市立の古い図書館です。",
              memoryPerson: "父",
              memoryPlace: "図書館",
            },
          },
          {
            optionId: "target_market",
            partialOptionId: "target_oldbuilding",
            values: {
              mapTargetFact: "『みどり市場』",
              placeTypeFact: "現在はない屋内市場",
              placeTypeReply: "昔の商店街にあった屋内市場で、今は残っていません。",
              placeTypeReplyAlt: "いくつもの店が入っていた市場の建物だそうです。",
              placeNameReply: "『みどり市場』という名前だったと聞きました。",
              placeNameReplyAlt: "写真の看板に『みどり市場』と写っています。",
              memoryPerson: "母",
              memoryPlace: "市場",
            },
          },
        ],
        need: [
          {
            optionId: "need_location",
            partialOptionId: "need_map",
            values: {
              mapNeedFact: "所在地を確認したい",
              goalReply: "今はなくなった建物が、どこにあったか確かめたいんです。",
              goalReplyAlt: "昔の建物の正確な場所を地図で確認したいです。",
            },
          },
          {
            optionId: "need_neighborhood",
            partialOptionId: "need_map",
            values: {
              mapNeedFact: "周辺の昔の様子を見たい",
              goalReply: "建物の場所だけでなく、周りがどんな街だったか見たいです。",
              goalReplyAlt: "その建物の周辺に何があったかを地図で確認したいです。",
            },
          },
          {
            optionId: "need_change",
            partialOptionId: "need_map",
            values: {
              mapNeedFact: "市場内の店の配置がどう変わったかを比べたい",
              goalReply: "市場の中にどんな店が並び、時期によって配置がどう変わったか比べたいです。",
              goalReplyAlt: "市場の場所だけでなく、店の並びの変化を昔の地図で確認したいです。",
            },
          },
        ],
      },
      facts: {
        showa_30s: "{mapPeriodFact}",
        current_area: "{mapAreaFact}",
        wants_location: "{mapNeedFact}",
        specific_place: "{memoryPlace}を探している",
        building_cinema: "{placeTypeFact}",
        theater_name: "{mapTargetFact}",
        active_period: "{mapPeriodFact}に使われていた",
        grandmother_memory: "{memoryPerson}の思い出がきっかけ",
      },
      questions: {
        q04_period: {
          responses: ["{mapPeriodReply}", "{mapPeriodReplyAlt}"],
        },
        q04_range: { responses: ["{areaReply}", "{areaReplyAlt}"] },
        q04_goal: { responses: ["{goalReply}", "{goalReplyAlt}"] },
        q04_place: {
          responses: [
            "はい。{memoryPerson}の思い出に出てくる{memoryPlace}のことです。",
            "{memoryPerson}から聞いた{memoryPlace}を手がかりにしています。",
          ],
        },
        q04_building: {
          responses: ["{placeTypeReply}", "{placeTypeReplyAlt}"],
        },
        q04_name: {
          text: "建物の名前は分かりますか？",
          responses: ["{placeNameReply}", "{placeNameReplyAlt}"],
        },
        q04_when: {
          text: "いつ頃使われていた建物ですか？",
          responses: ["{activePeriodReply}", "{activePeriodReplyAlt}"],
        },
        q04_reason: {
          responses: [
            "{memoryPerson}から、{mapTargetFact}へよく行ったという話を聞きました。",
            "{memoryPerson}の古い話に{mapTargetFact}という場所が出てきたのがきっかけです。",
          ],
        },
      },
      explanation:
        "利用者が地図で確かめたいのは、{mapPeriodFact}の{mapAreaFact}にあった{mapTargetFact}についての「{mapNeedFact}」でした。時期、範囲、対象、目的がそろうと、調べる地図を選べます。",
    },
    deduction: {
      template: "{slot1}、{slot2}にあった{slot3}の{slot4}。",
      slots: [
        {
          id: "period",
          label: "時期",
          requiresAll: ["showa_30s"],
          options: [
            { id: "period_30s", text: "昭和30年代ごろ", score: 1 },
            { id: "period_early", text: "昭和初期", score: 0 },
            { id: "period_50s", text: "昭和50年代ごろ", score: 0 },
            { id: "period_showa", text: "昭和のころ", score: 0.5 },
          ],
        },
        {
          id: "area",
          label: "地域",
          requiresAll: ["current_area"],
          options: [
            { id: "area_here", text: "現在地周辺", score: 1 },
            { id: "area_city", text: "この市内", score: 0 },
            { id: "area_station_east", text: "駅東口の旧商店街周辺", score: 0 },
            { id: "area_rough", text: "市内の昔の市街地", score: 0.5 },
          ],
        },
        {
          id: "target",
          label: "対象",
          requiresAll: ["theater_name"],
          partialRequiresAll: ["building_cinema"],
          options: [
            { id: "target_chuo", text: "『中央映画劇場』", score: 1 },
            { id: "target_library", text: "昔の市立図書館", score: 0 },
            { id: "target_market", text: "『みどり市場』", score: 0 },
            { id: "target_oldbuilding", text: "現在はない建物", score: 0.5 },
          ],
        },
        {
          id: "need",
          label: "確認したいこと",
          requiresAll: ["wants_location"],
          options: [
            { id: "need_location", text: "所在地を確認したい", score: 1 },
            { id: "need_neighborhood", text: "周辺の様子を見たい", score: 0 },
            { id: "need_change", text: "店の配置の変化を比べたい", score: 0 },
            { id: "need_map", text: "昔の地図で様子を確かめたい", score: 0.5 },
          ],
        },
      ],
    },
    correctSentence:
      "昭和30年代ごろ、現在地周辺にあった『中央映画劇場』の所在地を確認したい。",
    explanation:
      "利用者の関心は古地図そのものではなく、祖母の記憶にある映画館の所在地でした。時期、範囲、建物名がそろうと、地図や住宅地図を調べるための問いになります。",
    advice:
      "資料の種類を尋ねられたときほど、「その資料で何を確かめたいか」を確認しましょう。",
  },
  {
    id: "case05",
    number: "05",
    title: "統計の変化を調べたい",
    cardOpening: "大学に関係する人数の変化を追ってるんだけど、どの統計が手がかりになるかな？",
    category: "統計・時系列",
    difficulty: "FINAL",
    maxQuestions: GAME_CONFIG.maxQuestions,
    replayVariation: { recentHistorySize: 1 },
    opening: "日本の大学に関係する人数の変化を追ってるんだけど、どの統計表を見ればいいか迷ってて。司書さん、手を貸してもらえる？",
    patron: {
      name: "探偵さん",
      descriptor: "数字の謎を追う、明るい大学生探偵",
      initials: "05",
      accent: "#739b9b",
      image:
        "./assets/characters/extra-detective-reaction-medium-portrait.webp",
      cardPortraitPosition: "center 4%",
      cardPortraitScale: "1.08",
      messageSound: "message3",
      timeLimitLine: "あ、そろそろ次の調査に戻る時間みたい。ここまでの手がかりで、必要な統計をまとめてもらえる？",
      reactions: {
        high: {
          image:
            "./assets/characters/extra-detective-reaction-high-portrait.webp",
          line: "ありがとう、司書さん！ これなら調査を先へ進められそう！",
        },
        medium: {
          image:
            "./assets/characters/extra-detective-reaction-medium-portrait.webp",
          line: "ありがとう！ {statisticTargetFact}を{statisticPeriodFact}で見るところまではつかめたよ。もう少し手がかりを整理してみるね。",
        },
        low: {
          image:
            "./assets/characters/extra-detective-reaction-low-portrait.webp",
          line: "ありがとう、司書さん。まだ探してる数字とは少し違うみたいだけど、もう一度手がかりを整理してみるね。",
        },
      },
    },
    facts: {
      no_single_year: { label: "年次", display: "特定の1年だけではない" },
      report: { label: "利用目的", display: "レポート作成" },
      university_students: { label: "対象", display: "大学生の人数" },
      japan_total: { label: "地域", display: "日本全国" },
      increase_decrease: { label: "目的", display: "増えたか減ったかを示したい" },
      comparison: { label: "必要情報", display: "複数年の比較が必要" },
      twenty_years: { label: "期間", display: "直近約20年間" },
      time_series: { label: "統計", display: "各年の数値を追える時系列統計" },
      smalltalk_followup: { label: "", display: "" },
    },
    questions: [
      {
        id: "q05_year",
        text: "何年の数字が必要ですか？",
        requiresAll: [],
        requiresAny: [],
        response: "1年だけじゃなくて、前から今までを見たいんだ。",
        responseVariants: ["特定の1年じゃなくて、過去から現在までの数字が必要なんだ。"],
        reveals: ["no_single_year"],
      },
      {
        id: "q05_use",
        text: "何にお使いになりますか？",
        requiresAll: [],
        requiresAny: [],
        response: "授業のレポートで、大学生の人数の変化を説明するんだ。",
        responseVariants: ["大学生数がどう変わったかを、授業レポートにまとめるつもり。"],
        reveals: ["report", "increase_decrease"],
      },
      {
        id: "q05_target",
        text: "対象は、在学中の大学生ですか、それとも卒業者ですか？",
        requiresAll: [],
        requiresAny: [],
        response: "うん。大学院生や高校生じゃなくて、大学生の人数だよ。",
        responseVariants: ["対象は学部の大学生だけ。大学院生などは含めないよ。"],
        reveals: ["university_students"],
      },
      {
        id: "q05_area",
        text: "全国の数字ですか？",
        requiresAll: [],
        requiresAny: [],
        response: "うん、都道府県別じゃなくて日本全国の合計だよ。",
        responseVariants: ["地域別じゃなくて、全国を合計した人数を探してるんだ。"],
        reveals: ["japan_total"],
      },
      {
        id: "q05_explain",
        text: "何を説明するための数字ですか？",
        requiresAll: ["report"],
        requiresAny: [],
        response: "大学生の数が昔より増えたのか、減ったのかを示したいんだ。",
        responseVariants: ["以前と比べて、大学生数が増えたか減ったかを説明したいんだ。"],
        reveals: ["increase_decrease", "comparison"],
      },
      {
        id: "q05_compare",
        text: "他の年との比較が必要ですか？",
        requiresAll: [],
        requiresAny: ["report", "no_single_year"],
        response: "うん。現在の数字だけじゃなくて、過去からの変化を比較したいんだ。",
        responseVariants: ["最新値だけじゃ足りないから、複数年を並べて変化を見たいな。"],
        reveals: ["comparison"],
      },
      {
        id: "q05_span",
        text: "何年くらいの期間を比較しますか？",
        requiresAll: [],
        requiresAny: ["increase_decrease", "comparison"],
        response: "直近20年くらいが、課題の範囲にちょうどよさそう。",
        responseVariants: ["およそ20年前から現在までを比較するつもりだよ。"],
        reveals: ["twenty_years"],
      },
      {
        id: "q05_series",
        text: "毎年の推移が必要ですか？",
        requiresAll: ["comparison"],
        requiresAny: [],
        response: "うん。始点と終点だけじゃなくて、年ごとの推移をグラフにしたいんだ。",
        responseVariants: ["毎年の数値を使って、途中の動きも分かるグラフにしたいな。"],
        reveals: ["time_series"],
      },
      {
        id: "q05_plausible",
        text: "グラフにするなら、線は青色がよいですか？",
        requiresAll: [],
        requiresAny: [],
        response: "色はあとで決めるよ。今は必要な数字がそろうことの方が大切かな。",
        responseVariants: ["グラフの色にはこだわらないよ。今は統計データそのものを探してるんだ。"],
        reveals: [],
        distractor: "plausible",
      },
      {
        id: "q05_irrelevant",
        text: "調査のない日は、どんなふうに過ごすんですか？",
        requiresAll: [],
        requiresAny: [],
        response: "商店街をぶらぶら歩くのが好き！ 面白い看板や小さな路地を見つけると、ちょっと得した気分になるんだ。",
        responseVariants: ["喫茶店で新作パフェを試すことかな。メニューの写真と見比べるのも、けっこう楽しいんだよ！"],
        reveals: ["smalltalk_followup"],
        distractor: "irrelevant",
        distractorTone: "cheerful",
      },
      {
        id: "q05_smalltalk_followup",
        text: "楽しそうですね！ 最近の街歩きや喫茶店で、うれしい発見はありましたか？",
        requiresAll: ["smalltalk_followup"],
        requiresAny: [],
        response: "路地裏で、植木鉢の間から昼寝中の猫を見つけたよ。あれはいい発見だったなあ！",
        responseVariants: ["喫茶店のプリンに、小さな探偵帽みたいなクリームが乗ってたんだ。思わず写真を撮っちゃった！"],
        reveals: [],
        smallTalkFollowUp: true,
      },
    ],
    composition: {
      scenarios: [
        {
          id: "student-long-series-report",
          selections: {
            purpose: "purpose_report",
            target: "target_jp_students",
            period: "period_20",
            statistic: "stat_series",
          },
        },
        {
          id: "graduate-recent-comparison-budget",
          selections: {
            purpose: "purpose_budget",
            target: "target_graduates",
            period: "period_5",
            statistic: "stat_compare",
          },
        },
        {
          id: "women-researchers-field-breakdown-article",
          selections: {
            purpose: "purpose_article",
            target: "target_women_researchers",
            period: "period_10",
            statistic: "stat_breakdown",
          },
        },
      ],
      dimensions: {
        purpose: [
          {
            optionId: "purpose_report",
            partialOptionId: "purpose_research",
            values: {
              statisticPurposeFact: "授業のレポート作成",
              statisticUseReply: "授業のレポートに使うんだ。",
              statisticUseReplyAlt: "大学の課題で、人数の変化を説明するよ。",
            },
          },
          {
            optionId: "purpose_budget",
            partialOptionId: "purpose_research",
            values: {
              statisticPurposeFact: "進路支援の予算資料作成",
              statisticUseReply: "進路支援に使う予算資料を作ってるんだ。",
              statisticUseReplyAlt: "支援事業の予算を考える資料に使うよ。",
            },
          },
          {
            optionId: "purpose_article",
            partialOptionId: "purpose_research",
            values: {
              statisticPurposeFact: "大学広報の記事作成",
              statisticUseReply: "大学広報で、女性研究者を紹介する記事を作るんだ。",
              statisticUseReplyAlt: "研究者の多様性を扱う大学広報の記事に使うよ。",
            },
          },
        ],
        target: [
          {
            optionId: "target_jp_students",
            partialOptionId: "target_people",
            values: {
              statisticTargetFact: "日本の大学生数",
              statisticTargetPhrase: "大学生の数",
              targetReply: "大学院生や高校生じゃなくて、大学生の人数だよ。",
              targetReplyAlt: "対象は学部の大学生だけ。",
              statisticGoalFact: "大学生数の増減",
              statisticGoalReply: "大学生の数が以前より増えたか減ったかを示したいんだ。",
              statisticGoalReplyAlt: "大学生数の長期的な増減を説明したいんだ。",
            },
          },
          {
            optionId: "target_graduates",
            partialOptionId: "target_people",
            values: {
              statisticTargetFact: "日本の大学卒業者数",
              statisticTargetPhrase: "大学卒業者の数",
              targetReply: "在学生じゃなくて、大学を卒業した人数だよ。",
              targetReplyAlt: "大学院修了者じゃなくて、大学の卒業者数を探してるんだ。",
              statisticGoalFact: "大学卒業者数の増減",
              statisticGoalReply: "大学卒業者の数が最近どう変わったかを比較したいんだ。",
              statisticGoalReplyAlt: "卒業者数の増減を予算資料で説明するためだよ。",
            },
          },
          {
            optionId: "target_women_researchers",
            partialOptionId: "target_people",
            values: {
              statisticTargetFact: "日本の大学に所属する女性研究者数",
              statisticTargetPhrase: "大学に所属する女性研究者の数",
              targetReply: "学生じゃなくて、日本の大学に所属する女性研究者だよ。",
              targetReplyAlt: "大学で研究に携わる女性を対象にした数字を探してるんだ。",
              statisticGoalFact: "女性研究者の分野別構成",
              statisticGoalReply: "女性研究者がどの研究分野に多いか、内訳を示したいんだ。",
              statisticGoalReplyAlt: "総数の増減より、分野ごとの人数の違いを説明したいんだ。",
            },
          },
        ],
        period: [
          {
            optionId: "period_20",
            partialOptionId: "period_multiple",
            values: {
              statisticPeriodFact: "直近約20年間",
              yearReply: "1年だけじゃなくて、20年ほど前から現在までを見たいんだ。",
              yearReplyAlt: "直近約20年について、複数年の数字が必要なんだ。",
              spanReply: "直近20年くらいが、課題の範囲にちょうどよさそう。",
              spanReplyAlt: "およそ20年前から現在までを比較するつもりだよ。",
            },
          },
          {
            optionId: "period_5",
            partialOptionId: "period_multiple",
            values: {
              statisticPeriodFact: "直近約5年間",
              yearReply: "1年分じゃなくて、最近5年ほどを比べたいんだ。",
              yearReplyAlt: "直近約5年について、複数年の数字が必要なんだ。",
              spanReply: "まずは直近5年ほどを比較できれば十分だよ。",
              spanReplyAlt: "長期じゃなくて、最近5年間を見たいんだ。",
            },
          },
          {
            optionId: "period_10",
            partialOptionId: "period_multiple",
            values: {
              statisticPeriodFact: "直近約10年間",
              yearReply: "直近10年ほどの数字を見たいんだ。1年分だけじゃ足りないよ。",
              yearReplyAlt: "およそ10年前から現在までの資料が必要なんだ。",
              spanReply: "広報記事では、直近10年ほどを扱う予定だよ。",
              spanReplyAlt: "長すぎないよう、最近10年間に絞りたいんだ。",
            },
          },
        ],
        statistic: [
          {
            optionId: "stat_series",
            partialOptionId: "stat_general",
            values: {
              statisticNeedFact: "各年の数値を追える時系列統計",
              compareReply: "うん。毎年の数字を並べて変化を比較したいんだ。",
              compareReplyAlt: "最新値だけじゃなくて、年ごとの推移が必要なんだ。",
              seriesReply: "うん。途中の動きも分かるよう、毎年の数値を使いたいな。",
              seriesReplyAlt: "年ごとの推移をグラフにしたいんだ。",
            },
          },
          {
            optionId: "stat_compare",
            partialOptionId: "stat_general",
            values: {
              statisticNeedFact: "代表的な複数年を比較できる統計",
              compareReply: "うん。いくつかの年を並べて違いを比較したいんだ。",
              compareReplyAlt: "最新年だけじゃなくて、複数年を比べられる数字が必要なんだ。",
              seriesReply: "毎年じゃなくても、複数の年を比較できれば十分だよ。",
              seriesReplyAlt: "代表的な年をいくつか比べられる形を考えてるんだ。",
            },
          },
          {
            optionId: "stat_breakdown",
            partialOptionId: "stat_general",
            values: {
              statisticNeedFact: "研究分野別の内訳を比較できる統計",
              compareReply: "年ごとの総数より、同じ年の研究分野別の内訳を比べたいんだ。",
              compareReplyAlt: "複数年の総数じゃなくて、分野ごとの人数が分かる表が必要なんだ。",
              seriesReply: "毎年の推移より、研究分野別の内訳を同じ基準で比較したいんだ。",
              seriesReplyAlt: "年次グラフじゃなくて、分野ごとの人数を並べられる統計を探してるよ。",
            },
          },
        ],
      },
      opening: "日本の大学に関係する人数の変化を追ってるんだけど、どの統計表を見ればいいか迷ってて。司書さん、手を貸してもらえる？",
      facts: {
        no_single_year: "{statisticPeriodFact}の数字が必要",
        report: "{statisticPurposeFact}",
        university_students: "{statisticTargetFact}",
        japan_total: "日本全国",
        increase_decrease: "{statisticGoalFact}",
        comparison: "{statisticNeedFact}",
        twenty_years: "{statisticPeriodFact}",
        time_series: "{statisticNeedFact}",
      },
      questions: {
        q05_year: {
          responses: [
            { text: "{yearReply}", reveals: ["no_single_year", "twenty_years"] },
            { text: "{yearReplyAlt}", reveals: ["no_single_year", "twenty_years"] },
          ],
        },
        q05_use: {
          responses: [
            {
              text: "{statisticUseReply}",
              reveals: ["report"],
            },
            {
              text: "{statisticUseReplyAlt}",
              reveals: ["report"],
            },
          ],
        },
        q05_target: {
          text: "どの人の人数を調べたいですか？",
          responses: ["{targetReply}", "{targetReplyAlt}"],
        },
        q05_area: {
          responses: [
            "都道府県別じゃなくて、日本全国の合計だよ。",
            "地域別じゃなくて、全国値を探してるんだ。",
          ],
        },
        q05_explain: {
          responses: [
            {
              text: "{statisticGoalReply}",
              reveals: ["increase_decrease", "comparison", "university_students"],
            },
            {
              text: "{statisticGoalReplyAlt}",
              reveals: ["increase_decrease", "comparison", "university_students", "report"],
            },
          ],
        },
        q05_compare: {
          responses: [
            { text: "{compareReply}", reveals: ["comparison", "time_series"] },
            { text: "{compareReplyAlt}", reveals: ["comparison", "time_series"] },
          ],
        },
        q05_span: { responses: ["{spanReply}", "{spanReplyAlt}"] },
        q05_series: {
          responses: ["{seriesReply}", "{seriesReplyAlt}"],
        },
      },
      explanation:
        "必要な統計は、{statisticPurposeFact}のための{statisticTargetFact}です。期間は{statisticPeriodFact}、必要な形は「{statisticNeedFact}」でした。対象・地域・年次・比較方法を分けて確認すると、統計表を特定できます。",
    },
    deduction: {
      template: "{slot1}、{slot2}について、{slot3}の{slot4}。",
      slots: [
        {
          id: "purpose",
          label: "利用目的",
          requiresAll: ["report"],
          options: [
            { id: "purpose_report", text: "レポート作成のため", score: 1 },
            { id: "purpose_budget", text: "予算作成のため", score: 0 },
            { id: "purpose_article", text: "大学広報の記事作成のため", score: 0 },
            { id: "purpose_research", text: "大学に関する資料作成のため", score: 0.5 },
          ],
        },
        {
          id: "target",
          label: "対象",
          requiresAll: ["university_students"],
          options: [
            { id: "target_jp_students", text: "日本の大学生数", score: 1 },
            { id: "target_graduates", text: "日本の大学卒業者数", score: 0 },
            { id: "target_women_researchers", text: "大学に所属する女性研究者数", score: 0 },
            { id: "target_people", text: "大学に関係する人の数", score: 0.5 },
          ],
        },
        {
          id: "period",
          label: "期間",
          requiresAll: ["twenty_years"],
          partialRequiresAny: ["no_single_year", "increase_decrease", "comparison"],
          options: [
            { id: "period_20", text: "直近約20年間", score: 1 },
            { id: "period_5", text: "直近約5年間", score: 0 },
            { id: "period_10", text: "直近約10年間", score: 0 },
            { id: "period_multiple", text: "複数年", score: 0.5 },
          ],
        },
        {
          id: "statistic",
          label: "必要な統計",
          requiresAll: ["time_series"],
          partialRequiresAny: ["increase_decrease", "comparison"],
          options: [
            { id: "stat_series", text: "各年の数値で推移を追える統計を探している", score: 1 },
            { id: "stat_compare", text: "代表的な複数年を比べられる統計を探している", score: 0 },
            { id: "stat_breakdown", text: "研究分野別の内訳を比較できる統計を探している", score: 0 },
            { id: "stat_general", text: "条件に合う人数統計を探している", score: 0.5 },
          ],
        },
      ],
    },
    correctSentence:
      "レポート作成のため、日本の大学生数について、直近約20年間の各年の数値で推移を追える統計を探している。",
    explanation:
      "最初は単年度の人数を求めているように見えましたが、必要なのは約20年間の変化を示せる時系列統計でした。数字の用途と比較の軸を確認すると、必要な統計表の形が定まります。",
    advice:
      "統計の質問では、対象・地域・年次に加え、「単年値か変化か」を必ず確認すると探しやすくなります。",
  },
  ...createAdditionalCases(GAME_CONFIG.maxQuestions),
  ...createExtraCases(GAME_CONFIG.maxQuestions),
];

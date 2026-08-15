import { EXTRA_CASE_02_SCENARIO_B } from "./extra-case-02-scenario-b.js?v=20260816-fiction1";

export const EXTRA_CASE_02 = {
  id: "extra02",
  number: "EX2",
  title: "APCを払ったほうがいい？",
  cardOpening:
    "論文がアクセプトされたんですが、オープンアクセスにするならAPCを払ったほうがいいんでしょうか？",
  category: "EXTRA・オープンアクセス",
  difficulty: "INTERVIEW 02",
  maxQuestions: 10,
  replayVariation: { recentHistorySize: 1 },
  unlockAfter: ["extra01"],
  revealAfter: ["extra01"],
  unlockHint: "EX CASE 1をクリア",
  opening:
    "ちょっと相談していいですか？ 論文がアクセプトされたんですが、オープンアクセスにするならAPCを払ったほうがいいんでしょうか？ こういう制度、少し自信がなくて……。",
  presentation: {
    playerLabel: "司書さん",
    respondentLabel: "教授",
    respondentRole: "PROFESSOR",
    respondentInfoLabel: "教授から聞いた情報",
  },
  patron: {
    name: "教授",
    descriptor:
      "論文の出版手続きとオープンアクセス対応を整理したい物理学の教授",
    initials: "EX2",
    accent: "#9b7967",
    image: "./assets/characters/extra-prof-portrait.webp",
    messageSound: "message1",
    timeLimitLine:
      "すみません、そろそろ研究室に戻らないと。ここまでのお話で、私が本当に確認したかったことを整理していただけますか？",
    reactions: {
      high: {
        image: "./assets/characters/extra-prof-reaction-high-previous.webp",
        line:
          "ああ、そうです。知りたかったのは、APCの払い方ではなくて、即時OAに対応するためにAPCが必須なのか、ほかの方法も含めて考えられるのか、ということでした。",
      },
      medium: {
        image: "./assets/characters/extra-prof-reaction-medium-portrait.webp",
        line:
          "かなり整理できました。即時OAへの対応が目的、というところはそのとおりです。もう少し、なぜAPCの話になったのかまで整理できるとよさそうですね。",
      },
      low: {
        image: "./assets/characters/extra-prof-reaction-low-portrait.webp",
        line:
          "ありがとうございます。ただ、最初に私が『APC』と言ったことに、少し引っぱられているかもしれません。そもそも、何のためにOAを考え始めたのかから整理したほうがよさそうですね。",
      },
    },
  },
  facts: {
    accepted_stage: {
      label: "論文の段階",
      display: "査読を終えてアクセプトされ、出版手続きに入っている",
    },
    publisher_oa_offer: {
      label: "出版社からの案内",
      display: "APCを伴うオープンアクセスオプションを案内されている",
    },
    accepted_manuscript: {
      label: "手元の原稿",
      display: "査読後の著者最終稿が手元に残っている",
    },
    repository_awareness: {
      label: "別の公開方法",
      display: "所属大学の機関リポジトリも公開方法の候補になり得ると認識している",
    },
    policy_unchecked: {
      label: "未確認事項",
      display: "著者最終稿を今回の条件で公開できるかはまだ確認していない",
    },
    institution_notice: {
      label: "相談のきっかけ",
      display: "大学から即時OAに関する案内を受けた",
    },
    funding_target: {
      label: "研究費",
      display: "即時OAの対象となる科研費課題による成果論文",
    },
    compliance_goal: {
      label: "本来の目的",
      display: "論文の宣伝より、まず即時OA方針に適切に対応したい",
    },
    apc_amount: {
      label: "APC",
      display: "無視できない額だが、金額そのものが相談の中心ではない",
    },
    apc_budget: {
      label: "予算",
      display: "APCを支払える可能性はある",
    },
    apc_concern: {
      label: "一番の疑問",
      display: "即時OAに対応するためにAPCの支払いが必須なのか分からない",
    },
    hypothesis_confirmed: {
      label: "本当の質問",
      display: "APCが必須なのか、別の公開方法も含めて検討できるのか確認したい",
    },
    publication_deadline: {
      label: "回答期限",
      display: "出版社への回答期限は約1週間後",
    },
    data_scope: {
      label: "研究データ",
      display: "研究データも気になるが、今回まず確認したいのは論文",
    },
    coauthors: {
      label: "共著",
      display: "共著論文で、教授が出版手続きを担当している",
    },
    journal_reason: {
      label: "投稿先",
      display: "OAではなく研究分野との相性を重視して雑誌を選んだ",
    },
    smalltalk_followup: { label: "", display: "" },
  },
  questions: [
    {
      id: "q_ex2_stage",
      text: "論文は、今どの段階まで進んでいますか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "査読は終わって、先週アクセプトされました。今は出版社との出版手続きに入ったところです。",
      responseVariants: [
        "採択の連絡はもう来ています。まだ正式な出版前で、出版社から届いた手続きを確認しているところです。",
      ],
      reveals: ["accepted_stage"],
    },
    {
      id: "q_ex2_trigger",
      text: "そもそも、今回オープンアクセスを気にされたきっかけは何でしたか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "大学から、科研費の成果論文と即時OAについて案内が来たんです。それを見て、自分の論文も何か対応が必要なのかな、と。",
      responseVariants: [
        "大学から即時OAについてのお知らせが来たのがきっかけです。それまでは、今回の論文をOAにするかどうかは特に考えていませんでした。",
      ],
      reveals: ["institution_notice"],
    },
    {
      id: "q_ex2_publisher",
      text: "出版社からは、オープンアクセスについてどんな案内が来ていますか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "出版手続きの中にOAを選ぶ欄があって、選択するとAPCがかかると書いてあります。それで、これを選ぶ必要があるのかなと思ったんです。",
      responseVariants: [
        "出版社から、APCを払えば論文をOAにできるという案内が来ています。金額も書いてあったので、これが必要な手続きなのかと思いまして。",
      ],
      reveals: ["publisher_oa_offer"],
    },
    {
      id: "q_ex2_apc_amount",
      text: "APCは、どのくらいの金額なんですか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "かなり大きな額ですね。払えないわけではないですが、気軽に出せる金額ではありません。",
      responseVariants: [
        "それなりの金額です。ただ、安いか高いかより、本当にこの支払いが必要なのかがよく分からないんです。",
      ],
      reveals: ["apc_amount"],
      distractor: "plausible",
    },
    {
      id: "q_ex2_journal_reason",
      text: "今回、その雑誌を投稿先に選んだのは、オープンアクセスだからですか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "いえ。研究分野との相性や、その分野の研究者がよく読む雑誌だということを重視して選びました。OAについては投稿後に意識したくらいです。",
      responseVariants: [
        "OAを理由に選んだわけではありません。研究内容に合う雑誌だったからです。",
      ],
      reveals: ["journal_reason"],
      distractor: "plausible",
    },
    {
      id: "q_ex2_coauthors",
      text: "今回の論文は単著ですか？ 共著ですか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "共著です。私が責任著者なので出版手続きをしています。OAについても、まず私が整理してから共著者へ共有しようと思っています。",
      responseVariants: [
        "何人か共著者がいます。出版手続きは私が担当しています。",
      ],
      reveals: ["coauthors"],
      distractor: "plausible",
    },
    {
      id: "q_ex2_purpose",
      text: "先生が今回オープンアクセスにしたい一番の理由は、どんなことでしょう？",
      requiresAll: ["institution_notice"],
      requiresAny: [],
      response:
        "まずは大学から案内された即時OAに、きちんと対応しておきたいということですね。もちろん読んでもらえるのはうれしいですが、それが今回のきっかけではありません。",
      responseVariants: [
        "論文を広く宣伝したいというより、必要なOA対応を間違えずに済ませたい、というのが一番近いです。",
      ],
      reveals: ["compliance_goal"],
    },
    {
      id: "q_ex2_funding",
      text: "今回の論文は、どの研究費による成果か確認されていますか？",
      requiresAll: [],
      requiresAny: ["institution_notice", "compliance_goal"],
      response:
        "はい。確認したところ、即時OAの対象となる科研費課題の成果として出した論文です。",
      responseVariants: [
        "研究課題を確認しました。この論文は、今回の即時OAの対象になる科研費による成果です。",
      ],
      reveals: ["funding_target"],
    },
    {
      id: "q_ex2_budget",
      text: "APCを支払うとしたら、使える研究費はありそうですか？",
      requiresAll: [],
      requiresAny: ["publisher_oa_offer", "apc_amount"],
      response:
        "支払える可能性はあります。でも、予算があるかどうかより、そもそも即時OAに対応するために払う必要があるのかを先に知りたいですね。",
      responseVariants: [
        "研究費の残額はあります。ただ、『払えるなら払う』ではなくて、本当に必要な支払いなのかを確認してから判断したいです。",
      ],
      reveals: ["apc_budget", "apc_concern"],
    },
    {
      id: "q_ex2_cost_concern",
      text: "APCについて、先生が一番気になっているのはどんなことでしょう？",
      requiresAll: ["publisher_oa_offer"],
      requiresAny: [],
      response:
        "必要なら払うこと自体は構わないんです。ただ、即時OAに対応するには、このAPCを払うことが必須なのかが分からなくて。",
      responseVariants: [
        "費用の額そのものより、『制度に対応するには出版社のOAを選ばないといけないのか』が分からないんです。",
      ],
      reveals: ["apc_concern"],
    },
    {
      id: "q_ex2_other_routes",
      text: "出版社のOAオプション以外の公開方法については、何かご存じですか？",
      requiresAll: ["compliance_goal"],
      requiresAny: ["publisher_oa_offer", "apc_concern"],
      response:
        "大学に機関リポジトリがあるのは知っています。ただ、今回のような論文でも使えるのか、即時OAの対応になるのかまでは分かっていません。",
      responseVariants: [
        "リポジトリという方法があるのは知っています。でも、出版社のOAを選ぶのとどう違うのか、今回それで対応できるのかは自信がありません。",
      ],
      reveals: ["repository_awareness"],
    },
    {
      id: "q_ex2_manuscript",
      text: "査読が終わったあとの著者最終稿は、手元に残っていますか？",
      requiresAll: ["accepted_stage"],
      requiresAny: [],
      response:
        "はい。査読コメントへの修正を全部反映して、アクセプトされたときのWordファイルは残っています。",
      responseVariants: [
        "あります。出版社で組版される前の、査読後の最終原稿なら保存してあります。",
      ],
      reveals: ["accepted_manuscript"],
    },
    {
      id: "q_ex2_policy",
      text: "その著者最終稿を機関リポジトリで公開できる条件か、出版社のポリシーは確認されていますか？",
      requiresAll: ["accepted_manuscript", "repository_awareness"],
      requiresAny: [],
      response:
        "そこまではまだ確認していません。雑誌によって、載せていい版や時期が違うんですよね？ そこは確認してもらったほうがよさそうですね。",
      responseVariants: [
        "いえ、まだです。リポジトリがあるからといって、どの論文でもすぐ公開できるわけではないですよね。その条件は確認していません。",
      ],
      reveals: ["policy_unchecked"],
    },
    {
      id: "q_ex2_hypothesis",
      text:
        "確認ですが、出版社でOAにすること自体が目的ではなく、APCを払わなくても即時OA方針に対応できる方法があるなら、それも含めて検討したいということでしょうか？",
      requiresAll: [
        "compliance_goal",
        "publisher_oa_offer",
        "apc_concern",
        "repository_awareness",
      ],
      requiresAny: [],
      response:
        "はい、まさにそれです。出版社のOAにすること自体が目的ではないんです。必要な要件を満たせるなら、ほかの方法も含めて考えたいんです。",
      responseVariants: [
        "そうです。APCを払いたくない、というだけではなくて、即時OAに必要な対応の選択肢を確認して、そのうえで決めたいんです。",
      ],
      reveals: ["hypothesis_confirmed"],
    },
    {
      id: "q_ex2_deadline",
      text: "出版社への手続きは、いつ頃までに回答する必要がありますか？",
      requiresAll: ["accepted_stage"],
      requiresAny: [],
      response:
        "来週までです。今日中に決める必要はありませんが、それまでには整理しておきたいですね。",
      responseVariants: [
        "一週間ほど余裕があります。OAの選択も含めて、その頃までに出版社へ返事をすることになっています。",
      ],
      reveals: ["publication_deadline"],
      distractor: "plausible",
    },
    {
      id: "q_ex2_data",
      text: "論文だけでなく、研究データの公開についても今回確認したいですか？",
      requiresAll: [],
      requiresAny: ["institution_notice", "funding_target"],
      response:
        "データのことも案内には書いてあったので気になっています。ただ、今日はまず、この論文のOAをどう考えればいいのか整理したいです。",
      responseVariants: [
        "研究データについても別に確認したいことはあります。でも今いちばん困っているのは、アクセプトされたこの論文への対応ですね。",
      ],
      reveals: ["data_scope"],
      distractor: "plausible",
    },
    {
      id: "q_ex2_irrelevant",
      text: "ところで、論文がアクセプトされた日は何かお祝いしましたか？",
      requiresAll: [],
      requiresAny: [],
      response:
        "しましたよ。帰りに少し高いケーキを買いました。査読が長かったので、あの日くらいはいいかなと思って。……ふふ、OAとは全然関係ありませんね。",
      responseVariants: [
        "研究室のみんなとコーヒーを飲みました。大げさなお祝いではないですけど、やっぱり採択されるとうれしいですね。",
      ],
      reveals: ["smalltalk_followup"],
      distractor: "irrelevant",
      distractorTone: "cheerful",
    },
    {
      id: "q_ex2_smalltalk_followup",
      text: "それはお疲れさまでした。どんなケーキだったんですか？",
      requiresAll: ["smalltalk_followup"],
      requiresAny: [],
      response:
        "モンブランです。研究室の近くにおいしい店があるんです。……こうして話していると、もう一本くらい論文を書けそうな気がしてきました。",
      responseVariants: [
        "チョコレートケーキです。甘いものを食べると、査読コメントの記憶も少しやわらぎますね。",
      ],
      reveals: [],
      smallTalkFollowUp: true,
    },
  ],
  deduction: {
    template: "{slot1}について、{slot2}が、{slot3}ため、{slot4}。",
    slots: [
      {
        id: "target",
        label: "対象となる論文",
        requiresAll: ["funding_target"],
        partialRequiresAny: ["institution_notice"],
        options: [
          {
            id: "target_immediate_oa",
            text: "即時OAの対象となる科研費の成果論文",
            score: 1,
          },
          {
            id: "target_funded",
            text: "科研費による研究成果の論文",
            score: 0.5,
          },
          {
            id: "target_all_future",
            text: "教授が今後発表するすべての論文",
            score: 0,
          },
          {
            id: "target_oa_journal",
            text: "オープンアクセス誌へ投稿する予定の論文",
            score: 0,
          },
        ],
      },
      {
        id: "purpose",
        label: "何のために",
        requiresAll: ["compliance_goal"],
        options: [
          {
            id: "purpose_compliance",
            text: "即時OA方針に対応したい",
            score: 1,
          },
          {
            id: "purpose_oa",
            text: "論文をオープンアクセスにしたい",
            score: 0.5,
          },
          {
            id: "purpose_visibility",
            text: "より多くの研究者に論文を読んでもらいたい",
            score: 0,
          },
          {
            id: "purpose_citation",
            text: "論文の被引用数を増やしたい",
            score: 0,
          },
        ],
      },
      {
        id: "situation",
        label: "現在の状況",
        requiresAll: ["publisher_oa_offer"],
        partialRequiresAll: ["accepted_stage"],
        options: [
          {
            id: "situation_apc_offer",
            text: "出版社からAPCを伴うOAオプションを案内されている",
            score: 1,
          },
          {
            id: "situation_accepted",
            text: "アクセプト後の出版手続きに入っている",
            score: 0.5,
          },
          {
            id: "situation_repository",
            text: "すでに機関リポジトリで論文を公開している",
            score: 0,
          },
          {
            id: "situation_select_journal",
            text: "これから論文の投稿先を選ぼうとしている",
            score: 0,
          },
        ],
      },
      {
        id: "need",
        label: "本当に確認したいこと",
        requiresAll: ["hypothesis_confirmed"],
        partialRequiresAll: ["apc_concern", "repository_awareness"],
        options: [
          {
            id: "need_alternatives",
            text:
              "APCが必須なのか、機関リポジトリ等の別の方法でも対応できるのか確認したい",
            score: 1,
          },
          {
            id: "need_oa_method",
            text: "どの方法でオープンアクセスにすればよいか確認したい",
            score: 0.5,
          },
          {
            id: "need_apc_budget",
            text: "APCをどの予算から支払えばよいか確認したい",
            score: 0,
          },
          {
            id: "need_cheaper_journal",
            text: "より安いAPCで出版できる雑誌を探したい",
            score: 0,
          },
        ],
      },
    ],
  },
  correctSentence:
    "即時OAの対象となる科研費の成果論文について、即時OA方針に対応したいが、出版社からAPCを伴うOAオプションを案内されているため、APCが必須なのか、機関リポジトリ等の別の方法でも対応できるのか確認したい。",
  explanation:
    "教授は最初、「APCを払ったほうがいいか」と尋ねていました。しかし、APCの金額や支払える予算だけを確認しても、本当の質問にはたどり着きません。話を聞くと、相談のきっかけは大学からの即時OAに関する案内で、対象となる科研費の成果論文について適切に対応したいことが分かりました。一方、出版社からはAPCを伴うOAオプションが案内されており、教授はそれを選ぶことが必須なのか迷っていました。機関リポジトリなど別の公開方法も考えられますが、実際に利用できるかは出版社のポリシーや所属機関の運用等を確認する必要があります。最後に理解した内容を教授へ返して確認することで、「APCを払うべきか」という表面上の質問から、本当に確認したかったことが言葉になりました。本ケースは大学図書館で想定される相談をもとに構成したフィクションであり、実際の対応条件は個別の状況によって異なります。",
  advice:
    "具体的な手段を尋ねられたときほど、その手段をすぐ答えにしないことが大切です。「なぜそうしようとしているのか」を聞き、集めた情報から理解した質問をいったん利用者へ返して確認すると、まだ言葉になっていなかった本当の質問が見えてくることがあります。",
  variants: [
    {
      id: "oa-options-after-scope-check",
      scenarioData: EXTRA_CASE_02_SCENARIO_B,
    },
  ],
};

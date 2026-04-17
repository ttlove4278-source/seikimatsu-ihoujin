/**
 * 视觉小说剧本
 * 每一幕 = 一系列 node
 * node 类型：
 *   { bg, filter, place, placeEn, time }            — 场景切换
 *   { chapter, title, sub, date }                    — 章节卡
 *   { char, chars:[], speaker, text, mood }          — 对话
 *   { narrator, text }                               — 旁白
 *   { think, text }                                  — 心理
 *   { fullscreen, text, sub }                        — 全屏文字
 *   { blackout, duration }                           — 黑屏
 *   { choice: [{text, hint, goto}] }                 — 选择
 *   { battle: 'id' }                                 — 进入战斗
 *   { flag: 'key', value }                           — 设置标记
 *   { goto: 'label' } / { label: 'x' }               — 跳转/标签
 *   { end, title, text }                             — 结束
 */
const CHAPTERS = {
  ch1: {
    id: 'ch1',
    num: 'CHAPTER · 01',
    title: '異郷人・覚醒',
    sub: 'The Stranger Awakens',
    date: '1999 / 07 / 13 — TUESDAY',
    desc: '堤防にて、第327回目の生存確認。——ラジオはカミュの誕生日特集を流していた。',
    script: [
      { chapter: 'CHAPTER · 01', title: '異郷人・覚醒', sub: 'The Stranger Awakens', date: '1999 / 07 / 13 · 櫂町堤防' },
      { bg: 'bg-riverside bg-cicada-deco', filter: 'dusk', place: '櫂町 · 堤防', placeEn: 'KAICHŌ EMBANKMENT', time: '17:42' },
      { narrator: true, text: '蝉が鳴いている。' },
      { narrator: true, text: 'アスファルトが歪んでいる。遠くで、誰かの自動販売機が、コインを飲み込む音を立てた。' },
      { narrator: true, text: '—— 平成十一年、七月十三日。火曜日。' },
      { char: 'haku', speaker: '夏目 珀', text: '……327回目。', mood: 'calm' },
      { think: true, text: '（まだ、生きている。）' },
      { char: 'haku', speaker: '夏目 珀', text: '生きてるっていうのは、別に、意味があるわけじゃない。ただ、石がまだ山のふもとにあるだけだ。' },
      { narrator: true, text: 'ラジオはカミュの誕生日特集を流していた。—— 「生きるに値するかどうか。それが哲学の根本問題だ」。' },
      { fullscreen: true, text: '—— 我々はシーシュポスが幸福であると想像しなければならない。', sub: 'A. Camus' },
      { narrator: true, text: 'その瞬間、瞳孔の奥で、何かが署名した。' },
      { narrator: true, text: '世界が、僕の主張を、一度だけ受け入れた。' },
      { char: 'haku', speaker: '夏目 珀', text: '……これが、哲学症か。', mood: 'quiet' },
      { think: true, text: '（妹が死んでから、ちょうど五年目の夏だった。）' },

      { bg: 'bg-library', filter: 'night', place: '櫂町立図書館', placeEn: 'KAICHŌ PUBLIC LIBRARY', time: '20:10' },
      { narrator: true, text: '—— 三日後。' },
      { narrator: true, text: '図書館の閉館十分前。新刊コーナーの端で、一人の少女が、同じページを三回読み返していた。' },
      { char: 'hikaru', speaker: '御厨 光', text: '……また、あなた？' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '御厨さん。クラスの。' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: '珀くん、カミュばかり読んでるね。' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '……他のも読むよ。読むけど。戻ってくる。' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: 'ねえ。' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: '—— 世界が投影だって、考えたことある？' },
      { think: true, text: '（その瞳が、光った。）' },
      { narrator: true, text: '瞳孔の奥に、銀色の文字。プラトンの筆跡。' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '……君も。' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: 'うん。六月二十八日。私、あと四十二日なんだって。' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '……。' },

      { choice: [
        { text: '「君は、それを受け入れているのか？」', hint: '—— 距離を保つ', goto: 'ch1_a' },
        { text: '「……そっか。じゃあ、明日も会えるかな。」', hint: '—— そばに居る', goto: 'ch1_b' }
      ]},

      { label: 'ch1_a' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '君は、それを受け入れているのか？' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: '……受け入れてる、というか。見えすぎて、人と話すのが難しいの。' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: '私が「机」って言うとき、頭の中にあるのは机の理念で。でも、相手に届くのは、日常の机。' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: 'ずっと、翻訳できないの。' },
      { flag: 'route', value: 'distant' },
      { goto: 'ch1_merge' },

      { label: 'ch1_b' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '……そっか。じゃあ、明日も会えるかな。' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: '……うん。生きてたら。' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '生きてたら。' },
      { think: true, text: '（—— 妙な、約束だった。）' },
      { flag: 'route', value: 'close' },
      { goto: 'ch1_merge' },

      { label: 'ch1_merge' },
      { bg: 'bg-street bg-moon-deco', filter: 'night', place: '旧港・倉庫街', placeEn: 'OLD HARBOR WAREHOUSES', time: '22:30' },
      { narrator: true, text: '—— その夜。' },
      { narrator: true, text: 'ベンサム系論証者の暴走事件。九課の動員。そして、夏目珀の初めての「発動」。' },
      { char: '??', speaker: '???', text: '「最大多数の最大幸福のために——お前ら全員、ここで死んでくれ。」' },
      { battle: 'b1_bentham' },

      { bg: 'bg-riverside', filter: 'dawn', place: '櫂町 · 堤防', placeEn: 'KAICHŌ EMBANKMENT', time: '05:30' },
      { narrator: true, text: '—— 夜明け前。' },
      { char: 'toya', chars: ['haku','toya'], speaker: '久我 凍夜', text: '夏目 珀。厚生省第九課、久我だ。' },
      { char: 'toya', chars: ['haku','toya'], speaker: '久我 凍夜', text: '規則だ。協力者として、登録する。拒否権は、ない。' },
      { char: 'haku', chars: ['haku','toya'], speaker: '夏目 珀', text: '……はい。' },
      { char: 'toya', chars: ['haku','toya'], speaker: '久我 凍夜', text: '—— 分かってくれとは言わん。' },
      { char: 'haku', chars: ['haku','toya'], speaker: '夏目 珀', text: 'カミュ系も、分かってくれとは言いません。' },
      { narrator: true, text: '久我の口の端が、ほんの少しだけ、動いた気がした。' },

      { fullscreen: true, text: '—— 明日、また生きていたら。', sub: 'CHAPTER 01 · END' },
      { end: 'ch1' }
    ]
  },

  ch2: {
    id: 'ch2',
    num: 'CHAPTER · 02',
    title: '洞窟と太陽',
    sub: 'The Cave and the Sun',
    date: '1999 / 08 / 09 — MONDAY',
    desc: '御厨光の予後四十二日を超えて。——「明日見える」と約束した少女の、最後の選択。',
    script: [
      { chapter: 'CHAPTER · 02', title: '洞窟と太陽', sub: 'The Cave and the Sun', date: '1999 / 08 / 09 · 夏の四十三日目' },
      { bg: 'bg-classroom', filter: 'dusk', place: '櫂町高校 · 二年三組', placeEn: 'KAICHŌ HS · 2-3', time: '16:20' },
      { narrator: true, text: '—— 予後は、四十二日だった。' },
      { narrator: true, text: '今日は、四十三日目。' },
      { char: 'hikaru', speaker: '御厨 光', text: '……まだ、生きてる。' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '生きてる。' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: '珀くんのせい、かも。' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '僕のせい？' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: '九課の人が言ってた。「他者抑制」って。誰かに「人間」として見られてると、結晶化が遅くなるんだって。' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: '珀くん、私のこと、論証者じゃなくて、御厨光として見てる。だから、遅いんだって。' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '……。' },
      { think: true, text: '（なんて返せばいいのか、分からなかった。）' },

      { bg: 'bg-street', filter: 'night', place: '旧港・波止場', placeEn: 'OLD HARBOR · PIER', time: '22:00' },
      { narrator: true, text: '—— ボルドー会・日本支部。' },
      { narrator: true, text: '「哲学症は病ではない。進化だ」と叫ぶ集団。御厨光は、そこにいた。' },
      { narrator: true, text: '柏拉図系の理論結晶の前に、立っていた。' },
      { char: 'hikaru', speaker: '御厨 光', text: '……これを読めば、全部、見える。' },
      { char: 'hikaru', speaker: '御厨 光', text: '洞窟の外が、本当に見える。' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '御厨さん。' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: '珀くん、どうしてここに。' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '……。明日、会う約束だったから。' },

      { choice: [
        { text: '「見なくていい。洞窟の中でも、君を見てる人がいる。」', hint: '—— 引き戻す', goto: 'ch2_pull' },
        { text: '「……見たいのなら、見ろ。僕は、止めない。」', hint: '—— 尊重する', goto: 'ch2_let' }
      ]},

      { label: 'ch2_pull' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '見なくていい。洞窟の中でも、君を見てる人がいる。' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '—— 僕が、いる。' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: '……珀くん。' },
      { flag: 'route_ch2', value: 'pull' },
      { goto: 'ch2_merge' },

      { label: 'ch2_let' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '……見たいのなら、見ろ。僕は、止めない。' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: 'それ、カミュっぽい言い方ね。' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: 'でも——あなたが止めないってことは、ここで待っていてくれる、ってことでもある。' },
      { flag: 'route_ch2', value: 'let' },
      { goto: 'ch2_merge' },

      { label: 'ch2_merge' },
      { narrator: true, text: '—— そして、組織の男たちが現れた。' },
      { battle: 'b2_bordeaux' },

      { bg: 'bg-harbor', filter: 'dawn', place: '旧港・梅の木の下', placeEn: 'OLD HARBOR · UNDER THE PLUM TREE', time: '05:50' },
      { narrator: true, text: '—— 戦いの後。' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: '珀くん、海に行ったことある？' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '……別府に、一度。妹と。' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: 'じゃあ、海に行ってから、石を推してね。' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '……うん。' },
      { fullscreen: true, text: '—— 洞窟の中でも、太陽を想像することはできる。', sub: 'CHAPTER 02 · END' },
      { end: 'ch2' }
    ]
  },

  ch3: {
    id: 'ch3',
    num: 'CHAPTER · 03',
    title: '超人・綱の上で',
    sub: 'The Overman on the Rope',
    date: '1999 / 10 / 22 — FRIDAY',
    desc: '生徒会長・高城黎。父の自殺、三年前の冬、開かれなかった扉。——綱は、まだ、切れていない。',
    script: [
      { chapter: 'CHAPTER · 03', title: '超人・綱の上で', sub: 'The Overman on the Rope', date: '1999 / 10 / 22 · 秋深し' },
      { bg: 'bg-rooftop', filter: 'dusk', place: '櫂町高校 · 屋上', placeEn: 'KAICHŌ HS · ROOFTOP', time: '17:10' },
      { char: 'rei', speaker: '高城 黎', text: '夏目珀、二年三組。お前、死にたいか？' },
      { char: 'haku', chars: ['haku','rei'], speaker: '夏目 珀', text: '……いえ。' },
      { char: 'rei', chars: ['haku','rei'], speaker: '高城 黎', text: 'だが、生きたくもない。違うか。' },
      { char: 'haku', chars: ['haku','rei'], speaker: '夏目 珀', text: '……。' },
      { char: 'rei', chars: ['haku','rei'], speaker: '高城 黎', text: 'ツァラトゥストラは言った。「人間は、動物と超人の間に張られた綱である」。' },
      { char: 'rei', chars: ['haku','rei'], speaker: '高城 黎', text: 'お前は、綱の上で、動かない。' },
      { char: 'haku', chars: ['haku','rei'], speaker: '夏目 珀', text: '動けない、の間違いかも。' },

      { bg: 'bg-cemetery', filter: 'night', place: '市営墓地 · 高城家', placeEn: 'MUNICIPAL CEMETERY', time: '21:40' },
      { narrator: true, text: '—— 三年前の秋、高城の父は海に身を投げた。' },
      { narrator: true, text: '遺したのは、扉絵に「憎むは易し、愛すは難し」と書かれた、『ツァラトゥストラかく語りき』。' },
      { char: 'rei', speaker: '高城 黎', text: '……父は、なぜ、僕を置いて死んだ？' },
      { char: 'rei', speaker: '高城 黎', text: 'この本を遺して、何を伝えたかった？' },
      { char: 'rei', speaker: '高城 黎', text: '超人になれと？神を殺せと？' },
      { char: 'haku', chars: ['haku','rei'], speaker: '夏目 珀', text: '……高城。' },
      { char: 'haku', chars: ['haku','rei'], speaker: '夏目 珀', text: 'それは、教えじゃない。謝罪だ。' },
      { char: 'rei', chars: ['haku','rei'], speaker: '高城 黎', text: '……何？' },
      { char: 'haku', chars: ['haku','rei'], speaker: '夏目 珀', text: '「憎むは易し、愛すは難し」—— それは、お前に向けた言葉じゃない。' },
      { char: 'haku', chars: ['haku','rei'], speaker: '夏目 珀', text: 'お父さんが、自分に言い聞かせようとして、失敗した言葉だ。' },
      { char: 'haku', chars: ['haku','rei'], speaker: '夏目 珀', text: 'お父さんは、お前に憎んでほしくなかった。愛してほしかったんだ。—— けど、自分にはそれを教える資格がないと思って、死んだ。' },
      { char: 'rei', chars: ['haku','rei'], speaker: '高城 黎', text: '……。' },

      { narrator: true, text: '—— そして、ボルドー会の使者が現れた。高城黎を、取り込むために。' },
      { char: '??', speaker: '使者', text: '「高城黎よ。父の遺志を継げ。神はすでに死んだ。今こそ、超人になる時だ。」' },
      { char: 'rei', speaker: '高城 黎', text: '……黙れ。' },
      { battle: 'b3_rei' },

      { bg: 'bg-cemetery', filter: 'dawn', place: '市営墓地', placeEn: 'MUNICIPAL CEMETERY', time: '05:00' },
      { char: 'rei', speaker: '高城 黎', text: '……父さん。' },
      { char: 'rei', speaker: '高城 黎', text: '僕は、あんたを、もう憎まない。' },
      { narrator: true, text: '高城黎は、父の墓の前に、『ツァラトゥストラ』を置いた。' },
      { narrator: true, text: '—— 綱の上で、一歩、前に進んだ。' },
      { fullscreen: true, text: '—— 愛すは、難し。けれど、僕は、試みる。', sub: 'CHAPTER 03 · END' },
      { end: 'ch3' }
    ]
  },

  ch4: {
    id: 'ch4',
    num: 'CHAPTER · 04',
    title: '石を推す者',
    sub: 'The One Who Pushes the Stone',
    date: '1999 / 12 / 31 — FRIDAY',
    desc: '世紀末、最後の夜。床下の箱、未読の手紙、そして——第328回目の目覚め。',
    script: [
      { chapter: 'FINAL CHAPTER', title: '石を推す者', sub: 'The One Who Pushes the Stone', date: '1999 / 12 / 31 · 世紀末' },
      { bg: 'bg-classroom', filter: 'dusk', place: '夏目家 · 珀の部屋', placeEn: 'NATSUME HOUSE · HAKU\'S ROOM', time: '15:00' },
      { narrator: true, text: '—— 1999年、12月31日。' },
      { narrator: true, text: '夏目珀は、五年ぶりに、ベッドの下の段ボール箱を、開けた。' },
      { narrator: true, text: '深雪の小学生の赤いランドセル。プール写真。飲み終わったポカリの空瓶。そして——岩波文庫、『シーシュポスの神話』、1951年初版。' },
      { char: 'haku', speaker: '夏目 珀', text: '……。' },
      { narrator: true, text: '四十三ページと四十四ページの間に、円い水のシミのある、小さな便箋が挟まっていた。' },
      { fullscreen: true, text: '「兄さん、額でもいいから、頰でもいいから、キスしてほしいな。そしたら、夏の後も、私のこと覚えていてくれるって、わかるから。」', sub: '1994 · 08 · 03 — みゆき' },
      { char: 'haku', speaker: '夏目 珀', text: '……。' },
      { think: true, text: '（五年、開かなかった。）' },
      { think: true, text: '（開いたら、もう、「明日」は来ない気がして。）' },
      { char: 'haku', speaker: '夏目 珀', text: '……ごめん。深雪。' },
      { char: 'haku', speaker: '夏目 珀', text: 'でも、もう——明日、石を推せる、気がする。' },

      { bg: 'bg-tunnel', filter: 'fever', place: '櫂町合同庁舎 · 地下五階', placeEn: 'KAICHŌ GOV. BLDG. · B5F', time: '23:20' },
      { narrator: true, text: '—— 同時刻。' },
      { narrator: true, text: '千年虫信徒の「進位」儀式が、始まろうとしていた。' },
      { narrator: true, text: '九課、波止場会、論証者——総力戦。' },
      { char: 'toya', chars: ['haku','toya'], speaker: '久我 凍夜', text: '夏目。最後の仕事だ。' },
      { char: 'haku', chars: ['haku','toya'], speaker: '夏目 珀', text: '……はい。' },
      { char: 'toya', chars: ['haku','toya'], speaker: '久我 凍夜', text: '—— 生きて帰れ。' },
      { char: 'haku', chars: ['haku','toya'], speaker: '夏目 珀', text: 'それは、規則ですか。' },
      { char: 'toya', chars: ['haku','toya'], speaker: '久我 凍夜', text: '……規則ではない。個人的な、願いだ。' },
      { think: true, text: '（久我さんが「個人的」と言った。—— 初めて、聞いた。）' },

      { bg: 'bg-abstract', filter: 'fever', place: '「永遠の現在」', placeEn: '"Eternal Present"', time: '23:58' },
      { char: '??', speaker: '教主', text: '「夏目珀よ。時間を、止めてやる。永遠の現在——そこに、お前の妹はいる。」' },
      { char: 'haku', speaker: '夏目 珀', text: '……。' },
      { char: '??', speaker: '教主', text: '「どうだ、来ないか。妹に会えるぞ。」' },

      { choice: [
        { text: '「行かない。深雪は、僕の記憶の中にいる。」', hint: '—— 前に進む', goto: 'ch4_no' },
        { text: '「……会いたい、けど。」', hint: '—— 揺らぐ', goto: 'ch4_waver' }
      ]},

      { label: 'ch4_waver' },
      { char: 'haku', speaker: '夏目 珀', text: '……会いたい、けど。' },
      { char: 'haku', speaker: '夏目 珀', text: 'でも、それは——永遠の現在じゃない。停止だ。' },
      { char: 'haku', speaker: '夏目 珀', text: '深雪は、止まっていてほしくないと思う。' },
      { goto: 'ch4_fight' },

      { label: 'ch4_no' },
      { char: 'haku', speaker: '夏目 珀', text: '行かない。深雪は、僕の記憶の中にいる。' },
      { char: 'haku', speaker: '夏目 珀', text: '永遠の現在に行ったら——忘れることすら、できなくなる。' },
      { char: 'haku', speaker: '夏目 珀', text: '僕は、忘れながら、覚えていたい。' },
      { goto: 'ch4_fight' },

      { label: 'ch4_fight' },
      { fullscreen: true, text: '—— 我々はシーシュポスが幸福であると想像しなければならない。', sub: '第 328 回 · A. Camus' },
      { battle: 'b4_final' },

      { bg: 'bg-riverside', filter: 'dawn', place: '櫂町 · 堤防', placeEn: 'KAICHŌ EMBANKMENT', time: '00:05 / 2000 · 01 · 01' },
      { narrator: true, text: '—— 2000年、1月1日。' },
      { narrator: true, text: '世界は、進位しなかった。ただ、新年の鐘が、鳴っただけだった。' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: '夏、終わったね。' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '……石は、まだ、山のふもとにある。' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '明日、また、推す。' },
      { char: 'hikaru', chars: ['hikaru','haku'], speaker: '御厨 光', text: '一緒に、推そっか。' },
      { char: 'haku', chars: ['hikaru','haku'], speaker: '夏目 珀', text: '……うん。' },
      { fullscreen: true, text: '—— 明日も、生きていたら。', sub: 'FIN. · 2000 · 01 · 01' },
      { end: 'ch4' }
    ]
  }
};

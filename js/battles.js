const BATTLES = {
  // 第一战：边沁系暴走者
  b1_bentham: {
    id: 'b1_bentham',
    name: 'ベンサム系暴走者',
    chapter: 1,
    bg: 'shadow',
    domain: null,
    hero: { name: '夏目 珀', sig: 'A. Camus', hp: 100, logos: 80, color: '#6a8caf' },
    enemy: {
      name: 'ベンサム系暴走者',
      sig: 'J. Bentham',
      hp: 90, logos: 50,
      color: '#4a3a55',
      lines: [
        '「最大多数の最大幸福——お前一人が犠牲になれば、皆が救われる！」',
        '「数えろ！快と苦を！お前の命など、係数一だ！」',
        '「功利！功利！功利こそ真理！」',
        '「犠牲の計算式だ——抵抗するな！」'
      ],
      attacks: [
        { name: '功利計算', dmg: [8, 14] },
        { name: '最大多数の圧力', dmg: [12, 18] }
      ]
    },
    propositions: [
      { text: '我々はシーシュポスが幸福であると想像しなければならない', sig: 'A. Camus', cost: 8, dmg: 22 },
      { text: '不条理は、それ自体、意味を持たない', sig: 'A. Camus', cost: 8, dmg: 16 }
    ],
    intro: '「最大多数の最大幸福のために——お前、死んでくれ。」',
    win: { title: '勝利', text: 'ベンサム系暴走者は、砂のように崩れ、小さな計算式の結晶を残した。—— 初めて、誰かを救った。', reward: { crystal: 'c_bentham', flag: 'met_toya' } },
    lose: { title: '敗北', text: '石は、また転がり落ちた。けれど、シーシュポスは、まだ、山のふもとにいる。' }
  },

  // 第二战：波尔多会使徒
  b2_bordeaux: {
    id: 'b2_bordeaux',
    name: 'ボルドー会・使徒',
    chapter: 2,
    bg: 'cavern',
    domain: 'cavern',
    hero: { name: '夏目 珀', sig: 'A. Camus', hp: 110, logos: 90, color: '#6a8caf' },
    enemy: {
      name: 'ボルドー会使徒「洞窟守」',
      sig: 'Platon(偽)',
      hp: 130, logos: 80,
      color: '#8b5a2e',
      lines: [
        '「洞窟の外を見せてやる。お前の見ているものは、影にすぎん！」',
        '「真理に、耐えられるか？夏目珀。」',
        '「光とは、痛みだ。」',
        '「御厨光も、じきに、こちら側に来る。」'
      ],
      attacks: [
        { name: '影の投影', dmg: [10, 16] },
        { name: '理念の灼光', dmg: [14, 22] }
      ]
    },
    propositions: [
      { text: '我々はシーシュポスが幸福であると想像しなければならない', sig: 'A. Camus', cost: 8, dmg: 24 },
      { text: '反抗こそが、人間を人間たらしめる', sig: 'A. Camus', cost: 12, dmg: 34 },
      { text: '不条理は、それ自体、意味を持たない', sig: 'A. Camus', cost: 8, dmg: 18 }
    ],
    intro: '「真理は、残酷だ。—— 夏目珀、お前に、耐えられるか？」',
    win: { title: '勝利', text: '使徒は倒れ、プラトンの偽結晶が砕けた。御厨光は、洞窟の中に戻ってきた。「……ただいま」。', reward: { crystal: 'c_plato', flag: 'saved_hikaru' } },
    lose: { title: '敗北', text: '洞窟の外は、眩しすぎる。—— 石は、また、落ちる。' }
  },

  // 第三战：高城黎 / ボルドー会の使者
  b3_rei: {
    id: 'b3_rei',
    name: 'ボルドー会·使者',
    chapter: 3,
    bg: 'arena',
    domain: 'arena',
    hero: { name: '夏目 珀', sig: 'A. Camus', hp: 120, logos: 100, color: '#6a8caf', ally: { name: '高城 黎', sig: 'F. Nietzsche', color: '#d4af37' } },
    enemy: {
      name: 'ボルドー会·使者',
      sig: 'F. Nietzsche(偽)',
      hp: 180, logos: 100,
      color: '#8b1a1a',
      lines: [
        '「高城黎！お前は、選ばれた者だ。来い、超人になれ！」',
        '「父の復讐を——神を殺した人間を、憎め！」',
        '「弱者の情けなど、捨てろ。」',
        '「夏目珀、お前のような弱者は、ここでは、無だ。」'
      ],
      attacks: [
        { name: '超人の叫び', dmg: [12, 20] },
        { name: '権力意志の圧', dmg: [16, 26] }
      ]
    },
    propositions: [
      { text: '反抗こそが、人間を人間たらしめる', sig: 'A. Camus', cost: 12, dmg: 28 },
      { text: '推す石は、罰である——と認めよう', sig: 'A. Camus（反転）', cost: 22, dmg: 50, reversal: true },
      { text: '我々はシーシュポスが幸福であると想像しなければならない', sig: 'A. Camus', cost: 8, dmg: 22 }
    ],
    intro: '「高城黎——お前の父、本当に、お前に超人になってほしかったと思うか？」',
    win: { title: '勝利', text: '使者は崩れた。高城黎は、父の墓に『ツァラトゥストラ』を置いた。「僕は、あんたを、もう憎まない」。', reward: { crystal: 'c_nietzsche', flag: 'rei_ally' } },
    lose: { title: '敗北', text: '綱の上で、—— まだ、誰も、渡りきれない。' }
  },

  // 最终战：千年虫教主
  b4_final: {
    id: 'b4_final',
    name: '千年虫教主「アウグスティヌス」',
    chapter: 4,
    bg: 'infinite',
    domain: null,
    hero: { name: '夏目 珀', sig: 'A. Camus / 第328', hp: 150, logos: 120, color: '#6a8caf' },
    enemy: {
      name: '千年虫教主「聖アウグスティヌス」',
      sig: 'Augustinus',
      hp: 280, logos: 150,
      color: '#2a1a3a',
      lines: [
        '「永遠の現在、それこそが救い。時間を、忘れよ。」',
        '「夏目珀、妹はここにいる——来るだけでいい。」',
        '「進位せよ。世紀末は、格式化の時だ。」',
        '「お前のシーシュポスは、もう、疲れただろう。休めよ。」',
        '「時間は、流れない。流れていると、お前が信じているだけだ。」',
        '「——意味は、過剰だ。終わらせよう。」'
      ],
      attacks: [
        { name: '永遠の静止', dmg: [18, 28] },
        { name: '意味の格式化', dmg: [22, 34] },
        { name: '時間崩壊', dmg: [25, 40] }
      ]
    },
    propositions: [
      { text: '我々はシーシュポスが幸福であると想像しなければならない', sig: 'A. Camus', cost: 8, dmg: 24 },
      { text: '反抗こそが、人間を人間たらしめる', sig: 'A. Camus', cost: 12, dmg: 30 },
      { text: '推す石は、罰である——と認めよう', sig: 'A. Camus（反転1）', cost: 22, dmg: 50, reversal: true },
      { text: 'それでも、明日、石を推す', sig: 'A. Camus（反転2）', cost: 35, dmg: 90, reversal: true, finisher: true }
    ],
    intro: '「夏目珀よ。時間を止めてやる。—— 妹に、会いたくないか？」',
    win: { title: '勝利', text: '世紀末は、進位しなかった。ただ、新年の鐘が、鳴っただけだった。—— 石は、まだ、山のふもとにある。明日、また、推す。', reward: { crystal: 'c_augustine', flag: 'end_game', ending: true } },
    lose: { title: '敗北', text: 'シーシュポスは、石とともに、永遠の現在に、消えた。' }
  }
};

/* ============ 主流程 ============ */
const MENU = {
  init() {
    document.querySelectorAll('[data-go]').forEach(btn => {
      btn.onclick = () => {
        const target = btn.dataset.go;
        if (target === 'prologue') SCENE.prologue();
        else if (target === 'characters') SCENE.characters();
        else if (target === 'codex') SCENE.codex();
        else if (target === 'battle') SCENE.battle();
      };
    });
  }
};

/* ============ 战斗系统 ============ */
const BATTLE = {
  state: null,

  start() {
    this.state = {
      heroHP: 100, heroLG: 80,
      enemyHP: 100, enemyLG: 60,
      turn: 0,
      reversals: 0,
      busy: false,
      ended: false
    };
    this.render();
  },

  render() {
    const wrap = document.createElement('div');
    wrap.className = 'battle-wrap';
    wrap.id = 'battle';
    wrap.innerHTML = `
      <div class="battle-noise"></div>
      <div class="battle-vignette"></div>

      <div class="hud">
        <div class="hud-panel">
          <div class="name">夏目 珀</div>
          <div class="signature">A. Camus / 第 <span id="death-count">327</span> 回</div>
          <div class="bar-label"><span>VITA</span><span id="h-hp-n">100</span></div>
          <div class="bar"><div class="fill" id="h-hp" style="width:100%"></div></div>
          <div class="bar-label"><span>LOGOS</span><span id="h-lg-n">80</span></div>
          <div class="bar logos"><div class="fill" id="h-lg" style="width:80%"></div></div>
        </div>
        <div class="hud-panel enemy-panel">
          <div class="name">千年虫信徒・使者</div>
          <div class="signature">Augustinus 系</div>
          <div class="bar-label"><span>VITA</span><span id="e-hp-n">100</span></div>
          <div class="bar"><div class="fill" id="e-hp" style="width:100%;background:linear-gradient(90deg,#e94f37,#8b1a1a)"></div></div>
          <div class="bar-label"><span>LOGOS</span><span id="e-lg-n">60</span></div>
          <div class="bar logos"><div class="fill" id="e-lg" style="width:60%"></div></div>
        </div>
      </div>

      <div class="battle-stage">
        <div class="fighter hero" id="fighter-hero"><div class="fighter-silh"></div></div>
        <div class="fighter enemy" id="fighter-enemy"><div class="fighter-silh"></div></div>
      </div>

      <div class="proposition" id="proposition"></div>
      <div class="signature-burst" id="sigburst"></div>
      <div class="logos-burst" id="logosburst"></div>

      <div class="action-panel">
        <div class="log-box" id="log-box">
          <span class="speaker">使者 —</span> やはり来たな、夏目珀。—— お前の妹を、覚えているぞ。
        </div>
        <div class="action-btns">
          <button class="act-btn" data-act="quote">
            引用<span class="sub">QUOTE / 1 赫</span>
          </button>
          <button class="act-btn" data-act="develop">
            命題展開<span class="sub">DEVELOP / 8 赫</span>
          </button>
          <button class="act-btn" data-act="reverse">
            辯證反轉<span class="sub">INVERSION / 20 赫</span>
          </button>
          <button class="act-btn" data-act="reset">
            死亡重置<span class="sub">RESET / VITA = 0 時</span>
          </button>
        </div>
      </div>

      <div class="prop-select" id="prop-select">
        <h3>—— 宣言せよ ——</h3>
        <button class="prop-option" data-prop="0">
          「我々はシーシュポスが幸福であると想像しなければならない。」
          <span class="sub">A. Camus / 存在主義 / 共鳴値 高</span>
        </button>
        <button class="prop-option" data-prop="1">
          「不条理は、それ自体、意味を持たない。」
          <span class="sub">A. Camus / 派生命題 / 共鳴値 中</span>
        </button>
        <button class="prop-option" data-prop="2">
          「反抗こそが、人間を人間たらしめる。」
          <span class="sub">A. Camus / 反転命題 / 共鳴値 極高</span>
        </button>
      </div>

      <div class="ending" id="ending">
        <h2 id="ending-title"></h2>
        <p id="ending-text"></p>
        <button onclick="BATTLE.exit()">—— 菜单に戻る ——</button>
      </div>
    `;
    document.body.appendChild(wrap);

    wrap.querySelectorAll('.act-btn').forEach(b => {
      b.onclick = () => this.act(b.dataset.act);
    });
    wrap.querySelectorAll('.prop-option').forEach(b => {
      b.onclick = () => this.developChoose(parseInt(b.dataset.prop));
    });
  },

  log(speaker, text) {
    const box = document.getElementById('log-box');
    box.innerHTML = `<span class="speaker">${speaker} —</span> ${text}`;
    box.style.opacity = 0;
    requestAnimationFrame(() => {
      box.style.transition = 'opacity 0.5s';
      box.style.opacity = 1;
    });
  },

  updateHUD() {
    const s = this.state;
    document.getElementById('h-hp').style.width = Math.max(0, s.heroHP) + '%';
    document.getElementById('h-lg').style.width = Math.max(0, s.heroLG) + '%';
    document.getElementById('e-hp').style.width = Math.max(0, s.enemyHP) + '%';
    document.getElementById('e-lg').style.width = Math.max(0, s.enemyLG) + '%';
    document.getElementById('h-hp-n').textContent = Math.max(0, s.heroHP);
    document.getElementById('h-lg-n').textContent = Math.max(0, s.heroLG);
    document.getElementById('e-hp-n').textContent = Math.max(0, s.enemyHP);
    document.getElementById('e-lg-n').textContent = Math.max(0, s.enemyLG);
  },

  showProposition(text, signature) {
    const p = document.getElementById('proposition');
    p.textContent = '「' + text + '」';
    p.classList.remove('active');
    void p.offsetWidth;
    p.classList.add('active');

    const sig = document.getElementById('sigburst');
    sig.textContent = signature;
    sig.classList.remove('show');
    void sig.offsetWidth;
    setTimeout(() => sig.classList.add('show'), 600);

    const b = document.getElementById('logosburst');
    b.classList.remove('fire');
    void b.offsetWidth;
    setTimeout(() => b.classList.add('fire'), 800);
  },

  playBgTone(freq = 440, duration = 0.3, type = 'sine') {
    try {
      const ctx = OP.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      OP.audioCtx = ctx;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + duration);
    } catch (e) {}
  },

  heroAttack() {
    document.getElementById('fighter-hero').classList.add('attack');
    setTimeout(() => {
      document.getElementById('fighter-hero').classList.remove('attack');
      document.getElementById('fighter-enemy').classList.add('hurt');
      setTimeout(() => document.getElementById('fighter-enemy').classList.remove('hurt'), 400);
    }, 250);
  },

  enemyAttack() {
    document.getElementById('fighter-enemy').classList.add('attack');
    setTimeout(() => {
      document.getElementById('fighter-enemy').classList.remove('attack');
      document.getElementById('fighter-hero').classList.add('hurt');
      setTimeout(() => document.getElementById('fighter-hero').classList.remove('hurt'), 400);
    }, 250);
  },

  act(type) {
    if (this.state.busy || this.state.ended) return;
    const s = this.state;

    if (type === 'quote') {
      if (s.heroLG < 1) { this.log('システム', 'LOGOS が足りない。'); return; }
      s.busy = true;
      s.heroLG -= 1;
      const dmg = 6 + Math.floor(Math.random() * 5);
      s.enemyHP -= dmg;
      this.heroAttack();
      this.playBgTone(660, 0.2);
      this.log('珀', `—— 引用。「凝視する深淵もまた」 / ${dmg} ダメージ。`);
      this.updateHUD();
      setTimeout(() => this.enemyTurn(), 1200);
    }

    else if (type === 'develop') {
      if (s.heroLG < 8) { this.log('システム', 'LOGOS が足りない。展開には 8 赫必要。'); return; }
      document.getElementById('prop-select').classList.add('show');
    }

    else if (type === 'reverse') {
      if (s.heroLG < 20) { this.log('システム', 'LOGOS が足りない。反転には 20 赫必要。'); return; }
      if (s.reversals >= 1) { this.log('システム', 'これ以上の反転は、自己を壊す。'); return; }
      s.busy = true;
      s.heroLG -= 20;
      s.reversals += 1;
      this.showProposition('推す石は、罰である——と認めよう', 'A. Camus');
      this.playBgTone(220, 1.2, 'sawtooth');
      setTimeout(() => this.playBgTone(330, 0.8, 'triangle'), 400);
      this.log('珀', '—— 辯證反轉。僕は、あの石が罰であったと、認める。');
      setTimeout(() => {
        const dmg = 42;
        s.enemyHP -= dmg;
        this.heroAttack();
        this.log('システム', `反転効果発動 —— ${dmg} ダメージ。代価：顔の記憶が一つ、消える。`);
        this.updateHUD();
        setTimeout(() => this.enemyTurn(), 1500);
      }, 1800);
    }

    else if (type === 'reset') {
      if (s.heroHP > 0) { this.log('システム', '死亡していない。リセット不可。'); return; }
      s.busy = true;
      s.heroHP = 70;
      this.showProposition('—— 我々はシーシュポスが幸福であると想像しなければならない', 'A. Camus');
      this.playBgTone(110, 2, 'sine');
      this.log('珀', '—— 328回目。目を開ける。蝉が、まだ鳴いている。');
      const cnt = document.getElementById('death-count');
      cnt.textContent = parseInt(cnt.textContent) + 1;
      this.updateHUD();
      setTimeout(() => { s.busy = false; }, 1800);
    }
  },

  developChoose(i) {
    document.getElementById('prop-select').classList.remove('show');
    const s = this.state;
    s.busy = true;
    s.heroLG -= 8;

    const props = [
      { text: '我々はシーシュポスが幸福であると想像しなければならない', sig: 'A. Camus', dmg: 18 },
      { text: '不条理は、それ自体、意味を持たない', sig: 'A. Camus', dmg: 14 },
      { text: '反抗こそが、人間を人間たらしめる', sig: 'A. Camus', dmg: 24 }
    ];
    const p = props[i];
    this.showProposition(p.text, p.sig);
    this.playBgTone(440, 0.6, 'triangle');
    setTimeout(() => this.playBgTone(660, 0.4, 'triangle'), 300);

    this.log('珀', `—— 命題展開。「${p.text}。」`);

    setTimeout(() => {
      s.enemyHP -= p.dmg;
      this.heroAttack();
      this.log('システム', `${p.dmg} ダメージ。敵の逻各斯が動揺している。`);
      this.updateHUD();
      setTimeout(() => this.enemyTurn(), 1400);
    }, 2000);
  },

  enemyTurn() {
    const s = this.state;
    if (s.enemyHP <= 0) return this.end('win');

    const dmg = 10 + Math.floor(Math.random() * 12);
    s.heroHP -= dmg;
    this.enemyAttack();
    this.playBgTone(150, 0.4, 'sawtooth');

    const lines = [
      '「時は進むのだ、異郷人よ。お前の妹はそれを知らなかった。」',
      '「意味なき進位 —— それこそが救いだ。」',
      '「聖アウグスティヌスは言った —— 永遠の現在を。」',
      '「推しても、推しても、石は落ちるのだ。」'
    ];
    this.log('使者', lines[Math.floor(Math.random() * lines.length)] + ` / ${dmg} ダメージ。`);
    this.updateHUD();

    if (s.heroHP <= 0) {
      setTimeout(() => {
        this.log('システム', '—— 心拍停止、確認。3 秒。');
        this.playBgTone(80, 2, 'sine');
      }, 800);
    }

    // 逐回合逻各斯小幅恢复
    setTimeout(() => {
      s.heroLG = Math.min(80, s.heroLG + 3);
      this.updateHUD();
      s.busy = false;
      s.turn++;
    }, 1200);
  },

  end(result) {
    this.state.ended = true;
    const e = document.getElementById('ending');
    const t = document.getElementById('ending-title');
    const p = document.getElementById('ending-text');

    if (result === 'win') {
      t.textContent = '勝利';
      p.innerHTML = '使者は砂のように崩れ、几何学の結晶を残した。<br>「—— 兄さん、明日、海に行こう？」<br>どこかで、妹の声がした気がした。';
    } else {
      t.textContent = '敗北';
      p.innerHTML = '石は、また転がり落ちた。<br>—— けれど、シーシュポスは、まだ、山のふもとにいる。';
    }
    e.classList.add('show');
    this.playBgTone(330, 2, 'sine');
  },

  exit() {
    const b = document.getElementById('battle');
    if (b) b.remove();
    document.getElementById('menu').classList.remove('hidden');
  }
};

/* ============ 启动 ============ */
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keydown', bootStart, { once: true });
  document.addEventListener('click', bootStart, { once: true });
});
function bootStart() {
  const boot = document.getElementById('boot');
  boot.style.transition = 'opacity 1s';
  boot.style.opacity = '0';
  setTimeout(() => {
    boot.classList.add('hidden');
    OP.start();
  }, 1000);
}

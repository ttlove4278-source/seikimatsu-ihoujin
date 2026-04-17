const BATTLE = {
  cfg: null,
  onEnd: null,
  s: null,

  start(id, cb) {
    this.cfg = BATTLES[id];
    if (!this.cfg) return;
    this.onEnd = cb || (() => {});
    this.s = {
      hHP: this.cfg.hero.hp, hMax: this.cfg.hero.hp,
      hLG: this.cfg.hero.logos, hLGMax: this.cfg.hero.logos,
      eHP: this.cfg.enemy.hp, eMax: this.cfg.enemy.hp,
      eLG: this.cfg.enemy.logos, eLGMax: this.cfg.enemy.logos,
      turn: 1,
      busy: false,
      ended: false,
      reversed: false
    };
    this.render();
  },

  render() {
    const existing = document.getElementById('battle');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.className = 'battle';
    el.id = 'battle';

    const heroColor = this.cfg.hero.color;
    const enemyColor = this.cfg.enemy.color;

    el.innerHTML = `
      <div class="b-bg ${this.cfg.bg || ''}"></div>
      <div class="b-noise"></div>
      <div class="b-vignette"></div>
      <div class="b-domain ${this.cfg.domain || ''}" id="b-domain"></div>

      <div class="b-hud">
        <div class="b-panel">
          <div class="p-name">${this.cfg.hero.name}</div>
          <div class="p-sig">${this.cfg.hero.sig}</div>
          ${this.bar('VITA', 'h-hp', 'vita', this.s.hHP, this.s.hMax)}
          ${this.bar('LOGOS', 'h-lg', 'logos', this.s.hLG, this.s.hLGMax)}
        </div>
        <div class="b-turn-center">
          TURN<span class="turn-num" id="b-turn">${this.s.turn}</span>
        </div>
        <div class="b-panel enemy">
          <div class="p-name">${this.cfg.enemy.name}</div>
          <div class="p-sig">${this.cfg.enemy.sig}</div>
          ${this.bar('VITA', 'e-hp', 'enemy', this.s.eHP, this.s.eMax)}
          ${this.bar('LOGOS', 'e-lg', 'crystal', this.s.eLG, this.s.eLGMax)}
        </div>
      </div>

      <div class="b-stage">
        <div class="b-fighter hero" id="f-hero" style="--c:${heroColor}">
          <div class="silh"></div>
          <div class="f-name">${this.cfg.hero.name}</div>
        </div>
        <div class="b-fighter enemy" id="f-enemy" style="--c:${enemyColor}">
          <div class="silh"></div>
          <div class="f-name">${this.cfg.enemy.name}</div>
        </div>
      </div>

      <div class="b-proposition" id="b-prop"></div>
      <div class="b-signature" id="b-sig"></div>
      <div class="b-burst" id="b-burst"></div>
      <div class="b-impact" id="b-impact"></div>

      <div class="b-action">
        <div class="b-log" id="b-log">
          <span class="speaker">—</span><span class="text">${this.cfg.intro}</span>
        </div>
        <div class="b-btns">
          <button class="b-btn" data-act="quote">
            引用<span class="sub">QUOTE</span><span class="cost">1 赫</span>
          </button>
          <button class="b-btn" data-act="develop">
            命題展開<span class="sub">DEVELOP</span><span class="cost">8+ 赫</span>
          </button>
          <button class="b-btn" data-act="domain">
            論証領域<span class="sub">DOMAIN</span><span class="cost">30 赫</span>
          </button>
          <button class="b-btn" data-act="reset">
            死亡重置<span class="sub">RESET</span><span class="cost">VITA = 0</span>
          </button>
        </div>
      </div>

      <div class="b-submenu" id="b-sub">
        <h3>—— 宣言せよ ——</h3>
        <div id="b-sub-list"></div>
      </div>

      <div class="b-ending" id="b-end">
        <div class="result" id="b-result"></div>
        <h2 id="b-title"></h2>
        <div class="rewards" id="b-rewards"></div>
        <p id="b-text"></p>
        <button onclick="BATTLE.exit()">—— 次へ ——</button>
      </div>
    `;

    document.body.appendChild(el);

    el.querySelectorAll('.b-btn').forEach(b => {
      b.onclick = () => this.act(b.dataset.act);
    });
  },

  bar(label, id, cls, cur, max) {
    const pct = Math.max(0, cur) / max * 100;
    return `
      <div class="bar-row">
        <span class="lbl">${label}</span>
        <div class="bar"><div class="fill ${cls}" id="${id}" style="width:${pct}%"></div></div>
        <span class="val" id="${id}-n">${cur} / ${max}</span>
      </div>
    `;
  },

  updateHUD() {
    const s = this.s;
    const set = (id, cur, max) => {
      const f = document.getElementById(id);
      if (f) f.style.width = (Math.max(0, cur) / max * 100) + '%';
      const n = document.getElementById(id + '-n');
      if (n) n.textContent = `${Math.max(0, cur)} / ${max}`;
    };
    set('h-hp', s.hHP, s.hMax);
    set('h-lg', s.hLG, s.hLGMax);
    set('e-hp', s.eHP, s.eMax);
    set('e-lg', s.eLG, s.eLGMax);
    document.getElementById('b-turn').textContent = s.turn;
  },

  log(speaker, text) {
    const box = document.getElementById('b-log');
    box.innerHTML = `<span class="speaker">${speaker} —</span><span class="text">${text}</span>`;
    box.style.opacity = 0;
    requestAnimationFrame(() => {
      box.style.transition = 'opacity 0.4s';
      box.style.opacity = 1;
    });
  },

  showProp(text, sig) {
    const p = document.getElementById('b-prop');
    p.textContent = '「' + text + '」';
    p.classList.remove('fire');
    void p.offsetWidth;
    p.classList.add('fire');

    setTimeout(() => {
      const s = document.getElementById('b-sig');
      s.textContent = sig;
      s.classList.remove('fire');
      void s.offsetWidth;
      s.classList.add('fire');
    }, 500);

    setTimeout(() => {
      const b = document.getElementById('b-burst');
      b.classList.remove('fire');
      void b.offsetWidth;
      b.classList.add('fire');
    }, 700);

    this.tone(220, 1.2, 'sawtooth');
    setTimeout(() => this.tone(440, 0.8, 'triangle'), 300);
  },

  impact() {
    const i = document.getElementById('b-impact');
    i.classList.remove('fire');
    void i.offsetWidth;
    i.classList.add('fire');
    document.getElementById('battle').classList.add('shake');
    setTimeout(() => document.getElementById('battle').classList.remove('shake'), 500);
  },

  popDamage(target, value, opts = {}) {
    const rect = target.getBoundingClientRect();
    const p = document.createElement('div');
    p.className = 'damage-pop' + (opts.crit ? ' crit' : '') + (opts.heal ? ' heal' : '');
    p.textContent = (opts.heal ? '+' : '') + value;
    p.style.left = (rect.left + rect.width / 2) + 'px';
    p.style.top = (rect.top + rect.height / 3) + 'px';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  },

  heroAtk() {
    const h = document.getElementById('f-hero');
    h.classList.add('attack');
    setTimeout(() => h.classList.remove('attack'), 600);
  },
  heroHurt() {
    const h = document.getElementById('f-hero');
    h.classList.add('hurt');
    setTimeout(() => h.classList.remove('hurt'), 500);
  },
  enemyAtk() {
    const e = document.getElementById('f-enemy');
    e.classList.add('attack');
    setTimeout(() => e.classList.remove('attack'), 600);
  },
  enemyHurt() {
    const e = document.getElementById('f-enemy');
    e.classList.add('hurt');
    setTimeout(() => e.classList.remove('hurt'), 500);
  },

  tone(freq, dur, type = 'sine') {
    try {
      const ctx = OP.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      OP.audioCtx = ctx;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.12, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + dur);
    } catch(e) {}
  },

  act(type) {
    if (this.s.busy || this.s.ended) return;

    if (type === 'quote') return this.doQuote();
    if (type === 'develop') return this.openDevelop();
    if (type === 'domain') return this.doDomain();
    if (type === 'reset') return this.doReset();
  },

  doQuote() {
    if (this.s.hLG < 1) { this.log('システム', 'LOGOS 不足。'); return; }
    this.s.busy = true;
    this.s.hLG -= 1;
    const dmg = 6 + Math.floor(Math.random() * 6);
    this.s.eHP -= dmg;
    this.heroAtk();
    setTimeout(() => {
      this.enemyHurt();
      this.popDamage(document.getElementById('f-enemy'), dmg);
      this.tone(660, 0.18);
    }, 300);
    this.log('珀', `—— 引用。「凝視する深淵」。${dmg} ダメージ。`);
    this.updateHUD();
    setTimeout(() => this.enemyTurn(), 1200);
  },

  openDevelop() {
    const sub = document.getElementById('b-sub');
    const list = document.getElementById('b-sub-list');
    list.innerHTML = this.cfg.propositions.map((p, i) => {
      const disabled = this.s.hLG < p.cost || (p.reversal && this.s.reversed && !p.finisher);
      return `
        <button class="b-opt" data-i="${i}" ${disabled ? 'disabled style="opacity:0.4;cursor:not-allowed"' : ''}>
          「${p.text}」
          <span class="hint">${p.sig}${p.reversal ? ' · 辯證反轉' : ''}${p.finisher ? ' · 絶対精神' : ''}</span>
          <span class="req">${p.cost} 赫</span>
        </button>
      `;
    }).join('');
    sub.classList.add('show');
    list.querySelectorAll('.b-opt').forEach(b => {
      b.onclick = () => {
        if (b.disabled) return;
        const i = parseInt(b.dataset.i);
        sub.classList.remove('show');
        this.doDevelop(i);
      };
    });
  },

  doDevelop(i) {
    const prop = this.cfg.propositions[i];
    this.s.busy = true;
    this.s.hLG -= prop.cost;

    this.showProp(prop.text, prop.sig);

    setTimeout(() => {
      let dmg = prop.dmg;
      let crit = false;
      if (Math.random() < 0.2) { dmg = Math.floor(dmg * 1.5); crit = true; }
      this.s.eHP -= dmg;
      this.heroAtk();
      this.enemyHurt();
      this.impact();
      this.popDamage(document.getElementById('f-enemy'), dmg, { crit });

      if (prop.reversal) this.s.reversed = true;

      this.log('珀', `—— 命題展開。${dmg} ダメージ${crit ? '（決定的！）' : ''}。${prop.reversal ? '辯證反轉発動。' : ''}`);
      this.updateHUD();
      setTimeout(() => {
        if (this.s.eHP <= 0) return this.end('win');
        this.enemyTurn();
      }, 1400);
    }, 1800);
  },

  doDomain() {
    if (this.s.hLG < 30) { this.log('システム', '—— 逻各斯浓度不足、30 赫必要。'); return; }
    this.s.busy = true;
    this.s.hLG -= 30;
    const d = document.getElementById('b-domain');
    d.classList.add('show');
    this.showProp('この書物の頁の内にて——', 'A. Camus');
    this.log('珀', '—— 論証領域・展開。' );
    this.tone(150, 2, 'sine');

    setTimeout(() => {
      const dmg = 35 + Math.floor(Math.random() * 15);
      this.s.eHP -= dmg;
      this.enemyHurt();
      this.impact();
      this.popDamage(document.getElementById('f-enemy'), dmg, { crit: true });
      this.log('システム', `領域内、命題が物理法則となる。${dmg} ダメージ。`);
      this.updateHUD();
      setTimeout(() => {
        d.classList.remove('show');
        if (this.s.eHP <= 0) return this.end('win');
        this.enemyTurn();
      }, 1600);
    }, 1800);
  },

  doReset() {
    if (this.s.hHP > 0) { this.log('システム', '—— まだ、死んでいない。'); return; }
    this.s.busy = true;
    this.s.hHP = Math.floor(this.s.hMax * 0.7);
    this.showProp('我々はシーシュポスが幸福であると想像しなければならない', 'A. Camus');
    this.tone(110, 2, 'sine');
    SAVE.state.deathCount += 1;
    SAVE.persist();
    this.log('珀', `—— 第${SAVE.state.deathCount}回目。目を開ける。蝉が、まだ鳴いている。`);
    this.popDamage(document.getElementById('f-hero'), Math.floor(this.s.hMax * 0.7), { heal: true });
    this.updateHUD();
    setTimeout(() => {
      this.s.busy = false;
    }, 1800);
  },

  enemyTurn() {
    const s = this.s;
    s.turn++;

    if (s.eHP <= 0) return this.end('win');

    setTimeout(() => {
      const e = this.cfg.enemy;
      const line = e.lines[Math.floor(Math.random() * e.lines.length)];
      const atk = e.attacks[Math.floor(Math.random() * e.attacks.length)];
      const [min, max] = atk.dmg;
      const dmg = min + Math.floor(Math.random() * (max - min + 1));

      this.enemyAtk();
      setTimeout(() => {
        s.hHP -= dmg;
        this.heroHurt();
        this.popDamage(document.getElementById('f-hero'), dmg);
        this.tone(120, 0.4, 'sawtooth');
        this.log(e.name, `${line} —— ${atk.name} / ${dmg} ダメージ。`);

        // 逻各斯自然恢复
        s.hLG = Math.min(s.hLGMax, s.hLG + 4);
        this.updateHUD();

        if (s.hHP <= 0) {
          setTimeout(() => {
            this.log('システム', '—— 心拍停止、確認。三秒。');
            this.tone(80, 2.5, 'sine');
          }, 600);
        }

        s.busy = false;
      }, 300);
    }, 400);
  },

  end(result) {
    this.s.ended = true;
    const data = result === 'win' ? this.cfg.win : this.cfg.lose;
    const end = document.getElementById('b-end');
    document.getElementById('b-result').textContent = result === 'win' ? '— VICTORY —' : '— DEFEAT —';
    document.getElementById('b-title').textContent = data.title;
    document.getElementById('b-text').textContent = data.text;

    let rewards = '';
    if (result === 'win' && data.reward) {
      if (data.reward.crystal) {
        SAVE.unlockCrystal(data.reward.crystal);
        const cr = CRYSTALS.find(x => x.id === data.reward.crystal);
        rewards += `<div>◆ 理論結晶を獲得：${cr.name}（${cr.source}）</div>`;
      }
      if (data.reward.flag) {
        SAVE.setFlag(data.reward.flag, true);
      }
      rewards += `<div>◆ 記録死亡回数：${SAVE.state.deathCount}</div>`;
    }
    document.getElementById('b-rewards').innerHTML = rewards;
    end.classList.add('show');

    if (result === 'win') {
      this.cfg._result = 'win';
      this.enemyKO();
    } else {
      this.heroKO();
    }
  },

  enemyKO() {
    const e = document.getElementById('f-enemy');
    e.classList.add('ko');
    this.tone(330, 2, 'sine');
  },
  heroKO() {
    const h = document.getElementById('f-hero');
    h.classList.add('ko');
  },

  exit() {
    const el = document.getElementById('battle');
    if (el) el.remove();
    const result = this.cfg?._result === 'win';
    if (this.onEnd) this.onEnd(result);
    else document.getElementById('menu').classList.remove('hidden');
  }
};

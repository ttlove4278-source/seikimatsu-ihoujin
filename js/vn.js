const VN = {
  script: null,
  index: 0,
  labels: {},
  playing: false,
  typing: false,
  typeTimer: null,
  currentText: '',

  play(chapterId) {
    const ch = CHAPTERS[chapterId];
    if (!ch) return;
    SAVE.state.currentChapter = chapterId;
    SAVE.persist();
    this.script = ch.script;
    this.index = 0;
    this.buildLabels();
    this.playing = true;
    this.mount();
    this.next();
  },

  buildLabels() {
    this.labels = {};
    this.script.forEach((n, i) => {
      if (n.label) this.labels[n.label] = i;
    });
  },

  mount() {
    const vn = document.getElementById('vn');
    vn.classList.remove('hidden');
    vn.innerHTML = `
      <div class="vn-bg" id="vn-bg"></div>
      <div class="vn-filter" id="vn-filter"></div>
      <div class="vn-noise"></div>
      <div class="vn-vignette"></div>

      <div class="vn-place" id="vn-place" style="display:none">
        <span class="deco"></span>
        <div>
          <div class="jp" id="vn-place-jp"></div>
          <div class="en" id="vn-place-en"></div>
        </div>
        <span class="time" id="vn-place-time"></span>
      </div>

      <div class="vn-controls">
        <button class="vn-btn" onclick="VN.skip()">SKIP ▸</button>
        <button class="vn-btn" onclick="VN.quit()">× QUIT</button>
      </div>

      <div class="vn-chars" id="vn-chars"></div>

      <div class="vn-dialog" id="vn-dialog" style="display:none">
        <div class="vn-speaker" id="vn-speaker"></div>
        <div class="vn-text" id="vn-text"></div>
        <span class="vn-next" id="vn-next">▸ NEXT</span>
      </div>

      <div class="vn-choices" id="vn-choices"></div>
      <div class="vn-fullscreen-text" id="vn-fs">
        <div>
          <div class="big" id="vn-fs-big"></div>
          <div class="sub" id="vn-fs-sub"></div>
        </div>
      </div>
      <div class="vn-blackout" id="vn-blackout"></div>
      <div id="vn-chapter" style="display:none"></div>
    `;

    vn.onclick = (e) => {
      if (e.target.closest('.vn-btn')) return;
      if (e.target.closest('.vn-choice')) return;
      this.advance();
    };
  },

  unmount() {
    const vn = document.getElementById('vn');
    vn.classList.add('hidden');
    vn.innerHTML = '';
    vn.onclick = null;
  },

  next() {
    if (!this.playing) return;
    if (this.index >= this.script.length) return this.finish();
    const node = this.script[this.index++];
    this.exec(node);
  },

  exec(node) {
    // 标签跳过
    if (node.label !== undefined) return this.next();
    if (node.goto) {
      if (this.labels[node.goto] !== undefined) this.index = this.labels[node.goto];
      return this.next();
    }
    if (node.flag) {
      SAVE.setFlag(node.flag, node.value);
      return this.next();
    }

    // 章节卡
    if (node.chapter) return this.showChapter(node);
    // 场景切换
    if (node.bg !== undefined || node.place !== undefined) return this.changeScene(node);
    // 全屏文字
    if (node.fullscreen) return this.showFullscreen(node);
    // 黑屏
    if (node.blackout) return this.blackout(node.duration || 1000);
    // 选择
    if (node.choice) return this.showChoices(node.choice);
    // 战斗
    if (node.battle) return this.enterBattle(node.battle);
    // 结束
    if (node.end) return this.endChapter(node.end);

    // 对话
    if (node.char || node.chars || node.narrator || node.think) return this.showDialog(node);

    this.next();
  },

  showChapter(node) {
    const el = document.getElementById('vn-chapter');
    el.style.display = '';
    el.innerHTML = `
      <div class="vn-chapter-card">
        <div class="ch-num">${node.chapter}</div>
        <div class="ch-title">${node.title}</div>
        <div class="ch-sub">${node.sub}</div>
        <div class="ch-date">${node.date}</div>
      </div>
    `;
    setTimeout(() => {
      el.style.display = 'none';
      el.innerHTML = '';
      this.next();
    }, 4000);
  },

  changeScene(node) {
    const bg = document.getElementById('vn-bg');
    const filter = document.getElementById('vn-filter');
    const placeEl = document.getElementById('vn-place');

    if (node.bg) bg.className = 'vn-bg ' + node.bg;
    if (node.filter) filter.className = 'vn-filter ' + node.filter;

    if (node.place) {
      placeEl.style.display = '';
      document.getElementById('vn-place-jp').textContent = node.place;
      document.getElementById('vn-place-en').textContent = node.placeEn || '';
      document.getElementById('vn-place-time').textContent = node.time || '';
      placeEl.style.animation = 'none';
      void placeEl.offsetWidth;
      placeEl.style.animation = '';
    }

    setTimeout(() => this.next(), 800);
  },

  showDialog(node) {
    const dlg = document.getElementById('vn-dialog');
    const spk = document.getElementById('vn-speaker');
    const txt = document.getElementById('vn-text');

    dlg.style.display = '';
    spk.className = 'vn-speaker';
    txt.className = 'vn-text';

    if (node.narrator) {
      spk.classList.add('narrator');
      txt.classList.add('narrator');
      spk.textContent = 'NARRATOR';
    } else if (node.think) {
      spk.classList.add('think');
      txt.classList.add('think');
      spk.textContent = '—— 心の声';
    } else {
      spk.textContent = node.speaker || '';
    }

    // 角色显示
    this.showChars(node);

    this.typeText(txt, node.text);
  },

  showChars(node) {
    const zone = document.getElementById('vn-chars');
    let list = [];
    if (node.chars) list = node.chars;
    else if (node.char) list = [node.char];

    if (list.length === 0) { zone.innerHTML = ''; return; }

    const active = node.char;
    const current = Array.from(zone.children).map(c => c.dataset.id);
    const same = list.length === current.length && list.every((x, i) => current[i] === x);

    if (!same) {
      zone.innerHTML = list.map(id => {
        const c = DATA.characters.find(x => x.id === id);
        if (!c) return '';
        return `
          <div class="vn-char" data-id="${id}" style="--silh-color:${c.accent}">
            <div class="vn-char-silh"></div>
            <div class="vn-char-name">${c.name}</div>
          </div>
        `;
      }).join('');
      requestAnimationFrame(() => {
        zone.querySelectorAll('.vn-char').forEach(el => el.classList.add('show'));
      });
    }

    zone.querySelectorAll('.vn-char').forEach(el => {
      el.classList.remove('speak', 'dim');
      if (active && el.dataset.id === active) el.classList.add('speak');
      else if (active && el.dataset.id !== active) el.classList.add('dim');
    });
  },

  typeText(el, text) {
    this.typing = true;
    this.currentText = text;
    el.textContent = '';
    let i = 0;
    clearInterval(this.typeTimer);
    this.typeTimer = setInterval(() => {
      if (i >= text.length) {
        clearInterval(this.typeTimer);
        this.typing = false;
        return;
      }
      el.textContent += text[i++];
      // 随机轻音
      if (Math.random() < 0.15) this.typeBlip();
    }, 32);
  },

  typeBlip() {
    try {
      const ctx = OP.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      OP.audioCtx = ctx;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 800 + Math.random() * 300;
      g.gain.setValueAtTime(0.01, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.06);
    } catch(e) {}
  },

  advance() {
    if (!this.playing) return;
    if (this.typing) {
      clearInterval(this.typeTimer);
      document.getElementById('vn-text').textContent = this.currentText;
      this.typing = false;
      return;
    }
    this.next();
  },

  showFullscreen(node) {
    const fs = document.getElementById('vn-fs');
    document.getElementById('vn-fs-big').textContent = node.text;
    document.getElementById('vn-fs-sub').textContent = node.sub || '';
    fs.classList.add('show');
    const onClick = () => {
      fs.classList.remove('show');
      fs.removeEventListener('click', onClick);
      setTimeout(() => this.next(), 500);
    };
    fs.addEventListener('click', onClick);
  },

  blackout(ms) {
    const bo = document.getElementById('vn-blackout');
    bo.classList.add('show');
    setTimeout(() => {
      bo.classList.remove('show');
      setTimeout(() => this.next(), 400);
    }, ms);
  },

  showChoices(list) {
    const zone = document.getElementById('vn-choices');
    zone.innerHTML = `<div class="vn-choices-title">—— 選べ ——</div>` +
      list.map((c, i) => `
        <button class="vn-choice" data-i="${i}">
          ${c.text}
          ${c.hint ? `<span class="hint">${c.hint}</span>` : ''}
        </button>
      `).join('');
    zone.classList.add('show');
    zone.querySelectorAll('.vn-choice').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const i = parseInt(btn.dataset.i);
        const ch = list[i];
        zone.classList.remove('show');
        if (ch.goto && this.labels[ch.goto] !== undefined) {
          this.index = this.labels[ch.goto];
        }
        if (ch.flag) SAVE.setFlag(ch.flag, ch.value);
        setTimeout(() => this.next(), 300);
      };
    });
  },

  enterBattle(id) {
    this.playing = false;
    this.unmount();
    BATTLE.start(id, (win) => {
      this.playing = true;
      const vn = document.getElementById('vn');
      vn.classList.remove('hidden');
      this.mount();
      // 重建状态
      setTimeout(() => this.next(), 200);
    });
  },

  endChapter(id) {
    SAVE.completeChapter(id);
    this.finish();
  },

  finish() {
    this.playing = false;
    this.unmount();
    document.getElementById('menu').classList.remove('hidden');
    SAVE.refreshUI();
  },

  skip() {
    if (confirm('スキップして次のシーンへ？')) {
      // 跳到下一个 label 或 choice
      while (this.index < this.script.length) {
        const n = this.script[this.index];
        if (n.choice || n.battle || n.end) break;
        this.index++;
      }
      clearInterval(this.typeTimer);
      this.typing = false;
      this.next();
    }
  },

  quit() {
    if (confirm('終了しますか？進行は自動保存されます。')) {
      this.finish();
    }
  }
};

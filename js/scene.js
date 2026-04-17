const SCENE = {
  show(html) {
    const s = document.getElementById('scene');
    s.innerHTML = html;
    s.classList.remove('hidden');
    document.getElementById('menu').classList.add('hidden');
  },
  hide() {
    document.getElementById('scene').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
  },
  header(title, sub) {
    return `
      <div class="scene-header">
        <div class="scene-title"><span>${sub}</span>${title}</div>
        <button class="back-btn" onclick="SCENE.hide()">◂ BACK</button>
      </div>
    `;
  },

  // 01 序章
  prologue() {
    this.show(`
      ${this.header('序章・覚醒', '01')}
      <div class="scene-body">
        <div class="prologue-wrap">
          <div class="prologue-date">1999 · 07 · 13 — TUESDAY</div>
          <h1 class="prologue-title">異郷人、覚醒。</h1>
          <div class="prose">${DATA.prologue}</div>
          <div class="prologue-continue">
            <button onclick="SCENE.hide()">— 続く —</button>
          </div>
        </div>
      </div>
    `);
  },

  // 02 角色名鉴
  characters() {
    const cards = DATA.characters.map(c => `
      <div class="char-card" data-kanji="${c.kanji}" style="--accent:${c.accent}" onclick="SCENE.charDetail('${c.id}')">
        <div class="char-id">${c.caseId}</div>
        <div class="char-name-jp">${c.name}</div>
        <div class="char-name-en">${c.nameEn}</div>
        <div class="char-meta">
          <div><span class="k">SRC</span>${c.source}</div>
          <div><span class="k">ABL</span>${c.ability}</div>
          <div><span class="k">LVL</span>${c.grade}</div>
          <div><span class="k">RSK</span>${c.risk}</div>
        </div>
        <div class="char-prop">「${c.prop}」</div>
      </div>
    `).join('');
    this.show(`
      ${this.header('登場人物', '02')}
      <div class="scene-body">
        <div class="char-grid">${cards}</div>
      </div>
    `);
  },

  charDetail(id) {
    const c = DATA.characters.find(x => x.id === id);
    const modal = document.createElement('div');
    modal.className = 'char-modal';
    modal.style.setProperty('--accent', c.accent);
    modal.innerHTML = `
      <div class="inner" style="--accent:${c.accent}">
        <button class="close" onclick="this.closest('.char-modal').remove()">×</button>
        <div class="modal-big-kanji">${c.kanji}</div>
        <div class="modal-header">
          <div class="id">${c.caseId} / ${c.affiliation} / ${c.age}</div>
          <h2>${c.name}</h2>
          <div class="en">${c.nameEn}</div>
        </div>
        <div class="modal-section">
          <h3>PROFILE <span>人物像</span></h3>
          <ul>${c.profile.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
        <div class="modal-section">
          <h3>ABILITY <span>能力・命題</span></h3>
          <ul>${c.ability_detail.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
        <div class="modal-section">
          <h3>HISTORY <span>背景</span></h3>
          <ul>${c.history.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
        <div class="modal-quote">${c.quote}</div>
      </div>
    `;
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
  },

  // 03 用语集
  codex() {
    const list = DATA.codex.map(e => `
      <div class="codex-entry">
        <div class="num">${e.num}</div>
        <h3>${e.name}</h3>
        <div class="en">${e.en}</div>
        <div class="desc">${e.desc}</div>
      </div>
    `).join('');
    this.show(`
      ${this.header('用語集', '03')}
      <div class="scene-body">
        <div class="codex-grid">${list}</div>
      </div>
    `);
  },

  // 04 命题展开·战斗
  battle() {
    BATTLE.start();
  }
};

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
    SAVE.refreshUI();
  },
  header(title, sub) {
    return `
      <div class="scene-header">
        <div class="scene-title"><span>${sub}</span>${title}</div>
        <button class="back-btn" onclick="SCENE.hide()">◂ BACK</button>
      </div>
    `;
  },

  // 章节选择
  chapters() {
    const cards = Object.values(CHAPTERS).filter(c => c.num).map((c, i) => {
      const prevId = i > 0 ? Object.values(CHAPTERS)[i-1].id : null;
      const locked = prevId ? !SAVE.state.completedChapters.includes(prevId) : false;
      const completed = SAVE.state.completedChapters.includes(c.id);
      return `
        <div class="chapter-card ${locked ? 'locked' : ''}" data-id="${c.id}" data-num="${i+1}">
          ${locked ? '<div class="chapter-lock">🔒 LOCKED</div>' : ''}
          ${completed ? '<div class="chapter-lock" style="color:var(--gold)">✓ 既読</div>' : ''}
          <div class="ch-num">${c.num}</div>
          <h3>${c.title}</h3>
          <div class="ch-sub">${c.sub}</div>
          <div class="ch-desc">${c.desc}</div>
          <div class="ch-date">${c.date}</div>
        </div>
      `;
    }).join('');
    this.show(`
      ${this.header('章を選ぶ', '01')}
      <div class="scene-body">
        <div class="chapters-wrap">${cards}</div>
      </div>
    `);
    document.querySelectorAll('.chapter-card').forEach(el => {
      if (el.classList.contains('locked')) return;
      el.onclick = () => {
        const id = el.dataset.id;
        this.hide();
        VN.play(id);
      };
    });
  },

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
      ${this.header('登場人物', '03')}
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
      ${this.header('用語集', '04')}
      <div class="scene-body">
        <div class="codex-grid">${list}</div>
      </div>
    `);
  },

  saveLoad() {
    const slots = SAVE.state.slots.map((s, i) => {
      if (!s) {
        return `
          <div class="save-slot empty">
            <div class="slot-num">${String(i+1).padStart(2,'0')}</div>
            <div class="slot-info">
              <div class="title">—— EMPTY SLOT ——</div>
              <div class="meta">未記録</div>
            </div>
            <div class="slot-actions">
              <button onclick="SAVE.saveSlot(${i});SCENE.saveLoad()">SAVE</button>
            </div>
          </div>
        `;
      }
      const ch = CHAPTERS[s.chapter];
      const d = new Date(s.savedAt);
      return `
        <div class="save-slot">
          <div class="slot-num">${String(i+1).padStart(2,'0')}</div>
          <div class="slot-info">
            <div class="title">${ch ? ch.title : '—'}</div>
            <div class="meta">
              記録: ${d.toLocaleString('ja-JP')}<br>
              既読章: ${s.completedChapters.length}/4 · 結晶: ${s.unlockedCrystals.length}/${CRYSTALS.length}<br>
              死亡回数: ${s.deathCount} 回
            </div>
          </div>
          <div class="slot-actions">
            <button onclick="SAVE.saveSlot(${i});SCENE.saveLoad()">OVERWRITE</button>
            <button onclick="if(SAVE.loadSlot(${i})){alert('ロードしました');SCENE.saveLoad()}">LOAD</button>
            <button class="danger" onclick="if(confirm('削除しますか？')){SAVE.deleteSlot(${i});SCENE.saveLoad()}">DEL</button>
          </div>
        </div>
      `;
    }).join('');

    this.show(`
      ${this.header('SAVE / LOAD', '06')}
      <div class="scene-body">
        <div class="save-wrap">${slots}</div>
      </div>
    `);
  }
};

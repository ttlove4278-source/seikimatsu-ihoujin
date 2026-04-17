const ARCHIVE = {
  show() {
    const list = CRYSTALS.map(c => {
      const unlocked = SAVE.state.unlockedCrystals.includes(c.id) ||
                       (c.unlockBy === 'default') ||
                       (c.unlockBy && c.unlockBy.startsWith('flag:') && SAVE.getFlag(c.unlockBy.slice(5)));
      return `
        <div class="crystal-card ${unlocked ? '' : 'locked'}"
             data-id="${c.id}"
             style="--c:${c.c};--c2:${c.c2};--glow:${c.glow}">
          <div class="crystal-shape"></div>
          <div class="crystal-id">${c.num}</div>
          <div class="crystal-name">${unlocked ? c.name : '?????'}</div>
          <div class="crystal-source">${unlocked ? c.source : '—— LOCKED ——'}</div>
          <div class="crystal-excerpt">${unlocked ? c.excerpt : '—— 未入手 ——'}</div>
        </div>
      `;
    }).join('');

    SCENE.show(`
      ${SCENE.header('理論結晶・書庫', '05')}
      <div class="scene-body">
        <div class="archive-grid">${list}</div>
      </div>
    `);

    document.querySelectorAll('.crystal-card').forEach(card => {
      if (card.classList.contains('locked')) return;
      card.onclick = () => {
        const id = card.dataset.id;
        ARCHIVE.detail(id);
      };
    });
  },

  detail(id) {
    const c = CRYSTALS.find(x => x.id === id);
    if (!c) return;
    const modal = document.createElement('div');
    modal.className = 'crystal-modal';
    modal.innerHTML = `
      <div class="cm-inner" style="--c:${c.c};--c2:${c.c2};--glow:${c.glow}">
        <button class="close" onclick="this.closest('.crystal-modal').remove()">×</button>
        <div class="cm-crystal"></div>
        <div class="cm-header">
          <div class="id">${c.num}</div>
          <h2>${c.name}</h2>
          <div class="source">${c.source}</div>
        </div>
        <div class="cm-section">
          <h3>EXCERPT</h3>
          <div class="cm-text">${c.excerpt}</div>
        </div>
        <div class="cm-section">
          <h3>CONTENT</h3>
          <div class="cm-text">${c.text}</div>
        </div>
        <div class="cm-section">
          <h3>NOTE</h3>
          <p>${c.note}</p>
        </div>
      </div>
    `;
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
  }
};

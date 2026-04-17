const SAVE = {
  KEY: 'seikimatsu_save_v1',

  /* 运行时状态 */
  state: {
    currentChapter: null,
    completedChapters: [],
    unlockedCrystals: ['c_camus'],
    visitedPlaces: [],
    flags: {},
    deathCount: 327,
    logos: 80,
    hp: 100,
    slots: [null, null, null]
  },

  init() {
    const raw = localStorage.getItem(this.KEY);
    if (raw) {
      try {
        this.state = Object.assign(this.state, JSON.parse(raw));
      } catch(e) {
        console.warn('Save load failed', e);
      }
    }
    this.refreshUI();
  },

  persist() {
    localStorage.setItem(this.KEY, JSON.stringify(this.state));
    this.refreshUI();
  },

  setFlag(key, value) {
    this.state.flags[key] = value;
    this.persist();
  },
  getFlag(key) { return this.state.flags[key]; },

  completeChapter(id) {
    if (!this.state.completedChapters.includes(id)) {
      this.state.completedChapters.push(id);
    }
    this.persist();
  },

  unlockCrystal(id) {
    if (!this.state.unlockedCrystals.includes(id)) {
      this.state.unlockedCrystals.push(id);
    }
    this.persist();
  },

  visitPlace(id) {
    if (!this.state.visitedPlaces.includes(id)) {
      this.state.visitedPlaces.push(id);
    }
    this.persist();
  },

  saveSlot(i) {
    this.state.slots[i] = {
      savedAt: new Date().toISOString(),
      chapter: this.state.currentChapter,
      completedChapters: [...this.state.completedChapters],
      unlockedCrystals: [...this.state.unlockedCrystals],
      visitedPlaces: [...this.state.visitedPlaces],
      flags: { ...this.state.flags },
      deathCount: this.state.deathCount,
      logos: this.state.logos,
      hp: this.state.hp
    };
    this.persist();
  },

  loadSlot(i) {
    const s = this.state.slots[i];
    if (!s) return false;
    this.state.currentChapter = s.chapter;
    this.state.completedChapters = [...s.completedChapters];
    this.state.unlockedCrystals = [...s.unlockedCrystals];
    this.state.visitedPlaces = [...s.visitedPlaces];
    this.state.flags = { ...s.flags };
    this.state.deathCount = s.deathCount;
    this.state.logos = s.logos;
    this.state.hp = s.hp;
    this.persist();
    return true;
  },

  deleteSlot(i) {
    this.state.slots[i] = null;
    this.persist();
  },

  refreshUI() {
    const d = document.getElementById('death-meter');
    const l = document.getElementById('logos-meter');
    const cn = document.getElementById('continue-label');
    const ss = document.getElementById('save-status');
    if (d) d.textContent = this.state.deathCount;
    if (l) l.textContent = this.state.logos;
    if (cn) {
      const ch = this.state.currentChapter || 'ch1';
      const chapter = CHAPTERS[ch];
      cn.textContent = chapter ? `—— ${chapter.title} ——` : '—— 序章から ——';
    }
    if (ss) {
      const slots = this.state.slots.filter(Boolean).length;
      ss.textContent = `SAVE · ${slots}/3 · ${this.state.completedChapters.length}/4`;
    }
  }
};

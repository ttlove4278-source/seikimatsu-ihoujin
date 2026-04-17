const MENU = {
  init() {
    SAVE.init();
    document.querySelectorAll('[data-go]').forEach(btn => {
      btn.onclick = () => {
        const target = btn.dataset.go;
        if (target === 'continue') {
          const ch = SAVE.state.currentChapter || 'ch1';
          document.getElementById('menu').classList.add('hidden');
          VN.play(ch);
        }
        else if (target === 'story') SCENE.chapters();
        else if (target === 'map') MAP.show();
        else if (target === 'characters') SCENE.characters();
        else if (target === 'codex') SCENE.codex();
        else if (target === 'archive') ARCHIVE.show();
        else if (target === 'save') SCENE.saveLoad();
      };
    });
  }
};

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

const OP = {
  start() {
    const op = document.getElementById('op');
    op.classList.remove('hidden');
    // OP 总时长约 17s
    this.timer = setTimeout(() => this.finish(), 17000);
    document.getElementById('skip-op').onclick = () => this.finish();
    this.playAmbient();
  },
  finish() {
    clearTimeout(this.timer);
    const op = document.getElementById('op');
    op.style.transition = 'opacity 1s';
    op.style.opacity = '0';
    setTimeout(() => {
      op.classList.add('hidden');
      op.style.opacity = '1';
      document.getElementById('menu').classList.remove('hidden');
      MENU.init();
    }, 1000);
  },
  playAmbient() {
    // Web Audio 合成蝉鸣环境音
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const master = ctx.createGain();
      master.gain.value = 0.04;
      master.connect(ctx.destination);

      // 白噪声 —— 蝉鸣
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.3;
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      noise.loop = true;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 3200;
      bp.Q.value = 2;
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 5;
      lfoGain.gain.value = 0.02;
      lfo.connect(lfoGain);
      lfoGain.connect(master.gain);
      noise.connect(bp).connect(master);
      noise.start(); lfo.start();

      // 低频 drone
      const osc = ctx.createOscillator();
      const oscG = ctx.createGain();
      osc.frequency.value = 55;
      osc.type = 'sine';
      oscG.gain.value = 0.05;
      osc.connect(oscG).connect(master);
      osc.start();

      this.audioCtx = ctx;
    } catch (e) {}
  }
};

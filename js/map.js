const MAP = {
  places: [
    { id: 'embankment', x: 18, y: 62, jp: '堤防', en: 'Embankment',
      desc: '—— 夏目珀が毎日、生きている確証を得る場所。遠くで、誰かのラジオ。',
      action: 'scene_embankment' },
    { id: 'school', x: 40, y: 38, jp: '櫂町高校', en: 'Kaichō High School',
      desc: '—— 二年三組。御厨光のいる教室。黒板消しの粉。',
      action: 'scene_school' },
    { id: 'library', x: 55, y: 50, jp: '市立図書館', en: 'Public Library',
      desc: '—— 岩波文庫の棚。閉館十分前、新刊コーナーの端。',
      action: 'scene_library' },
    { id: 'harbor', x: 30, y: 78, jp: '旧港・倉庫街', en: 'Old Harbor',
      desc: '—— 廃倉庫、波止場、ボルドー会の安全屋。',
      action: 'scene_harbor' },
    { id: 'bridge', x: 72, y: 72, jp: '旧港高架橋下', en: 'Under the Overpass',
      desc: '—— 白髪の男が、三年四ヶ月、同じページを読み続けている。',
      action: 'visit_bridge' },
    { id: 'plaza', x: 60, y: 28, jp: '駅前広場', en: 'Station Plaza',
      desc: '—— 木曜の夕方、蛍光緑のベスト。無料新聞、漫画、流浪の子ども。',
      action: 'visit_plaza' },
    { id: 'cemetery', x: 82, y: 42, jp: '市営墓地', en: 'Municipal Cemetery',
      desc: '—— 高城家の区画。三年前の秋、海に身を投げた父の、静かな名前。',
      action: 'scene_cemetery' },
    { id: 'kousei', x: 48, y: 18, jp: '櫂町合同庁舎', en: 'Gov. Building · Div. IX',
      desc: '—— 地下三階～五階。理論結晶四三二点、保管中。',
      action: 'scene_kousei' }
  ],

  show() {
    const m = document.getElementById('map');
    m.classList.remove('hidden');
    document.getElementById('menu').classList.add('hidden');
    m.innerHTML = `
      <div class="map-header">
        <div class="map-title"><span>02</span>櫂町 · KAICHŌ</div>
        <div class="map-date">1999 · 夏 · 37.5°C</div>
      </div>
      <div class="map-canvas" id="map-canvas"></div>
      <div class="map-compass"></div>
      <button class="map-back" onclick="MAP.hide()">◂ BACK</button>
      <div class="map-info hidden" id="map-info">
        <div>
          <div><span class="loc-en" id="mi-en"></span><span class="loc-name" id="mi-jp"></span></div>
          <div class="desc" id="mi-desc"></div>
        </div>
        <button class="enter-btn" id="mi-enter">—— 入る ——</button>
      </div>
    `;

    const canvas = document.getElementById('map-canvas');
    this.places.forEach(p => {
      const visited = SAVE.state.visitedPlaces.includes(p.id);
      const pin = document.createElement('div');
      pin.className = 'map-pin' + (visited ? ' visited' : '');
      pin.style.left = p.x + '%';
      pin.style.top = p.y + '%';
      pin.innerHTML = `
        <div class="dot"></div>
        <div class="label">${p.jp}<span class="en">${p.en}</span></div>
      `;
      pin.onclick = () => this.selectPlace(p);
      canvas.appendChild(pin);
    });
  },

  hide() {
    document.getElementById('map').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
  },

  selectPlace(p) {
    const info = document.getElementById('map-info');
    info.classList.remove('hidden');
    document.getElementById('mi-jp').textContent = p.jp;
    document.getElementById('mi-en').textContent = p.en;
    document.getElementById('mi-desc').textContent = p.desc;
    const btn = document.getElementById('mi-enter');
    btn.onclick = () => this.enter(p);
  },

  enter(p) {
    SAVE.visitPlace(p.id);

    // 支线结晶解锁
    if (p.action === 'visit_bridge') SAVE.unlockCrystal('c_pascal');
    if (p.action === 'visit_plaza') SAVE.unlockCrystal('c_rousseau');

    // 特殊地点触发小场景
    this.hide();
    this.triggerScene(p);
  },

  triggerScene(p) {
    // 构造临时小场景（走 VN 引擎）
    const mini = this.miniScenes[p.id];
    if (mini) {
      const tmpId = '__visit_' + p.id;
      CHAPTERS[tmpId] = { id: tmpId, script: mini };
      VN.play(tmpId);
    } else {
      alert(`${p.jp}\n\n${p.desc}`);
      document.getElementById('menu').classList.remove('hidden');
    }
  },

  miniScenes: {
    bridge: [
      { bg: 'bg-tunnel', filter: 'night', place: '旧港高架橋下', placeEn: 'UNDER THE OVERPASS', time: '—' },
      { narrator: true, text: 'コンクリートの柱。折りたたみ椅子。白髪の男が、同じページを開いたまま、座っている。' },
      { char: 'fujimori', speaker: '藤森 明', text: '……。' },
      { char: 'haku', chars: ['haku','fujimori'], speaker: '夏目 珀', text: '……ポカリ、置いておきます。' },
      { char: 'fujimori', chars: ['haku','fujimori'], speaker: '藤森 明', text: '……梢は、藍色の水着を。水が冷たい、と言った。平成六年の、六月。別府。' },
      { char: 'fujimori', chars: ['haku','fujimori'], speaker: '藤森 明', text: 'それだけは、まだ、忘れていない。' },
      { char: 'haku', chars: ['haku','fujimori'], speaker: '夏目 珀', text: '……。' },
      { fullscreen: true, text: '—— 人間は、考える葦である。', sub: 'B. Pascal' },
      { narrator: true, text: '【結晶・パスカルの葦 を解放した】' },
      { end: 'visit_bridge' }
    ],
    plaza: [
      { bg: 'bg-street', filter: 'dusk', place: '櫂町駅前広場', placeEn: 'KAICHŌ STATION PLAZA', time: '17:00' },
      { narrator: true, text: '木曜日。蛍光緑のベストを着た男が、無料新聞を配っている。' },
      { char: 'horita', speaker: '堀田 誠', text: 'あ、珀くん！今週の新聞、いるかい？' },
      { char: 'haku', chars: ['haku','horita'], speaker: '夏目 珀', text: '……もらいます。' },
      { char: 'horita', chars: ['haku','horita'], speaker: '堀田 誠', text: 'ねえ、珀くん、あの男の子の名前、何だったっけ……。' },
      { char: 'horita', chars: ['haku','horita'], speaker: '堀田 誠', text: '……忘れちゃった。でも、漫画、読み続けてるよ。' },
      { char: 'haku', chars: ['haku','horita'], speaker: '夏目 珀', text: '堀田さんがまだ新聞を配ってる。——それが、まだ諦めてない、ってことです。' },
      { fullscreen: true, text: '—— 人は自由に生まれつき、至る所で鎖につながれている。', sub: 'J.J. Rousseau' },
      { narrator: true, text: '【結晶・社会契約 を解放した】' },
      { end: 'visit_plaza' }
    ]
  }
};

// 让 VN 的结晶解锁走 SAVE
const _origEnd = VN.endChapter;
VN.endChapter = function(id) {
  if (id === 'visit_bridge') SAVE.unlockCrystal('c_pascal');
  if (id === 'visit_plaza') SAVE.unlockCrystal('c_rousseau');
  return _origEnd.call(this, id);
};

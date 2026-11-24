// Animações avaliadas por tempo absoluto: renderizar um trecho não depende dos quadros anteriores.
(function () {
  function validarMovimento(op = {}) {
    if (!op || typeof op !== 'object' || Array.isArray(op)) throw new Error('Movimento deve ser um objeto.');
    const cfg = { cameraContinua: true, gestos: true, interacoes: true, falaAnimada: true, intensidade: 0.7, ...op };
    for (const chave of ['cameraContinua', 'gestos', 'interacoes', 'falaAnimada']) {
      if (typeof cfg[chave] !== 'boolean') throw new Error('Movimento: ' + chave + ' deve ser verdadeiro ou falso.');
    }
    if (!Number.isFinite(cfg.intensidade) || cfg.intensidade < 0 || cfg.intensidade > 1) throw new Error('Movimento: intensidade deve estar entre 0 e 1.');
    return cfg;
  }
  if (typeof module !== 'undefined' && module.exports) { module.exports = { validarMovimento }; return; }
  const vetor = a => new THREE.Vector3(...a);
  const suave = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
  const misturar = (a, b, p) => a.map((n, i) => n + (b[i] - n) * p);
  const falas = new WeakMap();
  // Usa os tempos das palavras já alinhadas à narração; não gera nem altera o áudio.
  K.falaEm = function (t, tl = K.tl) {
    if (!tl || !Number.isFinite(t)) return 0;
    if (!falas.has(tl)) falas.set(tl, (tl.frases || []).flatMap(f => f.palavras || []).filter(p => Number.isFinite(p.inicio) && p.fim > p.inicio).sort((a, b) => a.inicio - b.inicio));
    const palavras = falas.get(tl);
    let a = 0, b = palavras.length - 1, i = -1;
    while (a <= b) { const m = (a + b) >> 1; if (palavras[m].inicio <= t) { i = m; a = m + 1; } else b = m - 1; }
    const palavra = palavras[i];
    if (!palavra || t >= palavra.fim) return 0;
    const dur = palavra.fim - palavra.inicio, dt = t - palavra.inicio;
    const borda = Math.min(0.045, dur * 0.22);
    const envelope = suave(dt / borda) * suave((dur - dt) / borda);
    return envelope * (0.35 + 0.65 * Math.sin(dt * Math.PI * 7.2) ** 2);
  };

  // Chaves em segundos reais, independentes dos blocos de fala e dos congelamentos do jogo.
  K.cameraContinua = function (chaves) {
    if (!Array.isArray(chaves) || chaves.length < 2) throw new Error('A câmera precisa de pelo menos duas chaves.');
    const pontos = chaves.map((c, i) => {
      if (!Number.isFinite(c.t) || (i && c.t <= chaves[i - 1].t)) throw new Error('Tempos de câmera devem ser crescentes.');
      for (const nome of ['pos', 'alvo']) if (!Array.isArray(c[nome]) || c[nome].length !== 3 || !c[nome].every(Number.isFinite)) throw new Error('Vetor de câmera inválido: ' + nome);
      if (!Number.isFinite(c.fov) || c.fov < 10 || c.fov > 100) throw new Error('FOV de câmera inválido.');
      return { t: c.t, valores: [...c.pos, ...c.alvo, c.fov] };
    });
    const tangentes = pontos.map((c, i) => c.valores.map((_, j) => i === 0 || i === pontos.length - 1 ? 0 : (pontos[i + 1].valores[j] - pontos[i - 1].valores[j]) / (pontos[i + 1].t - pontos[i - 1].t)));
    function amostrar(t) {
      if (!Number.isFinite(t)) throw new Error('Tempo de câmera inválido.');
      let i = 0;
      while (i < pontos.length - 2 && t > pontos[i + 1].t) i++;
      const a = pontos[i], b = pontos[i + 1], dt = b.t - a.t;
      const p = Math.max(0, Math.min(1, (t - a.t) / dt)), p2 = p * p, p3 = p2 * p;
      const valores = a.valores.map((n, j) => (2 * p3 - 3 * p2 + 1) * n + (p3 - 2 * p2 + p) * dt * tangentes[i][j] + (-2 * p3 + 3 * p2) * b.valores[j] + (p3 - p2) * dt * tangentes[i + 1][j]);
      return { pos: valores.slice(0, 3), alvo: valores.slice(3, 6), fov: valores[6] };
    }
    return { amostrar, em(t, camera = K.camera) {
      const c = amostrar(t); camera.fov = c.fov; camera.updateProjectionMatrix(); K.mirar(c.pos, c.alvo, camera); return c;
    } };
  };

  // Ajuste analítico, sem os degraus de afastamento de 5,5% do enquadramento antigo.
  // Use um envelope estável da ação, para a entrada de um objeto não provocar zoom repentino.
  K.enquadrarSeguro = function (pontos, alvo, op = {}) {
    const camera = op.camera || K.camera, origem = vetor(alvo);
    camera.updateMatrixWorld(true);
    const direita = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const cima = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    const tras = new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion);
    const area = op.area || [48, 430, 1032, 1660];
    const limites = [1 - area[0] / 540, 1 - area[1] / 960, area[2] / 540 - 1, area[3] / 960 - 1];
    if (limites.some(n => n <= 0)) throw new Error('A área segura deve conter o centro do quadro.');
    const ty = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / camera.zoom, tx = ty * camera.aspect;
    let distancia = camera.position.distanceTo(origem);
    for (const p of pontos) {
      const v = p.isVector3 ? p.clone().sub(origem) : vetor(p).sub(origem);
      const x = v.dot(direita), y = v.dot(cima), z = v.dot(tras);
      distancia = Math.max(distancia, z + Math.abs(x) / (tx * limites[x < 0 ? 0 : 2]), z + Math.abs(y) / (ty * limites[y < 0 ? 3 : 1]), z + camera.near + 0.01);
    }
    camera.position.copy(origem).addScaledVector(tras, distancia);
    camera.lookAt(origem); camera.updateMatrixWorld(true);
    return distancia;
  };

  function gesto(nome, t, desde, intensidade) {
    const onda = Math.sin(t * 2.9), pulso = Math.sin(t * 4.1 + 0.8), i = intensidade;
    const base = { e: [-0.38 - 0.22 * onda * i, 0.26 + 0.12 * pulso * i, -0.65 - 0.20 * onda * i], d: [-0.8, 0.15, -0.6], inclinacao: 0.028 * onda * i, cabeca: 0, alcance: 0.5 + 0.12 * pulso * i, olhar: 0.7, surpresa: 0 };
    if (nome === 'apresentar') { base.e = [-0.75 - 0.20 * onda * i, 0.40 + 0.08 * pulso * i, -0.8]; base.alcance = 0.35; base.olhar = 0.2; }
    if (nome === 'montar' || nome === 'acompanhar') { base.e = [-0.38, 0.22, -0.8 - 0.1 * onda * i]; base.alcance = 0.85; base.olhar = 0.9; base.inclinacao = 0.025; }
    if (nome === 'pensar') { base.e = [-0.3, 0.3, -0.6]; base.d = [-1.15, -0.35, -2.2]; base.cabeca = 0.1; base.alcance = 0; base.olhar = 0.65; }
    if (nome === 'reagir') { const p = Math.sin(Math.PI * Math.max(0, Math.min(1, (t - desde) / 1.15))); base.e = [-0.8, 0.32 + 0.14 * p, -0.7]; base.surpresa = p; base.alcance = 0.35; }
    if (nome === 'segurar') { base.e = [-0.45, 0.2, -0.7]; base.alcance = 1; base.olhar = 0.9; }
    if (nome === 'acenar') { base.e = [0, 2.55 + Math.sin(t * 8) * 0.22, -0.3]; base.d = [-0.25, 0.12, -0.4]; base.alcance = 0; base.olhar = 0; }
    return base;
  }
  const apresentadorOriginal = K.apresentador;
  K.apresentador = function (op) {
    const b = apresentadorOriginal(op);
    b.falar = function (t, tl = K.tl) {
      const abertura = K.falaEm(t, tl), falando = abertura > 0.16;
      b.boca.visible = !falando; b.bocaAberta.visible = falando;
      if (falando) b.bocaAberta.scale.set(0.75 + abertura * 0.25, 0.28 + abertura * 0.92, 0.4);
      return abertura;
    };
    b.atuar = function (t, op = {}) {
      b.reset(t);
      const modo = op.acao || 'explicar', anterior = op.anterior || modo;
      const desde = op.desde ?? 0, peso = suave((t - desde) / (op.transicao ?? 0.45)), intensidade = op.intensidade ?? 0.7;
      const a = gesto(anterior, t, op.anteriorDesde ?? desde, intensidade), z = gesto(modo, t, desde, intensidade);
      const blend = chave => a[chave] + (z[chave] - a[chave]) * peso;
      const e = misturar(a.e, z.e, peso), d = misturar(a.d, z.d, peso);
      b.pose({ x: e[0], z: e[1], c: e[2] }, { x: d[0], z: d[1], c: d[2] });
      b.corpo.rotation.z = blend('inclinacao'); b.cabeca.rotation.z = blend('cabeca');
      b.humor(blend('surpresa') > 0.4 ? 'surpreso' : modo === 'pensar' ? 'triste' : 'feliz');
      if (op.falaAnimada ?? K.tl?.roteiro?.direcao?.falaAnimada) b.falar(op.tempoFala ?? K.t ?? t);
      if (b.olhos) {
        const f = (t + b.fasePisca) % 3.4;
        b.olhos.scale.y = 1 - 0.9 * suave(f / 0.065) * suave((0.16 - f) / 0.065);
      }
      const alvo = misturar(op.alvoAnterior || op.alvo || [0, 1.1, 0.2], op.alvo || [0, 1.1, 0.2], peso);
      if (blend('alcance') > 0) b.alcancar(alvo, 1, blend('alcance'));
      // Alterna a atenção entre a demonstração e o público; não deixa o rosto preso de lado.
      const atencao = blend('olhar') * (0.78 + 0.22 * Math.sin(t * 0.85));
      b.olhar(misturar([-0.2, 1.3, 4], alvo, atencao), 1);
      return { acao: modo, transicao: peso };
    };
    return b;
  };

  // Peça e mão compartilham a mesma trajetória. A pegada é um ponto LOCAL na peça.
  K.interacaoPeca = function (obj, op) {
    const de = vetor(op.de), controle = vetor(op.controle), ate = vetor(op.ate);
    if (!(op.fim > op.inicio)) throw new Error('Interação precisa de início e fim válidos.');
    return { em(t) {
      const p = suave((t - op.inicio) / (op.fim - op.inicio));
      const pos = de.clone().multiplyScalar((1 - p) ** 2).addScaledVector(controle, 2 * (1 - p) * p).addScaledVector(ate, p * p);
      if (obj.parent) { obj.parent.updateWorldMatrix(true, false); obj.position.copy(obj.parent.worldToLocal(pos)); } else obj.position.copy(pos);
      obj.updateWorldMatrix(true, true);
      const pegada = obj.localToWorld(vetor(op.pegada || [0, 0, 0]));
      const peso = op.peso ? op.peso(t) : 1;
      const mao = op.ator.alcancar(pegada.toArray(), op.lado ?? 1, peso);
      op.ator.olhar(pos.toArray(), 0.85);
      return { pegada: pegada.toArray(), mao, erro: vetor(mao).distanceTo(pegada), peso };
    } };
  };
})();

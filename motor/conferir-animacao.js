// Confere continuidade, repetição de quadros, contato das mãos e espaço na cena real.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const { chromium } = require('playwright');
const { validarMovimento } = require('./animacao');
const raiz = path.resolve(__dirname, '..');
assert.throws(() => validarMovimento({ intensidade: 2 }), /intensidade/);
assert.throws(() => validarMovimento({ cameraContinua: 1 }), /cameraContinua/);
assert.throws(() => validarMovimento({ falaAnimada: 1 }), /falaAnimada/);
const pasta = path.join(raiz, 'videos/carregador-sem-fio');
const tl = JSON.parse(fs.readFileSync(path.join(pasta, 'timeline.json'), 'utf8'));
tl.roteiro = JSON.parse(fs.readFileSync(path.join(pasta, 'roteiro.json'), 'utf8'));
tl.roteiro.direcao = validarMovimento(JSON.parse(fs.readFileSync(path.join(raiz, 'canal/movimento.json'), 'utf8')));
tl.roteiro.visual = JSON.parse(fs.readFileSync(path.join(raiz, 'canal/visual.json'), 'utf8'));
(async () => {
  const browser = await chromium.launch({ channel: 'chromium', args: ['--enable-gpu', '--ignore-gpu-blocklist'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    const erros = []; page.on('pageerror', e => erros.push(e.message));
    await page.setContent('<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:1080px;height:1920px;overflow:hidden}#palco{position:relative;width:1080px;height:1920px;overflow:hidden}</style></head><body><div id="palco"><div id="legenda" class="legenda"></div></div></body></html>');
    for (const arquivo of ['node_modules/three/build/three.min.js', 'motor/kit.js', 'motor/qualidade-visual.js', 'motor/pecas-e-personagens.js', 'motor/animacao.js', 'videos/carregador-sem-fio/cena.js']) await page.addScriptTag({ path: path.join(raiz, arquivo) });
    await page.evaluate(async tl => { K.init(); K.preparar(tl); await CENA.montar(tl); }, tl);
    const resultado = await page.evaluate(total => {
      const amostrar = t => {
        K.quadro(t, false);
        const m = CENA.movimento();
        return { camera: [...K.camera.position.toArray(), ...K.camera.quaternion.toArray(), K.camera.fov], pose: [m.menino.corpo, m.menino.cabeca, ...m.menino.bracos.flatMap(b => [b.ombro, b.cotovelo])].flatMap(o => [...o.position.toArray(), ...o.quaternion.toArray()]).concat(m.menino.bocaAberta.scale.toArray(), Number(m.menino.bocaAberta.visible), m.menino.olhos.scale.y) };
      };
      let conflitos = null, erroContato = 0, contatos = 0, saltoCamera = 0, saltoDepoisDaAbertura = 0, anterior = null, bocaAberta = 0, bocaFechada = 0, foraDoQuadro = null;
      for (let t = 0; t < total; t += 0.1) {
        const a = amostrar(t), m = CENA.movimento();
        const c = K.conflitosDeEspaco(CENA.espaco());
        if (c.length && !conflitos) conflitos = { t, c };
        if (m.contato?.peso > 0.999) { erroContato = Math.max(erroContato, m.contato.erro); contatos++; }
        if (m.menino.bocaAberta.visible) bocaAberta++; else bocaFechada++;
        const pontos = [[-0.15, 0, 0], [0.15, 0, 0], [0, 1.50, 0]].map(p => m.menino.g.localToWorld(new THREE.Vector3(...p)).toArray());
        for (const i of [0, 1]) { const mao = new THREE.Vector3(...m.menino.mao(i)); for (const x of [-0.075, 0.075]) for (const y of [-0.075, 0.075]) pontos.push(mao.clone().add(new THREE.Vector3(x, y, 0)).toArray()); }
        for (const ponto of pontos) { const [x, y] = K.tela(ponto); if (!foraDoQuadro && (x < 24 || x > 1056 || y < 350 || y > 1700)) foraDoQuadro = { t, x, y }; }
        if (anterior) {
          const distancia = new THREE.Vector3(...a.camera.slice(0, 3)).distanceTo(new THREE.Vector3(...anterior.camera.slice(0, 3)));
          saltoCamera = Math.max(saltoCamera, distancia);
          if (t > 2.2) saltoDepoisDaAbertura = Math.max(saltoDepoisDaAbertura, distancia);
        }
        anterior = a;
      }
      const limites = K.tl.frases.map(f => f.inicio).filter(t => t > 0.1);
      let saltoNaFala = 0;
      for (const t of limites) {
        const a = amostrar(t - 0.00001), b = amostrar(t + 0.00001);
        saltoNaFala = Math.max(saltoNaFala, ...a.camera.map((n, i) => Math.abs(n - b.camera[i])));
      }
      const aleatorios = [49.1, 2.6, 35.2, 89.8, 57.3, 49.1], repeticao = amostrar(49.1);
      for (const t of aleatorios) amostrar(t);
      const depois = amostrar(49.1);
      const deltaRepeticao = Math.max(...[...repeticao.camera, ...repeticao.pose].map((n, i) => Math.abs(n - [...depois.camera, ...depois.pose][i])));
      const percurso = CENA.movimento().percurso;
      let mudancaVelocidade = 0;
      for (const t of [2.1, 12, 25, 35, 44, 50, 55, 67, 79, 86]) {
        const e = 0.00001, a = percurso.amostrar(t - e), b = percurso.amostrar(t), c = percurso.amostrar(t + e);
        for (const chave of ['pos', 'alvo']) for (let j = 0; j < 3; j++) mudancaVelocidade = Math.max(mudancaVelocidade, Math.abs((b[chave][j] - a[chave][j]) / e - (c[chave][j] - b[chave][j]) / e));
      }
      function tamanho(t) { amostrar(t); return Math.abs(K.tela([-0.69, 0, 0.17])[1] - K.tela([-0.69, 1.56, 0.17])[1]); }
      const alturaInicial = tamanho(0), alturaAproximada = tamanho(2.1), zoomInicial = alturaAproximada / alturaInicial;
      const falaTeste = { frases: [{ palavras: [{ inicio: 1, fim: 1.4 }, { inicio: 1.7, fim: 2.0 }] }] };
      const falaConferida = K.falaEm(0, falaTeste) === 0 && K.falaEm(1.15, falaTeste) > 0.16 && K.falaEm(1.5, falaTeste) === 0 && K.falaEm(2.1, falaTeste) === 0;
      return { amostras: Math.ceil(total * 10), conflitos, erroContato, contatos, saltoCamera, saltoDepoisDaAbertura, saltoNaFala, deltaRepeticao, mudancaVelocidade, bocaAberta, bocaFechada, foraDoQuadro, zoomInicial, falaConferida };
    }, tl.total);
    console.log(JSON.stringify(resultado));
    assert.equal(resultado.conflitos, null, 'Interseção na cena.');
    assert.ok(resultado.contatos > 10 && resultado.erroContato < 0.025, 'A mão perdeu contato com a peça.');
    // A aproximação inicial é mais rápida; depois dela a câmera volta ao limite suave anterior.
    assert.ok(resultado.saltoCamera < 0.15 && resultado.saltoDepoisDaAbertura < 0.08 && resultado.saltoNaFala < 0.0001, 'A câmera saltou entre as falas.');
    assert.ok(resultado.deltaRepeticao < 1e-8, 'A pose depende da ordem dos quadros.');
    assert.ok(resultado.mudancaVelocidade < 0.0001, 'A trajetória mudou de velocidade bruscamente.');
    assert.ok(resultado.bocaAberta > 100 && resultado.bocaFechada > 10 && resultado.falaConferida, 'A boca não acompanhou a fala e as pausas.');
    assert.equal(resultado.foraDoQuadro, null, 'Mãos, cabeça ou pés saíram da área útil.');
    assert.ok(resultado.zoomInicial > 1.03 && resultado.zoomInicial < 1.3, 'A aproximação inicial ficou imperceptível ou exagerada.');
    assert.deepEqual(erros, [], 'Erro de JavaScript.');
    fs.mkdirSync(path.join(pasta, 'testes'), { recursive: true });
    for (const t of [1.0, 4.2, 18.0, 35.2, 48.8, 55.5, 58.8, 89.9]) {
      await page.evaluate(t => K.quadro(t), t);
      await page.screenshot({ path: path.join(pasta, 'testes', `animacao-${t}s.png`) });
    }
    console.log('Animação conferida: câmera contínua, gestos repetíveis, contato e espaço.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e.message); process.exitCode = 1; });

// Comparações sem narração e sem alterar os vídeos ou as capas já entregues.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const crypto = require('crypto');
const { chromium } = require('playwright');
const { prepararModelos, instalarSuporteModelos } = require('./carregar-modelos');
const { validarVisual } = require('./qualidade-visual');
const raiz = path.resolve(__dirname, '..');
const configuracao = validarVisual(JSON.parse(fs.readFileSync(path.join(raiz, 'canal/visual.json'), 'utf8')));
assert.throws(() => validarVisual({ perfil: 'inexistente' }), /desconhecido/);
assert.throws(() => validarVisual({ exposicao: Infinity }), /exposicao/);
assert.throws(() => validarVisual({ alcanceSombras: -1 }), /alcanceSombras/);
const casos = [
  { pasta: 'carregador-sem-fio', tempo: 35.2 },
  { pasta: 'exemplo', tempo: 30 },
  { pasta: 'demonstracao-biblioteca-3d', tempo: 12 }
];
const html = '<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&display=block"><style>html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#000}#palco{position:relative;width:1080px;height:1920px;overflow:hidden}</style></head><body><div id="palco"><div class="legenda" id="legenda"></div></div></body></html>';
function timeline(pasta, roteiro) {
  const arquivo = path.join(pasta, 'timeline.json');
  if (fs.existsSync(arquivo)) return { ...JSON.parse(fs.readFileSync(arquivo, 'utf8')), roteiro };
  let t = 0.15;
  const frases = roteiro.frases.map(f => {
    const texto = f.texto.replace(/\*/g, ''), palavras = texto.split(/\s+/), dur = palavras.length / 3.08;
    const frase = { ...f, texto, marcado: f.texto, inicio: t, fim: t + dur, palavras: palavras.map((w, i) => ({ texto: w, inicio: t + i * dur / palavras.length, fim: t + (i + 1) * dur / palavras.length })) };
    t += dur + 0.1; return frase;
  });
  if (roteiro.cauda) { frases.push({ plano: roteiro.cauda.plano, texto: '', marcado: '', inicio: t, fim: t + roteiro.cauda.segundos, palavras: [] }); t += roteiro.cauda.segundos; }
  return { frases, total: t, estilo: roteiro.estilo, capa: roteiro.capa, roteiro };
}
async function aquecer(page, t) { await page.evaluate(t => { for (let i = 0; i < 8; i++) K.quadro(t); }, t); }
async function identidade(page) {
  return page.evaluate(() => {
    const itens = [], geometrias = new Map();
    const hash = atributo => {
      if (!atributo) return null;
      const a = atributo.array, bytes = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
      let h = 2166136261;
      for (let i = 0; i < bytes.length; i++) h = Math.imul(h ^ bytes[i], 16777619);
      return h >>> 0;
    };
    K.scene.traverse(obj => {
      if (!obj.geometry) return;
      const g = obj.geometry;
      if (!geometrias.has(g)) geometrias.set(g, { posicoes: hash(g.attributes.position), indices: hash(g.index) });
      itens.push({ id: obj.uuid, geometria: g.uuid, vertices: g.attributes.position?.count, dados: geometrias.get(g), cores: (Array.isArray(obj.material) ? obj.material : [obj.material]).map(m => m.color?.getHexString()) });
    });
    return { itens, camera: [...K.camera.position.toArray(), ...K.camera.quaternion.toArray(), K.camera.fov].map(n => Number(n.toFixed(6))) };
  });
}
async function velocidade(page, t) {
  const tempos = [];
  for (let i = 0; i < 8; i++) {
    const inicio = performance.now();
    await page.evaluate(t => K.quadro(t), t + i / 60);
    await page.screenshot({ type: 'jpeg', quality: 92 });
    tempos.push(performance.now() - inicio);
  }
  return Math.round(tempos.sort((a, b) => a - b)[4]);
}
(async () => {
  const browser = await chromium.launch({ channel: 'chromium', args: ['--enable-gpu', '--ignore-gpu-blocklist'] });
  const resultados = [];
  try {
    for (const caso of casos) {
      const pasta = path.join(raiz, 'videos', caso.pasta), saida = path.join(pasta, 'testes');
      fs.mkdirSync(saida, { recursive: true });
      const roteiro = JSON.parse(fs.readFileSync(path.join(pasta, 'roteiro.json'), 'utf8'));
      const tl = timeline(pasta, roteiro), modelos = prepararModelos(roteiro, raiz);
      const t = Math.min(caso.tempo, tl.total - 0.5);
      const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
      const erros = [];
      page.on('pageerror', e => erros.push(e.message));
      await page.setContent(html, { waitUntil: 'networkidle' });
      if (modelos.length) await instalarSuporteModelos(page, modelos, raiz);
      else await page.addScriptTag({ path: path.join(raiz, 'node_modules/three/build/three.min.js') });
      for (const arquivo of ['motor/kit.js', 'motor/qualidade-visual.js', 'motor/pecas-e-personagens.js', 'motor/animacao.js', `videos/${caso.pasta}/cena.js`]) await page.addScriptTag({ path: path.join(raiz, arquivo) });
      await page.evaluate(() => Promise.all([document.fonts.load('900 80px Montserrat'), document.fonts.load('800 80px Montserrat')]));
      await page.evaluate(async ({ tl, modelos }) => { K.init(); K.preparar(tl); await K.carregarModelos(modelos); await CENA.montar(tl); K.configurarVisual({ perfil: 'original' }); }, { tl, modelos: modelos.map(({ id, url }) => ({ id, url })) });
      await aquecer(page, t);
      const antes = await identidade(page);
      const original = path.join(saida, 'motor-grafico-original.png');
      await page.screenshot({ path: original });
      const msOriginal = await velocidade(page, t);
      await page.evaluate(config => K.configurarVisual(config), configuracao);
      await aquecer(page, t);
      const novo = path.join(saida, 'motor-grafico-cartoon.png');
      await page.screenshot({ path: novo });
      assert.deepEqual(await identidade(page), antes, 'A melhoria alterou geometria, paleta ou câmera: ' + caso.pasta);
      const msCartoon = await velocidade(page, t);
      const luz = await page.evaluate(t => {
        K.quadro(t); const a = [K.hemi.intensity, K.sol.intensity];
        K.quadro(t + 1); K.quadro(t);
        const b = [K.hemi.intensity, K.sol.intensity];
        const conflitos = typeof CENA.espaco === 'function' ? K.conflitosDeEspaco(CENA.espaco()) : [];
        return { a, b, conflitos, ambiente: Boolean(K.scene.environment), perfil: K.estadoVisual().perfil };
      }, t);
      assert.deepEqual(luz.a, luz.b, 'A luz acumulou intensidade ao repetir um instante.');
      assert.equal(luz.conflitos.length, 0, 'A cena de comparação tem interseções.');
      assert.equal(luz.ambiente, true); assert.equal(luz.perfil, 'cartoon');
      await page.evaluate(() => K.configurarVisual({ perfil: 'original' }));
      await aquecer(page, t);
      assert.deepEqual(await identidade(page), antes, 'Voltar ao original alterou a identidade.');
      const reversivel = await page.evaluate(() => K.estadoVisual().perfil === 'original' && K.renderer.toneMapping === THREE.NoToneMapping);
      assert.equal(reversivel, true, 'O perfil anterior não foi restaurado.');
      assert.deepEqual(erros, [], 'Erro de JavaScript no navegador.');
      const hash = arquivo => crypto.createHash('sha256').update(fs.readFileSync(arquivo)).digest('hex');
      assert.notEqual(hash(original), hash(novo), 'O novo perfil não mudou a imagem.');
      const resultado = { cena: caso.pasta, tempo: t, geometrias: antes.itens.length, identidadePreservada: true, originalMs: msOriginal, cartoonMs: msCartoon, diferencaPercentual: Math.round((msCartoon / msOriginal - 1) * 100) };
      resultados.push(resultado); console.log(JSON.stringify(resultado));
      await page.close();
    }
  } finally { await browser.close(); }
  console.log('Visual conferido: ' + resultados.length + ' cenas, incluindo noite e modelos GLB.');
})().catch(e => { console.error(e.message); process.exitCode = 1; });

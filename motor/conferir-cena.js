// Conferência reutilizável de uma cena, antes de gastar créditos ou renderizar o vídeo completo.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const { spawn } = require('child_process');
const { once } = require('events');
const { chromium } = require('playwright');
const { validarMovimento } = require('./animacao');
const argFps = process.argv.indexOf('--fps');
const fpsConferencia = argFps > 0 ? Number(process.argv[argFps + 1]) : 10;
if (!Number.isFinite(fpsConferencia) || fpsConferencia < 1 || fpsConferencia > 120) throw new Error('Use --fps entre 1 e 120.');
const raiz = path.resolve(__dirname, '..'), pasta = path.resolve(process.argv[2] || '.');
const roteiro = JSON.parse(fs.readFileSync(path.join(pasta, 'roteiro.json'), 'utf8'));
roteiro.direcao = validarMovimento({ ...JSON.parse(fs.readFileSync(path.join(raiz, 'canal/movimento.json'), 'utf8')), ...roteiro.direcao });
roteiro.visual = { ...JSON.parse(fs.readFileSync(path.join(raiz, 'canal/visual.json'), 'utf8')), ...roteiro.visual };
let tl;
const arquivo = path.join(pasta, 'timeline.json');
if (fs.existsSync(arquivo)) tl = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
else {
  let t = 0.15;
  const frases = roteiro.frases.map(f => {
    const texto = f.texto.replace(/\*/g, ''), palavras = texto.split(/\s+/), dur = palavras.length * 60 / roteiro.alvoPpm;
    const frase = { ...f, texto, marcado: f.texto, inicio: t, fim: t + dur, palavras: palavras.map((p, i) => ({ texto: p, inicio: t + i * dur / palavras.length, fim: t + (i + 0.95) * dur / palavras.length })) };
    t += dur + 0.1; return frase;
  });
  if (roteiro.cauda) { frases.push({ plano: roteiro.cauda.plano, inicio: t, fim: t + roteiro.cauda.segundos, texto: '', marcado: '', palavras: [] }); t += roteiro.cauda.segundos; }
  tl = { frases, total: t, estilo: roteiro.estilo, capa: roteiro.capa };
}
tl.roteiro = roteiro;
(async () => {
  const browser = await chromium.launch({ channel: 'chromium', args: ['--enable-gpu', '--ignore-gpu-blocklist'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    const erros = []; page.on('pageerror', e => erros.push(e.message));
    await page.setContent('<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&display=block"><style>html,body{margin:0;width:1080px;height:1920px;overflow:hidden}#palco{position:relative;width:1080px;height:1920px;overflow:hidden}</style></head><body><div id="palco"><div id="legenda" class="legenda"></div></div></body></html>');
    for (const arq of ['node_modules/three/build/three.min.js', 'motor/kit.js', 'motor/qualidade-visual.js', 'motor/pecas-e-personagens.js', 'motor/animacao.js', 'motor/ambientes.js']) await page.addScriptTag({ path: path.join(raiz, arq) });
    await page.addScriptTag({ path: path.join(pasta, 'cena.js') });
    await page.evaluate(() => Promise.all([document.fonts.load('900 80px Montserrat'), document.fonts.load('800 80px Montserrat')]));
    await page.evaluate(async tl => { K.init(); K.preparar(tl); await CENA.montar(tl); }, tl);
    const resultado = await page.evaluate(({ total, fps }) => {
      let amostras = 0, conflito = null, fora = null, erroContato = 0, contatos = 0;
      const capturar = t => {
        K.quadro(t, false);
        const m = CENA.movimento?.(), b = m?.menino;
        const dados = [...K.camera.position.toArray(), ...K.camera.quaternion.toArray(), K.camera.fov, ...(b ? [b.g, b.corpo, b.cabeca, ...b.bracos.flatMap(a => [a.ombro, a.cotovelo])].flatMap(o => [...o.position.toArray(), ...o.quaternion.toArray()]).concat(b.bocaAberta.scale.toArray(), Number(b.bocaAberta.visible)) : [])];
        if (!dados.every(Number.isFinite)) throw new Error('Posição ou câmera inválida em ' + t.toFixed(3) + 's.');
        return dados;
      };
      for (let quadro = 0; quadro < Math.ceil(total * fps); quadro++) {
        const t = quadro / fps;
        capturar(t); amostras++;
        const c = CENA.espaco ? K.conflitosDeEspaco(CENA.espaco()) : [];
        if (c.length && !conflito) conflito = { t, c };
        const m = CENA.movimento?.(), b = m?.menino;
        if (m?.contato?.peso > 0.999) { contatos++; erroContato = Math.max(erroContato, m.contato.erro); }
        if (b) {
          const pontos = [[-0.15, 0, 0], [0.15, 0, 0], [0, 1.5, 0]].map(p => b.g.localToWorld(new THREE.Vector3(...p)).toArray());
          for (const i of [0, 1]) { const mao = new THREE.Vector3(...b.mao(i)); for (const x of [-0.075, 0.075]) for (const y of [-0.075, 0.075]) pontos.push(mao.clone().add(new THREE.Vector3(x, y, 0)).toArray()); }
          for (const p of pontos) { const [x, y] = K.tela(p); if (!fora && (x < 24 || x > 1056 || y < 350 || y > 1700)) fora = { t, x, y }; }
        }
      }
      const t = Math.min(total * 0.44, total - 1), antes = capturar(t);
      for (const p of [0.1, 0.9, 0.3, 0.7]) capturar(total * p);
      const depois = capturar(t), repeticao = Math.max(...antes.map((n, i) => Math.abs(n - depois[i])));
      let corteNaFala = 0;
      for (const f of K.tl.frases) { const a = capturar(Math.max(0, f.inicio - 0.00001)), b = capturar(f.inicio + 0.00001); corteNaFala = Math.max(corteNaFala, ...a.slice(0, 8).map((n, i) => Math.abs(n - b[i]))); }
      return { amostras, duracao: total, conflito, fora, contatos, erroContato, repeticao, corteNaFala };
    }, { total: tl.total, fps: fpsConferencia });
    console.log(JSON.stringify(resultado));
    assert.equal(resultado.conflito, null, 'Objetos no mesmo espaço.');
    assert.equal(resultado.fora, null, 'Parte do personagem fora do quadro.');
    assert.ok(resultado.erroContato < 0.025, 'Mão sem contato com a peça.');
    assert.ok(resultado.repeticao < 1e-8 && resultado.corteNaFala < 0.0001, 'Pose ou câmera depende dos quadros anteriores.');
    assert.deepEqual(erros, [], 'Erro de JavaScript na cena.');
    const saida = path.join(pasta, 'testes'); fs.mkdirSync(saida, { recursive: true });
    const escolhidos = ['gancho', 'furinho', 'montar_circuito', 'antena_rotulo', 'atravessar', 'enfraquece', 'resposta', 'obstaculos', 'metal', 'reposicionar', 'por_dentro', 'cartao'];
    for (const n of escolhidos) { const f = tl.frases.find(f => f.plano === n); if (!f) continue; const t = (f.inicio + f.fim) / 2; await page.evaluate(t => K.quadro(t), t); await page.screenshot({ path: path.join(saida, `conferencia-${n}.png`) }); }
    const argumento = process.argv.indexOf('--trecho');
    if (argumento > 0) {
      const janela = process.argv[argumento + 1]?.split(',').map(Number);
      if (!janela || janela.length !== 2 || !janela.every(Number.isFinite) || janela[0] < 0 || janela[1] <= janela[0] || janela[1] > tl.total) throw new Error('Use --trecho inicio,fim dentro da duração da cena.');
      await page.evaluate(() => { K.renderer.setPixelRatio(0.5); K.sol.shadow.mapSize.set(1024, 1024); K.sol.shadow.blurSamples = 8; });
      const destino = path.join(saida, 'previa-revelacao-sem-voz.mp4');
      const encoder = spawn(require('ffmpeg-static'), ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', '30', '-i', 'pipe:0', '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', destino], { windowsHide: true, stdio: ['pipe', 'ignore', 'pipe'] });
      let falha = ''; encoder.stderr.on('data', b => { falha += b.toString(); });
      const terminou = once(encoder, 'close');
      const f0 = Math.round(janela[0] * 30), f1 = Math.round(janela[1] * 30);
      for (let f = f0; f < f1; f++) {
        await page.evaluate(t => K.quadro(t), f / 30);
        const quadro = await page.screenshot({ type: 'jpeg', quality: 92 });
        if (!encoder.stdin.write(quadro)) await once(encoder.stdin, 'drain');
      }
      encoder.stdin.end();
      const [codigo] = await terminou;
      if (codigo) throw new Error('Falha ao codificar a prévia: ' + falha);
      console.log('Prévia visual sem narração: ' + destino);
      await page.evaluate(() => { K.renderer.setPixelRatio(1); K.sol.shadow.mapSize.set(4096, 4096); });
    }
    await page.evaluate(titulo => K.capa(titulo), roteiro.capa);
    await page.screenshot({ path: path.join(saida, 'capa-proposta.png') });
    fs.writeFileSync(path.join(saida, 'conferencia.json'), JSON.stringify({ ...resultado, timelineEstimada: !fs.existsSync(arquivo), tempos: tl.frases.map(f => ({ plano: f.plano, inicio: f.inicio, fim: f.fim })) }, null, 2));
    console.log('Cena conferida e imagens preparadas em ' + saida);
  } finally { await browser.close(); }
})().catch(e => { console.error(e.message); process.exitCode = 1; });

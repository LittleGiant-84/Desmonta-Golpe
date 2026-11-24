// Confere clonagem, animação por tempo absoluto, articulações e peças do kit.
// --exportar também salva as três peças originais em GLB, com os componentes separados.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const { chromium } = require('playwright');
const { prepararModelos, instalarSuporteModelos } = require('./carregar-modelos');
const raiz = path.resolve(__dirname, '..');
const itens = [
  { id: 'robo', arquivo: 'motor/modelos/robot-expressive/RobotExpressive.glb' },
  { id: 'som', arquivo: 'motor/modelos/boom-box/BoomBox.glb' }
];
for (const id of ['placa', 'bateria', 'engrenagem']) {
  const arquivo = 'motor/modelos/pecas-originais/' + id + '.glb';
  if (fs.existsSync(path.join(raiz, arquivo))) itens.push({ id, arquivo });
}

(async () => {
  const modelos = prepararModelos({ modelos: itens }, raiz);
  assert.throws(() => prepararModelos({ modelos: [itens[0], itens[0]] }, raiz), /único/);
  assert.throws(() => prepararModelos({ modelos: [{ id: 'fora', arquivo: '../fora.glb' }] }, raiz));
  const browser = await chromium.launch({ channel: 'chromium', args: ['--enable-gpu', '--ignore-gpu-blocklist'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
    await page.setContent('<div id="palco"><div id="legenda"></div></div>');
    await instalarSuporteModelos(page, modelos, raiz);
    await page.addScriptTag({ path: path.join(__dirname, 'kit.js') });
    await page.addScriptTag({ path: path.join(__dirname, 'pecas-e-personagens.js') });
    const resultado = await page.evaluate(async lista => {
      function conferir(condicao, mensagem) { if (!condicao) throw new Error(mensagem); }
      const iguais = (a, b) => a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) < 1e-6);
      function pose(modelo) {
        const valores = [];
        modelo.raiz.traverse(obj => { if (obj.isBone) valores.push(...obj.quaternion.toArray()); });
        return valores;
      }
      K.init();
      K.preparar({ frases: [], total: 1, estilo: 'redondo' });
      await K.carregarModelos(lista);
      const a = K.modelo('robo', { altura: 1.4 });
      const b = K.modelo('robo', { altura: 1.4 });
      let skins = 0;
      a.raiz.traverse(obj => { if (obj.isSkinnedMesh) skins++; });
      conferir(skins > 0 && a.animacoes.length === 14, 'O robô precisa carregar o esqueleto e os 14 clipes.');
      a.em(0.34, { acao: 'Walking' });
      const primeira = pose(a);
      a.em(1.1, { acao: 'Walking' });
      conferir(!iguais(primeira, pose(a)), 'Os ossos precisam se mover.');
      a.em(0.34, { acao: 'Walking' });
      conferir(iguais(primeira, pose(a)), 'Voltar no tempo mudou a pose.');
      b.em(0.9, { acao: 'Wave' });
      conferir(iguais(primeira, pose(a)), 'Um clone alterou o outro.');
      const mistura = { acao: 'Wave', anterior: 'Idle', mistura: 0.4 };
      a.em(0.6, mistura);
      const mesclada = pose(a);
      a.em(2, { acao: 'Walking' });
      a.em(0.6, mistura);
      conferir(iguais(mesclada, pose(a)), 'A mistura de clipes depende do quadro anterior.');

      const ator = K.apresentador({ roupa: 'moletom' });
      ator.g.position.set(-0.6, 0.1, 0.2);
      ator.g.rotation.y = 0.35;
      ator.g.scale.setScalar(1.12);
      ator.reset(0.5);
      ator.g.updateMatrixWorld(true);
      const alvo = ator.corpo.localToWorld(new THREE.Vector3(0.42, 0.96, 0.32)).toArray();
      ator.alcancar(alvo, 1);
      const erro = new THREE.Vector3(...ator.mao(1)).distanceTo(new THREE.Vector3(...alvo));
      conferir(erro < 1e-5, 'A mão não alcançou o alvo com o ator girado e escalado.');
      const prop = new THREE.Object3D();
      ator.prenderNaMao(prop, 1);
      conferir(prop.parent === ator.maos[1], 'A peça não foi presa à mão.');
      const longe = ator.corpo.localToWorld(new THREE.Vector3(3, 3, 3)).toArray();
      ator.alcancar(longe, 1);
      conferir(ator.bracos[1].ombro.quaternion.toArray().every(Number.isFinite), 'Alvo fora do alcance gerou uma pose inválida.');
      ator.olhar(alvo);
      conferir(Math.abs(ator.cabeca.rotation.y) <= 0.7 && Math.abs(ator.cabeca.rotation.x) <= 0.45, 'Olhar fora dos limites.');

      const placa = K.placaEletronica();
      const bateria = K.bateria();
      const engrenagem = K.engrenagem();
      placa.abrir(1);
      conferir(placa.partes.chip.position.z === 0.32, 'Chip não se separou da placa.');
      placa.abrir(0);
      conferir(placa.partes.chip.position.z === 0, 'Chip não voltou à posição original.');
      bateria.carga(0);
      conferir(bateria.partes.nivel.children.every(x => !x.visible), 'Indicador da bateria não esvaziou.');
      bateria.carga(1);
      engrenagem.girar(1, 0.25);
      conferir(Math.abs(engrenagem.g.rotation.z - Math.PI / 2) < 1e-8, 'Rotação de engrenagem incorreta.');
      engrenagem.girar(0);
      const obstaculo = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4));
      const movel = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4));
      const solidos = [{ nome: 'mesa', obj: obstaculo }, { nome: 'personagem', obj: movel }];
      conferir(K.conflitosDeEspaco(solidos).length === 1, 'Interseção entre objetos não foi detectada.');
      movel.position.x = 0.6;
      conferir(K.conflitosDeEspaco(solidos).length === 0, 'Objetos afastados foram marcados como conflito.');
      movel.position.x = 0;
      movel.visible = false;
      conferir(K.conflitosDeEspaco(solidos).length === 0, 'Objeto escondido foi marcado como conflito.');
      for (const id of ['placa', 'bateria', 'engrenagem']) {
        if (lista.some(x => x.id === id)) {
          const importado = K.modelo(id, { altura: 0.6 });
          conferir(importado.raiz.children.length > 0, 'A peça exportada não carregou: ' + id);
          if (id === 'placa') conferir(Boolean(importado.raiz.getObjectByName('Chip')), 'O GLB perdeu a separação do chip.');
        }
      }
      window.PECAS_PARA_EXPORTAR = { placa: placa.g, bateria: bateria.g, engrenagem: engrenagem.g };
      return { modelos: lista.length, clipes: a.animacoes.length, malhasComEsqueleto: skins, erroDaMao: erro };
    }, modelos.map(({ id, url }) => ({ id, url })));
    if (process.argv.includes('--exportar')) {
      const destino = path.join(__dirname, 'modelos', 'pecas-originais');
      fs.mkdirSync(destino, { recursive: true });
      const exportados = await page.evaluate(async () => {
        const { GLTFExporter } = await import('http://fabrica.local/addons/exporters/GLTFExporter.js');
        const exportador = new GLTFExporter();
        const resultados = [];
        for (const [nome, g] of Object.entries(window.PECAS_PARA_EXPORTAR)) {
          const glb = await exportador.parseAsync(g, { binary: true, onlyVisible: false });
          resultados.push({ nome, bytes: Array.from(new Uint8Array(glb)) });
        }
        return resultados;
      });
      for (const { nome, bytes } of exportados) {
        const arquivo = path.join(destino, nome + '.glb');
        const buffer = Buffer.from(bytes);
        if (fs.existsSync(arquivo)) {
          if (!fs.readFileSync(arquivo).equals(buffer)) throw new Error('Já existe uma versão diferente da peça: ' + arquivo);
        } else fs.writeFileSync(arquivo, buffer, { flag: 'wx' });
        prepararModelos({ modelos: [{ id: nome, arquivo: path.relative(raiz, arquivo) }] }, raiz);
        console.log('Peça exportada: ' + path.relative(raiz, arquivo));
      }
    }
    console.log('Biblioteca conferida: ' + JSON.stringify(resultado));
  } finally {
    await browser.close();
  }
})().catch(erro => { console.error(erro.message); process.exitCode = 1; });

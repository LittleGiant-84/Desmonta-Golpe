// Ponte local entre os GLBs do projeto e os módulos oficiais do Three.js instalado.
const fs = require('fs');
const path = require('path');

const ORIGEM = 'http://fabrica.local';

function dentroDaPasta(raiz, arquivo) {
  const relativo = path.relative(raiz, arquivo);
  return relativo !== '' && !path.isAbsolute(relativo) && relativo !== '..' && !relativo.startsWith('..' + path.sep);
}

function prepararModelos(roteiro, raiz) {
  const itens = roteiro.modelos || [];
  if (!Array.isArray(itens)) throw new Error('modelos deve ser uma lista de { id, arquivo }.');
  const ids = new Set();
  return itens.map(item => {
    if (!item || typeof item.id !== 'string' || !/^[a-z0-9_-]+$/i.test(item.id) || ids.has(item.id)) throw new Error('Cada modelo precisa de um id único com letras, números ou hífen.');
    if (typeof item.arquivo !== 'string' || path.isAbsolute(item.arquivo) || !/\.glb$/i.test(item.arquivo)) throw new Error('O arquivo do modelo precisa ser um GLB dentro do projeto.');
    const arquivo = path.resolve(raiz, item.arquivo);
    if (!dentroDaPasta(raiz, arquivo) || !dentroDaPasta(fs.realpathSync(raiz), fs.realpathSync(arquivo))) throw new Error('Modelo fora da pasta do projeto.');
    const bytes = fs.readFileSync(arquivo);
    if (bytes.length < 20 || bytes.readUInt32LE(0) !== 0x46546c67 || bytes.readUInt32LE(4) !== 2 || bytes.readUInt32LE(8) !== bytes.length) throw new Error('GLB 2.0 inválido: ' + item.arquivo);
    const fimJson = 20 + bytes.readUInt32LE(12);
    if (bytes.readUInt32LE(16) !== 0x4e4f534a || fimJson > bytes.length) throw new Error('GLB sem descrição JSON válida.');
    const json = JSON.parse(bytes.subarray(20, fimJson).toString('utf8').trim());
    const recursos = [...(json.buffers || []), ...(json.images || [])];
    if (recursos.some(r => r.uri && !r.uri.startsWith('data:'))) throw new Error('Use GLBs com imagens e geometria incorporadas: ' + item.arquivo);
    ids.add(item.id);
    return { id: item.id, arquivo, url: ORIGEM + '/modelos/' + item.id + '.glb' };
  });
}

async function instalarSuporteModelos(page, modelos, raiz) {
  const addons = path.join(raiz, 'node_modules', 'three', 'examples', 'jsm');
  const arquivos = new Map(modelos.map(m => [new URL(m.url).pathname, m.arquivo]));
  arquivos.set('/vendor/three.module.js', path.join(raiz, 'node_modules', 'three', 'build', 'three.module.js'));
  await page.route(ORIGEM + '/**', async route => {
    const pathname = decodeURIComponent(new URL(route.request().url()).pathname);
    let arquivo = arquivos.get(pathname);
    if (!arquivo && pathname.startsWith('/addons/') && pathname.endsWith('.js')) {
      const candidato = path.resolve(addons, pathname.slice('/addons/'.length));
      if (dentroDaPasta(addons, candidato) && fs.existsSync(candidato) && dentroDaPasta(fs.realpathSync(addons), fs.realpathSync(candidato))) arquivo = candidato;
    }
    if (!arquivo) return route.fulfill({ status: 404, body: 'Recurso local não encontrado.' });
    await route.fulfill({ path: arquivo, contentType: pathname.endsWith('.js') ? 'text/javascript' : 'model/gltf-binary', headers: { 'access-control-allow-origin': '*' } });
  });
  await page.addScriptTag({ type: 'importmap', content: JSON.stringify({ imports: { three: ORIGEM + '/vendor/three.module.js' } }) });
  await page.evaluate(async origem => {
    const [three, loader, skeleton, ambiente] = await Promise.all([
      import(origem + '/vendor/three.module.js'),
      import(origem + '/addons/loaders/GLTFLoader.js'),
      import(origem + '/addons/utils/SkeletonUtils.js'),
      import(origem + '/addons/environments/RoomEnvironment.js')
    ]);
    // O kit personaliza algumas geometrias; a cópia mantém o namespace do módulo intacto.
    window.THREE = { ...three };
    window.FABRICA_GLTF = { Loader: loader.GLTFLoader, clonar: skeleton.clone, Ambiente: ambiente.RoomEnvironment };
  }, ORIGEM);
}

module.exports = { prepararModelos, instalarSuporteModelos };

// Sincronização por etapa. Não observa pastas nem registra conteúdo de credenciais.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const DESTINO = 'LittleGiant-84/Desmonta-Golpe';
const MAX_BYTES = 45 * 1024 * 1024;
const BINARIOS = /\.(?:png|jpe?g|webp|gif|ico|wav|ogg|mp3|glb|blend|ttf|woff2?|pdf|zip)$/i;

function proibido(nome) {
  const n = nome.replace(/\\/g, '/').toLowerCase();
  const base = n.split('/').pop();
  return (base.startsWith('.env') && base !== '.env.exemplo') ||
    /\.(?:pem|key|p12|pfx|mp4|mov|webm|avi|mkv)$/i.test(base) ||
    ['.npmrc', '.netrc', 'credentials.json', 'secrets.json'].includes(base) ||
    /(?:^|\/)(?:node_modules|narracao|testes|versoes|\.cache|\.npm-cache)(?:\/|$)/.test(n);
}

function segredo(dados) {
  let texto;
  if (dados[0] === 0xff && dados[1] === 0xfe) texto = dados.subarray(2).toString('utf16le');
  else if (dados.subarray(0, 8000).includes(0)) return false;
  else texto = dados.toString('utf8');
  return [
    /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
    /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
    /\bgithub_pat_[A-Za-z0-9_]{40,}\b/,
    /\bsk[-_](?:proj-)?[A-Za-z0-9_-]{24,}\b/,
    /\bAKIA[A-Z0-9]{16}\b/,
    /\b(?:api[_-]?key|access[_-]?token|client[_-]?secret|password|senha)["']?\s*[:=]\s*["'][A-Za-z0-9+/=_-]{24,}["']/i,
    /https?:\/\/[^\s/@:]+:[^\s/@]+@github\.com/i,
  ].some(re => re.test(texto));
}

function destinoValido(url) {
  // O GitHub não diferencia maiúsculas no nome do repositório (o clone pode vir como desmonta-golpe)
  return [`https://github.com/${DESTINO}.git`, `https://github.com/${DESTINO}`,
    `git@github.com:${DESTINO}.git`].map(u => u.toLowerCase()).includes(String(url).toLowerCase());
}

function git(args, op = {}) {
  const r = spawnSync('git', args, {
    cwd: ROOT, windowsHide: true, maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'Never' },
  });
  if (r.error) throw new Error('Não foi possível executar o Git: ' + r.error.code);
  if (r.status !== 0 && !(op.aceitar || []).includes(r.status)) {
    // Git não recebe nem imprime tokens: o endereço remoto é validado antes da rede.
    throw new Error(`Git ${args[0]} não concluiu: ${r.stderr.toString('utf8').trim()}`);
  }
  return op.resultado ? r : op.buffer ? r.stdout : r.stdout.toString('utf8').trim();
}

function validarArquivo(nome, dados, bytes = dados?.length) {
  if (proibido(nome)) throw new Error(`Arquivo local/protegido no conjunto de envio: ${nome}`);
  if (bytes > MAX_BYTES) throw new Error(`Arquivo acima de 45 MiB: ${nome}. Separar o recurso antes de enviar.`);
  if (dados && segredo(dados)) throw new Error(`Possível credencial em ${nome}. Conteúdo não exibido; envio interrompido.`);
}

function conferirPasta() {
  const nomes = git(['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { buffer: true })
    .toString('utf8').split('\0').filter(Boolean);
  for (const nome of new Set(nomes)) {
    if (proibido(nome)) validarArquivo(nome, null, 0);
    const local = path.join(ROOT, nome);
    if (!fs.existsSync(local)) continue; // Exclusão legítima a ser registrada pelo Git.
    const stat = fs.lstatSync(local);
    if (stat.isSymbolicLink()) throw new Error(`Link simbólico precisa de revisão: ${nome}`);
    if (!stat.isFile()) throw new Error(`Entrada Git não é arquivo regular: ${nome}`);
    validarArquivo(nome, BINARIOS.test(nome) ? null : fs.readFileSync(local), stat.size);
  }
  return new Set(nomes).size;
}

const blobsConferidos = new Set();
function conferirSnapshot(ref) {
  const entradas = git(['ls-tree', '-r', '-z', ref], { buffer: true }).toString('utf8').split('\0').filter(Boolean);
  for (const entrada of entradas) {
    const tab = entrada.indexOf('\t'), nome = entrada.slice(tab + 1);
    const [modo, tipo, sha] = entrada.slice(0, tab).split(' ');
    if (tipo !== 'blob' || !['100644', '100755'].includes(modo)) throw new Error(`Entrada Git especial precisa de revisão: ${nome}`);
    validarArquivo(nome, null, 0);
    if (blobsConferidos.has(sha)) continue;
    const bytes = Number(git(['cat-file', '-s', sha]));
    validarArquivo(nome, BINARIOS.test(nome) ? null : git(['cat-file', 'blob', sha], { buffer: true }), bytes);
    blobsConferidos.add(sha);
  }
}

function main(args = process.argv.slice(2)) {
  const conferir = args.includes('--conferir');
  if (args.some(a => a.startsWith('--') && a !== '--conferir')) throw new Error('Opção desconhecida. Use --conferir ou uma descrição da etapa.');
  const mensagem = args.filter(a => a !== '--conferir').join(' ').trim() || 'Sincroniza etapa da Fábrica Cartoon';
  const branch = git(['symbolic-ref', '--quiet', '--short', 'HEAD']);
  if (!destinoValido(git(['remote', 'get-url', 'origin'])) || !destinoValido(git(['remote', 'get-url', '--push', 'origin']))) {
    throw new Error('O origin não corresponde ao repositório autorizado Desmonta-Golpe.');
  }
  if (path.resolve(git(['rev-parse', '--show-toplevel'])).toLowerCase() !== ROOT.toLowerCase()) throw new Error('Executar somente na pasta deste projeto.');
  for (const nome of ['MERGE_HEAD', 'CHERRY_PICK_HEAD', 'REVERT_HEAD', 'rebase-merge', 'rebase-apply']) {
    if (fs.existsSync(path.resolve(ROOT, git(['rev-parse', '--git-path', nome])))) throw new Error('Há uma integração Git em andamento; concluir antes de sincronizar.');
  }
  const total = conferirPasta();
  console.log(`Destino: ${DESTINO} / ${branch}. ${total} arquivos permitidos conferidos.`);
  const status = git(['status', '--short', '--untracked-files=all']);
  console.log(status || 'Nenhuma alteração na pasta.');
  if (conferir) { console.log('Conferência concluída; nada foi adicionado, commitado ou enviado.'); return; }

  const lock = path.resolve(ROOT, git(['rev-parse', '--git-path', 'fabrica-sync.lock']));
  let fd;
  try { fd = fs.openSync(lock, 'wx'); }
  catch (e) { if (e.code === 'EEXIST') throw new Error('Já existe uma sincronização em andamento. Verificar o processo antes de remover o lock.'); throw e; }
  try {
    fs.writeFileSync(fd, JSON.stringify({ pid: process.pid, inicio: new Date().toISOString() }));
    git(['fetch', 'origin']);
    const remoto = `refs/remotes/origin/${branch}`;
    const existe = git(['show-ref', '--verify', '--quiet', remoto], { resultado: true, aceitar: [1] }).status === 0;
    if (existe && git(['merge-base', '--is-ancestor', remoto, 'HEAD'], { resultado: true, aceitar: [1] }).status !== 0) {
      throw new Error('A branch remota tem alterações novas. Revisar e integrar antes do envio; nenhum arquivo local foi descartado.');
    }
    // Conferir também commits locais anteriores: um segredo apagado depois ainda estaria no histórico.
    const anteriores = git(['rev-list', 'HEAD', '--not', '--remotes=origin']).split('\n').filter(Boolean);
    for (const commit of anteriores) conferirSnapshot(commit);
    git(['add', '--all', '--', '.']);
    const arvore = git(['write-tree']);
    conferirSnapshot(arvore);
    if (git(['write-tree']) !== arvore) throw new Error('O índice mudou durante a revisão; repetir a sincronização.');
    const mudou = git(['diff', '--cached', '--quiet'], { resultado: true, aceitar: [1] }).status === 1;
    if (mudou) console.log(git(['commit', '-m', mensagem]));
    else console.log('Nenhuma alteração nova para commit.');
    const commit = git(['rev-parse', 'HEAD']);
    if (git(['rev-parse', 'HEAD^{tree}']) !== arvore) throw new Error('O commit não corresponde à árvore revisada. Envio cancelado; trabalho preservado.');
    // SHA explícito e push normal: não envia um commit concorrente nem sobrescreve histórico remoto.
    git(['push', 'origin', `${commit}:refs/heads/${branch}`]);
    git(['config', `branch.${branch}.remote`, 'origin']);
    git(['config', `branch.${branch}.merge`, `refs/heads/${branch}`]);
    const confirmado = git(['ls-remote', '--heads', 'origin', `refs/heads/${branch}`]).split(/\s/)[0];
    if (confirmado !== commit) throw new Error('A referência remota mudou após o envio; conferir o estado remoto antes de anunciar conclusão.');
    console.log(`SINCRONIZADO: ${commit}`);
    console.log(`https://github.com/${DESTINO}/commit/${commit}`);
    if (git(['status', '--porcelain'])) console.log('Há alterações locais feitas durante o envio; executar novamente ao concluir essa etapa.');
  } finally {
    fs.closeSync(fd);
    fs.unlinkSync(lock);
  }
}

if (require.main === module) {
  try { main(); }
  catch (e) { console.error(e.message); console.error('Sincronização não confirmada. Trabalho local preservado.'); process.exitCode = 1; }
}
module.exports = { proibido, segredo, destinoValido, validarArquivo };

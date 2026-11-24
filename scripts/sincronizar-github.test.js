'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { proibido, segredo, destinoValido, validarArquivo } = require('./sincronizar-github');

test('só permite os endereços do repositório autorizado', () => {
  assert(destinoValido('https://github.com/LittleGiant-84/Desmonta-Golpe.git'));
  assert(destinoValido('git@github.com:LittleGiant-84/Desmonta-Golpe.git'));
  assert(destinoValido('https://github.com/LittleGiant-84/desmonta-golpe'));
  for (const url of ['https://github.com/Outro/projeto.git', 'https://github.com/LittleGiant-84/Desmonta-Golpe.git.evil',
    'https://' + 'usuario:senha' + '@github.com/LittleGiant-84/Desmonta-Golpe.git']) assert(!destinoValido(url));
});

test('barra credenciais e mídia local mesmo se alguém forçar git add', () => {
  for (const nome of ['.env', 'sub/.env.local', '.npmrc', 'id.key', 'certificado.pfx',
    'videos/exemplo/video.mp4', 'videos/exemplo/narracao/1.mp3', 'a/testes/preview.png', 'a/versoes/cena.js']) assert(proibido(nome), nome);
  for (const nome of ['.env.exemplo', 'canal/voz.json', 'videos/tema/roteiro.json', 'videos/tema/capa.png', 'motor/modelos/robo.glb']) assert(!proibido(nome), nome);
});

test('detecta tokens sem mostrar o valor no erro', () => {
  const token = 'sk_' + 'a'.repeat(40);
  assert(segredo(Buffer.from('ELEVENLABS_API_KEY=' + token)));
  assert(segredo(Buffer.from('ghp_' + 'b'.repeat(36))));
  assert(segredo(Buffer.from('-----BEGIN ' + 'PRIVATE KEY-----')));
  const utf16 = Buffer.concat([Buffer.from([255, 254]), Buffer.from(token, 'utf16le')]);
  assert(segredo(utf16));
  assert.throws(() => validarArquivo('config.json', Buffer.from(token)), e => e.message.includes('config.json') && !e.message.includes(token));
  assert(!segredo(Buffer.from('ELEVENLABS_API_KEY=COLE_SUA_CHAVE_AQUI')));
  assert(!segredo(Buffer.from('const apiKey = process.env.ELEVENLABS_API_KEY;')));
});

test('barra arquivos grandes antes do envio', () => {
  assert.throws(() => validarArquivo('capa.png', null, 46 * 1024 * 1024), /45 MiB/);
});

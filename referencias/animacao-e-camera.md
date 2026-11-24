# Animação e câmera contínua

O motor carrega `motor/animacao.js` depois das peças. O padrão de direção vem de `canal/movimento.json`; um vídeo
pode substituir campos com `direcao` no `roteiro.json`. `--direcao-original` desliga os três recursos na comparação.
O personagem, as cores, a luz e a voz não mudam. Cenas antigas continuam funcionando; para usar a direção nova,
o `cena.js` precisa chamar os ajudantes abaixo. Exemplo integrado: `videos/carregador-sem-fio/cena.js`.

A direção segue também a referência de dinâmica enviada pelo usuário, analisada em `referencias/dinamica/guia.md`.
Além dos três recursos principais, `falaAnimada` ativa a articulação cartoon nos tempos das palavras da narração.
`--direcao-original` também desliga essa articulação. As cenas anteriores permanecem compatíveis.

## Câmera

Criar uma vez em `montar(tl)` e avaliar em cada quadro, sem reiniciar ao trocar a frase:

```js
percurso = K.cameraContinua([
  { t: 0,  pos: [0.1, 2.8, 5.2], alvo: [0.1, 0.95, 0], fov: 48 },
  { t: 12, pos: [0.3, 2.7, 5.0], alvo: [0.1, 0.95, 0], fov: 45 },
  { t: 25, pos: [0.1, 2.8, 5.2], alvo: [0.1, 0.95, 0], fov: 48 }
]);
const camera = percurso.em(K.t);
K.enquadrarSeguro(pontosDoEnvelope, camera.alvo);
```

As chaves interpolam posição, alvo e abertura com velocidade contínua. `amostrar(t)` consulta o percurso sem mover
a câmera. Usar `K.t` para a câmera seguir durante congelamentos; peças e gestos podem continuar em `tc`.
Um zoom de aproximadamente 5 a 10% costuma bastar; conferir a aproximação real depois do ajuste de segurança.
O envelope deve cobrir a ação inteira, inclusive mãos e pés. Se ele precisar mudar, interpolar seus limites com
antecedência. Evitar recalculá-lo a partir dos objetos visíveis: isso produz um afastamento súbito quando eles entram.
A área segura padrão é `[48, 430, 1032, 1660]` em 1080×1920; pode ser substituída em `{area: [...]}`.

## Atuação

`menino.atuar(tc, {acao, anterior, desde, anteriorDesde, alvo, alvoAnterior, transicao: 0.45, intensidade: 0.7})`.
Inclui reset, braços, inclinação do corpo, olhar e expressão. Ações: `explicar`, `apresentar`, `montar`, `acompanhar`,
`pensar`, `reagir`, `segurar`, `acenar`. Passar a ação anterior e seus tempos para misturar os gestos sem salto.
Manter a posição do personagem definida antes da chamada; para ações físicas, aplicar o contato depois.

`apresentador.falar(t, tl)` anima a abertura da boca usando `K.falaEm(t, tl)` (0–1). O tempo vem do alinhamento já
salvo da voz, sem gerar novo áudio. Usar tempo real `K.t` para continuar acompanhando a narração durante congelamentos
da ação. A boca repousa nas pausas; as piscadas são suaves e independentes dos gestos. A articulação é por palavras,
sem promessa de sincronização fonética exata.

## Interação com uma peça

```js
interacao = K.interacaoPeca(peca.g, {
  ator: menino, lado: 1, inicio: 47.6, fim: 50.0,
  de: [-0.12, 1.15, 0.30], controle: [0.02, 1.20, 0.24], ate: [0.10, 1.03, 0.20],
  pegada: [-0.40, 0, 0.05] // coordenada LOCAL da peça, antes da escala/rotação
});
const contato = interacao.em(tc);
```

O percurso é dado em coordenadas do mundo e funciona mesmo com a peça dentro de um grupo transformado.
`contato` retorna mão, pegada e distância entre elas. `peso(t)` opcional permite aproximar e soltar a mão suavemente.
A peça deve ter escala e rotação definidas antes de `em`. Não colocar o alvo fora do alcance dos braços: a IK limita
a extensão e não arrasta o corpo. Planejar a posição da peça ou do apresentador e conferir os volumes com
`CENA.espaco()`. A mão pode tocar a peça; tronco, bancada e componentes independentes precisam continuar separados.

## Conferência

`npm run conferir-animacao` verifica a cena do carregador: 901 instantes, continuidade entre falas, velocidade nas
chaves, repetição fora de ordem, contato com a placa e colisões, além da boca, da área útil e da aproximação inicial.
Gera quadros de abertura, fala, montagem e encerramento em `videos/carregador-sem-fio/testes/`.
Conferir também um trecho em movimento antes do render final; nenhuma mudança da direção exige gerar nova voz.

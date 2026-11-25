# Identidade visual do canal

> É isso que faz o seu vídeo não parecer com o de ninguém. O `/instalar` preenche com você.
> O `/novo-video` copia o bloco "No roteiro.json" pra todo vídeo novo.

## Personagem

A detetive: menina de cabelo preto com **sobretudo de detetive amarelo** (capa de chuva): gola levantada e lapelas
pretas, cinto preto com fivela dourada, botões pretos, mangas compridas com punho preto e sapatos pretos. Sem boina.
Usa lupa nas investigações. Diferente do menino azul e laranja do outro canal (O Mundo da Tecnologia).
Como fazer: o motor só desenha menina de vestido, então o vestido fica preto (`vestido: #111827`) e o sobretudo é
montado no `cena.js` por cima do corpo (copiar o bloco "Sobretudo de detetive" de `videos/voz-clonada/cena.js`).

Nas cenas com interação, usar `K.apresentador` para orientar o olhar, apontar para as pistas e segurar o celular,
o boleto ou a maquininha. Modelos externos em `referencias/modelos-e-personagens.md`.

- Tipo: `menino` ou `menina`
- Roupa: `camiseta` (camiseta + bermuda) ou `moletom` (moletom com capuz, mochila, calça)
- Cores que dá pra trocar: `camiseta`, `bermuda`, `tenis`, `cabelo`, `pele`, `moletom`, `punho`, `calca`, `mochila`, `vestido`

## Lugar e hora padrão

Cozinha à noite: a hora em que chega a mensagem estranha. Para mostrar o caminho do dinheiro ou o que acontece
dentro do celular, usar o lugar `escuro` (o "mundo de dentro").

Lugares: `quintal`, `praia`, `cozinha`, `espaco`, `lua`, `escuro`. Horas: `dia`, `tarde`, `noite`.

## Estilo

Animação 3D arredondada, perfil `cartoon` (`canal/visual.json`). Paleta de alerta: amarelo `#facc15`, preto
`#111827` e branco; vermelho `#ef4444` só para o momento em que a vítima cai e para as pistas.

- `"estilo": "redondo"`: sombreamento liso, quinas arredondadas, personagem com olho de verdade
- `"fps": 60`: movimento mais fluido (no PC o render leva poucos minutos; na nuvem, horas)
- `"efeitos": {"abaixa": true}`: os efeitos sonoros ficam por baixo da voz

## Direção de animação

Câmera contínua com poucos cortes (`canal/movimento.json`). O **congelamento** no segundo em que a vítima cai é a
marca do canal: imagem para, cor puxa pro vermelho e a detetive entra no quadro. Cada pista aparece com a palavra que
a explica. Telas de celular são desenhadas pela cena (sem logo nem nome de app real).

## Voz

Feminina, brasileira, séria mas próxima, como uma amiga avisando. O padrão de todos os vídeos é a **Voz feminina
natural** das suas vozes na ElevenLabs (ID `IYSWsktXvPfMJJ7GKBNY`, escolhida em 24/11/2026; substitui a Bia). Também em
`canal/voz.json`, que o motor carrega sozinho. A voz do computador (Microsoft Maria) fica só para testes com
`--voz-teste`.

## Plaquinha do final

DESCONFIA
SEMPRE!

## Logo

Coloque o logo do canal em `canal/logo.png` (quadrado). Ele aparece no fim de todo vídeo.

## No roteiro.json

```json
"estilo": "redondo",
"fps": 60,
"efeitos": {"abaixa": true},
"personagem": {"tipo": "menina", "roupa": "moletom", "cores": {"vestido": "#111827", "cabeloMenina": "#1f1a17", "tenisBranco": "#111827", "moletom": "#facc15", "punho": "#111827", "calca": "#111827", "mochila": "#facc15", "tenis": "#f4f1ea", "cabelo": "#1f1a17"}},
"lugar": "cozinha",
"hora": "noite",
"voz": {"motor": "elevenlabs", "id": "IYSWsktXvPfMJJ7GKBNY", "modelo": "eleven_multilingual_v2", "velocidade": 1.1, "acelerar": "auto"}
```

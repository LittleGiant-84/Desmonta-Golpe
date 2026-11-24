# Novo vídeo

> No Claude Code: `/novo-video <tema>`. Em outra IA que trabalha na pasta: "faz um vídeo sobre <tema>".

Do tema ao vídeo pronto pra postar. O usuário não escreve código: a IA escreve o `roteiro.json` e o `cena.js` do
vídeo, seguindo **`referencias/COMO-FAZER-O-VIDEO.md`** (o método completo) e o exemplo em `videos/exemplo/`.

A IA conduz e a pessoa opina: o roteiro, as prévias e o vídeo pronto terminam com perguntas, e cada resposta (pedido,
mudança, nota, "tá ótimo") vai na hora pro `canal/historico.md`, como manda o `AGENTS.md`.

## Antes

Rodar `npm run conferir`. Se não der **PRONTO**, parar aqui e seguir `comandos/instalar.md` (só o que falta); depois
voltar pro tema que a pessoa pediu.

Ler `canal/canal.md`, `canal/identidade.md`, `canal/aprendizados.md`, `metodo/formula-roteiro.md`,
`referencias/COMO-FAZER-O-VIDEO.md` e o `roteiro.json` e o `cena.js` de `videos/exemplo/`. Pra saber o que o motor já
tem pronto, `referencias/kit-indice.md`.
Do canal, aplicar em todo vídeo: o nicho e o estilo do vídeo (tom da narração), o **mecanismo único** (no gancho e no
fechamento), o **estilo da capa** (no `CENA.capa()` e no campo `capa`), a voz e o personagem de `canal/identidade.md`.
Para a revelação, buscar uma referência técnica primária e anotar em `roteiro.md` o que ela confirma. Se usar um modelo
ou textura de terceiros, registrar a origem e a licença antes de integrar ao vídeo.
De `canal/aprendizados.md`, aplicar o gosto da pessoa (vale mais que o padrão do guia) e as lições técnicas (pra não
repetir erro de vídeo anterior).
Se o usuário não deu tema, sugerir 3 da `canal/pauta.md` ou que passem no teste de tema da fórmula, cada um com a
pergunta do gancho, e dizer qual você escolheria e por quê (puxando pro que já deu resultado, se os aprendizados
disserem).

## 1. Roteiro (`videos/<tema>/roteiro.md`)

Pasta: `videos/<tema-curto-sem-acento-com-hifen>/` (ex: `videos/guarda-chuva/`). Escrever como manda o passo 1 do
guia: fórmula, tamanho (primeiro vídeo ~60 s; depois, mais de 1 minuto), ciência conferida e as **ideias de cena,
frase por frase** (o que a câmera mostra, o que o personagem faz, que peça entra, que texto aparece).

Mostrar o roteiro na conversa e fechar com:
- uma linha com o que aplicou de `canal/aprendizados.md`, se tiver algo ("Usei o que você me ensinou: ...")
- 2 ou 3 perguntas curtas, com a sua sugestão. Modelo:
  1. "O começo prende? Tenho outra opção: '<gancho B>'. Eu ficaria com o <A ou B>, porque..."
  2. "Tá bom de tamanho (uns <n> segundos) ou prefere mais curto ou mais longo?"
  3. "Quer mudar alguma coisa? Se tá bom, é só dizer 'segue'."

**Esperar o ok**, a não ser que o usuário tenha pedido pra seguir direto ("faz tudo", "pode seguir") ou isso esteja em
"Jeito de trabalhar" de `canal/aprendizados.md`. Pediu mudança: ajustar, mostrar só o que mudou e perguntar de novo.

## 2. `roteiro.json` e `cena.js`

Passos 2 e 3 do guia:
- `roteiro.json` com um `plano` de ação por frase e o `jogo` (falha → corrige; no máximo 2 `conserta` com ⏪). A câmera usa trajetórias contínuas atravessando várias falas, conforme `canal/movimento.json` e `referencias/animacao-e-camera.md`.
- Em `voz`, use a configuração do bloco "No roteiro.json" de `canal/identidade.md` quando houver uma voz escolhida.
  Sem essa configuração, use `{"motor": "elevenlabs", "id": "TX3LPaxmHKxFdv7VOQHJ", "velocidade": 1.1, "acelerar": "auto"}`
  se `.env` tiver `ELEVENLABS_API_KEY`, ou `{"motor": "teste"}` se a chave estiver ausente.
- `cena.js` a partir do `videos/exemplo/cena.js`: cenário, o objeto peça por peça, personagem e cores de
  `canal/identidade.md`, uma função por plano, capa e final (por fora → por dentro → plaquinha)
- Para interações com peças, usar `K.apresentador` e seus controles de olhar e alcance. Consultar
  `referencias/modelos-e-personagens.md` para declarar modelos GLB e reutilizar placas, baterias e engrenagens.
- Planejar espaços para corpos, móveis e peças. Em cenas com esses elementos próximos, declarar `CENA.espaco()`
  para a conferência de volumes e verificar visualmente os quadros de maior aproximação.

## 3. Prévias (sempre antes do render)

```
node motor/render.js videos/<tema> --voz-teste --previa <tempos>
node motor/render.js videos/<tema> --voz-teste --trecho <inicio>,<fim> --previa-rapida
node motor/render.js videos/<tema> --voz-teste --capa
```

Os tempos: um no meio de cada frase (ficam em `videos/<tema>/timeline.json` depois da 1ª rodada). **Abrir as imagens**
e passar no checklist do guia: personagem atuando e inteiro no quadro, câmera suave com zoom leve, peça certa aparecendo, nenhum
texto encavalado, capa no nível da `videos/exemplo/capa.png`. Ajustar o `cena.js` e repetir até ficar bom.

Gerar uma prévia em movimento da revelação para conferir o gesto, a câmera e a reação da peça no tempo da fala.
O modo rápido gera 540 × 960 a 30 fps. Sem `--voz-teste`, ele reaproveita a narração profissional quando ela já está
salva. Se faltar áudio, pede voz de teste em vez de gastar créditos.

As prévias e os trechos ficam em `videos/<tema>/testes/`; a capa, em `videos/<tema>/capa.png`. Quadro, capa
alternativa ou comparação que a IA fizer por conta própria também vai em `testes/` (regras em "Onde fica cada coisa",
no `AGENTS.md`).

Passou no checklist: **mostrar pra pessoa** a capa e 2 ou 3 prévias (links pros arquivos, pra ela abrir com um clique)
e perguntar: "O personagem, as cores e o lugar estão como você imaginou? Posso fazer o vídeo completo? Mudar agora é
mais rápido que depois do vídeo pronto." Pular só se "Jeito de trabalhar" de `canal/aprendizados.md` disser que ela
não quer ver prévia.

## 4. Render

```
node motor/render.js videos/<tema>
```

Mostrar a duração (teto do Shorts: 3:00) e seguir direto pro passo 5.

## 5. Entrega completa (logo depois do render, sem esperar pedido)

O vídeo só está pronto com **`video.mp4`, `capa.png` e `publicacao.md`** na pasta. Na mesma hora do render:

1. Conferir que saíram o `video.mp4` e a `capa.png` (o render gera a capa sozinho; se faltar, rodar com `--capa`)
2. Seguir `comandos/publicar.md` nesta pasta: gera o `publicacao.md` (título de busca, descrição, hashtags e comentário fixado)
3. Marcar o tema em `canal/pauta.md` (Roteiro ✅, Vídeo ✅)
4. Os testes ficam em `testes/`, sem apagar: é ali que a pessoa acha o que foi conferido. Na pasta do vídeo, só a
   entrega e o roteiro
5. Mostrar: a duração, os 3 arquivos (com links e a pasta onde estão), o título e a descrição prontos pra copiar, e
   avisar que a capa é o 1º quadro do
   vídeo (0:00): no YouTube Shorts é só escolher esse quadro; no TikTok, no Instagram e no Kwai vai a `capa.png`
6. **Pedir a opinião** do vídeo pronto: "O que achou? Me dá uma nota de 1 a 5 e me diz o que mais gostou e o que
   mudaria." Junto, uma sugestão sua do que dá pra melhorar no próximo. A resposta vai pro histórico (e vira regra em
   `canal/aprendizados.md` se for o caso). Pediu ajuste neste vídeo: mover o vídeo e a capa atuais pra `versoes/` com
   a data e refazer (frase que não mudou não gasta voz de novo)
7. Fechar com uma linha: "Postou? Volta em 2 ou 3 dias e me conta como foi: eu uso isso pra acertar os próximos."
8. Se este é o 5º, 10º, 15º... vídeo pronto (fora o exemplo), fazer a revisão dos aprendizados (`AGENTS.md`)

## Rascunho rápido (opcional)

Se o usuário pedir só um rascunho bem rápido, dá pra usar a cena-modelo `montagem`: o `roteiro.json` descreve o objeto
e ninguém escreve `cena.js` (campos em `referencias/montagem.md`). Sai mais simples (personagem parado, câmera fixa,
sem ⏪), então avisar antes.

## Se algo der errado

- Erro no `cena.js`: a mensagem do navegador aparece no terminal (`página: ...`); corrigir e rodar a prévia de novo
- Personagem fora do quadro ou colado na câmera: afastar a câmera ou mudar o lugar dele (em 9:16 a câmera enxerga pouco de lado)
- Duração acima de 3:00: encurtar o roteiro (o Shorts corta em 3:00)
- Cena escura demais: trocar o céu (`K.ceu('dia')`, `'tarde'`) ou dar `emissive` na peça principal
- Resolveu um erro que deu trabalho: uma linha em "Lições técnicas" de `canal/aprendizados.md` (o que deu errado e
  como resolveu), pra não repetir no próximo vídeo

# Comece aqui

**Pra que serve:** a Fábrica Cartoon transforma um tema em um vídeo curto animado em 3D, pronto pra postar
(roteiro, animação, narração, legenda, som e capa). Você escolhe o assunto e aprova o roteiro; a IA faz o resto.

**Dúvidas?** Fale com o suporte: **suporte@maquinapreguica3d.click** ou **WhatsApp (13) 98207-0278**. O mesmo passo a passo, com imagens, está no
`COMECE-AQUI.pdf`, que vem no zip junto com esta pasta.

Do zero ao primeiro vídeo postado. Siga na ordem.

## Escolha o seu jeito

Funciona com qualquer IA, até gratuita. O que muda é quanto ela faz sozinha e o capricho do vídeo.

| | Jeito 1: IA de código, que trabalha na pasta (recomendado) | Jeito 2: qualquer IA de chat (grátis) |
|---|---|---|
| **Qual IA** | **Claude Code** (o que usamos no nosso canal, plano pago). Também leem estas instruções: Codex, Gemini CLI, Cursor e GitHub Copilot no VS Code, alguns com plano grátis | ChatGPT, Gemini, Claude, DeepSeek, Copilot, inclusive nos planos gratuitos |
| **Como funciona** | Você pede o vídeo e a IA faz tudo: roteiro, cena própria, prévias, render, capa e texto de postar | A IA escreve o roteiro, você copia a resposta e um comando faz o vídeo |
| **Como fica** | O melhor: personagem atuando, câmera mudando a cada frase, ritmo de videogame | Mais simples: o objeto montado peça por peça, com câmera e personagem automáticos |
| **Passo a passo** | Continua abaixo | `comandos/modo-chat.md` |

Testado com o Claude Code. As outras IAs de código leem as mesmas instruções (`AGENTS.md`); o resultado depende de
quão bom é o modelo que você usa.

## O que você precisa

- **Um computador** com Windows, Mac ou Linux, e uns 2 GB livres
- **Uma IA** (veja a tabela acima)
- **Node.js 18 ou mais novo** (grátis, em nodejs.org). No jeito 1, a IA confere pra você
- **Opcional:** uma conta na ElevenLabs pra voz profissional. Sem ela, o vídeo sai com a voz do próprio computador,
  que serve pra testar

## 1. Instalar (uns 10 minutos)

1. Abra esta pasta na sua IA de código
2. No Claude Code, digite **`/instalar`**. Nas outras, escreva **instalar**

Ou só diga "oi": a IA confere o que falta instalar ou configurar, te mostra um resumo e explica como funciona. Depois
ela instala o que falta, renderiza o vídeo de exemplo pra ver se está tudo certo e faz umas perguntas rápidas sobre o
seu canal: nome, tema, jeito de falar e o seu personagem. As respostas vão pra pasta `canal/`. Perdeu-se? Digite **`/ajuda`** (ou "me ajuda").

## 2. Primeiro vídeo

No Claude Code, digite **`/novo-video`** e o tema. Nas outras, escreva o pedido. Exemplos:

```
/novo-video como funciona um guarda-chuva
faz um vídeo sobre como funciona um guarda-chuva
```

A IA:
1. escreve o roteiro na fórmula (pergunta curiosa no começo, objeto montado peça por peça), te mostra e pergunta o que
   você achou;
2. depois do seu ok, monta a cena (o objeto peça por peça, o personagem atuando, a câmera) e te mostra umas prévias;
3. renderiza o vídeo em `videos/<tema>/video.mp4`, já entrega a capa (`capa.png`) e o texto de postar
   (`publicacao.md`) e pede a sua opinião.

Quer mudar alguma coisa? É só pedir: "deixa a panela vermelha", "troca o gancho", "fala mais devagar".

**Onde fica cada coisa:** tudo de um vídeo fica na pasta dele, `videos/<tema>/`. Ali estão o vídeo, a capa e o texto
de postar. As imagens e vídeos de teste ficam em `testes/`, e as versões antigas, se você pediu pra refazer, em
`versoes/`. As amostras de voz ficam em `canal/testes-de-voz/`.

**Dica:** o primeiro vídeo fica melhor com uns 60 segundos. Depois que pegar o jeito, faça vídeos de mais de 1 minuto
(é o que conta pra monetização em várias redes).

## 3. Postar

O vídeo já sai com o `publicacao.md`, com o título, a descrição, as hashtags e o comentário pra fixar. Quer outra
versão do texto? No Claude Code, digite **`/publicar`**; nas outras, peça "escreve o texto de postar".

- **TikTok, Instagram e Kwai:** envie o `capa.png` como capa
- **YouTube Shorts:** não aceita capa enviada; escolha o **1º quadro do vídeo**, que é a própria capa

## 4. A IA aprende com você

Tudo o que você pede, elogia ou corrige fica anotado na pasta `canal/`, e a IA lê isso antes de cada vídeo novo:
- `canal/historico.md`: tudo o que você disse, com a data
- `canal/aprendizados.md`: o resumo do que ela aprendeu do seu gosto. Pode abrir e editar: apagou uma linha, ela esquece

Pra ela aprender mais rápido:
- Comece com **"sempre"** ou **"nunca"** pra virar regra: "sempre de noite", "nunca use gíria"
- Responda quando ela perguntar o que você achou: uma nota de 1 a 5 e o que mudaria já ajuda muito
- Depois de postar, volte e conte como foi (visualizações, comentários): ela aprende o que dá certo no seu canal
- Pergunte **"o que você já aprendeu?"** pra ver o que ela sabe de você

## Se der erro

Copie a mensagem de erro e cole pra IA. Ela conhece o motor e resolve. Não resolveu? Escreva pra
suporte@maquinapreguica3d.click com o print do erro, o sistema do computador (Windows, Mac ou Linux) e o que você
estava fazendo.

## Voz profissional (opcional)

1. Crie uma conta em elevenlabs.io e copie a sua chave de API
2. Crie um arquivo `.env` nesta pasta (use o `.env.exemplo` como modelo) com `ELEVENLABS_API_KEY=sua-chave`
3. No jeito 1, a IA usa a voz profissional sozinha quando encontra a chave. No jeito 2, o comando `npm run colar` também
4. Pra ouvir uma voz antes de escolher: `npm run testar-voz -- <id da voz>` (o id fica na página da voz, na
   ElevenLabs). A amostra vai pra `canal/testes-de-voz/`

Cada frase narrada fica guardada na pasta do vídeo: renderizar de novo não gasta créditos, só frase nova ou alterada.
Antes de monetizar, confira se o seu plano da ElevenLabs permite uso comercial.

# Instalar

> No Claude Code: `/instalar`. Em outra IA que trabalha na pasta: "instalar".

Deixa tudo pronto pro primeiro vídeo. Fala simples: quem compra pode nunca ter usado terminal.
**Nenhum vídeo começa antes desta instalação terminar**: sem o canal configurado, o vídeo sai genérico e gasta a
cota da IA à toa. Se a pessoa pedir um vídeo no meio, explicar isso em uma frase e continuar de onde parou.

## 1. Dependências

Fazer só o que o relatório do `npm run conferir` marcou como `[falta]`, mais o teste do passo 4, que roda sempre na
primeira instalação. Antes de cada passo, uma frase do que vai fazer e quanto leva; depois, só o resultado numa linha
(sem despejar log):

1. `node --version`. Precisa ser 18 ou mais. Se não tiver Node, o passo a passo de `comandos/boas-vindas.md`
   ("Node.js não instalado")
2. `npm install` na raiz da pasta (traz o motor 3D, o navegador de render e o ffmpeg)
3. `npx playwright install chromium` (o navegador que desenha os quadros)
4. Teste: `node motor/render.js videos/exemplo --voz-teste --previa 3,30` e abrir as duas imagens (ficam em
   `videos/exemplo/testes/`). Se aparecer a lanterna, está instalado. Apagar a pasta `videos/exemplo/testes/` depois

Se der erro, ler a mensagem e resolver. No Windows, se o PowerShell bloquear scripts, rodar os comandos pelo
"Prompt de Comando". No Linux, a voz de teste precisa do `espeak-ng` (`sudo apt install espeak-ng`).

## 2. O canal (entrevista)

Perguntar **uma coisa por vez**, com um exemplo em cada, e aceitar "escolhe você" (aí sugerir e confirmar):

1. **Nome do canal e @ nas redes.** O mesmo @ em todas as redes
2. **Nicho: do que o canal fala.** Qualquer nicho serve. A fórmula da Máquina é montar uma coisa peça por peça, então
   ela brilha quando o tema tem "como funciona" ou "como foi feito". Se o nicho for outro (história, esportes, games),
   propor o ângulo que encaixa: em história, "como construíram as pirâmides", "como funcionava uma catapulta"; em
   games, "como o controle vibra", "por que o console esquenta". Não prometer o que o motor não faz (filtro de imagem,
   personagens reais, cenas de multidão)
3. **Estilo do vídeo:** o tom da narração (conversado, sério, engraçado, dramático) e o que evitar
4. **Estilo visual:** o personagem (menino ou menina, camiseta ou moletom, cores da roupa e do cabelo), o lugar e a
   hora padrão (quintal, praia, cozinha, espaço, Lua ou o "mundo de dentro"; dia, tarde ou noite). **O personagem não
   pode ser igual ao de outro canal conhecido**: sugerir 2 ou 3 combinações de cor diferentes
5. **Voz:** de homem ou de mulher, e o tom (calma, animada, séria). A voz profissional é da ElevenLabs (passo 3)
6. **Mecanismo único:** o que todo vídeo do canal tem e os outros não têm. Ex.: "todo vídeo começa com uma pergunta
   polêmica e termina perguntando a opinião de quem assiste"
7. **Estilo da capa.** Ex.: "sempre a pergunta do vídeo, o personagem com cara exagerada e o objeto do tema na mão"
8. **Plaquinha do fim e assinatura falada.** Ex.: "SEGUE O\nCANAL!" e "E segue o <canal>."
9. **Tem logo?** Se sim, salvar como `canal/logo.png` (quadrado)
10. **Como prefere que eu trabalhe?** (a) te mostrar cada etapa e pedir a sua opinião (recomendado nos primeiros
    vídeos) ou (b) fazer direto e te mostrar só o vídeo pronto

Preencher `canal/canal.md` (nome, @, assinatura, nicho, quem assiste, estilo do vídeo, mecanismo único, estilo da capa,
fechamento e chamada, hashtags) e `canal/identidade.md` (personagem, lugar e hora, voz, plaquinha, e o bloco
"No roteiro.json" com as cores em `#rrggbb`). Trocar **todos** os campos de exemplo entre colchetes. A resposta 10 vai
em "Jeito de trabalhar" de `canal/aprendizados.md`. Mostrar o resumo e perguntar se está certo.

## 3. Voz profissional (opcional)

Perguntar se quer a voz profissional agora. Se sim:
1. Criar `.env` a partir do `.env.exemplo` e pedir pro usuário colar a chave da ElevenLabs **direto no arquivo** (não
   no chat). Nunca mostrar o conteúdo do `.env`
2. Com a chave salva, listar as vozes da conta pela API da ElevenLabs (`GET https://api.elevenlabs.io/v1/voices`, com o
   cabeçalho `xi-api-key`): nome, gênero e sotaque. Sugerir 3 que combinem com a resposta 5 e deixar a pessoa escolher.
   Pra ouvir: `npm run testar-voz -- <id1> <id2> <id3>` salva uma amostra de cada em `canal/testes-de-voz/`
   (`<nome-da-voz>.mp3`); passar os links pra pessoa abrir. Cada amostra gasta uns 110 caracteres do plano
3. Anotar a escolhida no bloco "No roteiro.json" de `canal/identidade.md`:
   `"voz": {"motor": "elevenlabs", "id": "<id>", "velocidade": 1.1, "acelerar": "auto"}`

Sem chave, os vídeos saem com a voz do computador (serve pra testar).

## 4. Conferir e pronto

Rodar `npm run conferir`. Só quando ele responder **PRONTO**:
1. Anotar a primeira linha em `canal/historico.md` ("canal" · canal configurado: nome, nicho e jeito de trabalhar)
2. Mostrar o relatório de novo, agora com tudo ✅ (e os opcionais que ficaram pra depois), e dizer que o personagem
   novo aparece no primeiro vídeo
3. Passar as **Dicas** de `comandos/boas-vindas.md` e contar que, daqui pra frente, tudo o que a pessoa pedir ou
   opinar fica anotado em `canal/historico.md`, e o que a IA aprender, em `canal/aprendizados.md` (ela pode abrir e
   editar quando quiser)
4. Sugerir um vídeo novo (`/novo-video` no Claude Code, ou "faz um vídeo sobre ...") com 3 temas da `canal/pauta.md`
   ou que combinem com o nicho, dizendo qual você escolheria, ou um que a pessoa quiser

Se ele listar algo faltando, resolver antes.

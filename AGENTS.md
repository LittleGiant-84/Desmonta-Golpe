# Fábrica Cartoon

Pasta de produção de vídeos curtos animados em 3D (9:16) para um canal de curiosidades. Estas instruções valem pra
qualquer IA que trabalhe nesta pasta (Claude Code, Codex, Gemini CLI, Cursor, GitHub Copilot e outras).

## Começo de toda conversa (regra número 1)

Na primeira resposta da conversa, seja qual for a mensagem (até um "oi"), e antes de qualquer pedido (vídeo, roteiro,
capa, texto de postar), seguir `comandos/boas-vindas.md`:
1. **Avisar** em uma frase, antes de rodar qualquer coisa, que vai dar uma olhada rápida se está tudo instalado e
   configurado
2. **Conferir:** rodar `npm run conferir` (se o comando nem existir, o Node.js não está instalado). Respondeu
   **PRONTO**: ler `canal/canal.md`, `canal/identidade.md`, `canal/aprendizados.md`, `canal/pauta.md` e as últimas ~15
   linhas de `canal/historico.md` (onde a conversa anterior parou)
3. **Relatório:** contar em palavras simples o que está pronto, o que falta, quem resolve e quanto leva. Tudo pronto
   numa conversa de volta: uma linha só
4. **Boas-vindas:** a apresentação na primeira vez, 2 ou 3 linhas nas outras. Uma vez só por conversa
5. **PRONTO**: seguir com o pedido. **FALTA CONFIGURAR**: não começar o pedido. Se a pessoa já tinha pedido um vídeo,
   explicar em uma frase que sem a instalação e o canal configurados o vídeo sai genérico e gasta a cota da IA à toa.
   Perguntar se pode resolver e conduzir `comandos/instalar.md` (só o que o relatório marcou como falta). Terminou e o
   conferir deu PRONTO: voltar ao pedido que a pessoa tinha feito

## Comandos

| O usuário pede | Siga |
|---|---|
| `/instalar`, "instalar", "configurar", primeiro uso | `comandos/instalar.md` |
| `/novo-video <tema>`, "faz um vídeo sobre...", um tema | `comandos/novo-video.md` |
| `/publicar`, "texto de postar", "legenda", "título" | `comandos/publicar.md` |
| `/ajuda`, "como usa?", "o que dá pra fazer?", "tô perdido" | `comandos/boas-vindas.md` (pedido de ajuda) |
| "o que você aprendeu?", "o que você sabe de mim?" | `comandos/boas-vindas.md` (o que a IA aprendeu) |
| "postei", "teve 2 mil views", "o pessoal comentou..." | `comandos/publicar.md` (depois de postar) |
| "tá instalado?", "confere", "falta alguma coisa?" | `comandos/boas-vindas.md` (relatório completo) |

Quem não tem uma IA que trabalha na pasta usa o jeito por chat: `comandos/modo-chat.md`.

## Sincronização permanente com o GitHub

Em 24/11/2026 o usuário criou o repositório privado `https://github.com/LittleGiant-84/Desmonta-Golpe` para este
projeto, com a mesma regra do projeto anterior (O Mundo da Tecnologia): enviar o trabalho sem pedir confirmação a cada
envio.

- Ao concluir uma etapa que altere arquivos (roteiro, cena, revisão, configuração, entrega ou registro de opinião),
  revisar o que mudou e executar `npm run sincronizar -- "Descrição curta da etapa"` antes de responder.
- Em trabalhos longos, sincronizar também nos pontos em que uma etapa fique consistente; não esperar o fim do vídeo.
- O comando revisa os arquivos, cria um commit e envia à branch atual em `origin`. Confirmar o resultado remoto;
  se falhar, dizer que o envio está pendente e preservar o trabalho local. Nunca afirmar sincronização sem confirmação.
- Seguir o `.gitignore`: enviar fontes, roteiros, capas, recursos e configurações sem segredos. Vídeos gerados,
  narrações, testes, versões antigas, dependências e credenciais permanecem locais, conforme a organização já definida.
- Registrar decisões no histórico do canal; GitHub recebe esses arquivos, não uma cópia automática das mensagens do chat.
- Não usar push forçado nem apagar alterações para sincronizar. Se houver atualizações remotas, integrá-las e conferir
  antes de tentar novamente. O envio automático não dispensa a opinião do usuário sobre o conteúdo dos vídeos.
- Detalhes e comando de conferência: `comandos/sincronizar.md`.

## Como conversar

Quem usa esta pasta provavelmente nunca mexeu com IA nem com terminal. A IA conduz; a pessoa decide.
- Fala simples e curta, como numa conversa de WhatsApp. Sem termo técnico sem explicar e sem despejar log
- **Toda etapa termina pedindo a opinião**: mostrar o que fez (roteiro, prévias, vídeo pronto, texto de postar) e
  fazer de 1 a 3 perguntas, cada uma com opções ou um exemplo. Sempre aceitar "escolhe você"
- Sugerir, não só perguntar: dar a sua opinião e o porquê ("eu iria no começo B: tem um número que assusta")
- Antes de algo demorado (instalar, render), dizer em uma frase o que vai acontecer e mais ou menos quanto leva
- Pediu pra seguir direto ("faz tudo", "não precisa me perguntar"): perguntar só no fim, e anotar isso (abaixo)

## Aprender com o usuário (a IA melhora a cada vídeo)

Tudo o que a pessoa pede, opina, corrige ou aprova fica nos arquivos de `canal/`, não só na memória da IA: assim vale
pra qualquer IA e não se perde quando a conversa acaba.

- **Anotar na hora**, sem esperar o fim da conversa: uma linha em `canal/historico.md` (formato no topo do arquivo).
  Vale pedido de vídeo, mudança, opinião, nota, elogio, reclamação, aprovação de primeira e o resultado nas redes
- **Virar regra em `canal/aprendizados.md`**, na seção certa, quando: a pessoa diz "sempre", "nunca", "prefiro", "de
  agora em diante"; o mesmo tipo de pedido aparece em 2 vídeos diferentes; ou os resultados mostram um padrão. Avisar
  em uma frase: "Anotei: daqui pra frente, ...". Configuração do canal (nome, cores, personagem, lugar, hora, voz,
  plaquinha, hashtags) vai direto em `canal/canal.md` ou `canal/identidade.md`
- Pedido que só vale pro vídeo atual ("deixa a panela vermelha") fica só no histórico
- **Usar:** ler `canal/aprendizados.md` antes de todo roteiro, cena e texto de postar. Ao mostrar o roteiro, dizer em
  uma linha o que aplicou do que aprendeu
- **Lição técnica:** erro do `cena.js` ou do motor que deu trabalho → uma linha em "Lições técnicas" de
  `canal/aprendizados.md` (o que deu errado e como resolver), pra não repetir no próximo vídeo
- **Revisão a cada 5 vídeos prontos** (ou quando `canal/aprendizados.md` passar de ~80 linhas): ler o histórico desde a
  última revisão, juntar o que se repete, apagar o que ficou velho ou foi contrariado (vale o mais recente), atualizar
  a linha "Última revisão" e contar pra pessoa, em 3 ou 4 linhas, o que aprendeu
- O gosto da pessoa vale mais que o padrão do método (ex: "sempre vídeo de 90 s"), mas nunca mais que as Regras
  abaixo. Se o pedido piora o vídeo, explicar o porquê uma vez e fazer como ela quiser
- Nunca anotar chave, senha nem dado pessoal (telefone, endereço, documento, e-mail)

## Fluxo de um vídeo

Novo vídeo → roteiro (`roteiro.md`) → opinião e ok do usuário → `roteiro.json` + `cena.js` → prévias → opinião do
usuário → vídeo → entrega completa (`capa.png`, texto de postar e pauta marcada, sem esperar pedido) → opinião do
vídeo pronto → resultado nas redes. Cada opinião vai pro histórico na hora.

- Cada vídeo fica em `videos/<tema-em-minusculas-com-hifen>/`, com tudo o que é dele (ver "Onde fica cada coisa")
- **Todo vídeo tem um `cena.js` próprio**, escrito pela IA: o método, as regras e o checklist estão em
  `referencias/COMO-FAZER-O-VIDEO.md`; o exemplo completo é `videos/exemplo/` (lanterna); tudo o que o motor faz está em
  `referencias/kit-indice.md`. A cena-modelo `montagem` (sem código) fica só pra rascunho rápido
- Render: `node motor/render.js videos/<tema>`. Prévias rápidas: `--voz-teste --previa 2,8.5,15`. Só a capa: `--capa`
- Sempre conferir prévias (abrir as imagens) antes do render completo
- Roteiro: seguir `metodo/formula-roteiro.md`. Ciência conferida: simplificar pode, inventar não
- Visual: seguir `canal/identidade.md` (personagem, cores, lugar) e `metodo/ritmo-e-visual.md`

## Onde fica cada coisa (toda mídia tem lugar certo)

A pessoa tem que achar qualquer arquivo pelo nome do vídeo. O motor já grava assim; a IA segue o mesmo pro que fizer
por conta própria.

| O quê | Onde |
|---|---|
| A entrega: `video.mp4`, `capa.png`, `publicacao.md` | `videos/<tema>/` |
| O roteiro e a cena: `roteiro.md`, `roteiro.json`, `cena.js` | `videos/<tema>/` |
| Todo teste do vídeo: prévias, trechos, vídeo com voz de teste | `videos/<tema>/testes/` (o motor grava lá sozinho) |
| A narração de cada frase, guardada pra não gastar crédito de novo | `videos/<tema>/narracao/` (o motor cuida) |
| Versão anterior de um vídeo já entregue | `videos/<tema>/versoes/` |
| Amostras de voz pra escolher a do canal | `canal/testes-de-voz/` (`npm run testar-voz -- <id>`) |
| Logo do canal | `canal/logo.png` |
| Teste da instalação | `videos/exemplo/testes/` (apagar depois do teste) |

- Nunca gravar mídia solta na raiz da pasta, na Área de Trabalho, em Downloads ou numa pasta temporária
- Mídia que a IA cria por conta própria (um quadro tirado do vídeo pra conferir, uma capa alternativa, uma comparação)
  vai em `videos/<tema>/testes/`, com um nome que diga o que é: `capa-opcao-b.png`, `quadro-12s.jpg`
- Refazer um vídeo já entregue: antes do render, mover o `video.mp4` e a `capa.png` antigos pra
  `videos/<tema>/versoes/` com a data (`video-28-10-2026.mp4`, `capa-28-10-2026.png`), pra dar pra voltar atrás
- Ao mostrar uma mídia pra pessoa, mandar o link do arquivo (pra abrir com um clique) e dizer em que pasta ela fica

## Regras

- Nunca copiar roteiro, frase ou visual de outro canal. A fórmula é livre; o texto e a identidade são do usuário
- Nunca mostrar nem enviar o conteúdo do `.env`
- O motor (`motor/`) é compartilhado por todos os vídeos: mudança nele vale pra todos
- Se um erro não se resolver depois de tentar, indicar o suporte: suporte@maquinapreguica3d.click (com o print do erro,
  o sistema do computador e o que a pessoa estava fazendo)

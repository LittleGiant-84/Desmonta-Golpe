# Começo da conversa: aviso, conferência, relatório e boas-vindas

> Na primeira resposta de toda conversa (regra número 1 do `AGENTS.md`), quando a pessoa pedir pra conferir ("tá
> instalado?", "confere") e quando pedir ajuda (`/ajuda`, "como usa?", "o que dá pra fazer?", "tô perdido").
> Quem usa pode nunca ter mexido com IA nem com terminal: fala simples, curta, sem termo técnico. Os modelos abaixo são
> um guia: adaptar ao canal e à conversa, com as suas palavras, sem ler como robô.

## 1. Aviso (antes de rodar qualquer coisa)

Uma frase, sozinha, antes do primeiro comando, pra pessoa não ficar olhando a tela parada sem saber o que acontece:

> Oi! Me dá um minutinho: vou ver se está tudo instalado e configurado por aqui. Se aparecer um pedido de permissão,
> pode aceitar: sou eu conferindo.

- A parte da permissão pode sair quando já dá pra ver que a pessoa usa há tempo (ela fala de um vídeo anterior, por
  exemplo). Na dúvida, fica: é uma frase só
- Se a mensagem já era um pedido, juntar os dois: "Oi! Já vou ver o vídeo do guarda-chuva. Antes, deixa eu conferir
  rapidinho se está tudo pronto por aqui."
- Ainda não explicar o projeto: isso vem depois do relatório

## 2. Conferência

Rodar `npm run conferir`. Cada linha vem marcada: `[ok]` pronto, `[falta]` resolver antes do vídeo, `[aviso]` funciona
com um porém, `[opcional]` não precisa.

Se o comando nem rodar ("npm não é reconhecido", "command not found"), o Node.js não está instalado: é o único item que
a pessoa resolve sozinha (passo a passo abaixo), e os outros só dá pra conferir depois dele.

## 3. Relatório

Traduzir cada linha pro que a pessoa entende, dizendo quem resolve e mais ou menos quanto leva:

| Linha do conferir | No relatório | Quem resolve |
|---|---|---|
| Node.js | Programa base (Node.js) | A pessoa, com o passo a passo abaixo (uns 5 minutos) |
| motor de animação | Motor de animação | A IA (uns 3 a 5 minutos, depende da internet) |
| navegador que desenha o vídeo | Navegador que desenha o vídeo | A IA (uns 2 minutos) |
| voz de teste do computador | Voz de teste do computador | Linux: a IA instala (pode pedir a senha do computador). Mac: a pessoa, no caminho que o conferir mostra. Windows sem voz em português: nada a fazer, só avisar |
| canal | Seu canal (nome, assunto, personagem, voz) | As duas: a IA pergunta, a pessoa responde (uns 5 minutos) |
| voz profissional (ElevenLabs) | Voz profissional | Opcional: a pessoa cria a conta, a IA configura. Dá pra deixar pra depois |
| logo do canal | Logo do canal | Opcional: a pessoa manda a imagem |

Modelo (primeira vez):

> Pronto, dei uma olhada. Olha o que encontrei:
>
> ✅ Programa base (Node.js): instalado
> ❌ Motor de animação: falta instalar. Eu instalo sozinho (uns 5 minutos)
> ❌ Navegador que desenha o vídeo: falta instalar. Eu instalo sozinho (uns 2 minutos)
> ✅ Voz de teste do computador: funcionando
> ❌ Seu canal: ainda não configurado. Eu te faço umas perguntas rápidas
> ⚪ Voz profissional: opcional, dá pra configurar depois
> ⚪ Logo do canal: opcional
>
> Resumindo: faltam 3 coisas, e a gente resolve tudo junto em uns 10 minutos.

- Símbolos: ✅ pronto · ❌ falta · ⚠️ funciona, com um porém · ⚪ opcional
- Sem "npm", "playwright", "chromium", "node_modules" nem "dependências": os comandos ficam com a IA
- Todo ❌ diz quem resolve e quanto leva. Fechar com uma linha de resumo
- **Tudo pronto numa conversa de volta:** uma linha só ("Tudo certo por aqui: instalado e configurado."), sem lista.
  `[aviso]` entra numa linha curta; `[opcional]` não aparece
- **Pedido de conferir:** sempre o relatório completo

### Node.js não instalado (a pessoa instala)

> Falta uma coisa que eu não consigo instalar sozinho: o Node.js, o programa que faz a Máquina funcionar. É grátis e
> leva uns 5 minutos:
> 1. Entre em **nodejs.org** e baixe a versão **LTS** (o botão de download da página)
> 2. Abra o arquivo que baixou e vá clicando em **Next** até **Finish** (no Mac: **Continuar** e **Instalar**)
> 3. Feche este programa (o VS Code, ou a janela onde você fala comigo) e abra de novo
> 4. Me diga "instalei" que eu continuo daqui

## 4. Boas-vindas (depois do relatório)

| Situação | O que dizer |
|---|---|
| **Primeira vez:** o canal ainda não foi configurado, ou `canal/historico.md` ainda não tem nenhuma anotação | A apresentação, e no fim perguntar se pode começar |
| **De volta:** deu PRONTO e já tem histórico | 2 ou 3 linhas (modelo abaixo) |
| **Pedido de ajuda** | A apresentação, as dicas e o "O que dá pra pedir" |

Uma vez só por conversa. Se a pessoa já fez um pedido, numa conversa de volta, só a linha do oi e o pedido segue.

### Apresentação (primeira vez)

> **O que é isto:** a Fábrica Cartoon transforma um tema (tipo "como funciona um guarda-chuva") num vídeo curto
> animado em 3D, pronto pra postar: roteiro, animação, narração, legenda, som e capa.
>
> **Como a gente vai trabalhar:**
> 1. **Uma vez só:** eu instalo o que falta e te faço umas perguntas sobre o canal: nome, assunto, personagem e voz
> 2. **A cada vídeo:** você me dá um tema, eu escrevo o roteiro e te mostro. Você aprova ou pede mudança
> 3. Eu monto a cena, te mostro umas imagens de prévia e faço o vídeo, já com a capa e o texto de postar
>
> **Antes de começar:**
> - Escreva do seu jeito, como no WhatsApp. Não precisa saber programação nem decorar comando
> - Quando eu pedir permissão pra rodar um comando, sou eu instalando ou fazendo o vídeo: pode aceitar. Na dúvida,
>   pergunte que eu explico
>
> Posso começar? Primeiro eu instalo o que falta, depois a gente configura o seu canal.

A pergunta do fim acompanha o relatório: só falta o canal, "Posso começar as perguntas do canal?"; falta o Node.js, o
fim é o passo a passo dele.

### Dicas (no fim da instalação e no pedido de ajuda)

> - Não gostou de algo? É só falar: "deixa mais curto", "troca a cor da camiseta". Eu anoto toda opinião sua e uso nos
>   próximos vídeos
> - Quer que valha pra todo vídeo? Comece com "sempre" ou "nunca": "sempre de noite", "nunca use gíria"
> - Postou? Volte uns dias depois e me conte como foi (visualizações, comentários): é assim que eu aprendo o que dá
>   certo no seu canal
> - `/ajuda` (ou "me ajuda") mostra estas dicas de novo, e "o que você já aprendeu?" mostra o que eu sei de você

Fora do Claude Code, os atalhos com `/` não existem: nessa dica, dizer só "me ajuda".

### De volta

Um oi, uma coisa que você lembra (onde a conversa anterior parou, no fim do `canal/historico.md`, o último vídeo da
`canal/pauta.md` ou uma preferência de `canal/aprendizados.md`) e o próximo passo, com uma sugestão sua. Exemplo:

> Tudo certo por aqui. O último foi o do guarda-chuva, com o começo de número que você curtiu. Já postou? Se sim, me
> conta como foi. Pro próximo eu iria na "geladeira" (é do dia a dia e tem peça escondida), ou me diz o seu tema.

No máximo uma pergunta sobre resultado por conversa, e só de vídeo postado há 2 dias ou mais que ainda está sem
"Resultado" na pauta.

### Pedido de ajuda: o que dá pra pedir

Depois da apresentação e das dicas, 4 ou 5 exemplos do que dá pra pedir agora, escolhidos pelo momento da pessoa:

- "faz um vídeo sobre como funciona a geladeira"
- "me dá 3 ideias de vídeo"
- "escreve o texto de postar do último vídeo"
- "muda a cor da camiseta do personagem pra azul, pra sempre"
- "o vídeo do guarda-chuva teve 3 mil views"
- "o que você já aprendeu?"

## O que a IA aprendeu

Quando a pessoa perguntar "o que você aprendeu?" ou "o que você sabe de mim?": ler `canal/aprendizados.md` e contar em
tópicos curtos, por assunto (jeito de trabalhar, roteiro, visual, voz, capa e texto, o que dá resultado), em linguagem
simples, sem as lições técnicas. Se ainda não tiver nada, dizer que aprende a cada vídeo e com cada opinião. Fechar
perguntando se quer mudar ou apagar alguma coisa. Se ela pedir, mudar no arquivo e anotar no histórico.

# Jeito por chat (qualquer IA, até gratuita)

> Pra quem não tem uma IA que trabalha direto na pasta. Funciona com qualquer IA de chat: ChatGPT, Gemini, Claude,
> DeepSeek, Copilot, inclusive nos planos gratuitos. A IA escreve o roteiro, você copia a resposta e um comando faz o
> vídeo. Os vídeos saem na cena-modelo (o objeto montado peça por peça, com câmera e personagem automáticos), mais simples
> que os feitos por uma IA de código, que escreve uma cena própria pra cada vídeo.
> Dúvidas: suporte@maquinapreguica3d.click ou WhatsApp (13) 98207-0278

## 1. Instalar (uma vez só, uns 10 minutos)

1. Instale o **Node.js** (versão LTS, em nodejs.org)
2. Abra o terminal **dentro desta pasta**:
   - **Mac:** abra o app Terminal, digite `cd ` (com espaço), arraste esta pasta pra janela e aperte Enter
   - **Windows:** abra esta pasta no Explorador de Arquivos, clique na barra de endereço, digite `cmd` e aperte Enter
3. Rode, um de cada vez:

```
npm install
npm run preparar
```

O `preparar` baixa o navegador que desenha os quadros e faz duas imagens de teste do vídeo de exemplo (a lanterna), em
`videos/exemplo/testes/`. Apareceram? Está instalado (pode apagar essa pasta `testes/` depois).

## 2. Configurar o canal (uma vez só)

Abra `canal/canal.md` e `canal/identidade.md` num editor de texto (Bloco de Notas, TextEdit) e troque o que está entre
colchetes. Se preferir, cole o **Prompt A** na sua IA, responda as perguntas e cole as respostas nos dois arquivos.

## 3. Fazer um vídeo

1. Cole o **Prompt B** na sua IA, com o seu tema no lugar indicado
2. Leia o roteiro que ela mandar. Quer mudar? Peça ("troca o gancho", "deixa mais curto")
3. Copie a resposta inteira da IA (o bloco que começa com `{`)
4. No terminal, rode (troque `guarda-chuva` pelo nome do seu vídeo, sem espaço):

```
npm run colar -- guarda-chuva
```

Antes de tudo, ele confere se a Máquina está instalada e o canal configurado (se faltar algo, ele diz o quê, sem gastar
nada). Depois pega o roteiro da área de transferência, aplica a identidade do seu canal e faz o vídeo em
`videos/guarda-chuva/`: `video.mp4` e `capa.png`. Se der erro, ele te diz o que colar pra IA.

**Ficou estranho?** A maioria das IAs gratuitas aceita imagem: mande a `capa.png` e peça "ajusta as peças pra ficar
mais parecido com o objeto de verdade". Copie o roteiro novo e rode o `colar` de novo.

**Voz:** sem a chave da ElevenLabs no arquivo `.env`, sai a voz do próprio computador (serve pra testar). Com a chave,
sai a voz profissional (passo a passo no `COMECE-AQUI.md`).

## 4. Texto de postar

Cole o **Prompt C** na sua IA, junto com o roteiro do vídeo. Ela devolve título, descrição, hashtags e o comentário pra
fixar.

## 5. Ensinar a IA (cada vídeo sai mais com a sua cara)

A IA de chat esquece tudo quando a conversa acaba. Pra ela aprender o seu gosto:
1. Depois de pedir mudanças num roteiro ("troca o gancho", "menos gíria"), cole o **Prompt D**
2. Copie os tópicos que ela mandar e cole em `canal/aprendizados.md`, na seção do assunto
3. No próximo vídeo, esse arquivo vai junto no Prompt B (na linha "O QUE EU PREFIRO")

Postou e teve um resultado bom ou ruim? Anote na coluna "Resultado" da `canal/pauta.md`: com o tempo, dá pra ver que
tipo de tema e de gancho funciona no seu canal.

---

## Prompt A · Configurar o canal

```
Vou criar um canal de vídeos curtos animados em 3D. O formato monta uma coisa peça por peça,
então funciona melhor com temas de "como funciona" ou "como foi feito". Me faça estas perguntas,
uma por vez, com um exemplo em cada, e aceite "escolhe você":
1. Nome do canal e @ nas redes
2. Nicho: do que o canal fala (se for história, games ou outro, sugira o ângulo de "como
   funciona" ou "como foi feito" que encaixa)
3. Estilo do vídeo: o tom da narração (conversado, sério, engraçado) e o que evitar
4. Estilo visual: o personagem (menino ou menina, camiseta ou moletom, cores da roupa e do
   cabelo em #rrggbb, diferente de canais conhecidos), o lugar (quintal, praia, cozinha,
   espaco, lua ou escuro) e a hora (dia, tarde ou noite)
5. Voz: de homem ou de mulher, e o tom
6. Mecanismo único: o que todo vídeo do canal tem e os outros não têm
7. Estilo da capa
8. O texto da plaquinha do fim e a frase de assinatura ("E segue o [canal].")
No fim, me entregue o texto pronto pra eu colar no meu canal.md e no identidade.md, trocando
todos os campos entre colchetes, e o bloco "No roteiro.json" com o personagem, o lugar e a hora.
```

## Prompt B · O roteiro do vídeo

```
Você vai escrever o roteiro de um vídeo curto animado em 3D (9:16, uns 60 a 90 segundos) no
formato JSON que o meu programa de animação entende.

TEMA: [escreva aqui o tema, ex.: como funciona um guarda-chuva]
MEU CANAL: [cole aqui o que está no seu canal/canal.md, ou apague esta linha]
O QUE EU PREFIRO: [cole aqui o que está no seu canal/aprendizados.md, ou apague esta linha]

A FÓRMULA (quem assiste monta o objeto do zero, junto com o vídeo):
- 1ª frase: uma pergunta BEM curiosa, de até 10 palavras, que o vídeo responde (plano "gancho")
- Depois: "Se você..." com uma cena em que algo dá errado (plano "problema")
- 3 a 6 ciclos: "Mas..." (problema visível, plano "problema") -> "Então você..." (a peça que
  resolve, descrita pelo que ela faz, plano "monta") -> "Esse é o *nome*." (plano "nome")
- Pelo menos 1 "É por isso que..." e 1 número concreto (plano "mostra")
- Fim: "Por fora, é só..." (plano "por_fora"), "Por dentro, é..." (plano "por_dentro") e a
  assinatura do canal (plano "segue")
- Frases curtas, sempre falando com "você". Ciência certa: simplificar pode, inventar não
- O nome da peça vai entre asteriscos na frase do plano "nome": "Esse é o *refletor*."

O OBJETO é montado com peças simples, de baixo pra cima. O chão é y = 0; "pos" é o CENTRO da
peça; o objeto inteiro deve ter de 1,5 a 3 de altura (o personagem tem 1,55).
Formas e "tam":
- caixa [largura, altura, profundidade]
- cilindro [raio, altura] ou [raio de cima, raio de baixo, altura]
- tubo [raio, altura] (oco) · funil [raio de cima, raio de baixo, altura] (oco)
- esfera [raio] · cone [raio, altura] · anel [raio, grossura] (deitado)
- cano: "pontos": [[x,y,z], ...] e "tam": [raio] (fio, mangueira, cano com curvas)
Opcionais da peça: "giro" [x,y,z] em graus, "cor" "#rrggbb", "metal": true, "brilho": 0 a 1,
"transparente": 0 a 1, "fixa": true (base que não se mexe).
Na frase: "peca" (número da peça, contando do 0, ou lista) nos planos "monta" e "nome";
"etiqueta" (texto curto, até 25 letras); "acao" (cair, suar, pensar, pular, comemorar,
apontar, acenar); "humor" (feliz, triste, surpreso, bravo, assustado); "marca" ("certo" ou
"errado"); "contador" {"texto": "3 HORAS", "sub": "COM UMA PILHA"}; "efeito" {"tipo": "luz",
"fogo", "fumaca", "vapor", "agua", "brilho", "chuva" ou "vento", "peca": n, "mantem": true}.
Topo: "titulo", "capa" (a pergunta da capa em 2 a 4 linhas, com \n entre as linhas e uma
*palavra* entre asteriscos), "lugar" (quintal, praia, cozinha, espaco, lua ou escuro),
"hora" (dia, tarde ou noite), "casa" (true põe uma casa no fundo do quintal).
"objeto": {"destaque": número da peça que ganha o círculo vermelho na capa, "pecas": [...]}.

EXEMPLO COMPLETO (guarda-chuva):
{
  "titulo": "Guarda-chuva",
  "capa": "COMO O GUARDA-CHUVA\nSEGURA A *CHUVA*?",
  "lugar": "quintal",
  "hora": "tarde",
  "casa": true,
  "objeto": {"destaque": 4, "pecas": [
    {"nome": "tecido", "forma": "funil", "tam": [0.06, 1.08, 0.46], "cor": "#2f7fe0", "pos": [0, 1.99, 0]},
    {"nome": "haste", "forma": "cilindro", "tam": [0.025, 1.9], "cor": "#2b2f36", "metal": true, "pos": [0, 1.25, 0]},
    {"nome": "cabo", "forma": "cano", "pontos": [[0, 0.35, 0], [0, 0.15, 0], [0.07, 0.04, 0], [0.17, 0.09, 0]], "tam": [0.04], "cor": "#7a4a22", "pos": [0, 0, 0]},
    {"nome": "varetas", "forma": "cano", "pontos": [[0, 2.2, 0], [1.08, 1.76, 0], [0, 2.2, 0], [0.764, 1.76, 0.764], [0, 2.2, 0], [0, 1.76, 1.08], [0, 2.2, 0], [-0.764, 1.76, 0.764], [0, 2.2, 0], [-1.08, 1.76, 0], [0, 2.2, 0], [-0.764, 1.76, -0.764], [0, 2.2, 0], [0, 1.76, -1.08], [0, 2.2, 0], [0.764, 1.76, -0.764], [0, 2.2, 0]], "tam": [0.014], "cor": "#c9ced6", "metal": true, "pos": [0, 0, 0]},
    {"nome": "trava", "forma": "cilindro", "tam": [0.06, 0.16], "cor": "#e8352b", "pos": [0, 1.62, 0], "som": "trava"}
  ]},
  "frases": [
    {"texto": "Como um pano tão fino segura um temporal inteiro?", "plano": "gancho", "gancho": true},
    {"texto": "Se você precisa atravessar a rua na chuva, põe um pano em cima da cabeça e chega encharcado do mesmo jeito.", "plano": "problema", "etiqueta": "Encharcado", "acao": "suar", "efeito": {"tipo": "chuva", "forca": 1, "mantem": true}},
    {"texto": "Mas o pano comum é cheio de furinhos, e a água passa direto.", "plano": "problema", "etiqueta": "A água passa"},
    {"texto": "Então você usa um tecido de fios bem fechadinhos, com uma camada que faz a gota escorrer.", "plano": "monta", "peca": 0, "etiqueta": "A gota escorre"},
    {"texto": "Esse é o *tecido impermeável*.", "plano": "nome", "peca": 0},
    {"texto": "Mas solto, ele murcha e a água empoça em cima da sua cabeça.", "plano": "problema", "etiqueta": "Murchou"},
    {"texto": "Então você estica ele num esqueleto de hastes de metal, presas num cabo.", "plano": "monta", "peca": [3, 1, 2], "etiqueta": "Esticado"},
    {"texto": "Essas são as *varetas*.", "plano": "nome", "peca": 3},
    {"texto": "Mas aberto o tempo todo, ele não passa nem na porta.", "plano": "problema", "etiqueta": "Não passa na porta"},
    {"texto": "Então você põe no cabo uma pecinha que desliza: sobe, abre tudo, e uma molinha prende lá em cima.", "plano": "monta", "peca": 4, "etiqueta": "Clique!"},
    {"texto": "Essa é a *trava*.", "plano": "nome", "peca": 4},
    {"texto": "É por isso que ele faz aquele clique quando abre.", "plano": "mostra", "marca": "certo"},
    {"texto": "Por fora, é só um pano esticado num cabo.", "plano": "por_fora"},
    {"texto": "Por dentro, é um tecido que a água não atravessa, varetas que esticam tudo e uma molinha que segura até o vento chegar.", "plano": "por_dentro"},
    {"texto": "E segue o canal pra ver o próximo.", "plano": "segue"}
  ]
}

Responda SÓ com o bloco JSON completo do meu tema, sem explicação antes ou depois.
```

## Prompt C · Texto de postar

```
Escreva o texto de postar deste vídeo curto (cole o roteiro abaixo):
1. TÍTULO pro YouTube Shorts: a pergunta que uma criança curiosa faria e alguém digitaria na
   busca, com o detalhe que intriga. Até 60 caracteres, sem hashtag e sem emoji
2. DESCRIÇÃO: uma abertura de 1 ou 2 frases, uma linha com o que o vídeo mostra, a assinatura do
   canal e até 5 hashtags em minúsculas
3. COMENTÁRIO PRA FIXAR: a pergunta do vídeo em CAIXA ALTA, uma linha de espanto e um item
   curto por peça, na ordem do vídeo, terminando com uma pergunta pra quem assiste
Ciência certa: simplificar pode, inventar não. Não prometa o que o vídeo não mostra.

[cole aqui o roteiro]
```

## Prompt D · O que a IA aprendeu

```
Com base no que eu pedi, corrigi e elogiei nesta conversa, me escreva em tópicos curtos o que
você aprendeu sobre o meu gosto, pra eu guardar e usar no próximo vídeo. Só o que vale pra
todos os vídeos (não o que era só deste tema), separado por assunto: roteiro e narração,
visual, capa e texto de postar. Um tópico por linha, começando com "- ".
```

# Desmonta Golpe

Projeto privado do canal **Desmonta Golpe** (golpes e segurança digital, animado), criado com a Fábrica Cartoon e ampliado com modelos GLB,
personagens articulados, peças reutilizáveis e verificações de espaço na cena.

O Git guarda o código, as configurações do canal, os roteiros, as capas e os recursos necessários para produzir os
vídeos. Os MP4 finais ficam na pasta `videos/<tema>/` do computador. Credenciais, narrações em cache, prévias e
dependências instaladas são locais e estão excluídas pelo `.gitignore`.

As alterações são enviadas ao [GitHub privado do projeto](https://github.com/LittleGiant-84/Desmonta-Golpe)
a cada etapa concluída pela IA, sem nova confirmação. `npm run sincronizar -- "Descrição da etapa"` revisa os arquivos,
cria o commit e confirma o envio. Não há monitoramento da pasta em segundo plano: a sincronização é acionada durante
o trabalho no projeto. Veja [como funciona](comandos/sincronizar.md).

Vídeos curtos animados em 3D, feitos por IA a partir de um tema: roteiro, animação, narração, legenda, som e capa.
Você escolhe o assunto, a IA faz o resto. Funciona com qualquer IA, até gratuita (com uma IA de código, como o
Claude Code, fica bem melhor).

**Comece por aqui:** [COMECE-AQUI.md](COMECE-AQUI.md)

**Suporte:** suporte@maquinapreguica3d.click ou WhatsApp (13) 98207-0278

**Licença:** uso pessoal. Os vídeos que você criar são seus; revender ou redistribuir a Fábrica Cartoon é proibido.
Detalhes em [LICENCA.md](LICENCA.md).

```
COMECE-AQUI.md     o passo a passo: instalar, criar o canal, primeiro vídeo, postar
LICENCA.md         o que você pode e o que não pode fazer com a Fábrica Cartoon
AGENTS.md          como a IA trabalha nesta pasta (CLAUDE.md e GEMINI.md apontam pra ele)
comandos/          boas-vindas, instalar, novo vídeo, publicar e o jeito por chat (qualquer IA)
canal/             o SEU canal: nome, tema, jeito de falar, personagem, pauta e o que a IA aprendeu com você
metodo/            a fórmula do roteiro e o ritmo dos vídeos
motor/             o motor de animação (não precisa mexer)
motor/modelos/     catálogo de modelos GLB, peças originais, arquivos de origem e licenças
referencias/       o método de cada vídeo e o índice do que o motor sabe fazer
videos/            uma pasta por vídeo (o vídeo, a capa e o texto de postar; os testes em testes/);
                   videos/exemplo/ é um vídeo pronto pra você ver
.claude/skills/    os atalhos /instalar, /novo-video, /publicar e /ajuda do Claude Code
```

Os modelos, as animações e as novas peças estão descritos em
[Modelos e personagens](referencias/modelos-e-personagens.md). `npm run conferir-biblioteca` verifica a integração.

O motor também oferece [produção com Remotion](motor/remotion/README.md), integrada ao template Problem Resolve
enviado pelo usuário. Usa o apresentador do kit, identidade Cartoon, câmera contínua e vozes já salvas.
`npm run render:remotion -- referencias/cenas-exemplo/fone-cancelamento-ruido` gera a prévia do exemplo em `testes/remotion/`.
O render habitual permanece disponível; esta opção não substitui arquivos finais aprovados.

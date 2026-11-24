# O que a IA aprendeu com você

> A IA lê isto antes de todo vídeo e atualiza sozinha, com o que você pede, elogia e corrige. Pode abrir e editar
> quando quiser: apagou uma linha, a IA esquece aquilo. O registro de tudo fica em `historico.md`.
>
> Formato: `- a regra, curta (de onde veio: vídeo ou "você pediu", data)`
>
> **Última revisão:** 24/11/2026, canal novo. As lições técnicas vieram do projeto O Mundo da Tecnologia.

## Jeito de trabalhar

- Guiado: mostrar roteiro, prévias e vídeo pronto, pedindo opinião em cada etapa, até você pedir outro jeito.
- Economizar créditos sem perder qualidade: reaproveitar narração guardada, conferir a cena com a voz de teste antes da
  voz paga e gerar só as falas novas (vindo do projeto anterior, 13/11/2026).
- Render final no PC (com placa de vídeo leva minutos; na nuvem, horas). Na nuvem, só prévias (23/11/2026).

## Roteiro e narração

- Ensinar a se defender, nunca a aplicar o golpe. Sem nome nem logo de banco, app ou loja real (canal criado, 24/11/2026).
- Vídeo curto pra ser visto até o fim (~50 s). Sem pedir "segue" no meio. No fim, pedir um comentário de UMA palavra ligada ao caso (ex.: "comenta COMBINADO"), sem copiar a palavra de outro canal (vídeo de referência do usuário, 24/11/2026).

## Visual (personagem, cena, câmera)

- Corpos, móveis e peças com espaço claro entre eles; orientar corpo, olhar e braço para a tarefa e conferir a ação em
  movimento; ambientar laterais e fundo, sem vazios brancos (vindo do projeto anterior, 10 e 12/11/2026).
- Câmera contínua atravessando falas, poucos cortes, peças reagindo na palavra que as explica (vindo do projeto
  anterior, 11/11/2026; guia em `referencias/dinamica/guia.md`).
- O 1º quadro é a capa no feed: abrir com o rosto da detetive enchendo a tela, já reagindo, com o título em 2 linhas em cima. Nada de plano aberto sem rosto no começo (vídeo de referência do usuário, 24/11/2026).

## Voz e som

- A Voz feminina natural (das suas vozes na ElevenLabs, ID `IYSWsktXvPfMJJ7GKBNY`) é a voz de todos os vídeos; voz do computador só para testes (você pediu, 24/11/2026; trocou a Bia).

## Capa e texto de postar

- Capa em série, igual em todos: fundo amarelo e preto, 2 linhas de texto e a detetive em choque; subir no campo Miniatura do YouTube Studio pelo computador (vídeo de referência, 24/11/2026).
- Título até 50 caracteres, começando com "E se", quem e a ideia, com uma palavra em MAIÚSCULA; nenhuma hashtag no título (vídeo de referência, 24/11/2026).
- Descrição curta (uma linha com o que a pessoa buscaria), sem hashtag e sem tags; preencher o vídeo relacionado quando houver um vídeo longo; marcar "sim" em uso de IA (voz realista feita com IA); programar sempre no mesmo horário: **12h** (vídeo de referência e escolha do usuário, 24/11/2026).

## O que dá resultado nas redes

- Conferir 48 h depois: quantos continuaram assistindo (meta 75%), duração média perto da duração do vídeo e o segundo em que a curva cai. Não apagar Short que travou: quando um estoura, puxa os antigos (vídeo de referência, 24/11/2026).

## Lições técnicas

- Render longo na nuvem (sem placa de vídeo, ~3,5 s por quadro a 60 fps, ~5 h para 1min40) é cortado com 2 h: o motor agora guarda os quadros em `testes/quadros/` e, rodando o mesmo comando de novo, continua de onde parou sem gastar narração (videogame-cidade, 23/11/2026).
- No PC do usuário (com placa de vídeo) o mesmo render de 1min40 a 60 fps leva ~5 min de quadros: preferir render final no PC. A narração em `narracao/` não vai pro GitHub, então trocar de máquina gera a voz de novo (~1.600 caracteres). O Git foi instalado no PC em 23/11/2026; se `git` não for achado num terminal antigo, abrir um novo (videogame-cidade, 23/11/2026).
- Colisão e contato não garantem leitura visual: orientar tronco, rosto e braços para a tarefa, conferir a frente local da peça e mantê-la à frente durante retiradas e giros. Separar personagem/modelo em profundidade, preservar rosto e mãos visíveis e manter a posição do ator até soltar a peça; revisar também mãos e pés no enquadramento. Declarar teclado e monitor separadamente no computador, sem volumes vazios (impressora, 13/11; bico, 16/11/2026).

- No Remotion/React Three Fiber, construir o apresentador com o kit e `K.ativarEstiloRedondo()`, usando um único canvas. Não chamar `K.init()` para criar um segundo renderer. Resolver React/Three da instalação da integração também nas cenas fora dela; avaliar poses e boca pelo frame/tempo absoluto e conferir contato e repetição antes do MP4 (integração Remotion, 14/11/2026).

- O tempo passado a K.etiqueta/K.rotulo deve ser o tempo real desde a entrada, inclusive negativo antes dela; os componentes já escondem tempos negativos. Forçar um mínimo de 0,35 s ou prender em zero antes de um evento futuro cria novos instantes de som e repete o efeito. Manter o instante estável e conferir a lista de eventos; no resumo do bico foram encontrados 36 disparos antes da entrada correta (fone, 13/11; revisão do bico, 16/11/2026).

> Pra IA: erros da cena ou do motor que já deram trabalho neste canal, e como resolver.
- `K.enquadrarSeguro` só afasta a câmera: posicionar a chave perto do alvo e incluir nos pontos o menino e uma caixa de foco por plano, misturada no tempo. Em 9:16 com cena larga (maquete + personagem ao lado), olhar em diagonal com o personagem na frente; mirar longe demais encolhe tudo. Trajetos perto de mesas: conferir a caixa girada do apresentador, que fica maior que ±0,26 (videogame-cidade, 22/11/2026).

- Geometria com drawRange ainda tem limites do modelo inteiro; declarar um volume físico ajustado para a peça e reduzir a escala de malhas auxiliares escondidas. Ao voltar no tempo, restaurar x/y/z e rotação antes de calcular a pose. Na impressora, bico e material usam o mesmo percurso convertido pela base móvel (12/11/2026).

- Em portas girando, dividir o volume em faixas estreitas para evitar colisões falsas com o espaço vazio da diagonal. Conferir também o celular na mão ao passar pelo vão. A câmera deve mostrar a tela e o rosto, sem a folha da porta na frente; abrir quadros do interior antes de exportar (quarto dos fundos, 12/11/2026).

- Em interiores, declarar os volumes das paredes por partes para preservar o vão da porta; conferir trajetos a 60 fps, pois intervalos de 0,1 s podem perder um toque breve no móvel. Cabos curvos devem ser testados por segmento. Curva de comprimento zero usa o ponto, evitando coordenadas inválidas (Wi-Fi entre sala e quarto, 12/11/2026).

- Acessórios presos à mão herdam a rotação do braço: na lupa, isso deixava a lente vista pela quina. Corrigir a orientação no espaço do mundo e converter a posição do cabo para o espaço da mão, preservando a pegada; conferir a capa e o gesto (Wi-Fi pela parede, 11/11/2026).

- Depois de usar o alcance das mãos (IK), zerar os três eixos do cotovelo ao aplicar a próxima pose. Zerar só x preservava a torção anterior; `b.pose` agora limpa a rotação completa. Conferir um instante repetido depois de pular para outros tempos (motor, 11/11/2026).
- Para câmera contínua, usar um envelope estável e ajuste analítico de enquadramento. Afastamentos em passos de 5,5% ou limites baseados nos objetos que acabam de aparecer provocam saltos de zoom. Ver `referencias/animacao-e-camera.md` (motor, 11/11/2026).
- Conferir o zoom efetivo na projeção: o ajuste de área segura pode compensar a aproximação e deixar o personagem do mesmo tamanho. Medir a altura de uma referência fixa no começo e no fim; na abertura do carregador, o zoom efetivo foi ajustado para 10,35%. Reavaliar as mãos ao aumentar o apresentador (11/11/2026).

- Conferir o retorno dos ajudantes antes de esconder objetos: `K.torneira` retorna `{ g, alavanca, bico }`, então usar `torneira.g.visible`. Usar `torneira.bico` como origem de `K.jato`, para o fluxo sair da peça (carregador sem fio, 11/11/2026).
- Para conferir bobinas, declarar em `CENA.espaco()` uma caixa ajustada ao fio físico e manter as setas de visualização fora desse volume. Conferir o enquadramento depois dos gestos para preservar mãos, pés e peças dentro da área útil (carregador sem fio, 11/11/2026).
- Conferir também o último segundo do cartão final. No carregador sem fio, abrir mais a câmera durante o aceno preserva a mão inteira no quadro e a plaquinha legível; verificar a pose extrema do gesto (11/11/2026).

- Para a voz de teste masculina em português do Brasil, usar `nomeTeste: "Microsoft Daniel"` em `voz`. Neste Windows ela funciona pela API de fala WinRT, usada pelo motor quando a voz é indicada pelo nome. No vídeo do celular, `ritmoWindows: 1.22` resultou em 1 min 17 s.
- Na cena, usar o nome base dos efeitos com variações numeradas, como `clique` e `metal`. O motor escolhe a variante ao mixar.

## Organização dos arquivos

- Sincronizar com o GitHub privado NoMundoTecnologia cada etapa concluída que altere o projeto, sem pedir confirmação: revisar e executar `npm run sincronizar -- "Descrição da etapa"` antes da entrega no chat; durante trabalhos longos, enviar também etapas intermediárias consistentes. Manter credenciais e arquivos ignorados locais; avisar se houver falha no envio (pedido do usuário, 13/11/2026).

- Salvar todas as imagens e vídeos criados neste chat dentro de C:\Users\lopes\Pictures\Fabrica Cartoon, organizados por produção (pedido do usuário, 10/11/2026).
- Manter no computador os recursos necessários para criar vídeos, as narrações reutilizáveis e as entregas finais. Limpar testes, versões antigas e cache após aprovação. No GitHub privado, guardar fontes e recursos de produção; vídeos, credenciais e dependências ficam somente locais (pedido do usuário, 11/11/2026).
- Neste computador, o render e a conferência precisam de acesso ao ambiente normal do Windows: o ambiente restrito não enxerga o navegador instalado e falha ao acessar System.Speech. Teste validado com prévias de 3 e 30 segundos em 10/11/2026.

# Como o fone faz silêncio?

**Canal:** O Mundo da Tecnologia — @omundonatecnologia.  
**Etapa:** vídeo final entregue em 14/11/2026 após aprovação da voz e animação e retirada do zumbido contínuo; arquivo video.mp4.
**Duração proposta originalmente:** cerca de 1min40; a duração real medida está abaixo.
**Texto:** 277 palavras em 36 falas.  
**Duração real com Yuri:** 92,442755 s, cerca de 1min32, incluindo pausas e cartão.
**Voz:** Yuri, ElevenLabs, padrão do canal. **Formato planejado:** 1080×1920, 60 fps, vertical, 3D Cartoon.

## Proposta e aprendizados aplicados

Um ônibus urbano atravessa uma rua arborizada. O menino coloca um fone e percebe o ronco diminuir, mas o ônibus continua andando. A montagem didática revela almofadas, microfones, processador e alto-falante; o público compara o ruído antes e depois e entende as limitações.

Aplicado do histórico: personagem atuando e manipulando objetos, câmera contínua com aproximações leves, cenário externo preenchido, poucos cortes e gestos sincronizados à fala. Corpo, cabeça e braços se orientam para a mesma tarefa. Preservar o menino de moletom azul e laranja; não reutilizar quarto nem mesa como palco da explicação.

Ônibus, fone original, passageiro e diagramas foram implementados em cena.js após a aprovação. A prévia profissional está em testes/previa-completa-com-yuri.mp4.

### Referência de encenação incorporada em 13/11/2026

O usuário pediu estudar Desmontando o Mundo e trazer uma animação para cada explicação. A análise amostral e os critérios estão em `referencias/dinamica/desmontando-o-mundo.md`. A direção deste vídeo passa a exigir uma transformação demonstrável por ideia: almofada vedando, microfone recebendo, sinal percorrendo a placa, chip calculando, membrana vibrando, pressão residual diminuindo e personagem reagindo ao passageiro. Não depender de apresentador gesticulando ao lado de um desenho parado.

O percurso visual sai do ônibus para a concha ampliada, revela o funcionamento e retorna ao uso real. Uma ideia atravessa várias falas com a mesma câmera. Personagem arredondado, cenário completo e poucos cortes preservados. Texto aprovado mantido; duração real medida após gerar Yuri.

## Narração

Como o fone faz silêncio?

Se você entra num ônibus barulhento, parece que o motor sentou do seu lado.

Você coloca o fone e aperta um botão. O ronco diminui.

Mas o ônibus continua andando! O que aconteceu?

Vamos montar esse truque.

Primeiro, você encaixa uma almofadinha em volta de cada ouvido.

Ela funciona como uma janela fechada: segura parte do barulho.

Esse é o isolamento.

Mas aquele ronco ainda passa!

Então você adiciona pecinhas que escutam o som ao redor.

São os microfones.

Só que escutar não resolve. Falta calcular uma resposta!

Você conecta os microfones a um minicomputador.

Esse é o processador.

Ele calcula um sinal para fazer o movimento contrário ao ruído.

Mas um sinal elétrico sozinho não faz som!

Então você liga um pequeno alto-falante.

Ele vibra o ar e produz o som calculado.

Pera... você combate barulho com mais som?

Sim! Som é uma variação de pressão no ar.

Pensa em dois empurrões contrários.

Quando um aumenta a pressão, o outro tenta diminuir.

Perto do ouvido, as duas variações se combinam.

A que sobra fica menor. Você escuta menos ruído!

Esse é o cancelamento ativo.

Mas a bateria acabou? A eletrônica para.

As almofadas continuam segurando parte do barulho.

Com a bateria carregada, o truque volta.

E não precisa tocar música pra funcionar.

Mas não vira silêncio absoluto!

O ronco constante do motor é mais fácil de reduzir.

Vozes e sons repentinos ainda podem aparecer.

É por isso que o fone deixa tudo mais quietinho, sem apagar o mundo.

Por fora, é só um fone.

Por dentro, almofadas, microfones e um processador comandando o alto-falante.

Qual aparelho a gente abre no próximo?

## Direção frase por frase

Os identificadores abaixo estão em roteiro.json e cena.js. A prévia profissional usa a timeline real de Yuri; colocação do fone, botão, diafragma e rótulos do resumo acompanham as palavras. Mudança de identificador não significa corte de câmera.

| # / plano | Narração | Ação, câmera e som |
|---|---|---|
| 1 / gancho | Como o fone faz silêncio? | Dentro do ônibus, enquadramento em três quartos do menino com o fone nas mãos; título acima, janela com rua e árvores ao fundo. Capa coincide com este primeiro quadro. |
| 2 / embarcar | Se você entra num ônibus barulhento, parece que o motor sentou do seu lado. | Ônibus ainda parado: menino avança pelo corredor e se acomoda no banco. Ronco discreto, expressão incomodada e breve olhar para a traseira; mochila fica ao lado, fora do encosto. |
| 3 / ligar_anc | Você coloca o fone e aperta um botão. O ronco diminui. | Já sentado e com o ônibus em movimento, coloca o fone com as duas mãos e toca o botão lateral; ronco cai na palavra “diminui”. Identificar “O QUE ELE OUVE · SIMULAÇÃO”. |
| 4 / onibus_continua | Mas o ônibus continua andando! O que aconteceu? | Olha pela janela e aponta a paisagem que segue passando. Movimento do ônibus e do cenário mantém a mesma velocidade. |
| 5 / abrir_esquema | Vamos montar esse truque. | Do fone surge uma ampliação didática flutuante ao lado do menino, fora do corpo. A câmera acompanha; exterior e interior continuam preenchendo o fundo. |
| 6 / almofadas | Primeiro, você encaixa uma almofadinha em volta de cada ouvido. | Ampliação separa as almofadas. Menino aproxima uma mão e indica o encaixe ao redor da orelha esquemática, sem atravessar cabeça ou peça. |
| 7 / comparar_janela | Ela funciona como uma janela fechada: segura parte do barulho. | No mesmo diagrama, miniatura de janela fecha e reduz parte das marcas de som. Não alterar a janela real nem atribuir redução total à almofada. |
| 8 / isolamento_rotulo | Esse é o isolamento. | Um rótulo ISOLAMENTO junto à almofada; menino contorna sua borda com o gesto. |
| 9 / ronco_passa | Mas aquele ronco ainda passa! | Ruído residual continua junto ao ouvido; menino reage ao ronco ainda presente, sem exagerar o volume. |
| 10 / microfones | Então você adiciona pecinhas que escutam o som ao redor. | Pequenos microfones são destacados na carcaça, com linhas de sinal indo ao espaço reservado à placa. |
| 11 / microfones_rotulo | São os microfones. | Rótulo MICROFONES; indicação clara das cápsulas. Elas recebem som e não emitem a onda de cancelamento. |
| 12 / falta_calculo | Só que escutar não resolve. Falta calcular uma resposta! | Sinal chega a uma conexão ainda vazia; menino olha o encaixe e faz gesto de dúvida. |
| 13 / encaixar_placa | Você conecta os microfones a um minicomputador. | Placa com chip se encaixa na ampliação; punho, olhar e tronco voltados para a mesma peça. |
| 14 / processador_rotulo | Esse é o processador. | Rótulo PROCESSADOR sobre o chip e brilho curto da placa. |
| 15 / calcular_sinal | Ele calcula um sinal para fazer o movimento contrário ao ruído. | Sinal do microfone passa pelo chip; desenho de pressão oposta aparece na saída elétrica, sem ainda haver emissão sonora. |
| 16 / falta_falante | Mas um sinal elétrico sozinho não faz som! | Saída elétrica termina num encaixe vazio; não fazer luz/bits virarem som antes da peça emissora. |
| 17 / alto_falante | Então você liga um pequeno alto-falante. | Alto-falante entra no encaixe e liga à placa. Diafragma e orelha esquemática têm espaço separado. |
| 18 / vibrar_ar | Ele vibra o ar e produz o som calculado. | Diafragma oscila longitudinalmente, comprimindo e rarefazendo pontos de ar; vibração exagerada com etiqueta AMPLIADO. |
| 19 / mais_som | Pera... você combate barulho com mais som? | Menino alterna o olhar entre ônibus e fone, abre as mãos em surpresa. Desenho se desloca com a câmera em vez de cortar. |
| 20 / pressao | Sim! Som é uma variação de pressão no ar. | Zoom leve na representação do ar: pontos aproximam-se e afastam-se ao longo do eixo, sem viajar do motor até o ouvido. |
| 21 / dois_empurroes | Pensa em dois empurrões contrários. | Menino usa as mãos para representar duas influências opostas. Indicador 2 SONS; não mostrar sons colidindo e desaparecendo no corredor. |
| 22 / opostos | Quando um aumenta a pressão, o outro tenta diminuir. | Duas curvas alinhadas de variação de pressão no mesmo ponto: laranja e azul, uma positiva quando a outra é negativa. Rótulos entram em sequência. |
| 23 / combinar | Perto do ouvido, as duas variações se combinam. | Curvas somam-se no ponto marcado junto ao ouvido esquemático. Esta é uma visualização de pressão ao longo do tempo, não dois caminhos físicos. |
| 24 / residual | A que sobra fica menor. Você escuta menos ruído! | Resultado de menor amplitude continua oscilando. Menino relaxa; ônibus e rua continuam ativos, sem silêncio absoluto na mixagem. |
| 25 / cancelamento_rotulo | Esse é o cancelamento ativo. | Rótulo CANCELAMENTO ATIVO. A câmera começa a retornar à escala real do fone. |
| 26 / sem_bateria | Mas a bateria acabou? A eletrônica para. | Situação hipotética identificada: SE A BATERIA ACABAR. Bateria da ampliação mostra carga zero, chip e emissão cessam; ronco retorna parcialmente. |
| 27 / isolamento_permanece | As almofadas continuam segurando parte do barulho. | Almofadas seguem colocadas e destacadas. Nunca comparar bateria zerada ao som sem fone, pois a barreira física continua. |
| 28 / bateria_carregada | Com a bateria carregada, o truque volta. | Volta didática ao estado BATERIA CARREGADA; sem simular recarga instantânea real. Placa acende e ronco volta a diminuir. |
| 29 / sem_musica | E não precisa tocar música pra funcionar. | Celular mostra reprodução pausada enquanto o cancelamento segue ligado; menino aponta a pausa e depois o fone. |
| 30 / limite | Mas não vira silêncio absoluto! | Menino ergue um dedo; som ambiente residual permanece. Etiqueta MENOS RUÍDO. |
| 31 / motor_constante | O ronco constante do motor é mais fácil de reduzir. | Mesmo trecho de ronco, repetível: alternância curta ANC DESLIGADO / ANC LIGADO, mantendo fone colocado, música pausada e nível da voz iguais. |
| 32 / voz_ainda_passa | Vozes e sons repentinos ainda podem aparecer. | Um passageiro ao lado faz um cumprimento discreto e acena; menino percebe e vira corpo e olhar para ele. Sem buzina abrupta ou susto sonoro. |
| 33 / quietinho | É por isso que o fone deixa tudo mais quietinho, sem apagar o mundo. | Menino responde ao aceno e relaxa, com a cidade passando. A comparação subjetiva termina sem desligar o motor do ônibus. |
| 34 / por_fora | Por fora, é só um fone. | Arco suave mostra o fone completo e o rosto, com postura coerente no banco. |
| 35 / por_dentro | Por dentro, almofadas, microfones e um processador comandando o alto-falante. | Ampliação reaparece ao lado: almofadas, microfones, processador e alto-falante destacados na ordem das palavras, um rótulo por vez. |
| 36 / segue | Qual aparelho a gente abre no próximo? | Menino olha para o público e faz gesto de convite; plaquinha entra ao lado, sem cobrir mãos, rosto, fone ou legendas. |

## Continuidade e espaço

- Começar já no interior do ônibus, com passagem legível da porta até o banco; ele só parte depois de o menino se sentar. Assento, pernas, mochila, mãos e fone terão trajetos e volumes próprios. Criar pose sentada, sem afundar o quadril no banco.
- Janelas com rua, calçada, árvores, fachadas e céu; nenhuma lateral em corte mostra fundo branco. O ônibus tem bancos, piso, corrimãos e teto. Definir quais partes se ocultam suavemente para a câmera sem expor vazios.
- Fazer movimentos de câmera em arcos de aproximadamente 8–15 segundos, atravessando falas. Planejar até dois cortes motivados se necessários à clareza, sem corte automático por frase.
- Manter rosto visível e diagrama em espaço separado; o fone real fica na cabeça enquanto a ampliação é identificada como esquema. Não desmontar fisicamente o fone dentro da cabeça.
- Orientar tronco antes dos gestos; usar as duas mãos na colocação do fone e conferir a pegada. O gesto do botão deve tocar a lateral correta.
- A montagem da ampliação e o ônibus em movimento mantêm ações contínuas durante a explicação. As janelas, a postura, os olhos e as peças permanecem ativos; evitar um painel imóvel durante todo o miolo.
- Usar falha/correção nas etapas da montagem, com transições curtas. Não congelar todo o ônibus a cada problema nem usar rebobinadas por rotina.
- Legendas, rótulos e demonstrações ficam em regiões distintas, com até dois textos de apoio por quadro. Não pôr peças importantes na faixa das legendas.
- Cartão final de 1,6 s com “QUAL A PROXIMA TECNOLOGIA INVESTIGAMOS?”. A narração encerra com a assinatura existente do canal.

## Direção sonora: parte essencial da explicação

Revisão final de 14/11/2026: o usuário aprovou voz, movimento e diferença sonora, mas pediu retirar o zumbido de fundo. A entrega video.mp4 usa ambiente apenas na comparação entre 75,512713 e 77,212713 s, com fades curtos. Não há ronco contínuo sob a narração. As falas Yuri foram remixadas do cache; vídeo copiado sem recodificação, com hash da imagem idêntico ao da prévia. Áudio final: -16,58 LUFS e pico verdadeiro -3,40 dBFS. O plano abaixo documenta a intenção original; a retirada do ambiente durante a narração prevalece.

A comparação será uma simulação editada da experiência do personagem, não uma gravação de desempenho de um modelo comercial nem cancelamento físico produzido pelo celular do espectador.

1. Separar narração, ruído do ônibus, voz eventual do passageiro e música. A narração permanece igualmente clara nas duas condições.
2. Usar ronco suave de motor com componentes que sobrevivam à reprodução em celular. Evitar depender somente de subgrave.
3. Na abertura, mostrar colocação e acionamento em sequência: isolamento parcial ao vestir, queda adicional ao apertar o botão.
4. Na comparação ao final, manter o fone colocado e alternar apenas o cancelamento: mesmo ruído de origem, duas mixagens, com residual preservado. Identificar “ANC DESLIGADO” e “ANC LIGADO” e explicar ANC pela narração antes.
5. Reservar duas janelas curtas sem fala, cerca de 0,7–1,0 s cada, para ouvir o antes/depois. Esses tempos e o cartão estão contemplados na faixa estimada; não aumentar a voz para mascarar o ruído.
6. Não baixar a música junto com o ronco; demonstrar com reprodução pausada. Evitar trilha de fundo durante as comparações para deixar a diferença legível.
7. Comparar também após a mixagem final e em mono, porque compressão, normalização e o alto-falante do celular podem reduzir o contraste percebido.

O motor atual aceita efeitos por nome, instante, ganho e duração, mas busca os sons em motor/sons. Não pressupor suporte a uma faixa ambiente local variável ao longo da timeline. Na implementação, preparar a faixa do episódio e integrar sua mixagem de forma revisada, preservando a organização em videos/fone-cancelamento-ruido/. Qualquer eventual mudança no motor compartilhado deve continuar compatível com os outros vídeos. A trilha ambiente precisa fazer parte das prévias, não ser adicionada somente à entrega.

## Ciência conferida e limites da representação

- Mostrar um fone externo com almofadas: vedação e materiais ajudam a reduzir ruído passivamente; a eletrônica realiza a redução ativa. O efeito e a quantidade de microfones variam por modelo.
- Microfones captam som; o processador calcula o sinal; o alto-falante produz a variação de pressão correspondente. Não atribuir emissão de som ao microfone.
- A oposição útil precisa acontecer perto do ouvido, considerando o caminho do som. Não sugerir que inverter uma gravação cancela o ambiente inteiro.
- Curvas coloridas são desenhos da pressão ao longo do tempo em um ponto. Partículas de ar oscilam em torno de posições médias; não viajam pelo ônibus como bolinhas entregando ruído.
- “Dois empurrões contrários” é uma analogia para variações opostas de pressão. Não significa que as ondas precisam viajar em direções opostas ou que duas forças rígidas bloqueiam o ar.
- Resultado com amplitude menor, nunca linha totalmente zerada como promessa real. Não criar bolha de silêncio no ônibus.
- Sons contínuos e graves tendem a ser mais fáceis de reduzir do que vozes e transientes. Um cumprimento pode continuar audível; não prometer ausência de qualquer redução da voz.
- Cancelamento ativo exige energia e pode funcionar sem música. Sem energia, a barreira física das almofadas permanece.
- O número “dois” descreve os sinais usados na explicação, sem inventar uma porcentagem de cancelamento ou autonomia de bateria.

## Fontes técnicas

Consultadas em 13/11/2026; texto e visual propostos são originais.

- [Bose — How do noise cancelling headphones work?](https://www.bose.com/stories/how-do-noise-cancelling-headphones-work): isolamento físico, microfones/processamento, sinal oposto, funcionamento sem música e limites em vozes/ruídos variáveis.
- [Bose — How does noise cancelling work?](https://www.bose.com/stories/noise-cancelling-vs-noise-masking): necessidade de energia e manutenção do isolamento passivo sem alimentação.
- [OpenStax — University Physics, 17.4, Noise Reduction through Destructive Interference](https://openstax.org/books/university-physics-volume-1/pages/17-4-normal-modes-of-a-standing-sound-wave): pressão sonora, soma de variações opostas e limites do cancelamento ideal.

## Próxima etapa

Entrega final: video.mp4, capa.png e publicacao.md. Voz e animação aprovadas, zumbido de fundo removido em 14/11/2026; aguardar opinião sobre a revisão sonora e informações de publicação. Relatório em testes/conferencia-sem-zumbido.json. Abaixo ficam os registros das prévias anteriores.

Atualização de 14/11/2026: a chave atualizada funcionou. As 36 falas de Yuri estão salvas; 35 novas consumiram 1542 caracteres e a chamada final foi reaproveitada. Ambiente e movimentos alinhados à voz real. Conferidos 5547 instantes: sem conflitos declarados, erro de contato máximo 0,00049, câmera contínua e repetição determinista. Prévia profissional Full HD/60 fps pronta em testes/previa-completa-com-yuri.mp4, 92,443 s, 54.566.843 bytes; MP4 inteiro decodificado sem erro, áudio -16,78 LUFS e pico -3,34 dBFS. Comparação sonora em mono com redução de 8,31 dB entre janelas da simulação, sem prometer desempenho de um aparelho real. Quadros exportados revisados: colocação, componentes, ondas, celular, comparação, resumo e cartão. Receber opinião sobre a prévia antes de promover a entrega final.

### Registro da etapa anterior (13/11/2026)

O usuário aprovou o roteiro e pediu a criação. Cena original, roteiro.json, gerador de ambiente, capa e textos de publicação estão preparados. Prévia visual completa em testes/previa-visual-sem-narracao.mp4: 96,8 s, 540×960, 30 fps, ambiente sintetizado localmente e aviso explícito de narração pendente. Esta não é a entrega final. A tentativa da ElevenLabs retornou 401 / Invalid API key; aguardar o usuário atualizar a chave local antes de gerar as 35 falas restantes. Uma fala idêntica já foi reaproveitada do cache; estimativa de 1542 caracteres novos.

Conferidos 5808 instantes a 60 fps: sem conflitos declarados, erro de contato inferior a 1e-12, câmera sem saltos nos limites das falas e repetição fora de ordem determinista. Arquivo MP4 inteiro decodificado sem erro. Conferidas imagens de abertura, componentes, ondas, passageiro e cartão; ajustes de enquadramento realizados antes da prévia. Ainda falta conferir a comparação com a voz e com a mixagem final, sincronizar eventos ao alinhamento real e receber opinião sobre a prévia profissional antes do render Full HD/60 fps. Procedimento de retomada em PRODUCAO.md.


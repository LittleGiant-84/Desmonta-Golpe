# Remotion integrado à Fábrica Cartoon

Opção de renderização 3D com Remotion + React Three Fiber. O motor existente continua disponível. O personagem, a paleta e o esqueleto vêm do kit original; o módulo acrescenta câmera orbital por chaves, trilhas de propriedades, indicadores de problema/solução, rótulos ancorados ao modelo e legendas pelos tempos de Yuri.

## Instalar em outro computador

Na raiz da Fábrica Cartoon:

```powershell
npm ci
npm ci --prefix motor/remotion --ignore-scripts
```

Dependências fixadas em motor/remotion/package-lock.json; instalação separada para não trocar as bibliotecas do motor legado. O Chromium, o FFmpeg e o áudio são os já disponíveis no projeto. A fonte Montserrat é carregada pelo pacote oficial do Remotion e requer conexão no primeiro carregamento.

## Gerar quadros e prévia

```powershell
node motor/render.js referencias/cenas-exemplo/fone-cancelamento-ruido --remotion --quadros
node motor/render.js referencias/cenas-exemplo/fone-cancelamento-ruido --remotion
```

Alternativa: npm run render:remotion -- referencias/cenas-exemplo/fone-cancelamento-ruido.

Saídas em referencias/cenas-exemplo/fone-cancelamento-ruido/testes/remotion/: plano.json, quadros, conferencia-cena.json e previa-integracao-remotion.mp4. A composição é 1080×1920/60 fps. O comando nunca sobrescreve video.mp4 nem capa.png do episódio e não lê .env ou chama serviço de TTS.

Abrir os quadros antes de exportar. O render exige um relatório CARTOON_AUDIT da cena, sem colisões declaradas, contato das mãos abaixo de 0,025 unidade e repetição determinista. Ao finalizar, confere dimensões, FPS, quantidade de quadros e decodifica o MP4 inteiro.

## Preparar outro vídeo

Manter roteiro.json, timeline.json e cena.js do episódio. Adicionar:

- remotion/config.json: intervalo pelos nomes inicio/fim da timeline, eventos por plano/palavra (ou fim da frase), deslocamentos em frames, trilhas animacoes, indicadores, poses de câmera, objetos e palavrasChave.
- remotion/cena.tsx: exportar CenaDoVideo e RotulosDoVideo. Usar os componentes de @motor-remotion e criarPersonagem para preservar o apresentador. A cena deve avaliar movimentos por frame absoluto e emitir CARTOON_AUDIT com amostras, erroContato, conflitos e repeticao.
- Uma fonte de áudio já aprovada dentro do episódio, informada em audioOrigem. O padrão é video.mp4. O módulo extrai só o trecho escolhido, mantendo a voz e os tempos existentes.

O adaptador converterá a timeline em cenas contíguas com tempo local, preservando os tempos globais para a boca do personagem. inicio/fim, palavras de eventos, animações e arquivo de áudio são validados antes do render. As propriedades específicas do fone ficam no episódio, não no motor genérico.

O exemplo atual é um trecho de 20,333 s do fone: falta de cálculo → colocação do processador → falta de emissão → colocação do alto-falante → membrana em funcionamento. O cenário de laboratório e a modelagem dessa prévia são originais do canal. O áudio foi recortado do vídeo aprovado, sem zumbido contínuo e sem créditos novos. A prévia testa a integração; não substitui o vídeo entregue.

## Referências

- ORIGEM.md registra o ZIP e os arquivos aproveitados.
- [ThreeCanvas](https://www.remotion.dev/docs/three-canvas): avaliação da animação pelo frame do Remotion.
- [RenderMedia](https://www.remotion.dev/docs/renderer/render-media): exportação programática.

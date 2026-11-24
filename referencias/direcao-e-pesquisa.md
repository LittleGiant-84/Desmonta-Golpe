# Direção, pesquisa e prévias em movimento

Ao preparar a revelação de cada episódio, definir a ação que explica o mecanismo e marcar a palavra que acompanha
sua reação. Se o gesto atravessar várias frases, a câmera pode acompanhá-lo num movimento contínuo. O personagem
acompanha a peça com o olhar e ajusta a postura durante o gesto.

## Recursos do kit

- `K.planoCurvo(de, controle, ate, p)` move a câmera em arco. `controle` é um ponto `[x, y, z]` entre os enquadramentos.
- `K.quando('palavra', inicio)` encontra o instante da fala na timeline. Use esse tempo para o contato, o som e a
  resposta visível da peça.
- `node motor/render.js videos/<tema> --trecho 12,23 --previa-rapida` gera uma prévia de 540 × 960 a 30 fps.
  A iluminação da prévia usa sombras simplificadas. O modo normal usa as configurações do roteiro.
- A prévia rápida usa narração profissional já salva em `narracao/`. Quando o áudio estiver ausente, use
  `--voz-teste`. O modo rápido recusa uma nova chamada de narração paga.
- A timeline da prévia rápida fica junto do trecho em `testes/`, com o sufixo `.timeline.json`.

## Referências consultadas

- O manual da Microchip descreve a alteração do sinal entre os eletrodos de uma tela de capacitância mútua quando
  o dedo toca o vidro. Usado no teste do celular. [Microchip TB3064](https://ww1.microchip.com/downloads/en/DeviceDoc/93064A.pdf)
- A documentação do Three.js descreve a curva quadrática com início, controle e fim, usada como base do movimento
  de câmera. [QuadraticBezierCurve3](https://threejs.org/docs/pages/QuadraticBezierCurve3.html)
- Para importar modelos com articulações e animações, o Blender exporta glTF/GLB e o Three.js dispõe de um sistema
  de reprodução e combinação dessas animações. [Exportação do Blender](https://docs.blender.org/manual/en/5.1/addons/import_export/scene_gltf2.html)
  e [sistema de animação do Three.js](https://threejs.org/manual/pages/animation-system.html)

## Teste do celular

O estudo do toque foi implementado em `referencias/cenas-exemplo/celular/cena.js` e pode ser ativado com `direcao.toqueContinuo = true`
no roteiro. A mesma narração foi reaproveitada. O contato e o clique acompanham a palavra “muda”, em 15,95 s na
narração usada no teste. As mídias temporárias do estudo foram removidas após a aprovação.

No trecho de 11 segundos, medido neste computador, o modo normal levou 85 s e gerou 5,98 MB.
A prévia rápida levou 34 s e gerou 1,74 MB. O modo normal foi conferido em 1080 × 1920 a 60 fps, e o rápido em
540 × 960 a 30 fps. Esses tempos variam com a cena e a carga do computador.

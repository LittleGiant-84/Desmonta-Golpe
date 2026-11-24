# Acabamento gráfico do canal

O perfil `cartoon` melhora luz, reflexos e sombras preservando geometrias, cores-base, roupa, personagem e as câmeras escritas em cada cena. O perfil `original` mantém o acabamento anterior.

## O que mudou

- Ambiente de reflexão gerado por código, com painéis amplos de luz. Metais ganham reflexos e materiais foscos recebem uma contribuição suave. Nenhuma textura externa precisa ser baixada.
- Luz de preenchimento acompanhando a câmera, sem uma nova passagem de sombras.
- Mapeamento de tons ACES e filtro de cor mais leve, mantendo os valores da paleta nos materiais.
- Sombras com menor afastamento dos objetos e área mais concentrada. A intensidade é calculada de novo em cada instante, inclusive quando a cena volta no tempo.
- Modelos GLB seguem funcionando e podem voltar ao ambiente de reflexão anterior.

O padrão dos renders fica em `canal/visual.json`:

```json
{
  "perfil": "cartoon",
  "exposicao": 1.05,
  "reflexos": 0.8,
  "alcanceSombras": 12
}
```

Um `visual` no `roteiro.json` substitui os campos escolhidos. Por exemplo, `"visual": {"perfil": "original"}` recupera o acabamento anterior para aquele vídeo. Também pode usar:

```
node motor/render.js videos/<tema> --visual-original
```

O campo `alcanceSombras` deve cobrir a cena: o padrão atende aos exemplos conferidos, mas cenários muito largos podem precisar de um valor maior, até 40. Aumentar esse alcance distribui o mapa de sombras por uma área maior.

## Conferência

```
npm run conferir-visual
npm run conferir-biblioteca
```

A conferência visual gera duas imagens em `testes/` de cada produção, compara os dados das geometrias, as cores-base e a câmera, verifica retorno ao perfil original, ausência de acúmulo de luz e volumes ocupados. Não gera narração nem modifica MP4 ou capa entregues.

Em 11/11/2026, passaram as cenas de dia do carregador, a lanterna à noite e a demonstração GLB. Medianas de oito quadros, após aquecimento e incluindo a captura JPEG em 1080 × 1920:

| Cena | Original | Cartoon |
|---|---:|---:|
| Carregador | 52 ms | 50 ms |
| Lanterna | 68 ms | 63 ms |
| Demonstração GLB | 56 ms | 48 ms |

Esses números são uma comparação local curta; o tempo de uma exportação completa inclui narração salva, áudio, gravação de imagens e codificação do MP4. Não representam reprodução em tempo real.

O perfil mantém apenas o sol gerando sombras. Não aplica desfoque sobre as legendas nem acrescenta brilho global que apague os detalhes.

Para rever o resultado deste ajuste, a comparação de seis segundos está em `videos/carregador-sem-fio/testes/motor-grafico-comparacao.mp4`: original à esquerda e cartoon à direita. A narração já salva de Yuri foi reaproveitada. As imagens de comparação ficam em `testes/motor-grafico-original.png` e `testes/motor-grafico-cartoon.png` de cada uma das três produções conferidas. São mídias de avaliação, para limpar depois da opinião sobre o acabamento.

## Fontes técnicas

- [Three.js: MeshStandardMaterial](https://threejs.org/docs/pages/MeshStandardMaterial.html), ambiente de reflexão e intensidade.
- [Three.js: PMREMGenerator](https://threejs.org/docs/pages/PMREMGenerator.html), iluminação de ambiente filtrada a partir de uma cena.
- [Three.js: sombras](https://threejs.org/manual/pages/shadows.html), custo das luzes com sombra e relação entre área coberta e definição.
- [RoomEnvironment da versão r160](https://github.com/mrdoob/three.js/blob/r160/examples/jsm/environments/RoomEnvironment.js), referência de implementação compatível com a versão instalada.

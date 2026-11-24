# Modelos, peças e personagens articulados

O motor aceita modelos GLB 2.0 com geometria e imagens incorporadas. Os arquivos declarados no roteiro são carregados
da pasta do projeto. Os vídeos que usam apenas as peças desenhadas por código seguem o fluxo habitual.

## Biblioteca disponível

| Recurso | Uso |
|---|---|
| RobotExpressive | Robô com esqueleto e 14 animações, incluindo andar, acenar, dançar e saltar |
| Boom Box | Aparelho de som com materiais e texturas |
| Placa eletrônica | Placa, chip, conectores e trilhas separados para vistas internas |
| Bateria | Indicador com quatro segmentos de carga |
| Engrenagem | Rotação por tempo, cor, raio e quantidade de dentes configuráveis |

O catálogo está em `motor/modelos/catalogo.json`. Os arquivos GLB estão em `motor/modelos/`.
As três peças originais também podem ser criadas diretamente pelas funções em `motor/pecas-e-personagens.js`.

## Modelos externos em um vídeo

Declare no `roteiro.json` os arquivos necessários, com caminhos relativos à raiz do projeto.

```json
"modelos": [
  {"id": "robo", "arquivo": "motor/modelos/robot-expressive/RobotExpressive.glb"}
]
```

Em `montar`, crie uma instância e guarde-a para usar nos quadros.

```js
robo = K.modelo('robo', { altura: 1.4 });
robo.g.position.set(0.8, 0, 0);
```

Em cada quadro, use o tempo da ação. A animação aceita voltar no tempo, tirar quadros isolados e gerar trechos.

```js
robo.em(B.t, {
  acao: 'Wave',
  anterior: 'Idle',
  mistura: K.suave(K.faixa(B.t, 0, 0.4))
});
```

`robo.animacoes` lista os nomes. Para ações que terminam em uma pose, use `repetir: false`.
Instâncias do mesmo modelo possuem esqueletos independentes. `expressao(nome, peso)` controla um alvo de expressão
existente no modelo. `anexar(objeto, nomeDaArticulacao, posicao, giro)` prende uma peça a um osso ou nó nomeado.

O carregador usa os módulos da versão de Three.js instalada no projeto. A integração atual atende GLBs incorporados
sem recursos externos nem decodificadores adicionais, como Draco e KTX2.

## Apresentador do canal

`K.apresentador(op)` aceita as cores e a roupa de `K.boneco(op)` e acrescenta alcance da mão e direção do olhar.
O personagem azul continua sendo construído pelo kit, com articulações de ombro, cotovelo e cabeça.

```js
// Em montar
menino = K.apresentador({ roupa: 'moletom', cores: { moletom: 0x2563eb, punho: 0xf97316 } });
peca = K.bateria();
peca.g.scale.setScalar(0.35);
menino.prenderNaMao(peca.g, -1);

// A cada quadro, depois de posicionar o personagem
menino.reset(tc);
menino.olhar([0.1, 1.1, 0.3]);
menino.alcancar([0.1, 1.1, 0.3], 1);
```

Os alvos são pontos no mundo. O lado `-1` indica a mão esquerda e `1` a direita. O alcance é limitado ao comprimento
do braço. As funções também funcionam com o personagem girado e escalado. A posição de uma peça presa à mão é local
à mão e pode ser ajustada pelos argumentos opcionais de `prenderNaMao`.

## Peças criadas para o projeto

```js
placa = K.placaEletronica();
placa.abrir(progresso);  // afasta o chip e os conectores
placa.em(tc, 1);        // anima a luz de energia

bateria = K.bateria();
bateria.carga(0.75);

engrenagem = K.engrenagem({ raio: 0.3, dentes: 12, cor: 0xffae52 });
engrenagem.girar(tc, 0.25);
```

Todas expõem `g`, para posicionar, girar e escalar. O arquivo GLB exportado guarda a geometria e as partes nomeadas.
As funções acima controlam seus movimentos quando usadas diretamente no kit.

## Conferir e exportar

As cenas podem expor `CENA.espaco()` com os volumes ocupados pelos objetos importantes. O render verifica esses
volumes a cada 0,1 s antes de começar e repete a conferência em cada quadro exportado. A exportação é interrompida
se encontrar interseção acima da tolerância. Para o robô, a caixa é
recalculada com a pose do esqueleto. Para o corpo do apresentador, use uma caixa local que represente o tronco e as
pernas, deixando o movimento intencional das mãos fora dela.

```js
function espaco() {
  return [
    { nome: 'personagem', obj: menino.g, caixa: [[-0.27, 0, -0.28], [0.27, 1.53, 0.28]] },
    { nome: 'mesa', obj: mesa },
    { nome: 'robô', obj: robo.g }
  ];
}
window.CENA = { montar, cena, espaco };
```

`K.conflitosDeEspaco(itens, tolerancia = 0.015)` devolve os pares em conflito. Objetos invisíveis e pares com o mesmo
`grupo` são ignorados. Use o grupo apenas para componentes que pertencem à mesma montagem. O teste usa caixas
envolventes, por isso a inspeção visual continua sendo necessária para verificar o enquadramento e as sobreposições
na imagem. As caixas locais de mesas devem representar os móveis, separando suportes que tenham contato intencional
com uma peça.

`npm run conferir-biblioteca` verifica os modelos, a independência dos esqueletos, o retorno a um instante anterior,
a mistura de clipes e o alcance das mãos. A verificação usa o navegador local e dispensa narração.

`npm run exportar-pecas` confere e exporta as peças para `motor/modelos/pecas-originais/`. Se um arquivo já existir com
conteúdo diferente, a operação para para preservar aquela versão.

## Fontes dos modelos

O robô é de Tomás Laulhé, com modificações de Don McCurdy. O README da versão r160 identifica o arquivo como CC0 1.0.
[Origem e licença do RobotExpressive](https://github.com/mrdoob/three.js/tree/r160/examples/models/gltf/RobotExpressive)

O aparelho de som é da Microsoft e está no catálogo Khronos, que identifica o modelo como CC0 1.0. Os textos de
metadados possuem sua própria licença, preservada nos arquivos locais.
[Origem e licença do Boom Box](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/BoomBox)

Os documentos originais de origem e licença acompanham os modelos. `downloads.json` registra as URLs, os tamanhos e
os hashes dos arquivos baixados em 10/11/2026.

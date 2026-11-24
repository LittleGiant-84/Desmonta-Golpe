# Ambientes e deslocamento entre cômodos

`motor/ambientes.js` acrescenta `K.casaEmCorte()`. O render e a conferência de cenas carregam o módulo; cenas antigas
continuam usando seus próprios cenários. O modelo é procedural e mantém o estilo arredondado do kit.

O retorno contém `g`, `rack`, `estante`, `sofa`, `cama`, `criado`, `divisoria`, `porta`, `armario`, `macaneta` e
`colisoes`. `atualizar(abertura, metalNoCaminho)` controla a abertura da porta (0–1) e o deslocamento do armário.
Opções: `K.casaEmCorte({ quartoDosFundos: true, armario: false })` acrescenta um terceiro ambiente atrás do quarto,
com cama roxa, placa, piso, passagem física e porta própria, e retira o móvel metálico da imagem e das colisões.
Nesse modo, o retorno inclui `fundos` (`g`, `porta`, `entrada`, `posicao`); o terceiro argumento de
`atualizar(abertura, metalNoCaminho, aberturaFundos)` anima a segunda porta. As laterais direitas dos quartos são
mostradas em corte para permitir que a câmera acompanhe a passagem de um para o outro sem esconder o personagem.
Não há teto nem fachada frontal para a câmera enxergar o interior; as paredes laterais, a parede divisória e os
móveis continuam físicos. A sala e o quarto usam cores distintas e placas para facilitar a leitura.

## Planejar o movimento

- Definir trajetos pelo vão da porta, com espaço para a largura do corpo e suas rotações ao andar.
- Abrir a porta antes da passagem e fechá-la depois de o corpo sair da área de giro.
- Contornar o rack e a cama com pontos intermediários. Não interpolar diretamente de uma posição final à outra.
- Misturar a passada com a pose parada na entrada e na saída do trajeto; evitar passos no lugar quando o corpo para.
- Para pegar e colocar o celular, interpolar entre o apoio físico e a posição da mão, calculadas pelo tempo real.
- Para levantar o roteador, primeiro subir acima da prateleira, depois deslocar e apoiar. Manter a peça ao alcance.
- Calcular o encontro do sinal com a divisória e o armário a partir das posições reais do roteador e do celular.
  As cores e a intensidade são ilustrações, sem valor de medição física.

## Conferência

`node motor/conferir-cena.js videos/<tema> --fps 60` confere todos os quadros previstos a 60 fps, sem renderizar cada
imagem, antes do render completo. Valida volumes, enquadramento do personagem, contato de mão, números finitos,
repetição fora de ordem e continuidade de câmera entre falas. A opção sem `--fps` mantém 10 amostras por segundo.

As colisões da casa são declaradas por peças: não usar uma caixa única que cubra o vão da porta. Partes que se
encaixam no mesmo móvel compartilham um grupo. Cabos curvos são conferidos por segmento para a caixa envolvente
não confundir o espaço vazio da curva com um fio sólido. Trajetos sem comprimento devem usar o ponto diretamente.
Portas inclinadas também usam faixas estreitas de volume: uma caixa única testa o vazio diagonal entre a folha
e a parede. Conferir o celular durante a passagem, além do corpo, e recolhê-lo para perto do peito ao sair.

Exemplo de aplicação: `videos/wi-fi-pela-parede/cena.js`, com câmera que entra no quarto, acompanha a passagem para
a sala, mostra as ondas cruzando a parede e volta ao quarto para mostrar o celular funcionando.

import * as ThreeOriginal from 'three';
import kitSource from '!!raw-loader!../../kit.js';
import pecasSource from '!!raw-loader!../../pecas-e-personagens.js';
import animacaoSource from '!!raw-loader!../../animacao.js';

// Instancia a geometria e o esqueleto do canal, sem abrir um segundo renderer ou canvas.
export function criarPersonagem(config:any,timeline:any){
  const THREE={...ThreeOriginal};
  new Function('THREE',kitSource)(THREE);
  const K=(window as any).K;
  new Function('K','THREE',pecasSource)(K,THREE);
  new Function('K','THREE','module',animacaoSource)(K,THREE,undefined);
  K.scene=new THREE.Group();K.ativarEstiloRedondo();K.tl=timeline;
  const ator=K.apresentador(config);
  return {K,ator,grupo:K.scene};
}

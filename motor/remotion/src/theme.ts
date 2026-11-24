// Adaptação do template recebido: identidade Cartoon prevalece sobre o low-poly de exemplo.
import {loadFont} from '@remotion/google-fonts/Montserrat';
export const {fontFamily:FONT}=loadFont('normal',{weights:['800','900'],subsets:['latin','latin-ext']});
export const PALETTE = {positive:'#20b85a',negative:'#e5383b',info:'#2563eb',warning:'#f97316',text:'#fff',outline:'#122638',accent:'#f97316',ground:'#dce7e8',groundSide:'#bacbd0',subject:'#2563eb',metal:'#a2abb5',pedestal:'#17364e'};
export const MATTE = {roughness:.7,metalness:0,flatShading:false};
export const METAL = {roughness:.38,metalness:.45,flatShading:false};
export const CAMERA = {fov:38,near:.1,far:150};
export const SAFE = {top:250,bottom:1580,side:70,badgeTop:290,captionCenterY:1450};
export const SKY = {surface:['#9bd3ee','#cce9ed','#edf6ee'],underground:['#9bd3ee','#cce9ed','#edf6ee']};

import React from 'react';
import {Composition,registerRoot,AbsoluteFill,useCurrentFrame,useVideoConfig,Sequence} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Audio} from '@remotion/media';
import {staticFile} from 'remotion';
import plano from '@plano-do-video';
import {CenaDoVideo,RotulosDoVideo} from '@cena-do-video';
import {Background} from './components/Background';
import {CameraController} from './components/CameraController';
import {BadgeLayer} from './components/TechnicalBadge';
import {sceneAt} from './data/scenes';
import {FONT,PALETTE} from './theme';

function Legendas(){
  const frame=useCurrentFrame(),t=frame/plano.fps;
  const palavra=plano.words.find(w=>t>=w.start&&t<w.end);
  if(!palavra)return null;
  return <div style={{position:'absolute',left:70,right:70,top:1395,height:180,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT,fontSize:86,fontWeight:900,lineHeight:1.1,textAlign:'center',color:palavra.key?'#ffcd49':'white',WebkitTextStroke:'12px '+PALETTE.outline,paintOrder:'stroke fill',textShadow:'0 5px 14px #0005'}}>{palavra.text}</div>;
}
const Preview:React.FC=()=>{
  const frame=useCurrentFrame(),{width,height}=useVideoConfig(),sc=sceneAt(frame);
  return <AbsoluteFill id="palco" style={{fontFamily:FONT,overflow:'hidden'}}>
    <Background/>
    <ThreeCanvas width={width} height={height} shadows="percentage" gl={{antialias:true,alpha:true,preserveDrawingBuffer:true}} camera={{fov:38,near:.1,far:150,position:[.7,2,6]}}>
      <CameraController/>
      <ambientLight intensity={.65}/><hemisphereLight args={['#e9f8ff','#b4b9a8',1.2]}/>
      <directionalLight position={[3,7,6]} intensity={2.3} castShadow shadow-mapSize={[2048,2048]} shadow-bias={-.0005} shadow-normalBias={.025} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6}/>
      <directionalLight position={[-4,3,4]} intensity={.8} color="#c5eaff"/>
      <CenaDoVideo plano={plano}/>
    </ThreeCanvas>
    <div style={{position:'absolute',top:200,left:75,right:75,display:'flex',justifyContent:'space-between',color:'#17364e',fontSize:27,fontWeight:800}}><span>DESMONTA GOLPE</span><span>@desmontagolpe</span></div>
    <Sequence from={sc.startFrame} durationInFrames={sc.durationInFrames} key={sc.id}><BadgeLayer badges={sc.badges}/></Sequence>
    <RotulosDoVideo plano={plano}/><Legendas/>
    <Audio src={staticFile('narracao.wav')} volume={1}/>
  </AbsoluteFill>;
};
registerRoot(()=> <Composition id="CartoonProblemResolve" component={Preview} width={1080} height={1920} fps={plano.fps} durationInFrames={plano.durationInFrames}/>);

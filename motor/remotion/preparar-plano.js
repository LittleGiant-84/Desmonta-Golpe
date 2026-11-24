const fs=require('fs'),path=require('path');
function preparar(pasta,raiz){
 const config=JSON.parse(fs.readFileSync(path.join(pasta,'remotion','config.json'),'utf8'));
 const tl=JSON.parse(fs.readFileSync(path.join(pasta,'timeline.json'),'utf8'));
 const a=tl.frases.findIndex(f=>f.plano===config.inicio),b=tl.frases.findIndex(f=>f.plano===config.fim);
 if(a<0||b<a)throw Error('Intervalo da prévia não encontrado na timeline aprovada.');
 const sourceStart=tl.frases[a].inicio,sourceEnd=tl.frases[b].fim+.15,fps=60;
 const selecionadas=tl.frases.slice(a,b+1),durationInFrames=Math.ceil((sourceEnd-sourceStart)*fps);
 const frame=t=>Math.round((t-sourceStart)*fps),find=n=>selecionadas.find(f=>f.plano===n);
 const palavra=(n,w)=>{const f=find(n),normal=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,'');const p=f?.palavras.find(p=>normal(p.texto)===normal(w));if(!p)throw Error('Palavra não alinhada: '+n+'/'+w);return frame(p.inicio);};
 const events=Object.fromEntries(Object.entries(config.eventos||{}).map(([n,e])=>{
  const f=find(e.plano);if(!f)throw Error('Evento fora do trecho: '+n);
  return [n,(e.palavra?palavra(e.plano,e.palavra):frame(e.fim?f.fim:f.inicio))+(e.offset||0)];
 }));
 const resolver=v=>typeof v==='number'?v:events[v];
 const animations=(config.animacoes||[]).map(a=>{const start=resolver(a.inicio),end=a.fim!=null?resolver(a.fim):start+a.duracao;
  if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start||start<0||end>durationInFrames)throw Error('Trilha inválida: '+a.target);
  return {...a,start,end,to:a.to??1};
 });
 const badges=config.indicadores||{},camera=config.camera||{de:{position:[.77,1.95,6.25],target:[.18,1.07,.02]},ate:{position:[.52,1.87,6.05],target:[.22,1.11,.02]}};
 const pose=t=>{const p=Math.max(0,Math.min(1,t/durationInFrames)),mix=(a,b)=>a.map((n,i)=>n+(b[i]-n)*p);return {position:mix(camera.de.position,camera.ate.position),target:mix(camera.de.target,camera.ate.target)};};
 const scenes=selecionadas.map((f,i)=>{
  const startFrame=i===0?0:frame(f.inicio),fim=i===selecionadas.length-1?durationInFrames:frame(selecionadas[i+1].inicio),duration=fim-startFrame;
  return {id:f.plano,startFrame,durationInFrames:duration,narration:f.texto,objects:config.objetos||[],camera:{projection:'perspective',movement:'tracking',keys:[{at:0,...pose(startFrame),easing:'soft'},{at:duration,...pose(fim),easing:'soft'}]},animations:animations.filter(x=>x.start>=startFrame&&x.start<fim).map(x=>({type:'interpolate',target:x.target,startFrame:x.start-startFrame,endFrame:x.end-startFrame,from:x.from??0,to:x.to,easing:x.easing||'soft',unit:'0-1'})),badges:[{text:badges[f.plano]?.[0]||f.plano,variant:badges[f.plano]?.[1]||'info',appearAt:0}],audioCues:[]};
 });
 const words=selecionadas.flatMap(f=>f.palavras.map(w=>({text:w.texto,start:w.inicio-sourceStart,end:w.fim-sourceStart,key:(config.palavrasChave||[]).includes(w.texto.toLowerCase())})));
 const audioOrigem=config.audioOrigem||'video.mp4',audioRel=path.relative(pasta,path.resolve(pasta,audioOrigem));
 if(audioRel.startsWith('..')||path.isAbsolute(audioRel)||!['.wav','.mp3','.mp4','.m4a','.ogg'].includes(path.extname(audioRel).toLowerCase()))throw Error('Áudio deve estar dentro da produção.');
 const plano={version:1,titulo:tl.roteiro.titulo,fps,width:1080,height:1920,durationInFrames,sourceStart,sourceEnd,events,scenes,words,personagem:tl.roteiro.personagem,timeline:{...tl,roteiro:{...tl.roteiro,direcao:{falaAnimada:true}}},audioOrigem,identidade:'canal/identidade.md',novosCreditos:0};
 validarPlano(plano);return plano;
}
function validarPlano(p){
 if(p.fps!==60||p.width!==1080||p.height!==1920)throw Error('Configuração fora do padrão do canal.');
 let fim=0;for(const s of p.scenes){if(s.startFrame!==fim||s.durationInFrames<=0)throw Error('Timeline não contígua.');fim+=s.durationInFrames;for(const k of s.camera.keys)if(!k.position.concat(k.target).every(Number.isFinite))throw Error('Câmera inválida.');}
 if(fim!==p.durationInFrames)throw Error('Duração incompatível.');
 for(const w of p.words)if(w.start<-.01||w.end<w.start||w.end>p.durationInFrames/p.fps+.01)throw Error('Legenda fora da duração.');
 return true;
}
module.exports={preparar,validarPlano};

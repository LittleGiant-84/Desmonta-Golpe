const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const {bundle}=require('@remotion/bundler'),{openBrowser,selectComposition,renderStill,renderMedia}=require('@remotion/renderer');
const {chromium}=require('playwright'),{preparar}=require('./preparar-plano');
const RAIZ=path.resolve(__dirname,'../..');
async function main(){
 const pasta=path.resolve(process.argv.slice(2).find(a=>!a.startsWith('--'))||path.join(RAIZ,'referencias/cenas-exemplo/fone-cancelamento-ruido'));
 const rel=path.relative(path.join(RAIZ,'videos'),pasta);if(rel.startsWith('..')||path.isAbsolute(rel))throw Error('Use uma pasta dentro de videos/.');
 const plano=preparar(pasta,RAIZ),testes=path.join(pasta,'testes/remotion'),publicDir=path.join(testes,'public');fs.mkdirSync(publicDir,{recursive:true});
 const arquivoPlano=path.join(testes,'plano.json');fs.writeFileSync(arquivoPlano,JSON.stringify(plano,null,2));
 execFileSync(require('ffmpeg-static'),['-y','-v','error','-ss',String(plano.sourceStart),'-i',path.join(pasta,plano.audioOrigem),'-t',String(plano.durationInFrames/plano.fps),'-vn','-ar','48000','-ac','2',path.join(publicDir,'narracao.wav')]);
 console.log('Plano validado:',plano.scenes.length,'etapas,',plano.durationInFrames,'quadros; áudio existente, zero créditos.');
 const serveUrl=await bundle({entryPoint:path.join(__dirname,'src/index.tsx'),outDir:path.join(RAIZ,'.cache/remotion-bundle'),publicDir,
  webpackOverride:config=>({...config,resolve:{...config.resolve,modules:[path.join(__dirname,'node_modules'),...(config.resolve?.modules||['node_modules'])],alias:{...config.resolve?.alias,'@plano-do-video':arquivoPlano,'@cena-do-video':path.join(pasta,'remotion/cena.tsx'),'@motor-remotion':path.join(__dirname,'src'),'three$':require.resolve('three')}}})});
 const chromiumOptions={gl:'angle'},browserExecutable=chromium.executablePath();
 const browser=await openBrowser('chrome',{browserExecutable,chromiumOptions,chromeMode:'chrome-for-testing'});
 try{
  const composition=await selectComposition({serveUrl,id:'CartoonProblemResolve',puppeteerInstance:browser,chromiumOptions});
  const audits=[];
  const comum={serveUrl,composition,puppeteerInstance:browser,chromiumOptions,logLevel:'error',onBrowserLog:info=>{const text=String(info.text||'');if(text.startsWith('CARTOON_AUDIT ')){const r=JSON.parse(text.slice(14));audits.push(r);console.log('Conferência 3D:',JSON.stringify(r));}else if(info.type==='error')console.log('Página:',text);}};
  const quadros=[0,...plano.scenes.filter((s,i)=>i%2===1).map(s=>Math.min(plano.durationInFrames-1,s.startFrame+Math.floor(s.durationInFrames*.55))),plano.durationInFrames-1];
  for(const frame of quadros){await renderStill({...comum,frame,output:path.join(testes,`quadro-${frame}.png`),imageFormat:'png'});console.log('Quadro conferível:',frame);}
  fs.writeFileSync(path.join(testes,'conferencia-cena.json'),JSON.stringify(audits,null,2));
  if(!audits.length||audits.some(a=>a.erroContato>.025||a.conflitos.length||a.repeticao>1e-8))throw Error('Conferência ausente ou contato/espaço/repetição fora dos limites.');
  if(process.argv.includes('--quadros'))return;
  let ultimo=0;const out=path.join(testes,'previa-integracao-remotion.mp4');
  await renderMedia({...comum,codec:'h264',outputLocation:out,pixelFormat:'yuv420p',crf:18,imageFormat:'png',concurrency:2,x264Preset:'medium',onProgress:({renderedFrames})=>{if(renderedFrames-ultimo>=120){ultimo=renderedFrames;console.log('Quadros:',renderedFrames+'/'+plano.durationInFrames);}}});
  const info=JSON.parse(execFileSync(require('ffprobe-static').path,['-v','error','-count_frames','-show_streams','-show_format','-of','json',out],{encoding:'utf8'}));
  const video=info.streams.find(s=>s.codec_type==='video');if(video.width!==1080||video.height!==1920||video.avg_frame_rate!=='60/1'||Number(video.nb_read_frames)!==plano.durationInFrames)throw Error('Metadados fora do esperado.');
  execFileSync(require('ffmpeg-static'),['-v','error','-i',out,'-f','null','-'],{stdio:['ignore','ignore','pipe']});
  fs.writeFileSync(path.join(testes,'conferencia-exportacao.json'),JSON.stringify({fonte:'Remotion Problem Resolve / adaptação Cartoon',novosCreditos:0,decode:'ok',...info},null,2));
  console.log('PRÉVIA PRONTA:',out);
 }finally{await browser.close({silent:true});}
}
main().catch(e=>{console.error(e.stack||e);process.exitCode=1;});

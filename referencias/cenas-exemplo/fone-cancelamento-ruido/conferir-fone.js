const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{chromium}=require('playwright');
const raiz=path.resolve(__dirname,'../..'),pasta=__dirname,saida=path.join(pasta,'testes');
const roteiro=JSON.parse(fs.readFileSync(path.join(pasta,'roteiro.json'),'utf8'));
roteiro.visual=JSON.parse(fs.readFileSync(path.join(raiz,'canal/visual.json'),'utf8'));
roteiro.direcao=JSON.parse(fs.readFileSync(path.join(raiz,'canal/movimento.json'),'utf8'));
let estimada=!fs.existsSync(path.join(pasta,'timeline.json')),tl;
if(!estimada)tl=JSON.parse(fs.readFileSync(path.join(pasta,'timeline.json'),'utf8'));
else{let t=.15;const frases=roteiro.frases.map(f=>{const words=f.texto.replace(/\*/g,'').split(/\s+/),dur=words.length*60/roteiro.alvoPpm;const r={...f,marcado:f.texto,inicio:t,fim:t+dur,palavras:words.map((texto,i)=>({texto,inicio:t+i*dur/words.length,fim:t+(i+.9)*dur/words.length}))};t+=dur+(f.pausaDepois??.1);return r;});frases.push({plano:'cartao',texto:'',inicio:t,fim:t+1.6,palavras:[]});tl={frases,total:t+1.6,capa:roteiro.capa,estilo:roteiro.estilo};}
tl.roteiro=roteiro;
fs.mkdirSync(saida,{recursive:true});fs.writeFileSync(path.join(saida,'timeline-visual.json'),JSON.stringify(tl,null,2));
(async()=>{fs.mkdirSync(saida,{recursive:true});const b=await chromium.launch({channel:'chromium',args:['--enable-gpu','--ignore-gpu-blocklist']});
try{
 const video=process.argv.includes('--video');const page=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:video?.5:1});const erros=[];page.on('pageerror',e=>erros.push(e.message));
 await page.setContent('<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&display=block"><style>html,body{margin:0;width:1080px;height:1920px;overflow:hidden}#palco{position:relative;width:1080px;height:1920px;overflow:hidden}</style></head><body><div id="palco"><div id="legenda" class="legenda"></div></div></body></html>');
 for(const f of ['node_modules/three/build/three.min.js','motor/kit.js','motor/qualidade-visual.js','motor/pecas-e-personagens.js','motor/animacao.js','motor/ambientes.js'])await page.addScriptTag({path:path.join(raiz,f)});
 await page.addScriptTag({path:path.join(pasta,'cena.js')});await page.evaluate(()=>Promise.all([document.fonts.load('900 80px Montserrat'),document.fonts.load('800 80px Montserrat')]));
 await page.evaluate(({t,video})=>{K.init();K.preparar(t);CENA.montar(t);if(video){K.renderer.setPixelRatio(.5);K.sol.shadow.mapSize.set(1024,1024);K.sol.shadow.blurSamples=8;}},{t:tl,video});
 const resultado=await page.evaluate(()=>{
  const conflitos=[],contatos=[],cameras=[];const ids=new Set();let maxContato=0;
  const snap=t=>{K.quadro(t,false);const o=CENA.objetos();return [...K.camera.position.toArray(),...K.camera.quaternion.toArray(),...o.menino.g.position.toArray(),...o.menino.cabeca.quaternion.toArray(),...o.diafragma.position.toArray(),...o.fone.g.position.toArray(),...o.placa.g.position.toArray(),...o.curvas[0].geometry.attributes.position.array.slice(0,9)];};
  for(let j=0;j<Math.ceil(K.tl.total*60);j++){const t=j/60,a=snap(t);if(!a.every(Number.isFinite))throw Error('Estado inválido '+t);for(const c of K.conflitosDeEspaco(CENA.espaco())){const id=c.a+'/'+c.b;if(!ids.has(id)){ids.add(id);conflitos.push({t,...c});}}
   const m=CENA.movimento();for(const c of m.estado.contatos){if(c.erro>maxContato)maxContato=c.erro;if(c.erro>.025&&contatos.length<10)contatos.push({t,...c});}
  }
  for(const f of K.tl.frases){const a=snap(Math.max(0,f.inicio-.00001)),b=snap(f.inicio+.00001);const delta=Math.max(...a.slice(0,7).map((n,i)=>Math.abs(n-b[i])));if(delta>.0001)cameras.push({plano:f.plano,delta});}
  const t=K.tl.total*.58,a=snap(t);for(const p of [.9,.1,.8,.3])snap(K.tl.total*p);const d=snap(t),repeticao=Math.max(...a.map((v,i)=>Math.abs(v-d[i])));
  return {duracao:K.tl.total,amostras:Math.ceil(K.tl.total*60),conflitos,contatos,maxContato,cameras,repeticao};
 });
 const planos=['gancho','embarcar','ligar_anc','almofadas','microfones','calcular_sinal','vibrar_ar','opostos','sem_bateria','sem_musica','voz_ainda_passa','por_dentro','cartao'];
 for(const n of planos){const f=tl.frases.find(f=>f.plano===n),t=f.inicio+(f.fim-f.inicio)*.66;await page.evaluate(t=>K.quadro(t),t);await page.screenshot({path:path.join(saida,'cena-'+n+'.png')});}
 if(!video){await page.evaluate(t=>K.capa(t),roteiro.capa);await page.screenshot({path:path.join(pasta,'capa.png')});}
 fs.writeFileSync(path.join(saida,'conferencia-fone.json'),JSON.stringify({...resultado,estimada,erros},null,2));console.log(JSON.stringify({...resultado,estimada,erros}));
 assert.deepEqual(erros,[]);assert(resultado.repeticao<1e-8,'Estado não determinista');if(!process.argv.includes('--diagnostico')){assert.deepEqual(resultado.conflitos,[]);assert(resultado.maxContato<.025,'Contato fora do alcance');assert.deepEqual(resultado.cameras,[]);}
 if(video){
   const {execFileSync}=require('child_process');execFileSync(process.execPath,[path.join(pasta,'gerar-ambiente.js'),path.join(saida,'timeline-visual.json')],{stdio:'inherit'});
   const frames=path.join(saida,'quadros-previa-visual');fs.mkdirSync(frames,{recursive:true});const gerados=[];
   const framesTotal=Math.ceil(tl.total*30);
   await page.evaluate(()=>{const d=document.createElement('div');d.textContent='PRÉVIA VISUAL · NARRAÇÃO YURI PENDENTE';d.style.cssText='position:absolute;top:220px;left:60px;right:60px;color:white;background:#142c3e;border-radius:14px;padding:14px;text-align:center;font:800 24px Montserrat;z-index:50';document.getElementById('palco').appendChild(d);});
   for(let i=0;i<framesTotal;i++){await page.evaluate(t=>K.quadro(t),i/30);const arq=path.join(frames,'q'+String(i).padStart(5,'0')+'.jpg');await page.screenshot({path:arq,type:'jpeg',quality:88});gerados.push(arq);if(i%150===0)console.log('prévia visual '+i+'/'+framesTotal);}
   execFileSync(require('ffmpeg-static'),['-y','-hide_banner','-loglevel','error','-framerate','30','-i',path.join(frames,'q%05d.jpg'),'-i',path.join(pasta,'sons/ambiente.wav'),'-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart','-shortest',path.join(saida,'previa-visual-sem-narracao.mp4')],{stdio:'inherit'});
   for(const arq of gerados)fs.unlinkSync(arq);fs.rmdirSync(frames);
   console.log('Prévia visual completa criada; narração profissional pendente.');
 }
}finally{await b.close();}})().catch(e=>{console.error(e.stack);process.exitCode=1});

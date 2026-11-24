// Ronco e passagem de ar sintetizados localmente; sem serviço pago nem gravação externa.
const fs=require('fs'),path=require('path');
const tl=JSON.parse(fs.readFileSync(process.argv[2]||path.join(__dirname,'timeline.json'),'utf8'));
const f=n=>tl.frases.find(x=>x.plano===n),rate=24000,total=Math.ceil(tl.total*rate),pcm=Buffer.alloc(total*2);
const clamp=x=>Math.max(0,Math.min(1,x)),mix=(a,b,u)=>a+(b-a)*clamp(u),smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const vestir=f('ligar_anc'),bateria=f('sem_bateria'),retorno=f('bateria_carregada'),comp=f('motor_constante'),proximo=f('voz_ainda_passa');
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,'');
const tempo=(frase,p)=>frase.palavras.find(w=>norm(w.texto)===norm(p))?.inicio??frase.inicio;
const colocou=tempo(vestir,'fone'),diminui=tempo(vestir,'diminui');
let seed=3179,low=0;
for(let i=0;i<total;i++){
 const t=i/rate;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/4294967296*2-1;low=.95*low+.05*noise;
 const motor=.34*Math.sin(2*Math.PI*120*t)+.21*Math.sin(2*Math.PI*240*t+.08*Math.sin(t*2))+.12*Math.sin(2*Math.PI*360*t)+.05*low;
 const ar=.014*noise;
 let gain=.14;
 gain=mix(.14,.095,smooth((t-colocou)/.45));gain=mix(gain,.025,smooth((t-diminui)/.25));
 if(t>=bateria.inicio&&t<retorno.inicio)gain=mix(.025,.095,smooth((t-bateria.inicio)/.3));
 if(t>=comp.fim&&t<proximo.inicio){gain=t<comp.fim+.85?.095:.025;}
 // Pedido de 14/11: sem zumbido sob a narração. Som só na comparação curta.
 const env=smooth((t-comp.fim)/.035)*smooth((proximo.inicio-t)/.035);
 pcm.writeInt16LE(Math.round(Math.max(-1,Math.min(1,(motor*gain+ar)*env))*32767),i*2);
}
const h=Buffer.alloc(44);h.write('RIFF');h.writeUInt32LE(36+pcm.length,4);h.write('WAVEfmt ',8);h.writeUInt32LE(16,16);h.writeUInt16LE(1,20);h.writeUInt16LE(1,22);h.writeUInt32LE(rate,24);h.writeUInt32LE(rate*2,28);h.writeUInt16LE(2,32);h.writeUInt16LE(16,34);h.write('data',36);h.writeUInt32LE(pcm.length,40);
fs.mkdirSync(path.join(__dirname,'sons'),{recursive:true});fs.writeFileSync(path.join(__dirname,'sons/ambiente.wav'),Buffer.concat([h,pcm]));
console.log(JSON.stringify({duracao:tl.total,comparacao:[comp.fim,comp.fim+.85,proximo.inicio],origem:'síntese original local',bytes:44+pcm.length}));

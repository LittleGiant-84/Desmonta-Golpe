// Cena original: ônibus, fone articulado e cancelamento de ruído.
// Todas as posições dependem do tempo absoluto; nenhum ativo de outro canal.
(function () {
  const BLUE=0x2563eb, ORANGE=0xf97316, NAVY=0x132e46, MINT=0x18a79a;
  const V=a=>new THREE.Vector3(...a), clamp=x=>K.clamp(x), smooth=x=>K.suave(clamp(x));
  let tl, frases, menino, passageiro, fone, esquema, cam, janela, bateria, placa, falante, diafragma, almofada, concha, orelha, microfones;
  let ar=[], circuitos=[], curvas=[], exterior=[], pernas=[], bancos=[], estado={}, foneCabeca, mochila, celular, placaFinal, painelOndas, nomesOndas=[];
  const etiquetas={}, rotulos={}, indices={}, contactos=[];
  const g=(pai=K.scene)=>{const o=new THREE.Group();pai.add(o);return o;};
  function mesh(pai,geo,cor,pos=[0,0,0],op={}){const m=K.malha(geo,K.mat(cor,op));m.position.set(...pos);pai.add(m);return m;}
  const box=(p,d,c,pos,op)=>mesh(p,new THREE.BoxGeometry(...d),c,pos,op);
  const sphere=(p,r,c,pos,op)=>mesh(p,new THREE.SphereGeometry(r,24,16),c,pos,op);
  function linha(p,pontos,cor,raio=.012){const c=new THREE.CatmullRomCurve3(pontos.map(V));return mesh(p,new THREE.TubeGeometry(c,32,raio,8,false),cor);}
  function disco(p,r,h,cor,pos){const m=mesh(p,new THREE.CylinderGeometry(r,r,h,48),cor,pos);m.rotation.x=Math.PI/2;return m;}
  function cartaz(p,texto,pos,w=.8,h=.22){const m=K.placa(texto,{larg:w,alt:h,fundo:'#f3fafb',cor:'#17384b'});p.add(m);m.position.set(...pos);return m;}
  const fr=n=>frases[indices[n]], start=n=>fr(n)?.inicio??0, end=n=>fr(n)?.fim??0;
  const palavra=(texto,n)=>K.quando(texto,start(n))??start(n);
  const progresso=(n,t)=>smooth((t-start(n))/Math.max(.001,end(n)-start(n)));
  const trans=(t,a,b)=>smooth((t-a)/Math.max(.001,b-a));
  function mostrar(o,on){o.visible=!!on;}

  function criarFone(p){
    const f=g(p);f.name='FoneOriginal';
    const arco=mesh(f,new THREE.TorusGeometry(.263,.027,12,48,Math.PI),NAVY,[0,.035,-.018]);
    const forro=mesh(f,new THREE.TorusGeometry(.231,.015,10,48,Math.PI),0x90d8e3,[0,.035,-.018]);
    const cups=[];
    for(const s of [-1,1]){
      const c=g(f);c.position.set(s*.249,-.025,-.006);
      const shell=sphere(c,.095,BLUE,[s*.018,0,0]);shell.scale.set(.48,1.32,.86);
      const pad=sphere(c,.095,NAVY,[-s*.018,0,0]);pad.scale.set(.34,1.18,.79);
      const band=box(c,[.026,.08,.09],ORANGE,[s*.052,.01,0]);band.rotation.z=s*.1;
      sphere(c,.012,0xaefde5,[s*.067,.027,.027],{emissive:0x38e3aa,emissiveIntensity:.4});
      cups.push(c);
    }
    return {g:f,cups};
  }
  function banco(x,z,cor=MINT){
    const assento=box(K.scene,[.64,.12,.62],cor,[x,.46,z]);
    const encosto=box(K.scene,[.64,.92,.12],cor,[x,.99,z-.34]);
    box(K.scene,[.11,.40,.11],NAVY,[x,.20,z]);
    box(K.scene,[.65,.045,.13],0x7c969d,[x,.035,z]);
    const topo=box(K.scene,[.54,.10,.14],0x96dcd4,[x,1.4,z-.34]);
    bancos.push(assento,encosto);return {assento,encosto,topo};
  }
  function pernasSentadas(b){
    for(const p of b.pernas)p.quadril.visible=false;
    const grp=g(b.corpo);
    for(const s of [-1,1]){
      const c=g(grp);c.position.set(s*.10,.60,.02);
      mesh(c,new THREE.CapsuleGeometry(.085,.13,6,20),0x1e293b,[0,-.13,0]);
      const knee=g(c);knee.position.y=-.26;sphere(knee,.082,0x1e293b,[0,0,0]);
      mesh(knee,new THREE.CapsuleGeometry(.07,.21,6,20),0x1e293b,[0,-.17,0]);
      const foot=mesh(knee,new THREE.CapsuleGeometry(.08,.13,6,20),0xf4f1ea,[0,-.37,.05]);foot.rotation.x=Math.PI/2;foot.scale.y=.63;
      box(knee,[.15,.025,.23],0xbed0d6,[0,-.418,.05]);c.userData.joelho=knee;pernas.push(c);
      c.rotation.x=-Math.PI/2;knee.rotation.x=Math.PI/2;
    }
    return grp;
  }
  function montar(timeline){
    tl=timeline;frases=tl.frases;frases.forEach((f,i)=>indices[f.plano]=i);
    K.scene.background=new THREE.Color(0xb9e3f0);K.ceu('dia');K.neblina(28,65,120);K.focoSombra(0,0);
    // Ônibus em corte: a face da câmera é aberta; atrás há rua e fachadas.
    box(K.scene,[7,.16,4.8],0x475b68,[0,-.10,0]);
    box(K.scene,[7,.08,4.8],0x667a84,[0,-.005,0]);
    for(let i=-7;i<=7;i++)box(K.scene,[.018,.008,4.8],0x8ca0a7,[i*.48,.04,0]);
    box(K.scene,[7,.73,.13],0xf1e8cd,[0,.39,-1.15]);
    box(K.scene,[7,.25,.14],NAVY,[0,2.42,-1.15]);
    box(K.scene,[7,.07,.09],ORANGE,[0,.79,-1.07]);
    for(const x of [-3.4,-1.8,.1,2.0,3.4]){
      box(K.scene,[.075,1.65,.11],0xe0e7e1,[x,1.55,-1.15]);
      box(K.scene,[.10,.055,.18],0x748e9d,[x,2.34,-1.1]);
    }
    // Vidros muito leves: transparência preserva a paisagem.
    for(const x of [-2.6,-.85,1.05,2.7])box(K.scene,[1.65,1.35,.018],0xc4e8ee,[x,1.56,-1.17],{transparent:true,opacity:.08,depthWrite:false});
    box(K.scene,[7,.16,.45],NAVY,[0,2.6,-.95]);
    linha(K.scene,[[-3,2.25,-.58],[0,2.25,-.58],[3,2.25,-.58]],0xf8b84b,.024);
    for(const x of [-2.3,2.5])linha(K.scene,[[x,.05,-.8],[x,2.25,-.8],[x,2.25,-.58]],0xf8b84b,.027);
    for(let i=0;i<4;i++){const a=mesh(K.scene,new THREE.TorusGeometry(.065,.012,8,24),0xf8b84b,[-1.8+i*1.25,2.09,-.58]);box(K.scene,[.015,.12,.015],0xf8b84b,[-1.8+i*1.25,2.20,-.58]);}
    cartaz(K.scene,'LINHA 3D • TECNOLOGIA',[1.5,2.4,-1.02],1.6,.16);
    banco(-.90,-.02);banco(-2.75,-.02,0x388f9c);banco(2.8,-.02,0x388f9c);
    // Exterior animado a partir do tempo, sem branco nas laterais.
    box(K.scene,[100,.1,7],0x475365,[0,-.2,-5.4]);
    box(K.scene,[100,.09,1.7],0xd7cdbd,[0,-.12,-2.75]);
    box(K.scene,[100,.1,8],0x72b57a,[0,-.2,-12]);
    for(let i=0;i<14;i++){
      const o=g();o.userData.x=i*3.6-25;
      const h=2.4+(i%3)*.7;box(o,[2.5,h,1.5],[0xeec98f,0xc1d6c2,0x9dbcd6,0xe2a997][i%4],[0,h/2-.1,-8.4]);
      for(let a=-1;a<=1;a++)for(let b=0;b<3;b++)box(o,[.40,.43,.04],0x2b647d,[a*.68,.65+b*.8,-7.62]);
      box(o,[2.65,.13,1.65],0xd3e3e0,[0,h,-8.4]);
      const tree=g(o);tree.position.set(1.45,0,-3.2);mesh(tree,new THREE.CylinderGeometry(.07,.10,.85,12),0x8b6947,[0,.35,0]);
      for(const [x,y,s] of [[0,1.2,.48],[-.22,1.04,.36],[.23,1.1,.38]])sphere(tree,s,0x4d9d62,[x,y,0]);
      exterior.push(o);
    }
    for(let i=-10;i<=10;i++)box(K.scene,[1.1,.01,.07],0xfff2b0,[i*3,-.135,-4.7]);
    menino=K.apresentador(tl.roteiro.personagem);menino.g.position.set(-.90,-.015,.04);pernasSentadas(menino);
    mochila=menino.mochila;mochila.visible=false;
    const bag=box(K.scene,[.32,.36,.21],BLUE,[-1.38,.71,-.03]);box(K.scene,[.20,.12,.03],ORANGE,[-1.38,.66,.09]);
    passageiro=K.apresentador({roupa:'moletom',cores:{moletom:0x6d5db4,punho:0xf2bd74,calca:0x334155,cabelo:0x34313f,mochila:0x6d5db4}});
    passageiro.g.position.set(-2.75,-.015,.04);pernasSentadas(passageiro);passageiro.mochila.visible=false;
    fone=criarFone(K.scene);foneCabeca=criarFone(menino.cabeca);foneCabeca.g.visible=false;
    const telefone=K.celular();telefone.tela.desenhar((c,w,h)=>{c.fillStyle='#133b56';c.fillRect(0,0,w,h);c.fillStyle='#69e1d2';c.beginPath();c.arc(w/2,h*.46,w*.34,0,Math.PI*2);c.fill();c.fillStyle='#153b54';c.fillRect(w*.36,h*.37,w*.10,h*.18);c.fillRect(w*.54,h*.37,w*.10,h*.18);c.fillStyle='#ffffff';c.font='bold 13px sans-serif';c.textAlign='center';c.fillText('PAUSADO',w/2,h*.80);},'pausa');
    celular=telefone.g;celular.position.set(-.57,.59,.39);celular.scale.setScalar(.65);celular.rotation.x=-.85;
    // Bancada imaginária: ampliação transparente do fone com partes separadas.
    esquema=g();esquema.position.set(.85,1.48,.25);esquema.scale.setScalar(.74);
    const suporte=box(esquema,[2.7,1.75,.045],0xd7eef4,[0,0,-.30],{transparent:true,opacity:.18,depthWrite:false});
    concha=g(esquema);disco(concha,.50,.12,BLUE,[0,0,0]);disco(concha,.43,.07,NAVY,[0,0,.085]);
    const aro=mesh(concha,new THREE.TorusGeometry(.47,.025,12,60),ORANGE,[0,0,.11]);
    microfones=g(esquema);
    for(const s of [-1,1]){const m=g(microfones);m.position.set(s*.14,.45,.05);disco(m,.060,.065,0x182b3b,[0,0,0]);for(let k=-1;k<=1;k++)box(m,[.007,.04,.009],0xb8d6df,[k*.014,0,.038]);}
    placa=K.placaEletronica();esquema.add(placa.g);placa.g.scale.setScalar(.65);
    falante=g(esquema);disco(falante,.36,.08,0x374859,[0,0,0]);
    const suspension=mesh(falante,new THREE.TorusGeometry(.295,.045,12,48),0x152332,[0,0,.055]);
    diafragma=g(falante);const cone=mesh(diafragma,new THREE.ConeGeometry(.28,.09,48,1,true),0x788e9f,[0,0,.055]);cone.rotation.x=Math.PI/2;
    const domo=sphere(diafragma,.115,0x394d5d,[0,0,.105]);domo.scale.z=.5;
    almofada=g(esquema);const pad=mesh(almofada,new THREE.TorusGeometry(.39,.10,16,64),0x142c3e,[0,0,0]);pad.scale.y=1.16;
    orelha=g(esquema);const ear=mesh(orelha,new THREE.TorusGeometry(.19,.057,12,48,Math.PI*1.65),0xf2bf99,[0,0,0]);ear.scale.set(.68,1.28,1);sphere(orelha,.07,0xe4a982,[0,-.02,.02]);
    bateria=K.bateria();esquema.add(bateria.g);bateria.g.scale.setScalar(.38);
    janela=g(esquema);box(janela,[.65,.58,.05],0xece3cd,[0,0,0]);for(const x of [-.17,.17])box(janela,[.29,.48,.04],0x82c8df,[x,0,.04]);box(janela,[.025,.55,.06],NAVY,[0,0,.06]);
    for(let j=0;j<30;j++){const m=sphere(esquema,.022,0x6bb5c9,[0,0,0]);ar.push(m);}
    for(let j=0;j<14;j++){const m=sphere(esquema,.022,0xffc75a,[0,0,.3],{emissive:0xf5b132,emissiveIntensity:.5});circuitos.push(m);}
    painelOndas=box(esquema,[2.65,1.80,.035],NAVY,[0,0,.46]);
    for(const [i,col] of [ORANGE,0x55bbff,0x56e0ad].entries()){
      const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(120*6*3),3));
      const l=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:col,side:THREE.DoubleSide}));esquema.add(l);curvas.push(l);
      nomesOndas.push(cartaz(esquema,['RUÍDO','RESPOSTA','RESULTADO'][i],[-.87,.71-i*.48,.53],.70,.15));
    }
    for(const [n,s] of Object.entries({isolamento_rotulo:'ISOLAMENTO',microfones_rotulo:'MICROFONES',processador_rotulo:'PROCESSADOR',alto_falante:'ALTO-FALANTE',cancelamento_rotulo:'CANCELAMENTO ATIVO'}))rotulos[n]=K.rotulo(s);
    for(const [n,s,c] of [['esquema','AMPLIAÇÃO DIDÁTICA','azul'],['ouvir','O QUE ELE OUVE · SIMULAÇÃO','azul'],['ronco','RONCO AINDA PASSA','laranja'],['pressao','PRESSÃO NO MESMO PONTO','azul'],['dois','2 SONS','azul'],['residual','MENOS RUÍDO','verde'],['zero','SE A BATERIA ACABAR','vermelho'],['carga','BATERIA CARREGADA','verde'],['pausa','MÚSICA PAUSADA','azul'],['off','CANCELAMENTO DESLIGADO','laranja'],['on','CANCELAMENTO LIGADO','verde'],['voz','UMA VOZ AINDA PODE PASSAR','azul'],['janela','COMO UMA JANELA FECHADA','azul']])etiquetas[n]=K.etiqueta(s,c);
    placaFinal=K.plaquinha('QUAL A PROXIMA\nTECNOLOGIA\nINVESTIGAMOS?');placaFinal.position.set(.30,.50,.50);placaFinal.scale.setScalar(.53);
    cam=K.cameraContinua([
      {t:0,pos:[.35,1.85,5.7],alvo:[-.30,1.1,0],fov:44},
      {t:start('ligar_anc'),pos:[.05,1.85,5.35],alvo:[-.45,1.08,0],fov:43},
      {t:start('abrir_esquema'),pos:[.65,1.9,5.5],alvo:[.05,1.15,0],fov:44},
      {t:start('almofadas'),pos:[1.15,2.0,5.1],alvo:[.85,1.48,.25],fov:47},
      {t:start('microfones'),pos:[1.2,2.0,5.0],alvo:[.85,1.48,.25],fov:47},
      {t:start('vibrar_ar'),pos:[1.25,1.95,4.85],alvo:[.85,1.48,.25],fov:47},
      {t:start('pressao'),pos:[1.12,1.9,4.9],alvo:[.85,1.48,.30],fov:47},
      {t:start('sem_bateria'),pos:[1.1,1.9,5.05],alvo:[.85,1.48,.25],fov:47},
      {t:start('sem_musica'),pos:[.35,1.85,5.5],alvo:[-.2,1.1,0],fov:44},
      {t:start('voz_ainda_passa'),pos:[-.65,1.8,6.6],alvo:[-1.45,1.08,0],fov:44},
      {t:start('por_fora'),pos:[.2,1.8,5.55],alvo:[-.30,1.08,0],fov:44},
      {t:start('segue'),pos:[.35,1.85,5.9],alvo:[-.15,1.15,.1],fov:44},
      {t:tl.total,pos:[.4,1.85,5.95],alvo:[-.15,1.15,.1],fov:44}
    ]);
  }
  function alvoMao(p,lado,peso){
    menino.alcancar(p,lado,peso);if(peso>.999){const mao=menino.mao(lado<0?0:1);contactos.push({lado,peso,erro:V(mao).distanceTo(V(p))});}
  }
  function quadro(t,modoCapa=false){
    const f=frases.find(f=>t>=f.inicio&&t<f.fim)||frases.reduce((a,f)=>f.inicio<=t?f:a,frases[0]);
    const idx=indices[f.plano]??0,p=progresso(f.plano,t);contactos.length=0;
    cam.em(t);menino.reset(t);passageiro.reset(t+.8);menino.mochila.visible=false;passageiro.mochila.visible=false;
    menino.g.position.set(-.90,-.015,.04);menino.g.rotation.y=.12;
    const andando=trans(t,start('embarcar'),end('embarcar')-.4),levantado=1-andando;
    const entrar=idx===1;menino.g.position.x=entrar?K.lerp(-.32,-.90,andando):-.90;
    menino.g.position.z=entrar?K.lerp(.90,.04,andando):.04;
    menino.g.position.y=entrar?K.lerp(.12,-.015,andando):-.015;
    if(idx===0)menino.g.position.set(-.32,.12,.90);
    const sentado=idx===0?0:idx===1?trans(t,start('embarcar')+.6,end('embarcar')-.25):1;
    for(let j=0;j<2;j++){const l=pernas[j],passo=Math.sin(t*7+j*Math.PI)*.28*(idx===1?1-sentado:0);l.rotation.x=-Math.PI/2*sentado+passo;l.userData.joelho.rotation.x=Math.PI/2*sentado;}
    menino.corpo.rotation.y=entrar?-.12:0;
    if(entrar)menino.pose({x:-.25*Math.sin(t*7),c:-.3},{x:.25*Math.sin(t*7),c:-.3});
    else menino.pose({x:-.24,c:-.70,z:.08},{x:-.20,c:-.68,z:.12});
    passageiro.pose({x:-.2,c:-.65},{x:-.20,c:-.65});
    const falarPass=idx===31||idx===32;
    if(falarPass){passageiro.pose({x:-.18,c:-.7},{x:-1.9,c:-.45,z:.3+Math.sin(t*6)*.12});menino.g.rotation.y=-.55*trans(t,start('voz_ainda_passa'),start('voz_ainda_passa')+.6);menino.olhar([-2.75,1.25,.25]);}
    else menino.olhar(idx>=4&&idx<=27?[.7,1.48,.5]:[.1,1.55,5],.7);
    if(idx===8||idx===11||idx===15||idx===25)menino.humor('surpreso');
    if(idx===32||idx>=33)menino.humor('feliz');
    menino.falar(t,tl);
    if(modoCapa){menino.olhos.scale.y=1;menino.humor('surpreso');}
    const marcha=Math.max(0,t-start('ligar_anc'));
    exterior.forEach(o=>o.position.x=((o.userData.x+marcha*.62+28)%50.4)-28);
    // Fone na cabeça acompanha o grupo da cabeça. A peça na mão segue o mesmo percurso até vestir.
    const inicioVestir=palavra('coloca','ligar_anc'),fimVestir=palavra('aperta','ligar_anc')-.06;
    const vestir=trans(t,inicioVestir,fimVestir),noRosto=idx>=3||(idx===2&&t>=fimVestir);
    fone.g.visible=!noRosto;foneCabeca.g.visible=noRosto;foneCabeca.g.position.set(0,.015,-.025);
    const subida=idx===2?vestir:0;
    const destino=menino.cabeca.localToWorld(V([0,.015,-.025]));
    const pos=V([menino.g.position.x,.89,.37]).lerp(destino,subida);
    if(idx===0||entrar){pos.x=menino.g.position.x;pos.y=.91+menino.g.position.y;pos.z=menino.g.position.z+.30;}
    fone.g.position.copy(pos);fone.g.rotation.set(0,.12,0);
    if(idx===2){const q=menino.cabeca.getWorldQuaternion(new THREE.Quaternion());fone.g.quaternion.slerp(q,subida);}
    if(!noRosto){for(const side of [-1,1]){const peg=fone.g.localToWorld(V([side*.25,-.025,.02]));alvoMao(peg.toArray(),side,1);}}
    if(idx===2&&noRosto){const target=menino.cabeca.localToWorld(V([.29,.01,.03]));const peso=1-trans(t,palavra('diminui','ligar_anc'),end('ligar_anc'));alvoMao(target.toArray(),1,peso);}
    if(idx===2&&noRosto){const target=menino.cabeca.localToWorld(V([-.25,-.01,.01]));alvoMao(target.toArray(),-1,1-trans(t,fimVestir,fimVestir+.4));}
    if(idx===28){const q=progresso('sem_musica',t);celular.position.set(-.53,.72+.10*q,.40);celular.rotation.x=-.12;alvoMao([-.53,.74+.10*q,.40],1,1);}
    else{celular.position.set(-.57,.59,.39);celular.rotation.x=-.85;}
    if(idx===35){menino.pose({x:-.3,c:-.6},{x:-1.2,c:-1,z:.28});}
    mostrar(esquema,idx>=4&&idx<=27||idx===34);mostrar(placaFinal,idx>=35);
    const e=smooth((t-start('abrir_esquema'))/.8);esquema.scale.setScalar(.74*e);
    if(idx===34){esquema.position.set(.40,1.55,.25);esquema.scale.setScalar(.43);}
    else esquema.position.set(.85,1.48,.25);
    const ex=idx===34?1:trans(t,start('abrir_esquema'),end('almofadas'));
    concha.position.set(K.lerp(0,-.88,ex),0,-.03);
    concha.scale.setScalar(.75);falante.scale.setScalar(.78);almofada.scale.setScalar(.76);
    almofada.position.set(K.lerp(0,.80,ex),0,.18);orelha.position.set(1.20,0,.20);
    mostrar(orelha,idx>=5);mostrar(almofada,idx>=5);mostrar(concha,true);
    mostrar(microfones,idx>=9);microfones.position.set(-.76,K.lerp(.35,-.20,progresso('microfones',t)),.13);
    placa.g.position.set(-.35,K.lerp(.55,-.52,progresso('encaixar_placa',t)),.15);mostrar(placa.g,idx>=12);
    placa.em(t,idx>=25&&idx<=26?0:1);
    falante.position.set(K.lerp(.15,.26,progresso('alto_falante',t)),K.lerp(.65,0,progresso('alto_falante',t)),.18);mostrar(falante,idx>=16);
    const ativo=(idx>17||idx===17&&t>=palavra('vibra','vibrar_ar'))&&!(idx===25||idx===26);diafragma.position.z=ativo?Math.sin(t*22)*.045:0;
    bateria.g.position.set(-.83,-.59,.14);mostrar(bateria.g,idx>=25&&idx<=27);bateria.carga(idx===25||idx===26?0:1);
    mostrar(janela,idx===6);janela.position.set(.10,-.58,.22);janela.rotation.y=idx===6?(1-progresso('comparar_janela',t))*.8:0;
    ar.forEach((m,j)=>{const col=j%10,row=Math.floor(j/10);m.visible=idx>=17&&idx<=23;m.position.set(.40+col*.09+(ativo?.025*Math.sin(t*16-col*.9):0),-.31+row*.13,.34);});
    circuitos.forEach((m,j)=>{m.visible=idx>=9&&idx<=18&&!(idx===11||idx===15);const u=(t*.65+j/14)%1;m.position.set(K.lerp(-.72,.27,u),-.22+.06*Math.sin(u*Math.PI),.30);if(idx<12&&u>.38)m.visible=false;if(idx<16&&u>.72)m.visible=false;});
    const onda=idx>=19&&idx<=24;
    painelOndas.visible=onda;
    for(let k=0;k<3;k++){
      const l=curvas[k];l.visible=onda&&(k===0||k===1&&idx>=20||k===2&&idx>=22);nomesOndas[k].visible=l.visible;const a=l.geometry.attributes.position.array;
      const point=u=>{const fase=u*Math.PI*4-t*3;return [-1.12+u*2.28,(k===0?.43:k===1?-.05:-.53)+Math.sin(fase)*(k===2?.025:k===1?.095:.12)*(k===1?-1:1)];};
      for(let j=0;j<120;j++){const v=point(j/120),w=point((j+1)/120),q=[v[0],v[1]-.008,.53,w[0],w[1]-.008,.53,v[0],v[1]+.008,.53,v[0],v[1]+.008,.53,w[0],w[1]-.008,.53,w[0],w[1]+.008,.53];a.set(q,j*18);}
      l.geometry.attributes.position.needsUpdate=true;l.geometry.computeBoundingSphere();
    }
    if(onda){mostrar(concha,false);mostrar(microfones,false);mostrar(placa.g,false);mostrar(falante,false);mostrar(almofada,false);mostrar(orelha,false);}
    // Étiquetas ficam acima do palco e não ocupam a faixa das legendas.
    const label=(n,y=550)=>etiquetas[n].em({tela:[540,y]},Math.max(0,t-f.inicio));
    if(rotulos[f.plano])rotulos[f.plano].em({tela:[540,580]},Math.max(0,t-f.inicio));
    else if(idx>=4&&idx<=18)label(idx===6?'janela':idx===8?'ronco':'esquema');
    if(idx===2||idx===3||idx===30)label('ouvir',700);
    if(onda){label(idx===20?'dois':idx>=23?'residual':'pressao');}
    if(idx===25||idx===26)label('zero');if(idx===27)label('carga');if(idx===28)label('pausa');
    if(idx===29)label('residual');if(idx===31)label('voz');
    const comp=fr('motor_constante');if(t>=comp.fim&&t<start('voz_ainda_passa'))label(t<comp.fim+.85?'off':'on');
    if(idx===34){const nomes=[['almofadas','isolamento_rotulo'],['microfones','microfones_rotulo'],['processador','processador_rotulo'],['alto-falante','alto_falante']];let atual=null;for(const [w,n] of nomes)if(t>=palavra(w,'por_dentro'))atual=n;if(atual)rotulos[atual].em({tela:[540,580]},t-palavra(nomes.find(x=>x[1]===atual)[0],'por_dentro'));}
    estado={plano:f.plano,indice:idx,ativo,vestir,contatos:contactos.map(c=>({...c})),membrana:diafragma.position.z};
    // Pequenos sons locais do kit, sem trilha que masque a comparação.
    K.som('clique',palavra('botão','ligar_anc'),.35);
    for(const n of ['almofadas','microfones','encaixar_placa','alto_falante'])K.som('clique',start(n)+.3,.25);
  }
  function espaco(){
    return [
      {nome:'tronco do menino',obj:menino.g,caixa:[[-.25,.55,-.22],[.25,1.08,.22]],grupo:'ator'},
      {nome:'assento',obj:bancos[0]}, {nome:'encosto',obj:bancos[1]},
      {nome:'ampliação',obj:esquema,caixa:[[-1.30,-.83,-.35],[1.32,.83,.60]],grupo:'esquema'},
      {nome:'passageiro',obj:passageiro.g,caixa:[[-.27,.49,-.22],[.27,1.5,.45]],grupo:'outro'}
    ];
  }
  window.CENA={montar,cena:tc=>quadro(K.t),capa:()=>quadro(0,true),espaco,movimento:()=>({menino,estado,contato:contactos[0]||null}),objetos:()=>({menino,fone,foneCabeca,esquema,concha,almofada,placa,falante,diafragma,ar,curvas})};
})();

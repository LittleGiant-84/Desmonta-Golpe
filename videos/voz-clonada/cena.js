// Caso nº 1: voz clonada por IA. Cozinha à noite; a detetive (moletom amarelo e preto) recebe o áudio da "mãe" no
// celular. Um celular gigante flutuando sobre a mesa mostra o que está na tela. No "PARA TUDO!" a imagem treme,
// congela e fica vermelha; depois vêm a cópia da voz (cartão de vídeo de 3 s entrando numa maquininha), o papagaio,
// as 3 pistas, a ligação, a palavra de segurança e o comentário final. Sem nome nem logo de banco ou app real.
// Tudo é função do tempo da cena (tc); a câmera usa o tempo real (t).
(function () {
  const AMARELO = 0xfacc15, PRETO = 0x111827, VERMELHO = 0xef4444, VERDE = 0x22c55e;
  const POS = [-0.45, 0, 0.8], YAW = 0.45;              // lugar da detetive
  const MESA = [0.45, 0, 0.0];                           // mesa da cozinha
  const TOPO = 0.78;                                     // altura do tampo
  const FONE = [0.42, 1.92, -0.6];                      // centro do celular gigante
  const MAQ = [0.12, TOPO, 0.08];                        // maquininha que copia a voz

  let tl, bl, det, percurso, focos = [], ROSTO;
  const I = {};
  let mesa, cadeira, fone, telaFone, celular, telaCel, lupa, maquina, engr = [], cartao, telaCartao, onda, telaOnda;
  let papagaio, poleiro, album, ampulheta, cadeado, retrato, plaquinha, luzMesa, luzFone;
  let overlay, carimbo, rot = {}, et = {}, cont, circulo, estado;

  const v = (a) => new THREE.Vector3(...a);
  const S = (x) => K.suave(K.clamp(x));
  const faixa = (x, a, b) => S(K.faixa(x, a, b));
  const T = (n) => (I[n] != null ? bl[I[n]].inicio : 0);
  const FIM = (n) => (I[n] != null ? bl[I[n]].ate : 0);
  const grupo = (pai = K.scene) => { const g = new THREE.Group(); pai.add(g); return g; };
  const caixa = (pai, tam, pos, cor, op = {}) => { const m = K.malha(new THREE.BoxGeometry(...tam), K.mat(cor, op)); m.position.set(...pos); pai.add(m); return m; };
  const bola = (pai, r, pos, cor, op = {}) => { const m = K.malha(new THREE.SphereGeometry(r, 20, 14), K.mat(cor, op)); m.position.set(...pos); pai.add(m); return m; };

  function canvasPlano(pai, larg, alt, px, desenho) {
    const t = K.telaCanvas(larg, alt, px); pai.add(t.m);
    if (desenho) t.desenhar(desenho, 'fixo');
    return t;
  }
  function arred(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
  function texto(c, s, x, y, tam, cor, peso = 800, al = 'left') { c.font = `${peso} ${tam}px Montserrat, Arial, sans-serif`; c.fillStyle = cor; c.textAlign = al; c.fillText(s, x, y); }
  function quebrar(c, s, x, y, larg, alt, tam, cor, peso = 700, estilo = '') {
    c.font = `${estilo} ${peso} ${tam}px Montserrat, Arial, sans-serif`; c.fillStyle = cor; c.textAlign = 'left';
    let linha = '', yy = y;
    for (const p of s.split(' ')) {
      const teste = linha ? linha + ' ' + p : p;
      if (c.measureText(teste).width > larg && linha) { c.fillText(linha, x, yy); linha = p; yy += alt; } else linha = teste;
    }
    if (linha) c.fillText(linha, x, yy);
  }
  function microfone(c, x, y, s, cor) {
    c.fillStyle = cor; arred(c, x - s * 0.3, y - s, s * 0.6, s * 1.1, s * 0.3); c.fill();
    c.strokeStyle = cor; c.lineWidth = s * 0.14; c.beginPath(); c.arc(x, y - s * 0.35, s * 0.5, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke();
    c.fillRect(x - s * 0.07, y + s * 0.15, s * 0.14, s * 0.35);
  }
  function ondaSom(c, x, y, w, h, n, prog, corOn, corOff, seed = 3) {
    const r = K.rand(seed), bw = w / n;
    for (let k = 0; k < n; k++) {
      const a = 0.25 + 0.75 * Math.abs(Math.sin(k * 0.7 + r() * 2));
      c.fillStyle = k / n < prog ? corOn : corOff;
      arred(c, x + k * bw + bw * 0.2, y - h * a / 2, bw * 0.6, h * a, bw * 0.3); c.fill();
    }
  }
  function avatar(c, x, y, r) {
    c.fillStyle = '#f9a8d4'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
    c.fillStyle = '#7c2d12'; c.beginPath(); c.arc(x, y - r * 0.15, r * 0.62, Math.PI, 0); c.fill();
    c.fillStyle = '#fde2c8'; c.beginPath(); c.arc(x, y + r * 0.05, r * 0.42, 0, 7); c.fill();
    c.fillStyle = '#ef4444'; c.beginPath(); c.arc(x + r * 0.72, y - r * 0.72, r * 0.28, 0, 7); c.fill();
  }

  // ---------- A tela do celular gigante ----------
  function desenharFone(modo, p, tc) {
    const q = Math.floor(tc * 20);
    telaFone.desenhar((c, w, h) => {
      c.clearRect(0, 0, w, h);
      const fundo = (cor) => { c.fillStyle = cor; c.fillRect(0, 0, w, h); };
      const barra = (escuro) => { texto(c, '22:00', 28, 40, 24, escuro ? '#e5e7eb' : '#111827', 700); c.fillStyle = escuro ? '#e5e7eb' : '#111827'; c.fillRect(w - 70, 22, 36, 18); c.fillRect(w - 34, 27, 4, 8); };
      if (modo === 'bloqueio') {
        const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#1e1b4b'); g.addColorStop(1, '#0f172a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
        texto(c, '22:00', w / 2, 210, 120, '#f8fafc', 300, 'center');
        texto(c, 'segunda-feira', w / 2, 260, 30, '#cbd5e1', 600, 'center');
        const k = S(p * 3), y = 330 + (1 - k) * -60;
        c.globalAlpha = k; c.fillStyle = '#f8fafc'; arred(c, 26, y, w - 52, 150, 28); c.fill();
        c.fillStyle = '#22c55e'; c.beginPath(); c.arc(80, y + 75, 32, 0, 7); c.fill();
        microfone(c, 80, y + 82, 30, '#ffffff');
        texto(c, 'Mãe', 130, y + 62, 40, '#111827', 800);
        texto(c, 'Mensagem de voz (0:06)', 130, y + 108, 26, '#475569', 600);
        c.globalAlpha = 1;
        return;
      }
      if (modo === 'audio' || modo === 'pista3' || modo === 'copia') {
        fundo('#efe6dc'); c.fillStyle = '#0f766e'; c.fillRect(0, 0, w, 140); barra(true);
        avatar(c, 70, 98, 30); texto(c, 'Mãe', 118, 110, 38, '#ffffff', 800);
        c.fillStyle = '#ffffff'; arred(c, 26, 190, w - 110, 130, 26); c.fill();
        c.fillStyle = '#0f766e'; c.beginPath(); c.moveTo(62, 230); c.lineTo(62, 280); c.lineTo(100, 255); c.closePath(); c.fill();
        const prog = modo === 'audio' ? K.clamp(p * 1.05) : 1;
        ondaSom(c, 118, 255, w - 240, 70, 26, prog, '#0f766e', '#94a3b8', 5);
        texto(c, prog < 1 ? '0:0' + Math.floor(prog * 6) : '0:06', 120, 312, 22, '#64748b', 600);
        if (modo === 'audio') {
          c.globalAlpha = S((p - 0.1) * 4);
          c.fillStyle = '#fef9c3'; arred(c, 26, 360, w - 52, 300, 24); c.fill();
          quebrar(c, '"Oi, filho. Preciso pagar uma conta. Me manda um Pix urgente?"', 52, 418, w - 104, 50, 38, '#111827', 700, 'italic');
          c.globalAlpha = 1;
        }
        if (modo === 'copia') {
          c.save(); c.translate(w / 2, 520); c.rotate(-0.18);
          c.strokeStyle = '#ef4444'; c.lineWidth = 12; arred(c, -170, -70, 340, 140, 18); c.stroke();
          texto(c, 'CÓPIA', 0, 30, 88, '#ef4444', 900, 'center'); c.restore();
          texto(c, 'feita por IA', w / 2, 650, 40, '#991b1b', 800, 'center');
        }
        if (modo === 'pista3') {
          c.fillStyle = '#ffffff'; arred(c, 26, 350, w - 110, 110, 26); c.fill();
          texto(c, 'Tô sem bateria, só manda.', 50, 418, 30, '#111827', 700);
          const k = S((p - 0.15) * 4);
          c.globalAlpha = k;
          c.strokeStyle = '#ef4444'; c.lineWidth = 10; c.strokeRect(140, 540, 170, 90); c.fillStyle = '#ef4444'; c.fillRect(310, 568, 16, 34); c.fillRect(156, 556, 26, 58);
          c.beginPath(); c.moveTo(110, 520); c.lineTo(360, 650); c.stroke();
          texto(c, 'não atende', w / 2, 720, 40, '#b91c1c', 800, 'center');
          c.globalAlpha = 1;
        }
        return;
      }
      if (modo === 'app' || modo === 'pista2' || modo === 'congelado') {
        fundo('#f8fafc'); c.fillStyle = '#1d4ed8'; c.fillRect(0, 0, w, 150); barra(true);
        texto(c, 'App do banco', 34, 118, 40, '#ffffff', 800);
        texto(c, 'Pix', 34, 230, 56, '#111827', 900);
        texto(c, 'Valor', 34, 300, 28, '#64748b', 700);
        const alvo = 'R$ 1.500,00', n = modo === 'app' ? Math.floor(K.clamp(p * 1.6) * alvo.length) : alvo.length;
        c.fillStyle = '#e2e8f0'; arred(c, 30, 320, w - 60, 100, 18); c.fill();
        texto(c, alvo.slice(0, Math.max(3, n)) + (modo === 'app' && q % 2 && n < alvo.length ? '|' : ''), 54, 392, 56, '#111827', 900);
        texto(c, 'Para', 34, 490, 28, '#64748b', 700);
        texto(c, 'J. S. P.', 34, 545, 46, '#111827', 900);
        texto(c, 'Conta: 0001-9 •••• 23', 34, 590, 24, '#64748b', 600);
        if (modo === 'pista2') {
          const pulso = 0.6 + 0.4 * Math.sin(tc * 8);
          c.strokeStyle = `rgba(239,68,68,${pulso})`; c.lineWidth = 9; arred(c, 18, 500, w - 36, 115, 18); c.stroke();
          texto(c, 'Quem é esse?', w / 2, 680, 40, '#b91c1c', 900, 'center');
        }
        c.fillStyle = '#16a34a'; arred(c, 30, h - 200, w - 60, 110, 55); c.fill();
        texto(c, 'CONFIRMAR', w / 2, h - 130, 44, '#ffffff', 900, 'center');
        if (modo !== 'pista2') {
          const k = modo === 'congelado' ? 1 : S((p - 0.62) * 3.5);
          if (k > 0) {
            const x = w / 2 + 70, y = K.lerp(h * 0.55, h - 150, k);
            c.fillStyle = 'rgba(253,226,200,0.95)'; c.beginPath(); c.ellipse(x, y, 34, 44, -0.3, 0, 7); c.fill();
            c.strokeStyle = '#c08457'; c.lineWidth = 4; c.stroke();
          }
        }
        return;
      }
      if (modo === 'ligando' || modo === 'nao_atendida') {
        fundo('#0f172a'); barra(true);
        avatar(c, w / 2, 260, 90);
        texto(c, 'Mãe', w / 2, 430, 64, '#f8fafc', 800, 'center');
        texto(c, 'número salvo', w / 2, 480, 30, '#94a3b8', 600, 'center');
        if (modo === 'ligando') {
          const pts = '.'.repeat(1 + Math.floor(tc * 3) % 3);
          texto(c, 'Chamando' + pts, w / 2, 580, 40, '#22c55e', 800, 'center');
          c.fillStyle = '#ef4444'; c.beginPath(); c.arc(w / 2, h - 150, 62, 0, 7); c.fill();
          c.save(); c.translate(w / 2, h - 150); c.rotate(2.35); c.fillStyle = '#fff'; arred(c, -34, -12, 68, 24, 12); c.fill(); c.restore();
        } else {
          c.fillStyle = 'rgba(239,68,68,0.15)'; arred(c, 30, 540, w - 60, 110, 24); c.fill();
          texto(c, 'Chamada não', w / 2, 585, 40, '#f87171', 800, 'center');
          texto(c, 'atendida', w / 2, 632, 40, '#f87171', 800, 'center');
        }
        return;
      }
      if (modo === 'regra') {
        fundo('#f8fafc'); barra(false);
        const k1 = S(p * 4), k2 = S((p - 0.4) * 4);
        c.globalAlpha = k1; c.fillStyle = '#dcfce7'; arred(c, 26, 90, w - 52, 330, 30); c.fill();
        texto(c, 'A VOZ', w / 2, 170, 58, '#15803d', 900, 'center');
        ondaSom(c, 70, 270, w - 140, 80, 18, 1, '#16a34a', '#16a34a', 5);
        texto(c, '✓', w / 2, 395, 76, '#16a34a', 900, 'center');
        c.globalAlpha = k2; c.fillStyle = '#fee2e2'; arred(c, 26, 450, w - 52, 380, 30); c.fill();
        texto(c, 'O PEDIDO', w / 2, 530, 58, '#b91c1c', 900, 'center');
        texto(c, '"Pix urgente"', w / 2, 610, 40, '#7f1d1d', 700, 'center');
        c.strokeStyle = '#ef4444'; c.lineWidth = 16; c.beginPath(); c.moveTo(w / 2 - 70, 660); c.lineTo(w / 2 + 70, 790); c.moveTo(w / 2 + 70, 660); c.lineTo(w / 2 - 70, 790); c.stroke();
        c.globalAlpha = 1;
        return;
      }
      if (modo === 'comentario') {
        fundo('#ffffff'); barra(false);
        texto(c, 'Comentários', 34, 130, 44, '#111827', 900);
        for (let k = 0; k < 3; k++) {
          c.fillStyle = '#e5e7eb'; c.beginPath(); c.arc(64, 210 + k * 120, 30, 0, 7); c.fill();
          c.fillStyle = '#e5e7eb'; arred(c, 110, 190 + k * 120, 260 - k * 40, 22, 11); c.fill(); arred(c, 110, 222 + k * 120, 180, 18, 9); c.fill();
        }
        const palavra = 'COMBINADO', n = Math.floor(K.clamp(p * 2.2) * palavra.length);
        c.fillStyle = '#f1f5f9'; arred(c, 24, h - 220, w - 48, 120, 60); c.fill();
        c.strokeStyle = '#facc15'; c.lineWidth = 6; c.stroke();
        texto(c, palavra.slice(0, n) + (n < palavra.length && q % 2 ? '|' : ''), 60, h - 142, 52, '#111827', 900);
        return;
      }
      fundo('#0f172a');
    }, modo + ':' + (['audio', 'app', 'bloqueio', 'regra', 'comentario', 'pista3', 'ligando'].includes(modo) ? Math.floor(p * 60) + ':' + q : modo === 'pista2' ? q : 0));
  }

  // ---------- Montagem ----------
  function montar(timeline) {
    tl = timeline;
    bl = K.blocos(tl);
    bl.forEach((b, i) => { if (I[b.plano] == null) I[b.plano] = i; });

    // Cozinha: piso, paredes, janela com a noite, relógio, armários, geladeira e luminária
    const piso = caixa(K.scene, [7, 0.04, 9], [0, -0.02, 1.3], 0xd6c3a1);
    const pisoTex = canvasPlano(K.scene, 7, 9, 700, (c, w, h) => {
      c.fillStyle = '#e4d5b7'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#cdb48c'; for (let x = 0; x < 14; x++) for (let y = 0; y < 18; y++) if ((x + y) % 2) c.fillRect(x * w / 14, y * h / 18, w / 14, h / 18);
    });
    pisoTex.m.rotation.x = -Math.PI / 2; pisoTex.m.position.set(0, 0.002, 1.3); pisoTex.m.receiveShadow = true;
    piso.visible = true;
    caixa(K.scene, [7, 3.2, 0.1], [0, 1.6, -2.3], 0x7aa2b8);
    caixa(K.scene, [0.1, 3.2, 9], [-3.2, 1.6, 1.3], 0x6b93a8);
    caixa(K.scene, [0.1, 3.2, 9], [3.2, 1.6, 1.3], 0x6b93a8);
    caixa(K.scene, [6.5, 0.08, 9], [0, 3.2, 1.3], 0xe8eef2);
    caixa(K.scene, [6.5, 0.12, 0.1], [0, 3.1, -2.22], 0xf4f1ea);
    caixa(K.scene, [7, 0.12, 0.12], [0, 0.06, -2.22], 0xf4f1ea);
    // janela
    const jan = grupo(); jan.position.set(-1.45, 1.85, -2.24);
    canvasPlano(jan, 1.2, 0.95, 360, (c, w, h) => {
      const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0b1d40'); g.addColorStop(1, '#2c5285'); c.fillStyle = g; c.fillRect(0, 0, w, h);
      const r = K.rand(9); c.fillStyle = '#ffffff'; for (let k = 0; k < 40; k++) { c.globalAlpha = 0.4 + r() * 0.6; c.fillRect(r() * w, r() * h * 0.7, 2, 2); }
      c.globalAlpha = 1; c.fillStyle = '#fef3c7'; c.beginPath(); c.arc(w * 0.72, h * 0.28, 34, 0, 7); c.fill();
      c.fillStyle = '#1e293b'; for (let k = 0; k < 7; k++) { const bw = 40 + r() * 30, bh = 60 + r() * 110; c.fillRect(k * 55 - 10, h - bh, bw, bh); }
      c.fillStyle = '#fde68a'; for (let k = 0; k < 18; k++) c.fillRect(r() * w, h - r() * 120, 6, 8);
    }).m.position.z = 0.01;
    caixa(jan, [1.32, 0.08, 0.08], [0, 0.515, 0.03], 0xf4f1ea); caixa(jan, [1.32, 0.08, 0.08], [0, -0.515, 0.03], 0xf4f1ea);
    caixa(jan, [0.08, 1.1, 0.08], [-0.64, 0, 0.03], 0xf4f1ea); caixa(jan, [0.08, 1.1, 0.08], [0.64, 0, 0.03], 0xf4f1ea);
    caixa(jan, [0.05, 1.0, 0.05], [0, 0, 0.03], 0xf4f1ea);
    // relógio marcando 22:00
    const rel = grupo(); rel.position.set(1.05, 2.25, -2.22);
    const relMesh = K.malha(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 32).rotateX(Math.PI / 2), K.mat(0xf8fafc)); rel.add(relMesh);
    canvasPlano(rel, 0.4, 0.4, 200, (c, w, h) => {
      c.fillStyle = '#ffffff'; c.beginPath(); c.arc(w / 2, h / 2, w / 2, 0, 7); c.fill();
      c.strokeStyle = '#111827'; c.lineWidth = 10; c.beginPath(); c.arc(w / 2, h / 2, w / 2 - 6, 0, 7); c.stroke();
      c.lineWidth = 9; c.beginPath(); c.moveTo(w / 2, h / 2); c.lineTo(w / 2 - 42, h / 2 - 24); c.stroke();
      c.lineWidth = 6; c.beginPath(); c.moveTo(w / 2, h / 2); c.lineTo(w / 2, h / 2 - 70); c.stroke();
    }).m.position.z = 0.03;
    rel.userData.mesh = relMesh;
    // armários e bancada
    caixa(K.scene, [2.6, 0.9, 0.6], [-1.7, 0.45, -1.95], 0xf4f1ea);
    caixa(K.scene, [2.7, 0.05, 0.66], [-1.7, 0.925, -1.93], 0x334155);
    for (let k = 0; k < 4; k++) caixa(K.scene, [0.6, 0.78, 0.02], [-2.67 + k * 0.65, 0.47, -1.64], 0xe7e2d6);
    caixa(K.scene, [1.0, 0.7, 0.4], [0.15, 2.35, -2.05], 0xf4f1ea);
    const panela = K.malha(new THREE.CylinderGeometry(0.16, 0.14, 0.16, 24), K.mat(0xdc2626)); panela.position.set(-0.75, 1.03, -1.95); K.scene.add(panela);
    const chaleira = bola(K.scene, 0.12, [-2.3, 1.06, -1.95], 0x94a3b8, { metalness: 0.5 }); chaleira.scale.y = 0.85;
    caixa(K.scene, [0.85, 1.95, 0.7], [2.55, 0.975, -1.75], 0xe5e7eb);
    caixa(K.scene, [0.04, 0.5, 0.04], [2.18, 1.25, -1.39], 0x94a3b8);
    // mesa e cadeira
    mesa = grupo(); mesa.position.set(...MESA);
    caixa(mesa, [1.25, 0.05, 0.8], [0, TOPO - 0.025, 0], 0xb07a48);
    [[-0.55, -0.33], [0.55, -0.33], [-0.55, 0.33], [0.55, 0.33]].forEach(([x, z]) => caixa(mesa, [0.06, TOPO - 0.05, 0.06], [x, (TOPO - 0.05) / 2, z], 0x8a5a32));
    cadeira = grupo(); cadeira.position.set(MESA[0] + 0.1, 0, MESA[2] - 0.7);
    caixa(cadeira, [0.45, 0.05, 0.45], [0, 0.46, 0], 0x8a5a32); caixa(cadeira, [0.45, 0.5, 0.05], [0, 0.72, -0.2], 0x8a5a32);
    [[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]].forEach(([x, z]) => caixa(cadeira, [0.04, 0.46, 0.04], [x, 0.23, z], 0x6b4423));
    // luminária e luz da cozinha
    luzMesa = new THREE.PointLight(0xffe2b0, 2.2, 7, 1.2); luzMesa.position.set(MESA[0], 2.1, MESA[2] + 0.4); K.scene.add(luzMesa);
    luzFone = new THREE.PointLight(0xbfe3ff, 0.9, 2.5, 1.5); K.scene.add(luzFone);

    // Celular gigante (a tela do caso)
    fone = grupo(); fone.position.set(...FONE); fone.rotation.y = -0.12;
    caixa(fone, [1.0, 1.84, 0.06], [0, 0, 0], 0x1f2937, { roughness: 0.35 });
    caixa(fone, [0.2, 0.025, 0.02], [0, 0.86, 0.035], 0x0b0f17);
    telaFone = K.telaCanvas(0.91, 1.7, 480); telaFone.m.position.z = 0.032; fone.add(telaFone.m);
    // Celular de verdade (na mão)
    celular = grupo();
    caixa(celular, [0.09, 0.17, 0.012], [0, 0, 0], 0x1f2937);
    telaCel = K.telaCanvas(0.08, 0.155, 80); telaCel.m.position.z = 0.0065; celular.add(telaCel.m);
    // Lupa
    lupa = grupo();
    const aro = K.malha(new THREE.TorusGeometry(0.085, 0.014, 12, 36), K.mat(PRETO)); lupa.add(aro);
    const vidro = K.malha(new THREE.CircleGeometry(0.08, 32), new THREE.MeshStandardMaterial({ color: 0xbfe3ff, transparent: true, opacity: 0.35, depthWrite: false })); lupa.add(vidro);
    const cabo = caixa(lupa, [0.026, 0.14, 0.026], [0, -0.16, 0], AMARELO);
    cabo.rotation.z = 0;

    // Maquininha que copia a voz, cartão de vídeo e a onda copiada
    maquina = grupo(); maquina.position.set(...MAQ);
    caixa(maquina, [0.38, 0.3, 0.3], [0, 0.15, 0], 0x334155);
    caixa(maquina, [0.2, 0.03, 0.06], [0, 0.31, 0], PRETO);
    caixa(maquina, [0.05, 0.05, 0.02], [0.13, 0.25, 0.155], VERMELHO, { emissive: VERMELHO, emissiveIntensity: 0.6 });
    [[-0.08, 0.13, 0.1], [0.09, 0.11, 0.075]].forEach(([x, y, r]) => { const e = K.engrenagem({ raio: r, cor: 0xfbbf24 }).g; e.position.set(x, y, 0.165); maquina.add(e); engr.push(e); });
    cartao = grupo();
    caixa(cartao, [0.3, 0.52, 0.015], [0, 0, 0], 0x111827);
    telaCartao = canvasPlano(cartao, 0.27, 0.48, 200, (c, w, h) => {
      const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#fde68a'); g.addColorStop(1, '#fb923c'); c.fillStyle = g; c.fillRect(0, 0, w, h);
      avatar(c, w / 2, h * 0.42, 62);
      c.fillStyle = 'rgba(0,0,0,0.55)'; arred(c, w / 2 - 50, h - 70, 100, 44, 12); c.fill();
      texto(c, '0:03', w / 2, h - 36, 32, '#ffffff', 900, 'center');
      c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(w / 2 - 18, 30); c.lineTo(w / 2 - 18, 70); c.lineTo(w / 2 + 16, 50); c.closePath(); c.fill();
    });
    telaCartao.m.position.z = 0.009;
    onda = grupo();
    telaOnda = canvasPlano(onda, 0.62, 0.18, 360, null);

    // Papagaio (corpo verde, cabeça, bico, asa e rabo) no poleiro
    poleiro = grupo();
    caixa(poleiro, [0.03, 0.22, 0.03], [0, 0.11, 0], 0x8a5a32); caixa(poleiro, [0.22, 0.03, 0.03], [0, 0.22, 0], 0x8a5a32);
    caixa(poleiro, [0.16, 0.02, 0.12], [0, 0.01, 0], 0x6b4423);
    papagaio = grupo();
    const corpo = bola(papagaio, 0.075, [0, 0.09, 0], 0x22c55e); corpo.scale.set(0.9, 1.25, 0.9);
    bola(papagaio, 0.06, [0, 0.2, 0.02], 0x22c55e);
    const bico = K.malha(new THREE.ConeGeometry(0.025, 0.06, 14).rotateX(Math.PI / 2), K.mat(0xf97316)); bico.position.set(0, 0.19, 0.08); bico.rotation.x = 0.35; papagaio.add(bico);
    [-0.03, 0.03].forEach((x) => { bola(papagaio, 0.014, [x, 0.215, 0.065], 0xffffff); bola(papagaio, 0.008, [x, 0.215, 0.077], PRETO); });
    const asaE = bola(papagaio, 0.05, [-0.065, 0.09, -0.005], 0x16a34a); asaE.scale.set(0.35, 1.1, 0.8);
    const asaD = bola(papagaio, 0.05, [0.065, 0.09, -0.005], 0x16a34a); asaD.scale.set(0.35, 1.1, 0.8);
    papagaio.userData.asas = [asaE, asaD];
    const rabo = caixa(papagaio, [0.05, 0.14, 0.02], [0, 0.0, -0.06], 0x2563eb); rabo.rotation.x = 0.6;
    bola(papagaio, 0.03, [0, 0.29, 0.0], 0xef4444).scale.set(0.6, 1, 1.4);
    // Álbum de família
    album = grupo();
    caixa(album, [0.42, 0.02, 0.3], [0, 0.01, 0], 0x7c2d12);
    canvasPlano(album, 0.4, 0.28, 300, (c, w, h) => {
      c.fillStyle = '#fef3c7'; c.fillRect(0, 0, w, h); c.fillStyle = '#d6c7a1'; c.fillRect(w / 2 - 2, 0, 4, h);
      [[0.25, 0.3], [0.25, 0.72], [0.75, 0.3], [0.75, 0.72]].forEach(([x, y], k) => {
        c.fillStyle = '#ffffff'; c.fillRect(x * w - 52, y * h - 40, 104, 80);
        c.fillStyle = ['#bfdbfe', '#fde68a', '#bbf7d0', '#fbcfe8'][k]; c.fillRect(x * w - 46, y * h - 34, 92, 56);
        avatar(c, x * w - 14, y * h - 4, 14); avatar(c, x * w + 18, y * h + 2, 10);
      });
    }).m.rotation.x = -Math.PI / 2;
    album.children[1].position.y = 0.021;
    // Ampulheta (pista da pressa)
    ampulheta = grupo();
    caixa(ampulheta, [0.2, 0.025, 0.2], [0, 0.0125, 0], 0x8a5a32); caixa(ampulheta, [0.2, 0.025, 0.2], [0, 0.3375, 0], 0x8a5a32);
    [[-0.085, -0.085], [0.085, -0.085], [-0.085, 0.085], [0.085, 0.085]].forEach(([x, z]) => caixa(ampulheta, [0.018, 0.3, 0.018], [x, 0.175, z], 0x8a5a32));
    const vidroA = new THREE.MeshStandardMaterial({ color: 0xdff2ff, transparent: true, opacity: 0.35, depthWrite: false });
    const c1 = K.malha(new THREE.ConeGeometry(0.075, 0.15, 24), vidroA); c1.position.y = 0.1; c1.rotation.x = Math.PI; ampulheta.add(c1);
    const c2 = K.malha(new THREE.ConeGeometry(0.075, 0.15, 24), vidroA); c2.position.y = 0.25; ampulheta.add(c2);
    const areia = K.malha(new THREE.ConeGeometry(0.05, 0.07, 20), K.mat(0xf59e0b)); areia.position.y = 0.06; ampulheta.add(areia);
    ampulheta.userData.areia = areia;
    // Cadeado com a palavra escondida e porta-retrato da família
    cadeado = grupo();
    caixa(cadeado, [0.3, 0.24, 0.12], [0, 0.12, 0], AMARELO, { metalness: 0.3 });
    const alca = K.malha(new THREE.TorusGeometry(0.1, 0.025, 12, 28, Math.PI), K.mat(0x9ca3af, { metalness: 0.7 })); alca.position.y = 0.24; cadeado.add(alca);
    canvasPlano(cadeado, 0.26, 0.12, 260, (c, w, h) => { c.fillStyle = '#111827'; c.fillRect(0, 0, w, h); texto(c, '******', w / 2, h * 0.75, 64, '#facc15', 900, 'center'); }).m.position.set(0, 0.11, 0.061);
    retrato = grupo();
    caixa(retrato, [0.26, 0.2, 0.02], [0, 0.12, 0], 0x92400e);
    canvasPlano(retrato, 0.22, 0.16, 220, (c, w, h) => { c.fillStyle = '#bae6fd'; c.fillRect(0, 0, w, h); avatar(c, w * 0.3, h * 0.55, 26); avatar(c, w * 0.62, h * 0.5, 30); avatar(c, w * 0.85, h * 0.66, 16); }).m.position.set(0, 0.12, 0.011);
    const pe = caixa(retrato, [0.03, 0.18, 0.02], [0, 0.09, -0.06], 0x92400e); pe.rotation.x = -0.4;

    // Detetive
    const id = tl.roteiro.personagem;
    const coresP = Object.fromEntries(Object.entries(id.cores).map(([k, c]) => [k, new THREE.Color(c).getHex()]));
    det = K.apresentador({ tipo: id.tipo, roupa: id.roupa, cores: coresP });
    det.g.position.set(...POS); det.g.rotation.y = YAW; det.reset(0); det.g.updateMatrixWorld(true);
    // Sobretudo de detetive (capa de chuva): amarelo, gola levantada e lapelas pretas, cinto com fivela, botões e mangas
    const COR_CAPA = 0xeab308, matCapa = K.mat(COR_CAPA), matPreto = K.mat(PRETO);
    const capaCorpo = K.malha(new THREE.SphereGeometry(0.262, 24, 16), matCapa); capaCorpo.scale.set(0.95, 1.27, 0.92); capaCorpo.position.y = 0.8; det.corpo.add(capaCorpo);
    const capaSaia = K.malha(new THREE.CylinderGeometry(0.245, 0.39, 0.5, 24, 1, true), K.mat(COR_CAPA, { side: THREE.DoubleSide })); capaSaia.position.y = 0.56; det.corpo.add(capaSaia);
    const abertura = K.malha(new THREE.BoxGeometry(0.012, 0.46, 0.02), matPreto); abertura.position.set(0.02, 0.55, 0.33); abertura.rotation.x = -0.29; det.corpo.add(abertura);
    const gola = K.malha(new THREE.TorusGeometry(0.12, 0.045, 10, 24), matPreto); gola.rotation.x = Math.PI / 2; gola.position.set(0, 1.07, -0.01); gola.scale.set(1.05, 1, 1.6); det.corpo.add(gola);
    [-1, 1].forEach((lado) => {
      const lapela = K.malha(new THREE.BoxGeometry(0.075, 0.24, 0.02), matPreto); lapela.position.set(lado * 0.065, 0.93, 0.205); lapela.rotation.set(-0.35, 0, lado * 0.38); det.corpo.add(lapela);
      [0.8, 0.7].forEach((y) => bola(det.corpo, 0.018, [lado * 0.075, y, 0.228 - (0.8 - y) * 0.05], PRETO));
    });
    const cinto = K.malha(new THREE.CylinderGeometry(0.288, 0.3, 0.065, 24), matPreto); cinto.position.y = 0.66; det.corpo.add(cinto);
    const fivela = K.malha(new THREE.BoxGeometry(0.08, 0.07, 0.02), K.mat(0xfde68a, { metalness: 0.6 })); fivela.position.set(0, 0.66, 0.3); det.corpo.add(fivela);
    det.bracos.forEach((b) => {
      const mSup = K.malha(new THREE.CapsuleGeometry(0.058, 0.17, 6, 16), matCapa); mSup.position.y = -0.13; b.ombro.add(mSup);
      const mAnt = K.malha(new THREE.CapsuleGeometry(0.054, 0.12, 6, 16), matCapa); mAnt.position.y = -0.09; b.cotovelo.add(mAnt);
      const punhoC = K.malha(new THREE.CylinderGeometry(0.062, 0.062, 0.04, 16), matPreto); punhoC.position.y = -0.17; b.cotovelo.add(punhoC);
    });
    ROSTO = det.cabeca.getWorldPosition(new THREE.Vector3()).toArray();

    plaquinha = K.plaquinha('DESCONFIA\nSEMPRE!'); plaquinha.position.set(1.3, 0, 0.75); plaquinha.rotation.y = -0.35; plaquinha.scale.setScalar(0.62);

    // Congelamento vermelho (por cima da imagem, embaixo dos textos)
    overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute;inset:0;background:rgba(220,38,38,0.42);mix-blend-mode:multiply;opacity:0;pointer-events:none';
    carimbo = document.createElement('div');
    carimbo.textContent = 'PARA TUDO!';
    carimbo.style.cssText = 'position:absolute;left:0;right:0;top:600px;margin:auto;width:760px;text-align:center;font:900 120px Montserrat,sans-serif;color:#fff;background:#dc2626;border:10px solid #fff;border-radius:28px;padding:10px 0;transform:rotate(-6deg);box-shadow:0 14px 40px rgba(0,0,0,.45);opacity:0;pointer-events:none';
    K.palco.insertBefore(overlay, K.canvas.nextSibling);
    K.palco.insertBefore(carimbo, overlay.nextSibling);

    rot = { palavra: K.rotulo('PALAVRA DE<br>SEGURANÇA') };
    et = {
      voz: K.etiqueta('A VOZ É DELA?', 'laranja'), copia: K.etiqueta('VOZ COPIADA POR IA', 'vermelho'),
      pix: K.etiqueta('“PIX URGENTE!”', 'laranja'), vida: K.etiqueta('NÃO SABE A VIDA DE VOCÊS', 'azul'),
      pressa: K.etiqueta('PRESSA', 'vermelho'), nome: K.etiqueta('NOME ESTRANHO', 'vermelho'), liga: K.etiqueta('NÃO DEIXA LIGAR', 'vermelho'),
      ligue: K.etiqueta('LIGUE VOCÊ', 'verde'), naoAtende: K.etiqueta('NÃO ATENDEU', 'vermelho'), familia: K.etiqueta('SÓ A FAMÍLIA SABE', 'verde'),
      naoSabe: K.etiqueta('???', 'laranja')
    };
    cont = K.contador(); circulo = K.circulo();

    percurso = K.cameraContinua(chavesCamera());
    const css = document.createElement('style');
    css.textContent = '.cena-golpe .capa-titulo{top:240px;font-size:74px;line-height:1.08;left:30px;right:30px}.cena-golpe .rotulo{font-size:62px;text-align:center}.cena-golpe .etiqueta{font-size:32px}';
    document.head.appendChild(css); K.palco.classList.add('cena-golpe');
  }

  // ---------- Câmera ----------
  function chavesCamera() {
    const rosto = v(ROSTO), frente = v([Math.sin(YAW) * 0.55, 0, 1]).normalize();
    const P = {
      perto: { pos: rosto.clone().addScaledVector(frente, 1.5).add(v([0.08, 0.06, 0])).toArray(), alvo: rosto.clone().add(v([0.06, 0.06, 0])).toArray(), fov: 38, foco: null },
      aberto: { pos: [0.05, 1.5, 3.2], alvo: [0.1, 1.4, -0.3], fov: 44, foco: [[-0.6, 0.0, 0.2], [0.95, 2.84, -0.6]], det: 1, pe: 0 },
      tela: { pos: [0.35, 1.9, 2.2], alvo: [0.4, 1.85, -0.6], fov: 42, foco: [[-0.1, 1.0, -0.6], [0.93, 2.84, -0.6]], det: 0, pe: 1.0 },
      mesa: { pos: [0.0, 1.45, 2.4], alvo: [0.2, 1.15, -0.1], fov: 42, foco: [[-0.5, 0.75, 0.4], [0.95, 1.5, -0.3]], det: 1, pe: 0.55 },
      final: { pos: [0.3, 1.5, 3.3], alvo: [0.35, 1.35, -0.1], fov: 44, foco: [[-0.6, 0.0, 0.2], [1.6, 2.84, 0.9]], det: 1, pe: 0 }
    };
    const plano = [
      ['gancho', 'perto', 0], ['gancho', 'perto', 0.9], ['noite', 'aberto', 0.4], ['audio', 'tela', 0.5], ['app', 'tela', 1.0],
      ['para_tudo', 'aberto', 0.5], ['copia', 'tela', 0.3], ['tres_seg', 'mesa', 0.3], ['papagaio', 'mesa', 1.2],
      ['pista1', 'mesa', 0.6], ['pista2', 'tela', 0.4], ['pista3', 'tela', 0.6], ['liga', 'aberto', 0.4],
      ['nao_atende', 'tela', 0.2], ['palavra', 'mesa', 0.4], ['palavra_rotulo', 'mesa', 0.8], ['regra', 'tela', 0.3],
      ['comenta', 'final', 0.5]
    ];
    focos = [];
    for (const [pl, nome, atraso] of plano) {
      const t = T(pl) + atraso;
      if (focos.length && t <= focos[focos.length - 1].t + 0.3) continue;
      focos.push({ t, ...P[nome] });
    }
    focos.push({ t: Math.max(tl.total + 0.5, focos[focos.length - 1].t + 1), ...P.final });
    return focos.map(({ t, pos, alvo, fov }) => ({ t, pos, alvo, fov }));
  }
  function focoEm(t) {
    let i = 0;
    while (i < focos.length - 2 && t > focos[i + 1].t) i++;
    const a = focos[i], b = focos[i + 1];
    const fa = a.foco || b.foco, fb = b.foco || a.foco;
    if (!fa) return null;
    const p = S((t - a.t) / (b.t - a.t));
    const caixaF = [0, 1].map((k) => fa[k].map((x, j) => K.lerp(x, fb[k][j], p)));
    caixaF.det = K.lerp(a.det ?? b.det ?? 1, b.det ?? a.det ?? 1, p);
    caixaF.pe = K.lerp(a.pe ?? b.pe ?? 0, b.pe ?? a.pe ?? 0, p);
    return caixaF;
  }

  // ---------- Gestos ----------
  function acaoDe(n) {
    return ({
      gancho: 'reagir', noite: 'segurar', audio: 'segurar', app: 'segurar', para_tudo: 'reagir', copia: 'explicar',
      tres_seg: 'apresentar', papagaio: 'explicar', pista1: 'acompanhar', pista2: 'acompanhar', pista3: 'acompanhar',
      liga: 'segurar', nao_atende: 'pensar', palavra: 'explicar', palavra_rotulo: 'apresentar', regra: 'explicar',
      comenta: 'apresentar', cartao: 'acenar'
    })[n] || 'explicar';
  }
  const comCelular = (n) => ['gancho', 'noite', 'audio', 'app', 'liga', 'capa'].includes(n);
  const comLupa = (n) => ['para_tudo', 'copia', 'tres_seg', 'papagaio', 'pista1', 'pista2', 'pista3'].includes(n);

  // ---------- Quadro ----------
  function cena(tc, t, forcar) {
    const capa = forcar === 'capa';
    const B = forcar ? { plano: forcar, p: 0.6, t: 1, dur: 2, inicio: 0, ate: 2 } : K.blocoEm(bl, tc);
    const n = B.plano, bi = capa ? -1 : bl.indexOf(B.bloco);
    const desde = (nome) => !capa && I[nome] != null && bi >= I[nome];
    const fim = n === 'comenta' || n === 'cartao';
    K.ceu('noite');

    // --- Congelamento do "PARA TUDO!" (a cena para no dedo indo pro Confirmar) ---
    const tPara = T('para_tudo');
    const congelado = !capa && n === 'para_tudo';
    const dtPara = tc - tPara;
    overlay.style.opacity = congelado ? (0.35 + 0.65 * faixa(dtPara, 0.05, 0.25)).toFixed(3) : '0';
    carimbo.style.opacity = congelado ? (faixa(dtPara, 0.05, 0.18) * (1 - faixa(tc, FIM('para_tudo') - 0.25, FIM('para_tudo')))).toFixed(3) : '0';
    carimbo.style.transform = `rotate(-6deg) scale(${(congelado ? 1 + 0.35 * (1 - faixa(dtPara, 0.05, 0.3)) : 1).toFixed(3)})`;
    if (!capa && I.para_tudo != null) { K.som('estrondo', tPara + 0.02, 0.5); K.som('congela', tPara + 0.05, 0.6); }

    // --- Detetive ---
    det.g.position.set(...POS);
    let yaw = YAW;
    if (comLupa(n) || ['palavra', 'palavra_rotulo', 'regra'].includes(n)) yaw = 0.75;
    if (fim) yaw = 0.2;
    det.g.rotation.y = yaw;
    const anterior = bl[Math.max(0, bi - 1)] || B.bloco || B;
    const alvos = {
      copia: [FONE[0], FONE[1] - 0.2, FONE[2]], tres_seg: [MAQ[0], TOPO + 0.4, MAQ[2]], papagaio: [MAQ[0], TOPO + 0.45, MAQ[2]],
      pista1: [0.78, TOPO + 0.2, 0.2], pista2: [FONE[0] - 0.1, FONE[1] - 0.25, FONE[2]], pista3: [FONE[0] - 0.1, FONE[1] + 0.1, FONE[2]],
      palavra: [MESA[0], TOPO + 0.2, 0.2], palavra_rotulo: [MESA[0], TOPO + 0.25, 0.2], regra: [FONE[0], FONE[1], FONE[2]]
    };
    const alvo = alvos[n] || det.g.localToWorld(v([0.15, 1.0, 0.35])).toArray();
    det.atuar(tc, { acao: capa ? 'reagir' : acaoDe(n), anterior: acaoDe(anterior.plano), desde: B.inicio, anteriorDesde: anterior.inicio, alvo, intensidade: 0.75 });
    if (capa || n === 'gancho' || congelado) det.humor('assustado');
    if (n === 'nao_atende' || n === 'pista2') det.humor('surpreso');
    if (n === 'cartao') det.acenar(t, 1);
    det.g.updateMatrixWorld(true);

    // Celular na mão direita
    celular.visible = comCelular(capa ? 'capa' : n) || (congelado && dtPara < 0.4);
    if (celular.visible) {
      const pc = det.g.localToWorld(v([0.1, 1.02, 0.3]));
      det.alcancar(pc.toArray(), 1, 1);
      celular.position.copy(pc); celular.rotation.set(-0.35, yaw + 0.25, 0);
      if (n === 'noite') celular.position.x += Math.sin(tc * 70) * 0.006 * (1 - faixa(B.t, 0.2, 1.0));
      det.olhar(celular.position.toArray(), capa || n === 'gancho' ? 0.35 : 0.9);
      telaCel.desenhar((c, w, h) => { c.fillStyle = n === 'app' ? '#1d4ed8' : n === 'liga' ? '#0f172a' : '#0f766e'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.fillRect(w * 0.15, h * 0.4, w * 0.7, 6); c.fillRect(w * 0.15, h * 0.5, w * 0.5, 6); }, n);
    }
    // Lupa na mão esquerda
    lupa.visible = !capa && comLupa(n) && !(congelado && dtPara < 0.35);
    if (lupa.visible) {
      const pl = det.g.localToWorld(v([-0.2, 1.05, 0.32]));
      const mira = alvos[n] ? v(alvos[n]) : null;
      if (mira) pl.lerp(mira, 0.22);
      det.alcancar(pl.toArray(), -1, 1);
      lupa.position.copy(pl).add(v([0, 0.17, 0])); lupa.rotation.set(0, yaw, 0.15);
      if (mira) lupa.lookAt(K.camera.position);
    }

    // --- Celular gigante ---
    let modo = 'nada', pm = B.p;
    if (n === 'noite') modo = 'bloqueio';
    else if (n === 'audio') modo = 'audio';
    else if (n === 'app') modo = 'app';
    else if (n === 'para_tudo') modo = 'congelado';
    else if (n === 'copia' || n === 'tres_seg' || n === 'papagaio') modo = 'copia';
    else if (n === 'pista1') modo = 'audio', pm = 1;
    else if (n === 'pista2') modo = 'pista2';
    else if (n === 'pista3') modo = 'pista3';
    else if (n === 'liga') modo = B.p < 0.25 ? 'congelado' : 'ligando';
    else if (n === 'nao_atende') modo = 'nao_atendida';
    else if (n === 'palavra' || n === 'palavra_rotulo') modo = 'nao_atendida';
    else if (n === 'regra') modo = 'regra';
    else if (fim) modo = 'comentario', pm = n === 'cartao' ? 1 : B.p;
    if (n === 'pista1') modo = 'audio';
    const foneVis = capa ? 0 : n === 'gancho' ? 0 : n === 'noite' ? faixa(B.t, 0.0, 0.5) : 1;
    fone.visible = foneVis > 0.01;
    fone.scale.setScalar(Math.max(0.01, foneVis));
    fone.position.set(FONE[0], FONE[1] + Math.sin(tc * 1.3) * 0.02, FONE[2]);
    if (fone.visible) desenharFone(modo === 'audio' && n === 'pista1' ? 'audio' : modo, n === 'pista1' ? 1 : pm, tc);
    luzFone.position.copy(fone.position).add(v([0, 0, 0.6])); luzFone.intensity = 0.9 * foneVis;
    if (n === 'noite') K.som('bip', B.inicio + 0.35, 0.5);
    if (n === 'app') for (let k = 0; k < 6; k++) K.som('clique', B.inicio + 0.3 + k * 0.18, 0.12);
    if (n === 'liga') { K.som('desliga', B.inicio + 0.1, 0.5); K.som('bip', B.inicio + B.dur * 0.45, 0.35); K.som('bip', B.inicio + B.dur * 0.75, 0.35); }
    if (n === 'nao_atende') K.som('errado', B.inicio + 0.5, 0.4);

    // --- Cópia: cartão de vídeo entra na maquininha e sai a onda copiada ---
    const naMesa = (n === 'tres_seg' || n === 'papagaio');
    maquina.visible = !capa && naMesa;
    const tq = n === 'tres_seg' ? B.t : n === 'papagaio' ? 99 : 0;
    maquina.scale.setScalar(n === 'tres_seg' ? Math.max(0.01, S(B.t / 0.4)) : 1);
    engr.forEach((e, k) => { e.rotation.z = (k ? -1 : 1) * tc * (n === 'tres_seg' ? 4 : 1.2); });
    cartao.visible = n === 'tres_seg' && tq < 1.9;
    if (cartao.visible) {
      const k = S((tq - 0.6) / 1.1);
      cartao.position.set(K.lerp(-0.25, MAQ[0], k), K.lerp(1.55, TOPO + 0.33, k), K.lerp(0.55, MAQ[2], k));
      cartao.rotation.set(-0.15 + 0.5 * k, 0.4 * (1 - k), 0); cartao.scale.setScalar(1 - 0.75 * k);
    }
    onda.visible = (n === 'tres_seg' && tq > 1.6) || n === 'papagaio';
    if (onda.visible) {
      const k = n === 'papagaio' ? 1 : S((tq - 1.6) / 0.8);
      onda.position.set(MAQ[0] + 0.15 + 0.4 * k, TOPO + 0.25 + 0.3 * k, MAQ[2] + 0.12);
      onda.scale.setScalar(Math.max(0.01, k)); onda.lookAt(K.camera.position);
      const f = Math.floor(tc * 12);
      telaOnda.desenhar((c, w, h) => {
        c.clearRect(0, 0, w, h); c.fillStyle = 'rgba(15,23,42,0.85)'; arred(c, 0, 0, w, h, 30); c.fill();
        ondaSom(c, 20, h / 2, w - 40, h * 0.75, 24, 1, '#f87171', '#f87171', 7 + (f % 3));
        c.strokeStyle = '#fde68a'; c.setLineDash([10, 8]); c.lineWidth = 4; c.beginPath(); c.moveTo(w * 0.33, 6); c.lineTo(w * 0.33, h - 6); c.moveTo(w * 0.66, 6); c.lineTo(w * 0.66, h - 6); c.stroke(); c.setLineDash([]);
      }, 'o' + (f % 3));
    }
    if (n === 'tres_seg') { K.som('whoosh', B.inicio + 0.7, 0.35); K.som('zumbido', B.inicio + 1.5, 0.25, 0.8); K.som('ding', B.inicio + 2.1, 0.35); }

    // --- Papagaio ---
    const pousado = v([MAQ[0], TOPO + 0.31, MAQ[2]]);
    const comPapagaio = !capa && desde('papagaio') && !fim;
    papagaio.visible = comPapagaio;
    poleiro.visible = comPapagaio && !naMesa;
    poleiro.position.set(MAQ[0], TOPO, MAQ[2]);
    if (comPapagaio) {
      const base = naMesa ? pousado : v([MAQ[0], TOPO + 0.23, MAQ[2]]);
      let pos = base.clone(), voando = 0;
      if (n === 'papagaio') {
        const k = S(B.t / 0.9); voando = 1 - S((B.t - 0.7) / 0.3);
        pos = v([1.3, 2.3, 0.6]).lerp(base, k); pos.y += Math.sin(k * Math.PI) * 0.25;
      }
      let queda = 0;
      if (n === 'palavra_rotulo') queda = faixa(tc, (K.quando('papagaio', B.inicio) ?? B.inicio + B.dur * 0.55) + 0.5, (K.quando('papagaio', B.inicio) ?? B.inicio + B.dur * 0.55) + 1.0);
      papagaio.position.copy(pos);
      papagaio.position.y -= 0.22 * queda * queda;
      papagaio.position.x += 0.12 * queda;
      papagaio.rotation.set(0, -0.3 + (n === 'papagaio' ? 0.2 * Math.sin(tc * 3) : 0), -1.4 * queda);
      const bate = voando > 0.05 ? Math.sin(tc * 30) * 0.9 * voando : Math.sin(tc * 2) * 0.05;
      papagaio.userData.asas[0].rotation.z = bate; papagaio.userData.asas[1].rotation.z = -bate;
      papagaio.scale.setScalar(1.25);
      if (n === 'papagaio') K.som('whoosh', B.inicio + 0.1, 0.3);
      if (n === 'palavra_rotulo') K.som('baque', (K.quando('papagaio', B.inicio) ?? B.inicio + B.dur * 0.55) + 1.0, 0.35);
    }
    album.visible = n === 'papagaio' && B.p > 0.5;
    album.position.set(MESA[0] + 0.3, TOPO + 0.0 + 0.02 * (1 - faixa(B.t, B.dur * 0.5, B.dur * 0.5 + 0.3)), 0.22);
    album.scale.setScalar(Math.max(0.01, faixa(B.p, 0.5, 0.6)));

    // --- Ampulheta (pista 1) ---
    ampulheta.visible = n === 'pista1';
    ampulheta.position.set(0.78, TOPO, 0.2);
    ampulheta.scale.setScalar(Math.max(0.01, S(B.t / 0.35)) * 1.7);
    ampulheta.rotation.z = n === 'pista1' ? Math.floor(B.t / 0.7) * Math.PI + S((B.t % 0.7) / 0.25) * Math.PI : 0;
    ampulheta.position.y = TOPO + (n === 'pista1' ? 0.2 * Math.abs(Math.sin(ampulheta.rotation.z)) : 0);
    if (n === 'pista1') for (let k = 0; k < 4; k++) K.som('madeira', B.inicio + 0.25 + k * 0.7, 0.2);

    // --- Cadeado e porta-retrato ---
    const comCadeado = desde('palavra') && !desde('regra') && !capa;
    cadeado.visible = retrato.visible = comCadeado;
    if (comCadeado) {
      const k = n === 'palavra' ? S((B.t - 0.6) / 0.6) : 1;
      cadeado.position.set(MESA[0] - 0.05, TOPO + K.queda(n === 'palavra' ? B.t - 0.6 : 5, 1.2, 0.6), 0.22);
      cadeado.scale.setScalar(1.1);
      cadeado.rotation.y = -0.2;
      retrato.position.set(MESA[0] + 0.42, TOPO, 0.05); retrato.rotation.y = -0.3;
      retrato.scale.setScalar(Math.max(0.01, n === 'palavra' ? S((B.t - 1.2) / 0.4) : 1));
      if (n === 'palavra') { K.som('metal', B.inicio + 1.15, 0.4); K.som('brilho', B.inicio + 1.3, 0.3); }
      void k;
    }

    // --- Final ---
    plaquinha.visible = fim;
    plaquinha.scale.setScalar(0.62 * (fim ? Math.max(0.001, faixa(tc, T('comenta') + B.dur * 0 + 0.3, T('comenta') + 0.9)) : 0.001));
    if (fim) K.som('madeira', T('comenta') + 0.35, 0.35);
    if (n === 'cartao') K.som('final', B.inicio, 0.4);
    if (n === 'comenta') for (let k = 0; k < 9; k++) K.som('clique', B.inicio + 0.5 + k * 0.1, 0.08);

    // --- Câmera ---
    let cam;
    if (capa) {
      cam = { pos: focos[0].pos, alvo: focos[0].alvo, fov: 38 };
    } else cam = percurso.amostrar(t);
    K.camera.fov = cam.fov; K.camera.updateProjectionMatrix(); K.mirar(cam.pos, cam.alvo);
    const fc = capa ? null : focoEm(t);
    if (fc) {
      const pts = [];
      const centroF = v([(fc[0][0] + fc[1][0]) / 2, (fc[0][1] + fc[1][1]) / 2, (fc[0][2] + fc[1][2]) / 2]);
      for (const x of [-0.42, 0.42]) for (const y of [fc.pe * 1.2, 1.62]) for (const z of [-0.3, 0.4]) pts.push(centroF.clone().lerp(det.g.localToWorld(v([x, y, z])), fc.det).toArray());
      for (const x of [fc[0][0], fc[1][0]]) for (const y of [fc[0][1], fc[1][1]]) for (const z of [fc[0][2], fc[1][2]]) pts.push([x, y, z]);
      const antes = K.camera.position.clone();
      K.enquadrarSeguro(pts, cam.alvo, { area: [48, 520, 1032, 1700] });
      const w = I.noite != null ? faixa(t, T('noite') - 0.1, T('noite') + 0.9) : 1;
      if (w < 1) { K.camera.position.lerp(antes, 1 - w); K.camera.lookAt(v(cam.alvo)); }
    }
    if (congelado) K.tremer(dtPara, 1.6);

    // --- Textos ---
    const tela = (y) => ({ tela: [540, y] });
    if (n === 'audio' && B.p > 0.75) et.voz.em(tela(560), B.t - B.dur * 0.75);
    if (n === 'copia') et.copia.em(tela(560), B.t - 0.4);
    if (n === 'tres_seg' && tq > 2.0) cont.em('3 s', tela(500), tq - 2.0, 'DE VÍDEO');
    if (n === 'papagaio') { if (B.p < 0.5) et.pix.em(tela(560), B.t - 0.9); else et.vida.em(tela(560), B.t - B.dur * 0.5); }
    if (n === 'pista1') { cont.em('1', tela(450), B.t - 0.05, 'PISTA'); et.pressa.em(tela(585), B.t - 0.8); circulo.em([0.78, TOPO + 0.3, 0.2], 230, B.t - 0.9); }
    if (n === 'pista2') { cont.em('2', tela(450), B.t - 0.05, 'PISTA'); et.nome.em(tela(585), B.t - 0.8); }
    if (n === 'pista3') { cont.em('3', tela(450), B.t - 0.05, 'PISTA'); et.liga.em(tela(585), B.t - 0.9); }
    if (n === 'liga' && B.p > 0.3) et.ligue.em(tela(560), B.t - B.dur * 0.3);
    if (n === 'nao_atende') et.naoAtende.em(tela(560), B.t - 0.5);
    if (n === 'palavra' && B.t > 1.3) et.familia.em(tela(560), B.t - 1.3);
    if (n === 'palavra_rotulo') {
      const qp = K.quando('papagaio', B.inicio) ?? B.inicio + B.dur * 0.55;
      if (tc < qp) rot.palavra.em(tela(530), B.t - 0.05); else et.naoSabe.em(tela(560), tc - qp);
    }

    estado = { n, modo };
  }

  function espaco() {
    return [
      { nome: 'corpo da detetive', obj: det.g, grupo: 'apresentador', caixa: [[-0.26, 0, -0.25], [0.26, 1.53, 0.25]] },
      { nome: 'mesa', obj: mesa }, { nome: 'cadeira', obj: cadeira }
    ];
  }

  window.CENA = { montar, cena, espaco, movimento: () => ({ det, estado, percurso }), capa: () => cena(0, 0, 'capa') };
})();

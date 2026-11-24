// Celular em corte didático. O vidro, a grade e o controlador têm movimentos independentes.
// Cada plano é calculado a partir do tempo, inclusive ao voltar um trecho ou tirar uma prévia.
(function () {
  const LARGURA = 1.08;
  const ALTURA = 1.95;
  const COLUNAS = [-0.34, -0.17, 0, 0.17, 0.34];
  const LINHAS = [0.7, 0.525, 0.35, 0.175, 0, -0.175, -0.35, -0.525, -0.7];
  const PONTO = [COLUNAS[3], LINHAS[3]];
  const SEGUNDO_PONTO = [COLUNAS[1], LINHAS[6]];
  const AZUL = 0x42d9ff;
  const LARANJA = 0xffb857;
  const AMARELO = 0xffe274;
  let blocos, menino, telefone, suporte, telefoneDeMao, placa, temposToque;
  let corpo, visor, vidro, malha, chip, cabo, mapa, cruzamentos, gradeX, gradeY;
  let pulsos, medidor, dedos, ondas, circulo, rotulos, etiquetas, logo;

  function caixa(pai, tamanho, pos, mat, sombra = true) {
    const objeto = K.malha(new THREE.BoxGeometry(...tamanho), mat, sombra);
    objeto.position.set(...pos);
    pai.add(objeto);
    return objeto;
  }

  function retangulo(larg, alt, raio) {
    const x = -larg / 2, y = -alt / 2;
    const forma = new THREE.Shape();
    forma.moveTo(x + raio, y);
    forma.lineTo(-x - raio, y);
    forma.quadraticCurveTo(-x, y, -x, y + raio);
    forma.lineTo(-x, -y - raio);
    forma.quadraticCurveTo(-x, -y, -x - raio, -y);
    forma.lineTo(x + raio, -y);
    forma.quadraticCurveTo(x, -y, x, -y - raio);
    forma.lineTo(x, y + raio);
    forma.quadraticCurveTo(x, y, x + raio, y);
    return forma;
  }

  function camada(pai, larg, alt, raio, espessura, z, material) {
    const geometria = espessura
      ? new THREE.ExtrudeGeometry(retangulo(larg, alt, raio), {
        depth: espessura, bevelEnabled: true, bevelSize: 0.018, bevelThickness: 0.012, bevelSegments: 3, curveSegments: 12
      })
      : new THREE.ShapeGeometry(retangulo(larg, alt, raio), 16);
    if (!espessura) {
      const pos = geometria.attributes.position, uv = geometria.attributes.uv;
      for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / larg + 0.5, pos.getY(i) / alt + 0.5);
    }
    const objeto = K.malha(geometria, material, Boolean(espessura));
    objeto.position.z = z;
    pai.add(objeto);
    return objeto;
  }

  function formaCanvas(ctx, x, y, w, h, raio, cor) {
    ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, raio);
    ctx.fill();
  }

  function texturaTela() {
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 880;
    const ctx = canvas.getContext('2d');
    const textura = new THREE.CanvasTexture(canvas);
    textura.colorSpace = THREE.SRGBColorSpace;
    textura.anisotropy = 4;
    let imagemAtual, zoomAtual;
    return {
      textura,
      desenhar(imagem, zoom = 1) {
        if (imagem === imagemAtual && zoom === zoomAtual) return;
        imagemAtual = imagem;
        zoomAtual = zoom;
        const fundo = ctx.createLinearGradient(0, 0, 480, 880);
        fundo.addColorStop(0, '#132449');
        fundo.addColorStop(0.48, '#154f77');
        fundo.addColorStop(1, '#052b3d');
        ctx.fillStyle = fundo;
        ctx.fillRect(0, 0, 480, 880);
        ctx.save();
        ctx.translate(240, 425);
        ctx.scale(zoom, zoom);
        const ceu = ctx.createLinearGradient(0, -280, 0, 310);
        ceu.addColorStop(0, '#66dbfa');
        ceu.addColorStop(0.6, '#b6f2e9');
        ceu.addColorStop(1, '#a4d872');
        ctx.beginPath();
        ctx.roundRect(-196, -245, 392, 518, 28);
        ctx.clip();
        ctx.fillStyle = ceu;
        ctx.fillRect(-196, -245, 392, 518);
        ctx.beginPath();
        ctx.fillStyle = '#ffdb71';
        ctx.arc(91, -130, 48, 0, Math.PI * 2);
        ctx.fill();
        for (const [cor, altura, deslocamento] of [['#48976d', 64, 60], ['#78bd69', 135, -80], ['#369064', 217, 20]]) {
          ctx.beginPath();
          ctx.moveTo(-200, altura);
          ctx.quadraticCurveTo(deslocamento, altura - 160, 200, altura - 23);
          ctx.lineTo(200, 280);
          ctx.lineTo(-200, 280);
          ctx.fillStyle = cor;
          ctx.fill();
        }
        formaCanvas(ctx, -45, 82, 79, 87, 6, '#fff3cd');
        formaCanvas(ctx, -53, 74, 95, 17, 7, '#f49960');
        formaCanvas(ctx, -14, 121, 23, 48, 5, '#21596b');
        ctx.restore();
        if (imagem === 'inicio') {
          formaCanvas(ctx, 44, 180, 392, 518, 28, '#142e5788');
          formaCanvas(ctx, 270, 294, 94, 94, 24, '#ffc25f');
          ctx.strokeStyle = '#173654';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.roundRect(290, 317, 54, 47, 9);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(292, 355);
          ctx.lineTo(310, 337);
          ctx.lineTo(321, 348);
          ctx.lineTo(334, 333);
          ctx.lineTo(343, 340);
          ctx.stroke();
          formaCanvas(ctx, 88, 725, 304, 53, 26, '#e6f9ff26');
          ['#8ee8cb', '#90d5ff', '#ffaf81', '#c8c6ff'].forEach((cor, i) => formaCanvas(ctx, 115 + i * 68, 735, 34, 34, 10, cor));
        }
        formaCanvas(ctx, 189, 26, 102, 25, 12, '#0b1629');
        formaCanvas(ctx, 169, 838, 142, 8, 4, '#f0fcff');
        ctx.font = 'bold 22px Arial';
        ctx.fillStyle = '#f0fcff';
        ctx.fillText('09:41', 42, 51);
        formaCanvas(ctx, 403, 34, 32, 13, 4, '#f0fcff');
        textura.needsUpdate = true;
      }
    };
  }

  function emissivo(cor) {
    return new THREE.MeshBasicMaterial({ color: cor });
  }

  function criarDedo(i) {
    const g = new THREE.Group();
    const pele = K.mat(0xd89a72, { roughness: 0.8 });
    const esfera = new THREE.SphereGeometry(1, 20, 14);
    const haste = new THREE.CylinderGeometry(0.9, 1, 1, 18).translate(0, 0.5, 0);
    function volume(pos, escala, material = pele) {
      const objeto = K.malha(esfera, material, false);
      objeto.position.set(...pos);
      objeto.scale.set(...escala);
      g.add(objeto);
      return objeto;
    }
    function elo(a, b, raio, material = pele) {
      const objeto = K.malha(haste, material, false);
      K.ligarPontos(objeto, a, b, raio);
      g.add(objeto);
    }
    const lado = i === 0 ? 1 : -1;
    const ponta = [0, 0, 0.077];
    const junta = [0.14 * lado, -0.018, 0.17];
    const base = [0.29 * lado, -0.065, 0.24];
    const punho = [0.54 * lado, -0.14, 0.35];
    elo(ponta, junta, 0.069);
    elo(junta, base, 0.081);
    volume(ponta, [0.072, 0.069, 0.076]);
    volume(junta, [0.08, 0.078, 0.08]);
    const unha = volume([0.038 * lado, 0.059, 0.107], [0.059, 0.017, 0.041], K.mat(0xf5b99e));
    unha.rotation.y = -lado * 0.4;
    const palma = volume([0.39 * lado, -0.126, 0.302], [0.186, 0.117, 0.116]);
    palma.rotation.y = -lado * 0.45;
    for (let j = 0; j < 3; j++) {
      volume([(0.305 + j * 0.044) * lado, -0.169 - j * 0.025, 0.337 + j * 0.017], [0.079, 0.051, 0.057]);
    }
    const polegar = volume([0.36 * lado, -0.235, 0.265], [0.11, 0.056, 0.061]);
    polegar.rotation.z = lado * 0.35;
    elo([0.48 * lado, -0.14, 0.34], punho, 0.109);
    elo(punho, [0.64 * lado, -0.15, 0.38], 0.127, K.mat(0xf97316));
    elo([0.62 * lado, -0.15, 0.38], [1.11 * lado, -0.23, 0.52], 0.143, K.mat(0x2563eb));
    telefone.add(g);
    return g;
  }

  function montar(timeline) {
    blocos = K.blocos(timeline);
    temposToque = timeline.roteiro.direcao?.toqueContinuo ? prepararToque() : null;
    K.palco.classList.add('cena-celular');
    const css = document.createElement('style');
    css.textContent = '.cena-celular .capa-titulo{top:273px;font-size:94px;line-height:1.01;-webkit-text-stroke:17px #111}';
    document.head.appendChild(css);
    K.mundo(14);
    const casa = K.casa();
    casa.position.set(-4.8, 0, -4.6);
    casa.rotation.y = 0.2;
    const madeira = K.mat(0xa7693c, { roughness: 0.72 });
    for (let i = 0; i < 8; i++) {
      const x = 1.6 + i * 0.48;
      caixa(K.scene, [0.29, 0.93, 0.09], [x, 0.465, -3.5], madeira);
    }
    caixa(K.scene, [4.1, 0.085, 0.13], [3.18, 0.33, -3.56], madeira);
    caixa(K.scene, [4.1, 0.085, 0.13], [3.18, 0.72, -3.56], madeira);
    suporte = new THREE.Group();
    suporte.position.set(0.43, 0, 0);
    K.scene.add(suporte);
    caixa(suporte, [1.36, 0.12, 0.72], [0, 0.31, 0], madeira);
    for (const x of [-0.52, 0.52]) caixa(suporte, [0.13, 0.3, 0.42], [x, 0.15, 0], madeira);
    caixa(suporte, [0.88, 0.06, 0.41], [0, 0.4, 0.015], K.mat(0x172b44));
    telefone = new THREE.Group();
    K.scene.add(telefone);
    corpo = new THREE.Group();
    telefone.add(corpo);
    camada(corpo, LARGURA, ALTURA, 0.127, 0.106, -0.12, K.mat(0x223f61, { metalness: 0.58, roughness: 0.27 }));
    camada(corpo, 1.055, 1.927, 0.113, 0.025, -0.034, K.mat(0x081425, { roughness: 0.36 }));
    caixa(corpo, [0.025, 0.22, 0.055], [0.548, 0.33, -0.062], K.mat(0x638aaa, { metalness: 0.54 }));
    caixa(corpo, [0.025, 0.14, 0.05], [0.548, 0.046, -0.063], K.mat(0x638aaa, { metalness: 0.54 }));
    const tela = texturaTela();
    visor = camada(telefone, 0.99, 1.86, 0.103, 0, 0.012, new THREE.MeshBasicMaterial({ map: tela.textura }));
    visor.userData.tela = tela;
    vidro = camada(telefone, 1.015, 1.89, 0.108, 0, 0.062,
      new THREE.MeshBasicMaterial({ color: 0x98def9, opacity: 0.13, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
    vidro.renderOrder = 3;

    malha = new THREE.Group();
    telefone.add(malha);
    camada(malha, 0.98, 1.82, 0.09, 0, -0.035, emissivo(0x09243a));
    const matX = emissivo(AZUL), matY = emissivo(LARANJA);
    gradeX = LINHAS.map((y) => caixa(malha, [0.85, 0.025, 0.012], [0, y, 0.01], matX, false));
    gradeY = COLUNAS.map((x) => caixa(malha, [0.025, 1.65, 0.012], [x, 0, 0.042], matY, false));
    const geoPonto = new THREE.SphereGeometry(0.031, 12, 10);
    cruzamentos = LINHAS.flatMap((y) => COLUNAS.map((x) => {
      const objeto = new THREE.Mesh(geoPonto, emissivo(0x21728c));
      objeto.position.set(x, y, 0.063);
      malha.add(objeto);
      return objeto;
    }));
    mapa = new THREE.Group();
    malha.add(mapa);
    const guias = [
      ...COLUNAS.map((x, i) => [String.fromCharCode(65 + i), x, 0.845]),
      ...LINHAS.map((y, i) => [String(i + 1), -0.46, y])
    ];
    for (const [texto, x, y] of guias) {
      const guia = K.placa(texto, { larg: 0.085, alt: 0.07, fundo: '#102b48', cor: '#ffffff', borda: '#102b48' });
      guia.position.set(x, y, 0.06);
      mapa.add(guia);
    }

    chip = new THREE.Group();
    telefone.add(chip);
    caixa(chip, [0.47, 0.28, 0.046], [0, 0, 0], K.mat(0x0d887e, { roughness: 0.63 }));
    caixa(chip, [0.235, 0.156, 0.065], [0, 0, 0.056], K.mat(0x172438, { metalness: 0.25 }));
    for (const lado of [-1, 1]) {
      for (let i = 0; i < 5; i++) caixa(chip, [0.059, 0.013, 0.014], [lado * 0.138, (i - 2) * 0.029, 0.04], K.mat(0xe5c06c));
    }
    caixa(chip, [0.037, 0.037, 0.01], [-0.074, 0.037, 0.096], emissivo(0x97ffd5), false);
    cabo = caixa(telefone, [0.105, 0.24, 0.024], [0, -0.85, 0.055], K.mat(0xff9950), false);

    pulsos = [AZUL, LARANJA, AMARELO].map((cor) => {
      const objeto = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 10), emissivo(cor));
      malha.add(objeto);
      return objeto;
    });
    medidor = new THREE.Group();
    malha.add(medidor);
    caixa(medidor, [0.58, 0.096, 0.013], [0, 0, 0], emissivo(0x16344e), false);
    medidor.userData.barras = Array.from({ length: 10 }, (_, i) =>
      caixa(medidor, [0.038, 0.056, 0.014], [(i - 4.5) * 0.051, 0, 0.013], emissivo(AZUL), false));
    medidor.position.set(0, 0.62, 0.088);

    dedos = [criarDedo(0), criarDedo(1)];
    ondas = dedos.map(() => {
      const anel = new THREE.Mesh(new THREE.RingGeometry(0.11, 0.135, 40),
        new THREE.MeshBasicMaterial({ color: AMARELO, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
      anel.renderOrder = 5;
      telefone.add(anel);
      return anel;
    });
    const identidade = timeline.roteiro.personagem;
    const cores = Object.fromEntries(Object.entries(identidade.cores).map(([nome, valor]) => [nome, parseInt(valor.slice(1), 16)]));
    menino = K.boneco({ tipo: identidade.tipo, roupa: identidade.roupa, cores });
    menino.g.scale.setScalar(0.88);
    telefoneDeMao = K.celular();
    telefoneDeMao.tela.m.material.map = tela.textura;
    placa = K.plaquinha('QUAL A PROXIMA\nTECNOLOGIA\nINVESTIGAMOS?');
    placa.scale.set(1.05, 1.04, 1);
    circulo = K.circulo();
    logo = window.LOGO && K.logoFinal();
    rotulos = { sensor: K.rotulo('Sensor capacitivo'), controlador: K.rotulo('Controlador') };
    etiquetas = {
      falha: K.etiqueta('SEM RESPOSTA', 'vermelho'),
      pulso: K.etiqueta('SINAL ENTRE AS TIRAS', 'azul'),
      toque: K.etiqueta('O SINAL MUDA', 'laranja'),
      grade: K.etiqueta('LINHAS × COLUNAS', 'azul'),
      dois_toques: K.etiqueta('DOIS TOQUES', 'verde')
    };
  }

  const CAMERAS = {
    capa: [[0.13, 1.77, 5.15], [0.06, 1.42, 0]],
    gancho: [[0.13, 1.77, 5.15], [0.06, 1.42, 0]],
    imagem: [[-0.65, 2.04, 4.9], [0.03, 1.3, 0]],
    falha: [[0.84, 1.77, 4.24], [0.12, 1.34, 0]],
    duas_tiras: [[1.2, 2.16, 4.23], [0.23, 1.5, 0.1]],
    pulso: [[0.86, 1.96, 3.78], [0.19, 1.51, 0.16]],
    toque: [[1.56, 1.93, 3.83], [0.23, 1.54, 0.1]],
    sensor: [[0.3, 1.78, 4.32], [0.08, 1.37, 0.06]],
    canto: [[0.8, 1.72, 4.47], [0.09, 1.38, 0.07]],
    montar_grade: [[1.3, 2.2, 4.83], [0.13, 1.38, 0.08]],
    grade: [[0.39, 2.23, 4.23], [0.18, 1.41, 0.08]],
    mapa: [[0.36, 1.56, 3.55], [0.23, 1.39, 0.08]],
    varredura: [[-0.72, 2.05, 4.56], [0.08, 1.4, 0.08]],
    encaixar_chip: [[1.43, 1.47, 4.2], [0.2, 1.25, 0.05]],
    controlador: [[0.93, 1.79, 4.33], [0.15, 1.34, 0.09]],
    dois_toques: [[0.51, 1.88, 3.85], [0.26, 1.41, 0.12]],
    zoom: [[0.6, 1.76, 3.59], [0.25, 1.39, 0.07]],
    por_fora: [[-0.8, 1.91, 4.99], [0.04, 1.36, 0.05]],
    por_dentro: [[1.86, 2.16, 5.04], [0.17, 1.36, 0.12]],
    segue: [[0.11, 1.78, 4.84], [0.05, 1.2, 0.19]],
    cartao: [[0.11, 1.78, 4.77], [0.05, 1.2, 0.19]]
  };
  const ESTAGIOS = {
    capa: 'inicio', gancho: 'inicio', imagem: 'inicio', falha: 'inicio',
    duas_tiras: 'par', pulso: 'par', toque: 'par', sensor: 'par', canto: 'par',
    montar_grade: 'grade', grade: 'grade', mapa: 'grade', varredura: 'grade',
    encaixar_chip: 'chip', controlador: 'chip', dois_toques: 'chip', zoom: 'foto',
    por_fora: 'inicio', por_dentro: 'explodido', segue: 'final', cartao: 'final'
  };
  const SONS = {
    imagem: ['clique', 0.4], falha: ['errado', 0.45], duas_tiras: ['metal', 0.66],
    pulso: ['bip', 0.29], toque: ['clique', 0.31], sensor: ['rotulo', 0.1],
    canto: ['errado', 0.38], montar_grade: ['liga', 0.49], mapa: ['etiqueta', 0.48],
    encaixar_chip: ['trava', 0.61], controlador: ['rotulo', 0.13], dois_toques: ['certo', 0.52],
    zoom: ['whoosh', 0.48], por_dentro: ['desconstrucao', 0.12], segue: ['final', 0.13]
  };

  const QUADRO_ABERTO = { pos: [0.86, 1.96, 3.78], alvo: [0.19, 1.51, 0.16], fov: 50 };
  const QUADRO_TOQUE = { pos: [1.54, 1.74, 2.52], alvo: [0.53, 1.59, 0.16], fov: 46 };
  const QUADRO_SENSOR = { pos: [0.74, 1.84, 3.9], alvo: [0.18, 1.39, 0.1], fov: 50 };

  function prepararToque() {
    const [pulso, toque, sensor] = ['pulso', 'toque', 'sensor'].map(plano => blocos.find(b => b.plano === plano));
    if (!pulso || !toque || !sensor) return null;
    const palavraMuda = K.quando('muda', toque.inicio);
    const contato = palavraMuda != null && palavraMuda < toque.fim ? palavraMuda : toque.inicio + 0.55;
    return { inicio: pulso.inicio, contato, soltar: sensor.inicio + 0.12, fim: sensor.ate };
  }

  function estadoDoToque(tc) {
    if (!temposToque || tc < temposToque.inicio || tc >= temposToque.fim) return null;
    const { contato, soltar } = temposToque;
    const aproxima = K.suave(K.faixa(tc, contato - 1.14, contato));
    const recua = K.suave(K.faixa(tc, soltar, soltar + 0.61));
    return {
      contato,
      avanco: aproxima * (1 - recua),
      visivel: tc >= contato - 1.14 && recua < 1,
      sinal: K.suave(K.faixa(tc, contato, contato + 0.24)) * (1 - recua)
    };
  }

  function cameraDoToque(tc) {
    const { inicio, contato, fim } = temposToque;
    const virada = contato + 0.35;
    if (tc <= virada) {
      K.planoCurvo(QUADRO_ABERTO, [1.02, 2.06, 3.03], QUADRO_TOQUE, K.faixa(tc, inicio, virada));
    } else {
      K.planoCurvo(QUADRO_TOQUE, [0.39, 1.59, 2.89], QUADRO_SENSOR, K.faixa(tc, virada, fim));
    }
  }

  function camera(plano, progresso) {
    const [pos, alvo] = CAMERAS[plano];
    const aberto = plano === 'capa' || plano === 'gancho';
    K.plano({ pos, alvo }, {
      pos: [pos[0] + (aberto ? 0.09 : -0.15), pos[1] + 0.04, pos[2] - 0.12],
      alvo: [alvo[0] + 0.018, alvo[1], alvo[2]]
    }, progresso);
  }

  function atuar(plano, tc, p) {
    const final = ESTAGIOS[plano] === 'final';
    const surpresa = ['capa', 'gancho', 'falha', 'canto', 'varredura'].includes(plano);
    const macro = ['pulso', 'toque', 'mapa', 'dois_toques', 'zoom'].includes(plano);
    menino.g.position.set(final ? -0.64 : -0.72 + 0.03 * Math.sin(p * Math.PI), 0, final ? 0.28 : macro ? -0.54 : 0.12);
    menino.g.rotation.y = final ? 0.14 : 0.42;
    menino.reset(tc);
    menino.humor(surpresa ? 'surpreso' : 'feliz');
    if (final) {
      menino.pose({ x: -1.15, z: -0.24, c: -0.66 }, { x: -1.4, z: 0.13, c: -0.2 });
    } else if (['falha', 'canto', 'mapa', 'varredura'].includes(plano)) {
      menino.pensar();
    } else if (['imagem', 'duas_tiras', 'montar_grade', 'encaixar_chip', 'por_fora'].includes(plano)) {
      menino.segurar();
    } else {
      menino.apontar(0.24 + 0.16 * Math.sin(p * Math.PI));
    }
    telefoneDeMao.g.visible = final;
    if (final) {
      const [x, y, z] = menino.mao(0);
      telefoneDeMao.g.position.set(x, y + 0.1, z + 0.06);
      telefoneDeMao.g.rotation.set(-0.07, 0.17, 0.16);
      telefoneDeMao.g.scale.setScalar(1.25);
    }
  }

  function mostrarDedo(i, ponto, distancia, brilho, tc) {
    const [x, y] = ponto;
    dedos[i].visible = true;
    dedos[i].position.set(x, y, vidro.position.z + distancia);
    const anel = ondas[i];
    anel.visible = brilho > 0.02;
    anel.position.set(x, y, vidro.position.z + 0.034);
    anel.scale.setScalar(1 + 0.18 * Math.sin(tc * 5));
    anel.material.opacity = brilho;
  }

  function mostrarGrade(plano, B, tc, mostrarChip, toqueContinuo) {
    const par = ESTAGIOS[plano] === 'par';
    const chegada = plano === 'montar_grade' ? K.suave(K.faixa(B.q, 0.12, 0.8)) : 1;
    const indiceX = plano === 'mapa' ? 2 : 3;
    const indiceY = plano === 'mapa' ? 1 : 3;
    gradeX.forEach((tira, i) => {
      tira.visible = !par || i === indiceX;
      tira.position.x = (i % 2 ? -1 : 1) * (1 - chegada) * 0.57;
    });
    gradeY.forEach((tira, i) => {
      tira.visible = !par || i === indiceY;
      tira.position.y = (i % 2 ? 1 : -1) * (1 - chegada) * 0.49;
    });
    const varrendo = plano === 'varredura' || plano === 'encaixar_chip' || plano === 'controlador';
    const linhaAtiva = Math.floor(tc * 5) % LINHAS.length;
    const regioes = plano === 'dois_toques' ? [PONTO, SEGUNDO_PONTO] : plano === 'controlador' ? [PONTO] : [];
    cruzamentos.forEach((ponto, i) => {
      const linha = Math.floor(i / COLUNAS.length), coluna = i % COLUNAS.length;
      const principal = linha === indiceX && coluna === indiceY;
      ponto.visible = par ? principal : chegada > 0.62;
      const distancia = regioes.reduce((d, [x, y]) => Math.min(d, Math.hypot(x - ponto.position.x, y - ponto.position.y)), 1);
      const intensidade = Math.max(0, 1 - distancia / 0.29);
      const aceso = principal && (par || plano === 'mapa') || varrendo && linha === linhaAtiva;
      ponto.material.color.setHex(intensidade > 0.05 ? AMARELO : aceso ? AZUL : 0x37758d);
      ponto.scale.setScalar(intensidade > 0.05 ? 0.85 + intensidade * 1.2 : aceso ? 1 : 0.53);
    });
    mapa.visible = plano === 'mapa';
    const fase = (tc * 1.35) % 1;
    const acoplamento = plano === 'pulso' || plano === 'toque' || toqueContinuo !== null;
    const atenuacao = toqueContinuo?.sinal ?? (plano === 'toque' && B.p > 0.24 ? 1 : 0);
    pulsos[0].visible = acoplamento || varrendo;
    pulsos[0].position.set(K.lerp(-0.42, 0.42, fase), LINHAS[varrendo ? linhaAtiva : indiceX], 0.075);
    pulsos[1].visible = acoplamento && fase > 0.34;
    pulsos[1].position.set(COLUNAS[indiceY], K.lerp(LINHAS[indiceX], -0.82, K.faixa(fase, 0.34, 1)), 0.09);
    pulsos[1].scale.setScalar(K.lerp(0.93, 0.45, atenuacao));
    pulsos[2].visible = mostrarChip && varrendo;
    pulsos[2].position.set(0, K.lerp(-0.67, -0.88, fase), 0.105);
    medidor.visible = acoplamento;
    medidor.userData.barras.forEach((barra, i) => barra.material.color.setHex(i < 9 - Math.round(atenuacao * 5) ? AZUL : 0x34546a));
  }

  function cena(tc, _t, planoForcado) {
    const B = planoForcado ? { plano: planoForcado, p: 0, q: 0, inicio: 0, dur: 1, t: 0 } : K.blocoEm(blocos, tc);
    const plano = B.plano;
    const estagio = ESTAGIOS[plano];
    const final = estagio === 'final';
    const inteiro = estagio === 'inicio' || estagio === 'foto';
    const explodido = estagio === 'explodido';
    const mostrarChip = estagio === 'chip' || explodido;
    const abrir = explodido ? K.suave(K.faixa(B.p, 0.06, 0.75)) : 0;
    const zoom = estagio === 'foto' ? 1 + 0.78 * K.suave(K.faixa(B.p, 0.25, 0.85)) : 1;
    const toqueContinuo = planoForcado ? null : estadoDoToque(tc);
    if (toqueContinuo) cameraDoToque(tc);
    else camera(plano, B.p);
    atuar(plano, tc, B.p);
    if (toqueContinuo) {
      menino.g.position.set(-0.71, 0, -0.37);
      menino.cabeca.rotation.y += 0.38 + 0.22 * toqueContinuo.avanco;
      menino.cabeca.rotation.x += 0.16 * toqueContinuo.avanco;
      menino.corpo.rotation.z = -0.12 * toqueContinuo.avanco;
      menino.apontar(0.2 + 0.3 * toqueContinuo.avanco);
    }
    suporte.visible = telefone.visible = !final;
    telefone.position.set(0.43, 1.41 + (plano === 'imagem' ? (1 - K.suave(B.p)) * 0.24 : 0), 0.015);
    telefone.rotation.set(-0.025, plano === 'falha' ? -0.13 + 0.33 * B.p : 0.11 - 0.18 * abrir, 0.04 * abrir);
    corpo.position.set(-0.43 * abrir, 0.12 * abrir, -0.38 * abrir);
    visor.visible = inteiro || explodido;
    visor.position.set(-0.28 * abrir, -0.2 * abrir, 0.012 - 0.14 * abrir);
    visor.userData.tela.desenhar(estagio === 'foto' ? 'foto' : 'inicio', zoom);
    const deslocamentoVidro = plano === 'duas_tiras' ? 0.18 * (1 - K.suave(B.q)) : 0;
    vidro.position.set(0.27 * abrir, 0.25 * abrir + deslocamentoVidro, (inteiro ? 0.062 : 0.139) + 0.27 * abrir + deslocamentoVidro);
    vidro.material.opacity = inteiro ? 0.075 : explodido ? 0.26 : 0.16;
    malha.visible = !inteiro && !final;
    malha.position.set(0.04 * abrir, 0.06 * abrir, 0.035 + 0.075 * abrir);
    chip.visible = cabo.visible = mostrarChip;
    const chegadaChip = plano === 'encaixar_chip' ? 1 - K.suave(K.faixa(B.q, 0.1, 0.72)) : 0;
    chip.position.set(-0.04 - 0.33 * abrir + chegadaChip * 0.53, -0.83 + 0.31 * abrir - 0.16 * chegadaChip, 0.136 + 0.4 * abrir);
    cabo.visible = mostrarChip && abrir < 0.55;
    cabo.scale.y = K.lerp(1, 0.2, chegadaChip);
    placa.visible = final;
    placa.position.set(0.36, final ? 0.06 : 0, 0.37);
    placa.rotation.y = -0.045;
    if (final && logo) logo.em(B.t);

    dedos.forEach((objeto) => { objeto.visible = false; });
    ondas.forEach((objeto) => { objeto.visible = false; });
    if (plano === 'capa' || plano === 'gancho') {
      mostrarDedo(0, PONTO, K.lerp(0.19, 0.024, K.suave(B.p)), 0, tc);
      telefone.updateMatrixWorld(true);
      const alvo = telefone.localToWorld(new THREE.Vector3(PONTO[0], PONTO[1], 0.16)).toArray();
      circulo.em(alvo, 130, plano === 'capa' ? 0.35 : B.t + 0.18);
    }
    if (plano === 'falha' || plano === 'canto') mostrarDedo(0, plano === 'canto' ? [-0.32, -0.54] : PONTO, 0.14 * Math.abs(Math.cos(B.p * Math.PI * 2)), 0, tc);
    if (toqueContinuo?.visivel) {
      const afastamento = 1 - toqueContinuo.avanco;
      const [x, y] = PONTO;
      mostrarDedo(0, [x + 0.59 * afastamento, y + 0.18 * afastamento], 0.018 + 0.35 * afastamento, 0.85 * toqueContinuo.sinal, tc);
    } else if ((!toqueContinuo && plano === 'toque') || plano === 'controlador') {
      mostrarDedo(0, PONTO, 0.15 * (1 - K.suave(K.faixa(B.p, 0, 0.27))), 0.8, tc);
    }
    if (plano === 'dois_toques') {
      mostrarDedo(0, PONTO, 0.012, 0.92, tc);
      mostrarDedo(1, SEGUNDO_PONTO, 0.019, 0.92, tc);
    }
    if (plano === 'zoom') {
      mostrarDedo(0, [PONTO[0] + 0.105 * (zoom - 1), PONTO[1] + 0.18 * (zoom - 1)], 0.018, 0.64, tc);
      mostrarDedo(1, [SEGUNDO_PONTO[0] - 0.13 * (zoom - 1), SEGUNDO_PONTO[1] - 0.12 * (zoom - 1)], 0.018, 0.64, tc);
    }
    if (malha.visible) mostrarGrade(plano, B, tc, mostrarChip, toqueContinuo);
    if (rotulos[plano]) rotulos[plano].em({ tela: [540, 460] }, B.t);
    if (etiquetas[plano]) etiquetas[plano].em({ tela: [540, 410] }, B.t);
    if (SONS[plano]) {
      const [som, momento] = SONS[plano];
      K.som(som, plano === 'toque' && toqueContinuo ? toqueContinuo.contato : B.inicio + B.dur * momento);
    }
  }

  window.CENA = { montar, cena, capa: () => cena(0, 0, 'capa') };
})();

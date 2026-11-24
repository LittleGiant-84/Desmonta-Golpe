// Biblioteca compartilhada de peças, personagens articulados e modelos GLB.
(function () {
  const modelos = new Map();

  K.carregarModelos = async function (lista) {
    if (!lista.length) return;
    if (!window.FABRICA_GLTF) throw new Error('O suporte a modelos GLB não foi preparado.');
    const loader = new FABRICA_GLTF.Loader();
    await Promise.all(lista.map(async item => modelos.set(item.id, await loader.loadAsync(item.url))));
    const gerador = new THREE.PMREMGenerator(K.renderer);
    const ambiente = new FABRICA_GLTF.Ambiente();
    const textura = gerador.fromScene(ambiente, 0.04).texture;
    if (K.registrarAmbienteModelos) K.registrarAmbienteModelos(textura);
    else K.scene.environment = textura;
    ambiente.dispose();
    gerador.dispose();
  };

  K.modelo = function (id, op = {}) {
    const original = modelos.get(id);
    if (!original) throw new Error('Declare o modelo no roteiro antes de usar K.modelo: ' + id);
    const raiz = FABRICA_GLTF.clonar(original.scene);
    raiz.updateMatrixWorld(true);
    const limites = new THREE.Box3().setFromObject(raiz);
    const tamanho = limites.getSize(new THREE.Vector3());
    const centro = limites.getCenter(new THREE.Vector3());
    const escala = op.altura != null ? op.altura / tamanho.y : 1;
    if (!Number.isFinite(escala) || escala <= 0) throw new Error('Modelo com altura inválida.');
    const g = new THREE.Group();
    const normalizado = new THREE.Group();
    normalizado.scale.setScalar(escala);
    raiz.position.sub(new THREE.Vector3(centro.x, limites.min.y, centro.z));
    normalizado.add(raiz);
    g.add(normalizado);
    K.scene.add(g);
    raiz.traverse(obj => { if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; } });
    const mixer = new THREE.AnimationMixer(raiz);
    const acoes = new Map(original.animations.map(clip => [clip.name, mixer.clipAction(clip)]));
    function ativar(nome, peso, repetir) {
      const acao = acoes.get(nome);
      if (!acao) throw new Error('Animação desconhecida: ' + nome + '. Disponíveis: ' + [...acoes.keys()].join(', '));
      acao.reset().setLoop(repetir ? THREE.LoopRepeat : THREE.LoopOnce, repetir ? Infinity : 1);
      acao.clampWhenFinished = !repetir;
      acao.setEffectiveWeight(peso).play();
    }
    return {
      g, raiz, animacoes: [...acoes.keys()],
      em(tempo, estado = {}) {
        mixer.stopAllAction();
        const atual = estado.acao || original.animations[0]?.name;
        if (!atual) return;
        const mistura = estado.anterior ? K.clamp(estado.mistura ?? 1) : 1;
        if (estado.anterior && estado.anterior !== atual) ativar(estado.anterior, 1 - mistura, estado.repetir !== false);
        ativar(atual, estado.anterior === atual ? 1 : mistura, estado.repetir !== false);
        mixer.setTime(Math.max(0, tempo));
        raiz.updateMatrixWorld(true);
      },
      expressao(nome, valor) {
        raiz.traverse(obj => {
          const indice = obj.morphTargetDictionary?.[nome];
          if (indice != null) obj.morphTargetInfluences[indice] = K.clamp(valor);
        });
      },
      anexar(objeto, nome, pos = [0, 0, 0], giro = [0, 0, 0]) {
        const osso = raiz.getObjectByName(nome);
        if (!osso) throw new Error('Articulação não encontrada: ' + nome);
        osso.add(objeto);
        objeto.position.set(...pos);
        objeto.rotation.set(...giro);
      }
    };
  };

  function caixa(grupo, medidas, pos, mat) {
    const m = K.malha(new THREE.BoxGeometry(...medidas), mat);
    m.position.set(...pos);
    grupo.add(m);
    return m;
  }

  K.placaEletronica = function (op = {}) {
    const g = new THREE.Group();
    g.name = 'PlacaEletronica';
    const placa = K.mat(op.cor ?? 0x126f63, { roughness: 0.64 });
    const ouro = K.mat(0xe5bc59, { metalness: 0.55, roughness: 0.4 });
    const preto = K.mat(0x182536, { roughness: 0.58 });
    const corpo = caixa(g, [0.92, 0.62, 0.045], [0, 0, 0], placa);
    const chip = new THREE.Group();
    caixa(chip, [0.29, 0.23, 0.075], [0, 0, 0.045], preto);
    [-1, 1].forEach(lado => {
      for (let i = 0; i < 6; i++) caixa(chip, [0.069, 0.017, 0.02], [lado * 0.17, (i - 2.5) * 0.033, 0.048], ouro);
    });
    g.add(chip);
    const conectores = new THREE.Group();
    for (let i = 0; i < 10; i++) caixa(conectores, [0.032, 0.12, 0.008], [-0.35 + i * 0.077, -0.26, 0.029], ouro);
    g.add(conectores);
    const trilhas = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const lado = i % 2 ? -1 : 1;
      caixa(trilhas, [0.20, 0.011, 0.008], [lado * 0.29, 0.04 + i * 0.041, 0.028], ouro);
      caixa(trilhas, [0.012, 0.12, 0.008], [lado * 0.39, 0.10 + i * 0.023, 0.028], ouro);
    }
    g.add(trilhas);
    const led = K.malha(new THREE.SphereGeometry(0.035, 16, 10), K.mat(0x72ffd4, { emissive: 0x38e3aa, emissiveIntensity: 0.5 }));
    led.position.set(-0.33, -0.09, 0.05);
    g.add(led);
    for (const [nome, parte] of Object.entries({ Base: corpo, Chip: chip, Conectores: conectores, Trilhas: trilhas })) parte.name = nome;
    K.scene.add(g);
    return {
      g, partes: { corpo, chip, conectores, trilhas },
      abrir(valor) {
        const x = K.clamp(valor);
        chip.position.z = x * 0.32;
        conectores.position.set(0, -x * 0.13, x * 0.10);
      },
      em(t, energia = 1) { led.material.emissiveIntensity = energia * (0.45 + 0.35 * Math.sin(t * 4)); }
    };
  };

  K.bateria = function (op = {}) {
    const g = new THREE.Group();
    g.name = 'Bateria';
    const corpo = caixa(g, [0.44, 0.77, 0.09], [0, 0, 0], K.mat(op.cor ?? 0x183d65, { roughness: 0.42 }));
    caixa(g, [0.39, 0.59, 0.012], [0, 0.035, 0.052], K.mat(0xe5f6eb));
    const nivel = new THREE.Group();
    nivel.name = 'IndicadorDeCarga';
    const barras = [];
    for (let i = 0; i < 4; i++) barras.push(caixa(nivel, [0.26, 0.075, 0.015], [0, -0.13 + i * 0.115, 0.069], K.mat(0x31b995, { emissive: 0x167a57, emissiveIntensity: 0.15 })));
    g.add(nivel);
    [-1, 1].forEach(lado => caixa(g, [0.09, 0.058, 0.045], [lado * 0.10, 0.397, 0], K.mat(0xe6bf64, { metalness: 0.5 })));
    K.scene.add(g);
    return { g, partes: { corpo, nivel }, carga(x) { barras.forEach((b, i) => { b.visible = K.clamp(x) * 4 > i; }); } };
  };

  K.engrenagem = function (op = {}) {
    const g = new THREE.Group();
    g.name = 'Engrenagem';
    const raio = op.raio || 0.31, dentes = op.dentes || 12;
    const mat = K.mat(op.cor ?? 0xffae52, { metalness: 0.46, roughness: 0.37 });
    const aro = K.malha(new THREE.TorusGeometry(raio * 0.72, raio * 0.2, 12, 48), mat);
    g.add(aro);
    for (let i = 0; i < dentes; i++) {
      const a = i * Math.PI * 2 / dentes;
      const dente = caixa(g, [raio * 0.26, raio * 0.32, raio * 0.24], [Math.cos(a) * raio * 0.94, Math.sin(a) * raio * 0.94, 0], mat);
      dente.rotation.z = a - Math.PI / 2;
    }
    const miolo = K.malha(new THREE.TorusGeometry(raio * 0.18, raio * 0.09, 10, 28), mat);
    g.add(miolo);
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2;
      const haste = caixa(g, [raio * 0.13, raio * 0.60, raio * 0.24], [Math.sin(a) * raio * 0.38, Math.cos(a) * raio * 0.38, 0], mat);
      haste.rotation.z = -a;
    }
    K.scene.add(g);
    return { g, girar(t, voltasPorSegundo = 0.25) { g.rotation.z = t * Math.PI * 2 * voltasPorSegundo; } };
  };

  // Cada item representa um volume ocupado. Peças presas à mesma montagem podem compartilhar grupo.
  K.conflitosDeEspaco = function (itens, tolerancia = 0.015) {
    const volumes = [];
    for (const item of itens) {
      let visivel = true;
      for (let pai = item.obj; pai; pai = pai.parent) if (!pai.visible) visivel = false;
      if (!visivel) continue;
      item.obj.updateWorldMatrix(true, true);
      item.obj.traverse(obj => { if (obj.isSkinnedMesh) obj.skeleton.update(); });
      const caixa = item.caixa
        ? new THREE.Box3(new THREE.Vector3(...item.caixa[0]), new THREE.Vector3(...item.caixa[1])).applyMatrix4(item.obj.matrixWorld)
        : new THREE.Box3().setFromObject(item.obj, true);
      if (!caixa.isEmpty()) volumes.push({ ...item, caixa });
    }
    const conflitos = [];
    for (let i = 0; i < volumes.length; i++) {
      for (let j = i + 1; j < volumes.length; j++) {
        const a = volumes[i], b = volumes[j];
        if (a.grupo && a.grupo === b.grupo) continue;
        const intersecao = a.caixa.clone().intersect(b.caixa);
        if (intersecao.isEmpty()) continue;
        const tamanho = intersecao.getSize(new THREE.Vector3());
        if (Math.min(tamanho.x, tamanho.y, tamanho.z) > tolerancia) {
          conflitos.push({ a: a.nome, b: b.nome, profundidade: tamanho.toArray() });
        }
      }
    }
    return conflitos;
  };

  K.apresentador = function (op = {}) {
    const b = K.boneco(op);
    const baixo = new THREE.Vector3(0, -1, 0);
    const alvoLocal = new THREE.Vector3();
    const ombroMundo = new THREE.Vector3();
    const fim = new THREE.Vector3();
    const direcao = new THREE.Vector3();
    const polo = new THREE.Vector3();
    const meio = new THREE.Vector3();

    b.olhar = function (alvo, peso = 1) {
      b.corpo.updateWorldMatrix(true, false);
      alvoLocal.copy(b.corpo.worldToLocal(new THREE.Vector3(...alvo))).sub(b.cabeca.position);
      const x = Math.atan2(alvoLocal.x, alvoLocal.z);
      const y = -Math.atan2(alvoLocal.y, Math.hypot(alvoLocal.x, alvoLocal.z));
      b.cabeca.rotation.y = K.lerp(b.cabeca.rotation.y, K.clamp(x, -0.7, 0.7), K.clamp(peso));
      b.cabeca.rotation.x = K.lerp(b.cabeca.rotation.x, K.clamp(y, -0.45, 0.45), K.clamp(peso));
    };

    // Resolve o braço de dois segmentos no espaço local do tronco.
    b.alcancar = function (alvo, lado = 1, peso = 1) {
      const i = lado < 0 ? 0 : 1;
      const braco = b.bracos[i];
      b.g.updateMatrixWorld(true);
      alvoLocal.copy(b.corpo.worldToLocal(new THREE.Vector3(...alvo)));
      ombroMundo.copy(braco.ombro.position);
      direcao.subVectors(alvoLocal, ombroMundo);
      const distancia = K.clamp(direcao.length(), 0.035, 0.529);
      if (direcao.lengthSq() < 1e-12) direcao.copy(baixo);
      direcao.normalize();
      fim.copy(ombroMundo).addScaledVector(direcao, distancia);
      polo.set(lado < 0 ? -0.5 : 0.5, -0.15, 0.65);
      polo.addScaledVector(direcao, -polo.dot(direcao));
      if (polo.lengthSq() < 1e-10) {
        polo.set(Math.abs(direcao.y) < 0.9 ? 0 : 1, Math.abs(direcao.y) < 0.9 ? 1 : 0, 0);
        polo.addScaledVector(direcao, -polo.dot(direcao));
      }
      polo.normalize();
      const l1 = 0.28, l2 = 0.25;
      const projecao = (l1 * l1 - l2 * l2 + distancia * distancia) / (2 * distancia);
      const altura = Math.sqrt(Math.max(0, l1 * l1 - projecao * projecao));
      meio.copy(ombroMundo).addScaledVector(direcao, projecao).addScaledVector(polo, altura);
      const qOmbro = new THREE.Quaternion().setFromUnitVectors(baixo, meio.clone().sub(ombroMundo).normalize());
      braco.ombro.quaternion.slerp(qOmbro, K.clamp(peso));
      const antebraco = fim.clone().sub(meio).normalize().applyQuaternion(qOmbro.clone().invert());
      braco.cotovelo.quaternion.slerp(new THREE.Quaternion().setFromUnitVectors(baixo, antebraco), K.clamp(peso));
      b.g.updateMatrixWorld(true);
      return b.mao(i);
    };

    b.prenderNaMao = function (objeto, lado = 1, pos = [0, -0.02, 0.055], giro = [0, 0, 0]) {
      const mao = b.maos[lado < 0 ? 0 : 1];
      mao.add(objeto);
      objeto.position.set(...pos);
      objeto.rotation.set(...giro);
    };
    return b;
  };
})();

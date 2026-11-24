// Acabamento de luz e materiais. Não altera geometria, cores-base, poses ou câmeras das cenas.
(function () {
  function validarVisual(valor = {}) {
    const op = typeof valor === 'string' ? { perfil: valor } : valor;
    if (!op || Array.isArray(op) || typeof op !== 'object') throw new Error('visual deve ser um objeto ou o nome do perfil.');
    const perfil = op.perfil || 'original';
    if (!['original', 'cartoon'].includes(perfil)) throw new Error('Perfil visual desconhecido: ' + perfil);
    const numero = (nome, padrao, min, max) => {
      const n = op[nome] ?? padrao;
      if (!Number.isFinite(n) || n < min || n > max) throw new Error(`visual.${nome} deve ficar entre ${min} e ${max}.`);
      return n;
    };
    return { perfil, exposicao: numero('exposicao', 1.05, 0.5, 2), reflexos: numero('reflexos', 0.8, 0, 2), alcanceSombras: numero('alcanceSombras', 12, 4, 40) };
  }
  if (typeof module === 'object' && module.exports) { module.exports = { validarVisual }; return; }

  const S = { config: validarVisual(), originais: null, ambienteBase: null, ambiente: null, luz: null, ceu: ['dia'], materiais: new WeakMap(), css: null };
  const frente = new THREE.Vector3(), direita = new THREE.Vector3();

  function ambienteSuave() {
    if (S.ambiente) return S.ambiente.texture;
    const sala = new THREE.Scene();
    sala.background = new THREE.Color().setRGB(0.17, 0.20, 0.25);
    const recursos = [];
    const painel = (pos, tamanho, cor, forca) => {
      const geo = new THREE.PlaneGeometry(...tamanho);
      const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
      mat.color.setHex(cor).multiplyScalar(forca);
      const m = new THREE.Mesh(geo, mat); m.position.set(...pos); m.lookAt(0, 0, 0); sala.add(m);
      recursos.push(geo, mat);
    };
    // Luzes amplas desenhadas por código: nenhuma textura ou HDR externo.
    painel([2.5, 4, 3], [4.5, 3.5], 0xfff1df, 3.2);
    painel([-4, 1, 2], [2.5, 4], 0xc9e8ff, 1.5);
    painel([1, 2, -4], [2.5, 3], 0xffffff, 2.8);
    painel([0, 5, 0], [5, 5], 0xffffff, 1.2);
    const gerador = new THREE.PMREMGenerator(K.renderer);
    try { S.ambiente = gerador.fromScene(sala, 0.06, 0.1, 30); }
    finally { recursos.forEach(r => r.dispose()); gerador.dispose(); }
    return S.ambiente.texture;
  }
  function guardarOriginais() {
    if (S.originais) return;
    const r = K.renderer, s = K.sol.shadow, c = s.camera;
    S.originais = {
      toneMapping: r.toneMapping, exposure: r.toneMappingExposure, colorSpace: r.outputColorSpace,
      tipoSombra: r.shadowMap.type, radius: s.radius, blurSamples: s.blurSamples, bias: s.bias, normalBias: s.normalBias,
      camera: { left: c.left, right: c.right, top: c.top, bottom: c.bottom }
    };
    S.ambienteBase = K.scene.environment;
  }
  K.configurarVisual = function (valor) {
    guardarOriginais();
    S.config = validarVisual(valor);
    const ativo = S.config.perfil === 'cartoon', r = K.renderer, sombra = K.sol.shadow, original = S.originais;
    if (!S.css) {
      S.css = document.createElement('style');
      S.css.textContent = '.redondo.visual-cartoon canvas{filter:saturate(1.04) contrast(1.02)}.visual-cartoon .vinheta{opacity:.55}';
      document.head.appendChild(S.css);
    }
    K.palco.classList.toggle('visual-cartoon', ativo);
    if (ativo) {
      if (!S.luz) {
        S.luz = new THREE.DirectionalLight(0xd8ebff, 0);
        S.luz.name = 'PreenchimentoCartoon'; K.scene.add(S.luz, S.luz.target);
      }
      r.outputColorSpace = THREE.SRGBColorSpace;
      r.toneMapping = THREE.ACESFilmicToneMapping;
      r.toneMappingExposure = S.config.exposicao;
      K.scene.environment = ambienteSuave();
      r.shadowMap.type = THREE.VSMShadowMap;
      sombra.radius = 3.5; sombra.blurSamples = 8; sombra.bias = -0.00025; sombra.normalBias = 0.008;
      const alcance = S.config.alcanceSombras;
      Object.assign(sombra.camera, { left: -alcance, right: alcance, top: alcance, bottom: -alcance });
    } else {
      r.outputColorSpace = original.colorSpace; r.toneMapping = original.toneMapping; r.toneMappingExposure = original.exposure;
      K.scene.environment = S.ambienteBase;
      r.shadowMap.type = original.tipoSombra;
      Object.assign(sombra, { radius: original.radius, blurSamples: original.blurSamples, bias: original.bias, normalBias: original.normalBias });
      Object.assign(sombra.camera, original.camera);
      if (S.luz) S.luz.intensity = 0;
    }
    sombra.camera.updateProjectionMatrix(); r.shadowMap.needsUpdate = true;
    K.ceu(...S.ceu);
    K.atualizarVisual();
    return { ...S.config };
  };
  K.registrarAmbienteModelos = function (textura) {
    S.ambienteBase = textura;
    if (S.config.perfil !== 'cartoon') K.scene.environment = textura;
  };
  K.atualizarLuzVisual = function (a, b, x) {
    S.ceu = [a, b, x];
    if (S.config.perfil !== 'cartoon') return;
    K.hemi.intensity *= 0.84;
    K.sol.intensity *= 0.95;
  };
  K.atualizarVisual = function () {
    const ativo = S.config.perfil === 'cartoon';
    if (S.luz) {
      S.luz.visible = ativo;
      S.luz.intensity = ativo ? K.hemi.intensity * 0.24 : 0;
      if (ativo) {
        const cam = K.dividida ? K.camCima : K.camera;
        cam.getWorldDirection(frente); direita.set(1, 0, 0).applyQuaternion(cam.quaternion);
        S.luz.position.copy(cam.position).addScaledVector(direita, -3); S.luz.position.y += 2;
        S.luz.target.position.copy(cam.position).addScaledVector(frente, 8); S.luz.target.updateMatrixWorld();
        if (K.contra) K.contra.intensity = K.hemi.intensity * 0.42;
      }
    }
    K.scene.traverse(obj => {
      for (const m of Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : []) {
        if (!m.isMeshStandardMaterial || m.envMap) continue;
        if (!S.materiais.has(m)) S.materiais.set(m, m.envMapIntensity);
        const original = S.materiais.get(m);
        const peso = m.metalness > 0.25 ? 1 : 0.28;
        m.envMapIntensity = ativo ? original * S.config.reflexos * peso : original;
      }
    });
  };
  K.estadoVisual = () => ({ ...S.config });
})();

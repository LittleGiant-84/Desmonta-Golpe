// Ambientes físicos reutilizáveis. A fachada e o teto são retirados para a câmera ver o interior.
(function () {
  K.casaEmCorte = function (op = {}) {
    const g = new THREE.Group(); K.scene.add(g);
    const colisoes = [], materiaisParede = [];
    function caixa(pai, tam, pos, cor, nome, op = {}) {
      const m = K.malha(new THREE.BoxGeometry(...tam), K.mat(cor, op)); m.position.set(...pos); pai.add(m);
      if (nome) colisoes.push({ nome, obj: m, grupo: pai !== g ? pai.name || undefined : undefined }); return m;
    }
    function placa(texto, pos, largura = 0.8, fundo = '#fff8e8') {
      const m = K.placa(texto, { larg: largura, alt: 0.22, fundo, cor: '#254059', borda: '#365168' }); m.position.set(...pos); g.add(m); return m;
    }
    const fundo = K.malha(new THREE.PlaneGeometry(100, 100), K.mat(0xc7dce5)); fundo.rotation.x = -Math.PI / 2; fundo.position.y = -0.12; g.add(fundo);
    caixa(g, [5.55, 0.10, 3.60], [0, -0.05, 0.25], 0xe9ddca, 'piso da casa');
    caixa(g, [2.58, 0.012, 3.40], [-1.35, 0.007, 0.25], 0xd6b58f);
    caixa(g, [2.58, 0.012, 3.40], [1.35, 0.007, 0.25], 0xa7c6d8);
    for (let i = 0; i < 12; i++) caixa(g, [2.57, 0.002, 0.012], [-1.35, 0.015, -1.36 + i * 0.28], 0xc09b73);
    const traseiraSala = caixa(g, [2.65, 2.10, 0.10], [-1.375, 1.05, -1.50], 0xf2dfc3, 'parede do fundo da sala');
    if (!op.quartoDosFundos) caixa(g, [2.65, 2.10, 0.10], [1.375, 1.05, -1.50], 0xc5dfeb, 'parede do fundo do quarto');
    caixa(g, [0.10, 2.10, 3.0], [-2.75, 1.05, 0], 0xf2dfc3, 'parede externa da sala');
    caixa(g, [0.10, op.quartoDosFundos ? 0.42 : 2.10, 3.0], [2.75, op.quartoDosFundos ? 0.21 : 1.05, 0], 0xc5dfeb, 'parede externa do quarto');
    const divisoria = caixa(g, [0.105, 2.10, 1.95], [0, 1.05, -0.525], 0xe2b18a, 'parede entre sala e quarto');
    materiaisParede.push(divisoria.material);
    caixa(g, [0.14, 0.28, 1.00], [0, 1.96, 0.94], 0xd59c73, 'viga sobre a porta');
    caixa(g, [0.14, 1.82, 0.075], [0, 0.91, 1.465], 0xd59c73, 'batente frontal da porta');
    // Juntas dos tijolos tornam a parede reconhecível, sem abrir furos.
    for (const lado of [-1, 1]) for (let y = 0; y < 9; y++) {
      caixa(g, [0.006, 0.007, 1.94], [lado * 0.056, 0.15 + y * 0.215, -0.525], 0xeed1b1);
      for (let z = 0; z < 5; z++) caixa(g, [0.006, 0.205, 0.007], [lado * 0.056, 0.25 + y * 0.215, -1.45 + z * 0.40 + (y % 2) * 0.16], 0xeed1b1);
    }
    caixa(g, [0.14, 1.82, 0.06], [0, 0.91, 0.48], 0xd59c73);
    const porta = new THREE.Group(); porta.name = 'porta'; porta.position.set(0, 0, 0.51); g.add(porta);
    caixa(porta, [0.070, 1.77, 0.86], [0, 0.89, 0.43], 0xbd8053, 'porta entre os cômodos');
    caixa(porta, [0.082, 0.90, 0.65], [0, 0.98, 0.43], 0xd29768);
    const macaneta = K.malha(new THREE.SphereGeometry(0.035, 16, 10), K.mat(0xf4ca63, { metalness: 0.65 })); macaneta.position.set(-0.065, 0.90, 0.80); porta.add(macaneta);
    function janela(x) {
      caixa(g, [0.72, 0.62, 0.035], [x, 1.43, -1.43], 0x8ec9e8);
      for (const dx of [-0.36, 0.36]) caixa(g, [0.035, 0.68, 0.06], [x + dx, 1.43, -1.40], 0xf9f1df);
      for (const dy of [-0.32, 0.32]) caixa(g, [0.75, 0.035, 0.06], [x, 1.43 + dy, -1.40], 0xf9f1df);
      caixa(g, [0.025, 0.61, 0.055], [x, 1.43, -1.39], 0xf9f1df);
    }
    janela(-1.95); if (!op.quartoDosFundos) janela(1.85);
    placa('SALA', [-1.30, 1.98, -1.39], 0.70, '#fff1d5'); placa('QUARTO', [1.30, 1.98, -1.39], 0.90, '#e4f4ff');
    const sofa = new THREE.Group(); sofa.name = 'sofa'; g.add(sofa);
    caixa(sofa, [1.25, 0.35, 0.58], [-1.65, 0.29, -1.10], 0xdd8957, 'assento do sofá');
    caixa(sofa, [1.30, 0.65, 0.16], [-1.65, 0.52, -1.35], 0xc97648, 'encosto do sofá');
    for (const x of [-2.28, -1.02]) caixa(sofa, [0.13, 0.35, 0.57], [x, 0.48, -1.08], 0xd38050, 'braço do sofá');
    caixa(sofa, [0.36, 0.25, 0.12], [-1.92, 0.55, -1.21], 0xf3c075);
    const tv = caixa(g, [0.68, 0.42, 0.05], [-0.65, 1.29, -1.39], 0x173a56);
    caixa(g, [0.61, 0.34, 0.018], [-0.65, 1.29, -1.35], 0x418dba);
    const rack = new THREE.Group(); rack.name = 'rack'; g.add(rack);
    caixa(rack, [0.85, 0.66, 0.45], [-1.20, 0.38, 0.10], 0x865f47, 'rack do roteador');
    caixa(rack, [0.89, 0.055, 0.49], [-1.20, 0.745, 0.10], 0xd7b890, 'tampo do rack');
    for (const x of [-1.47, -0.93]) caixa(rack, [0.07, 0.15, 0.07], [x, 0.075, 0.10], 0x344b59);
    const estante = new THREE.Group(); estante.name = 'estante'; g.add(estante);
    caixa(estante, [0.70, 0.055, 0.38], [-1.15, 1.285, -0.75], 0xdfc59a, 'prateleira aberta para o roteador');
    for (const x of [-1.46, -0.84]) caixa(estante, [0.06, 1.26, 0.06], [x, 0.63, -0.75], 0x5b7888, 'suporte da prateleira');
    const cama = new THREE.Group(); cama.name = 'cama'; cama.position.z = 0.07; g.add(cama);
    caixa(cama, [1.25, 0.25, 1.65], [1.85, 0.23, -0.65], 0x8c715b, 'base da cama');
    caixa(cama, [1.20, 0.16, 1.60], [1.85, 0.43, -0.65], 0xf2eee3, 'colchão');
    caixa(cama, [1.23, 0.055, 1.14], [1.85, 0.54, -0.38], 0x4784c5, 'cobertor');
    caixa(cama, [1.28, 0.84, 0.10], [1.85, 0.47, -1.43], 0x345b7c, 'cabeceira da cama');
    for (const x of [1.55, 2.15]) caixa(cama, [0.47, 0.12, 0.31], [x, 0.56, -1.17], 0xf8dfbc);
    caixa(g, [0.98, 0.018, 0.58], [1.80, 0.028, 0.74], 0x6ea4bf);
    const xCriado = op.quartoDosFundos ? 0.20 : 0.55;
    const criado = caixa(g, [0.30, 0.80, 0.32], [xCriado, 0.40, -0.42], 0xcaa779, 'criado-mudo do celular');
    caixa(g, [0.23, 0.12, 0.012], [xCriado, 0.63, -0.252], 0xa8835d);
    // Terceiro cômodo ao fundo: a passagem ocupa uma abertura real na parede do quarto da frente.
    let fundos = null;
    if (op.quartoDosFundos) {
      const quartoFundos = new THREE.Group(); quartoFundos.name = 'quarto-dos-fundos'; g.add(quartoFundos);
      caixa(g, [2.75, 0.10, 2.95], [1.375, -0.05, -3.025], 0xe6d8c8, 'piso do quarto dos fundos');
      caixa(g, [2.60, 0.012, 2.88], [1.375, 0.008, -3.00], 0xc7b5d9);
      caixa(g, [0.2675, 2.10, 0.10], [0.18625, 1.05, -1.50], 0xc5dfeb, 'parede à esquerda da passagem dos fundos');
      caixa(g, [1.255, 2.10, 0.10], [2.0725, 1.05, -1.50], 0xc5dfeb, 'parede à direita da passagem dos fundos');
      caixa(g, [1.125, 0.28, 0.14], [0.8825, 1.96, -1.50], 0xc4abd4, 'viga sobre a porta dos fundos');
      for (const x of [0.33, 1.435]) caixa(g, [0.055, 1.82, 0.14], [x, 0.91, -1.50], 0xbd9671);
      caixa(g, [0.10, 2.10, 2.95], [0, 1.05, -3.025], 0xd1bfe1, 'parede lateral do quarto dos fundos');
      caixa(g, [2.65, 2.10, 0.10], [1.375, 1.05, -4.50], 0xd1bfe1, 'parede traseira do quarto dos fundos');
      // Lateral direita em corte, para a câmera acompanhar a entrada sem atravessar uma parede opaca.
      caixa(g, [0.10, 0.42, 2.95], [2.75, 0.21, -3.025], 0xd1bfe1, 'parede em corte do quarto dos fundos');
      const portaFundos = new THREE.Group(); portaFundos.name = 'porta-fundos'; portaFundos.position.set(0.365, 0, -1.50); g.add(portaFundos);
      const folhaFundos = caixa(portaFundos, [1.04, 1.77, 0.07], [0.52, 0.89, 0], 0xa07cb6);
      // Faixas estreitas preservam o volume da folha girando, sem testar o vazio da sua caixa diagonal.
      for (let i = 0; i < 16; i++) colisoes.push({ nome: 'porta do quarto dos fundos ' + i, obj: folhaFundos, grupo: 'porta-fundos', caixa: [[-0.52 + i * 0.065, -0.885, -0.035], [-0.455 + i * 0.065, 0.885, 0.035]] });
      caixa(portaFundos, [0.82, 0.90, 0.08], [0.52, 0.98, 0], 0xc2a3d1);
      const puxador = K.malha(new THREE.SphereGeometry(0.035, 16, 10), K.mat(0xf4ca63)); puxador.position.set(0.92, 0.90, 0.065); portaFundos.add(puxador);
      caixa(quartoFundos, [1.08, 0.26, 1.35], [1.96, 0.24, -3.66], 0x947460, 'base da cama dos fundos');
      caixa(quartoFundos, [1.05, 0.15, 1.32], [1.96, 0.445, -3.66], 0xf3eddf, 'colchão dos fundos');
      caixa(quartoFundos, [1.06, 0.055, 0.92], [1.96, 0.55, -3.48], 0xa17fc0, 'cobertor dos fundos');
      caixa(quartoFundos, [1.12, 0.83, 0.09], [1.96, 0.49, -4.35], 0x77568e, 'cabeceira dos fundos');
      caixa(quartoFundos, [0.64, 0.12, 0.26], [1.96, 0.56, -4.08], 0xffe1a6);
      caixa(g, [0.75, 0.015, 0.65], [0.82, 0.022, -2.85], 0xe9cf9e);
      placa('QUARTO DOS FUNDOS', [1.35, 1.96, -4.39], 2.08, '#f3e7ff');
      fundos = { g: quartoFundos, porta: portaFundos, entrada: [0.82, 0, -1.50], posicao: [1.00, 0, -3.00] };
    }
    const armario = new THREE.Group(); armario.name = 'armario'; g.add(armario);
    caixa(armario, [0.40, 1.65, 0.44], [0, 0.825, 0], 0x8c9ca6, 'armário metálico');
    caixa(armario, [0.018, 1.52, 0.37], [-0.214, 0.825, 0], 0xb7c3c9, null, { metalness: 0.65, roughness: 0.3 });
    caixa(armario, [0.025, 0.20, 0.035], [-0.24, 0.88, 0.11], 0x3c5c6e);
    armario.position.set(-0.50, 0, -0.95);
    if (op.armario === false) {
      armario.visible = false;
      for (let i = colisoes.length - 1; i >= 0; i--) if (colisoes[i].grupo === 'armario') colisoes.splice(i, 1);
    }
    return { g, rack, estante, sofa, cama, criado, divisoria, porta, armario, macaneta, colisoes, materiaisParede, fundos,
      atualizar(abertura, metalNoCaminho, aberturaFundos = 0) {
        porta.rotation.y = -Math.PI / 2 * abertura;
        armario.position.z = K.lerp(-0.95, 0.10, metalNoCaminho);
        if (fundos) fundos.porta.rotation.y = Math.PI / 2 * aberturaFundos;
      }
    };
  };
})();

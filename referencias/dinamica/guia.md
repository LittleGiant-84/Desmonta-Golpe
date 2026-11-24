# Referência de dinâmica enviada pelo usuário

Referência local: `referencia-usuario.mp4`, cópia preservada do arquivo enviado `Download (1).mp4`, em 11/11/2026.
Vídeo vertical, 576×1024, 30 fps, duração de 49,761 s. Usar para estudar encenação e ritmo; identidade, personagem,
assunto, texto e cenário das produções são os do canal configurado em `canal/`.

## O que foi observado

- 0–2 s: aproximação para apresentar o personagem, com uma reação facial logo no começo.
- 2–8 s: deslocamentos laterais pequenos, personagem gesticulando, boca e sobrancelhas mudando; elementos da
  explicação aparecem e mudam enquanto o enquadramento acompanha a ação.
- 14–16 s: mudança de expressão e indicação visual junto do assunto explicado.
- 16–22 s: passagem para outro ambiente e reações no rosto; o cenário ajuda a mostrar a comparação da fala.
- Ao longo do vídeo: personagem com presença no quadro, legendas por palavra, rótulos de apoio e mudanças de
  cenário por bloco de assunto. Algumas passagens usam movimento lateral rápido. A tela final da plataforma
  não faz parte da referência para as nossas entregas.

## Como adaptar ao canal

Manter o menino de moletom azul e laranja, o 3D arredondado, as peças e a voz Yuri. A referência orienta o ritmo;
prevalece o pedido do usuário por mais animações e interações, um pouco de zoom e menos cortes.

1. Abrir com aproximação breve e moderada; no carregador, a aproximação efetiva medida ficou em cerca de 10%.
2. Dar mais presença ao apresentador, preservando mãos, cabeça e pés dentro do quadro e espaço entre os objetos.
3. Animar a boca pelos tempos das palavras da narração e voltar ao repouso nas pausas. É uma articulação cartoon
   por palavras, sem reprodução precisa dos fonemas. Usar tempo real para a boca, inclusive se a ação congelar.
4. Alternar olhar, piscadas, expressões e gestos para cada ideia; transição de cerca de 0,45 s entre as ações.
5. Mostrar mão e peça interagindo de verdade, com alcance e contato conferidos. A reação deve acontecer junto da fala.
6. Usar deslocamentos laterais curtos e aproximações nas revelações, mantendo a continuidade entre as falas.
   As trajetórias longas podem durar 8–15 s; a aproximação de abertura dura cerca de 2 s.
7. Posicionar os rótulos junto da região da demonstração, acompanhando a câmera. Trocar de ambiente quando o
   assunto pedir; evitar adotar todas as passagens rápidas da referência, pois o usuário pediu poucos cortes.

## Implementação e conferência

Direção em `canal/movimento.json`; motor em `motor/animacao.js`; aplicação em `videos/carregador-sem-fio/cena.js`.
O render reaproveita as narrações em cache. O arquivo de referência fica apenas local, coberto pelo ignore de MP4.
`npm run conferir-animacao` confere continuidade, boca ativa e em pausa, poses fora de ordem, contato das mãos,
espaço, área útil e aproximação inicial. As prévias ficam na pasta de testes da produção.

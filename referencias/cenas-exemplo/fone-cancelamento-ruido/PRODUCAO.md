# Retomar a produção do fone

Roteiro e direção aprovados em 13/11/2026. Personagem, ônibus, fone original, componentes, sinais e prévia visual implementados. Voz principal: Yuri.

## Economia

- Cenário, modelos, movimentos e ambiente sonoro criados localmente, sem gerador de imagem/vídeo pago.
- Uma fala final idêntica foi reaproveitada do cache de outro episódio. As outras 35 foram geradas uma vez, com 1542 caracteres; reutilizar os arquivos de narracao/.
- Não mudar o texto aprovado para corrigir animação. Fazer revisões na cena e nos tempos.
- Usar conferência local e prévia leve antes do Full HD/60 fps.

## Estado em 14/11/2026

**Entrega atual:** video.mp4, 92,443 s, 1080×1920/60 fps. O usuário aprovou voz e animação e pediu retirar o zumbido de fundo. Revisão concluída: ambiente somente na comparação entre 75,512713 e 77,212713 s, zero amostras da faixa ambiente fora desse intervalo. A imagem codificada foi preservada integralmente (SHA-256 idêntico), e o áudio usa as 36 falas salvas, sem chamada à ElevenLabs. MP4 inteiro conferido; áudio -16,58 LUFS e pico -3,40 dBFS. Capa e publicacao.md acompanham. Relatório em testes/conferencia-sem-zumbido.json; aguardar opinião sobre a revisão e publicação.

Chave atualizada pelo usuário e narração Yuri gerada com sucesso: 35 falas novas, 1542 caracteres, uma fala final reaproveitada. As 36 falas estão em narracao/ e novas renderizações não precisam gerar voz novamente. Nunca abrir ou registrar o conteúdo do .env.

Duração real da timeline: 92,442755 s, incluindo comparação sonora e cartão. Movimentos de colocar o fone, botão, diafragma e rótulos do resumo alinhados às palavras. Ambiente regenerado com o alinhamento da voz: redução na palavra “diminui”, comparação sem voz entre 75,512713 e 77,212713 s. Conferência de 5547 instantes sem conflitos, maior erro de contato inferior a 0,00049, câmera contínua e repetição determinista.

Prévia profissional concluída e conferida: testes/previa-completa-com-yuri.mp4, 92,443 s, 1080×1920/60 fps, H.264/AAC, 54.566.843 bytes, faststart. MP4 inteiro decodificado sem erro; áudio -16,78 LUFS, pico verdadeiro -3,34 dBFS. Comparação em mono: queda de 8,31 dB entre janelas sem fala de 75,70 e 76,60 s (simulação editada, não medição de um fone real). Relatório em testes/conferencia-profissional.json; quadros exportados em testes/yuri-quadro-*.jpg. Aguardando opinião sobre voz e animação antes de promover a entrega final. Capa e textos estão preparados.

## Comandos para revisar mantendo a voz salva

Na raiz do projeto:

```powershell
node motor/render.js videos/fone-cancelamento-ruido --previa 1,10,30,50,70,90
node videos/fone-cancelamento-ruido/gerar-ambiente.js
node videos/fone-cancelamento-ruido/conferir-fone.js
```

O primeiro comando guarda a voz e a timeline real sem renderizar o vídeo inteiro. O segundo reconstrói o ambiente sincronizado com essa timeline. O terceiro confere movimentos e grava quadros; abrir as imagens antes de renderizar.

Obter a duração total em timeline.json e gerar a prévia profissional inteira:

```powershell
node motor/render.js videos/fone-cancelamento-ruido --trecho 0,<total> --previa-rapida
```

Substituir <total> pelo número real. O vídeo já foi aprovado e entregue; esses comandos servem para futuras revisões visuais. Antes de substituir video.mp4 ou capa.png de uma entrega, preservar a versão anterior em versoes/ com data, conforme AGENTS.md.

Para uma revisão apenas sonora, remixar-audio.js usa exclusivamente os arquivos em cache e copia o vídeo da prévia sem recodificar imagens. Ele interrompe se faltar qualquer fala ou se video.mp4 já existir; preservar a entrega antes de executar novamente. Nenhuma chave é lida por esse script.

## Conferência sem créditos de voz

```powershell
node videos/fone-cancelamento-ruido/conferir-fone.js
node videos/fone-cancelamento-ruido/conferir-fone.js --video
```

Sem timeline real, a conferência usa tempos estimados e grava testes/timeline-visual.json. O segundo comando gera testes/previa-visual-sem-narracao.mp4 com identificação explícita da ausência de narração. Esse teste é 540×960/30 fps e não é a entrega final.

O motor recebeu dois recursos opcionais: pausaDepois por fala (0–3 segundos) e ambiente.arquivo relativo à pasta do episódio. As configurações anteriores mantêm as pausas e mixagem existentes quando esses campos não aparecem. Ambiente participa das prévias e da mixagem normal, com volume subordinado à voz; conferir a comparação após a normalização e em mono.

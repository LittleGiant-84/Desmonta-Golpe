# Sincronizar com o GitHub

Destino: https://github.com/LittleGiant-84/Desmonta-Golpe (privado).

O usuário autorizou (13/11/2026 no projeto anterior, mantido neste em 24/11/2026) o envio automático de cada etapa concluída, sem nova confirmação.
Isso vale para roteiro, cena, revisões, configurações, capas e registros do canal, inclusive em outros chats que
trabalhem nesta pasta e sigam o AGENTS.md.

## Enviar

```powershell
npm run sincronizar -- "Atualiza animação da impressora no laboratório"
```

O comando confere o destino, a branch, os arquivos e possíveis credenciais; atualiza as referências remotas,
adiciona as alterações permitidas pelo `.gitignore`, cria o commit e faz push. Depois confere se o commit está no
GitHub. Se não houver alterações, não cria commit vazio. Alterações remotas não são sobrescritas.

## Só conferir

```powershell
npm run sincronizar -- --conferir
```

Essa opção mostra o resumo e valida os arquivos sem adicioná-los, criar commit ou enviar.

## O que acompanha o projeto

- Código, bibliotecas próprias, modelos, roteiros, configurações sem segredos, capas e textos de publicação.
- Decisões, pedidos e progresso registrados nos arquivos de `canal/`.
- Credenciais, vídeos gerados, narrações, testes, versões antigas e dependências instaladas seguem locais.

O GitHub guarda os arquivos versionados; não espelha automaticamente a interface ou todas as mensagens do chat.
A IA deve acionar o comando ao terminar cada etapa consistente e antes de entregar a resposta. Não há serviço em
segundo plano e o projeto não envia arquivos quando ninguém está trabalhando nele.

## Se o envio falhar

Preservar os arquivos e qualquer commit local. Resolver a conexão, autenticação ou divergência apontada e repetir
o comando. Nunca usar `--force`, descartar arquivos ou registrar credenciais no repositório. Se a branch remota
avançar, revisar e integrar as alterações antes do novo envio. Informar ao usuário o estado real da sincronização.

Preferências visuais e aprovação dos vídeos continuam no fluxo normal; a autorização permanente é para o GitHub.

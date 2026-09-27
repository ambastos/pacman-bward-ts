# Último prompt

Quero criar uma versão em texto do jogo Pac-Man. Sem alterar o código original (PIXI.ts), criar uma página separada (index-text.html) com saída em texto/ASCII. O servidor (server.js) deve ter uma rota /text. Usar canvas com caracteres ASCII em vez de PIXIjs. Pacman como >, <, ^, v. Fantasmas como B, P, I, C.

# Última resposta

Implementado. A versão em texto fica em **`http://localhost:8080/text`** (rode
`npm start` e abra essa rota). O jogo original em `/` continua intacto.

## Como funciona

A ideia central é não reimplementar o jogo: a página nova carrega o
`build/app.js` de verdade e apenas **troca a camada de desenho**. Ou seja, o
fluxo de boot é o real — carregar assets, mostrar o botão de start, clicar, e só
aí existe `gc.gameEngine`, `gc.pacman` e `gc.ghosts`. O console ASCII é uma
saída alternativa para o mesmo estado, não uma cópia dele.

Isso foi possível porque existem duas costuras no `GameCoordinator`:

- `gc.render()` — chamada pelo `gameEngine` a cada frame. Substituída por uma
  função vazia; o console desenha no seu próprio `requestAnimationFrame`. Isso
  também resolve o fato de o motor só renderizar enquanto está rodando (loading
  e menu não têm engine).
- `gc.displayText()` — interceptada para registrar texto + duração em vez de
  criar sprites PIXI. É de onde saem `READY!`, `GAME OVER` e os popups de
  pontos.

Consequência importante: o console respeita exatamente as mesmas flags do jogo.
Quando `game.config` desabilita fantasmas, `settingsManager.applyGhosts()` põe
`ghost.display = false` e o console some com eles — igual ao PIXI. Nenhuma
verificação duplicada, nenhum estado paralelo.

## Arquivos

| Arquivo | Papel |
| --- | --- |
| `app/scripts/text/textRenderer.ts` | o console inteiro (front screens, labirinto, entidades, HUD, overlays) |
| `index-text.html` | página nova; canvas 2D + placeholders ocultos para os ids que o jogo desreferencia |
| `gulpfile-text.js` | build esbuild só do renderer → `build/textRenderer.js` |
| `server.js` | `app.get('/text')` (única alteração em arquivo existente) |
| `package.json` | scripts `build:text` e `watch:text` |

`gulpfile.js` não foi tocado, por isso o build do console é separado. Depois de
clonar, rode `npm run build:text` — sem o bundle a página avisa isso no próprio
canvas em vez de ficar preta.

## Legenda

| Glifo | Significado | Cor |
| --- | --- | --- |
| `> < ^ v` | Pac-Man | amarelo `#ffdf00` |
| `B P I C` | blinky, pinky, inky, clyde | vermelho, rosa, ciano, laranja |
| `b p i c` | fantasma assustado | azul `#2121ff` |
| `o` | olhos (fantasma comido voltando) | branco |
| `.` | ponto | azul-escuro `#3d3d9e` |
| `O` | power pellet | lilás `#8a8aff` |
| `#` | parede | azul `#2121ff` |
| `=` | porta da casa dos fantasmas | azul |
| `@` | fruta | branco |
| `<` | vida (barra inferior) | amarelo |

`ENTER`/`ESPAÇO`/clique começa, setas ou WASD movem, `ESC` pausa, `Q` liga e
desliga o som.

## Detalhes que custaram tempo

- **Não confiar no `mazeArray` para os pontos.** Ele continua marcando pontos
  já comidos como `o`. Os pontos vêm de `gc.pickups[].visible`.
- **O índice do tile tem que bater com o que o jogo testa.** O console usa
  `Math.floor(determineGridPosition(...))` com âncora `0.5`, que é exatamente o
  que `checkForWallCollision` faz — o tile desenhado é o tile testado.
- **`<base href="/">` é obrigatório** na página nova: os assets são carregados
  com caminho relativo e sem isso viravam `/text/app/style/...` (404).
- **`gc.remainingSources` não serve como progresso.** A barra trava em 0.99 até
  `mainMenu.style.visibility === 'visible'`, que é o sinal confiável.
- **`writeCentered` agora trunca** textos largos. O `put` faz wrap de coluna
  (necessário para entidades no meio de uma transição de tile), então um texto
  maior que 28 colunas dava a volta e comia a moldura.
- **Um `.` a 45px ocupa ~0,4% da célula.** Qualquer leitura de canvas para
  conferir o resultado precisa de limiar baixo, senão os pontos "somem" da
  verificação — eles estão no console.

## Pendente: alinhamento

O console funciona, mas visualmente está desalinhado. A grade é 28×37 com célula
de altura igual ao font size e largura `0.6 × fontSize` (proporção de terminal),
o que deixa o labirinto bem mais alto que largo. Labirinto, entidades e HUD são
consistentes entre si — o tile desenhado é o tile que o jogo testa — mas o
conjunto não se encaixa bem na moldura da tela. Fica para uma próxima sessão.

## Verificação

`npx tsc --noEmit` limpo nos arquivos novos. Playwright, ponta a ponta: menu
aparece, `ENTER` cria `gameEngine`/`pacman`/4 fantasmas/245 pickups, `READY!`
aparece, setas movem e comem pontos, `ESC` pausa, game over volta ao menu e
`ENTER` reinicia. Zero erros de página nas duas rotas. O `/` original também foi
regressão-testado e abre sem erros.

Nota: o `game.config` deste working tree tem
`game.ghosts.disabled=['pinky','inky','clyde']`, então só o blinky aparece — isso
é configuração do projeto, não do console.

# Histórico


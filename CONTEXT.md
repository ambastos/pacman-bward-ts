# Último prompt

 Grave no context.md que agora esse projeto está em typescript e pixijs pronto para ser usado com mods externos.

# Última resposta

Registrado em `CONTEXT.md`, na entrada de **2026-09-28 — O jogo vira pacote,
pronto para mods externos**.

O master é TypeScript + PixiJS e está pronto para ser estendido por mods de
outros repositórios. Ele não conhece nenhum mod — em código, em dependência ou
em config. Só expõe o contrato em `app/scripts/mod/mod.ts` e o registro
`mods`, que o `settingsManager.applyMod()` consulta.

O que ficou registrado, além do estado:

- A dependência foi **invertida**: o mod é que depende do jogo, por
  `peerDependencies`. O master não menciona o mod em lugar nenhum.
- `package.json` virou manifesto de biblioteca, com `exports` por wildcard
  (`"./*": "./app/scripts/*.ts"`) e `app/@types` no `files`.
- **Por que `import type` falhou** e por que com o pacote do jogo dá para
  `extends` igual ao PixiJS: o esbuild compila junto e deduplica por caminho
  absoluto. Medido — `var Ghost` aparece uma vez, e `Sonic extends
  ghost_default`.
- **Por que o branch do mod não pode manter `app/scripts/`**: com o jogo nos
  dois lugares o bundle sai com `var Ghost` e `var Ghost2`.
- Os três bugs corrigidos: o `EmptyMod` importado do arquivo errado, o ciclo de
  import em runtime, e o caminho morto de config do mod.
- A exceção `!app/@types/*.d.ts` no `.gitignore`, e por que ela é necessária.
- Seis pendências, incluindo a **tag `v1.0.0`**, que continua não decidida —
  até ela existir, a versão no `package.json` é fiction.
- E a nota de que `npx tsc` aqui não é o compilador, então o esbuild é o único
  portão real de build.

# Versão em texto (rota `/text`)

> Documentação da rota `/text` (console ASCII), escrita quando ela foi
> implementada. O código continua no repo: `index-text.html`, `server.js`,
> `app/scripts/text/textRenderer.ts`. **Atenção:** `gulpfile-text.js` foi
> removido do working tree em 2026-09-28, então `npm run build:text` e
> `watch:text` ainda existem no `package.json` mas não têm gulpfile para rodar.
> Verificar antes de usar.

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

## 2026-09-27 — Mods removidos: o jogo fica "puro"

Decisão de escopo: **todos os mods foram removidos**. O repositório passa a
conter apenas o Pac-Man original, agora em TypeScript. 

Commit: `a210864` — *"Retirando o módulo flood para deixar esse apenas com o
jogo original"* (78 arquivos, −3100 linhas).

O que saiu:

| Removido | Detalhe |
| --- | --- |
| `app/mods/` inteiro | `mod.ts`, `empty-mod.ts` e todo `implementations/flood/` (sprites do sonic, bubbles, som, waves, breath, states). O diretório não existe mais. |
| `game.mod="flood"` | chave removida do `app/configs/game.config` |
| `game.mods=['none','flood']` → `['none']` | config volta ao padrão |
| `window.f = window.gc.mod?.flood ?? null` | linha removida de `app/scripts/initial.ts` |

O que ficou: o jogo original, o port para TypeScript e a versão em texto/ASCII
da rota `/text` (que é só uma camada de desenho alternativa sobre o mesmo
estado — não é um mod).

Único resquício de configuração, e é intencional, não resíduo de mod:
`game.ghosts.disabled=['pinky','inky','clyde']` continua em `game.config`, então
só o blinky aparece. `game.pacman.lives` foi de 2 para 3. Se a intenção for
"puro" também no gameplay, é aí que se ajusta.

## 2026-09-28 — O jogo vira pacote, pronto para mods externos

**Estado: TypeScript + PixiJS, publicado como `pacman-bward-ts` e pronto para
ser estendido por mods que vivem em outros repositórios.** O master não sabe
qualquer mod — nem em código, nem em dependência, nem em config. Ele só
expõe o contrato e um registro em runtime.

### A direção da dependência foi invertida

Até aqui o jogo importava o mod de dentro do próprio repo. Inverteu: agora o
mod é que depende do jogo, via `peerDependencies`, e o master nunca menciona
o mod. O repositório do jogo é a dependência; o do mod é o dependente.

### O master como pacote

`package.json` deixou de ser um manifesto de app e passou a ser o de uma
biblioteca. O `main` apontava para `.eslintrc.js`, o que estava errado.

```jsonc
"exports": {
  ".":     "./app/scripts/initial.ts",
  "./mod": "./app/scripts/mod/mod.ts",
  "./*":   "./app/scripts/*.ts"
},
"files": ["app/scripts", "app/configs", "app/@types"]
```

O `./*` é wildcard e cobre `pacman-bward-ts/characters/ghost` →
`./app/scripts/characters/ghost.ts`. Escolhido no lugar de uma lista explícita
de dez caminhos para não precisar manter a lista quando um arquivo entra ou
sai. `app/@types` entrou no `files` porque sem ele o pacote não viaja com as
declarações de `window.gc` / `window.debug` / `HTMLImageElement.load`, e o
consumidor passa a tomar 17 erros de tipo.

### O contrato de mod, e onde ele mora

O contrato foi de `app/mods/` para **`app/scripts/mod/`**, seguindo a convenção
das outras pastas (`core`, `characters`, `mazes`, `utilities`, todas no
singular). `app/mods/` não existe mais.

| Arquivo | Papel |
| --- | --- |
| `app/scripts/mod/mod.ts` | classe base `Mod` + o registro `mods` |
| `app/scripts/mod/empty-mod.ts` | null object, `name = "none"` |

O gancho de registro, exportado pelo pacote como `pacman-bward-ts/mod`:

```ts
export const mods: Record<string, any> = {}
```

E o `settingsManager.applyMod()` resolve por ele:

```ts
const Ctor = MODS[name] || mods[name] || EmptyMod
```

A leitura é feita **dentro** de `applyMod()`, não num spread no `const MODS`.
Spread captura o estado no momento em que o módulo é avaliado, e a ordem de
avaliação de módulos não é garantida — o registro viria vazio Depending de qual
import fosse avaliado primeiro.

### `import type` era o erro, e ele custou tempo

Afirmei antes, com base num grep por `new Ghost(`, que o mod só usava o jogo
como **tipo**. Estava errado: o grep não cobria `extends`. O mod faz
`class Sonic extends Ghost`, chama `vLerp()` / `calculateDistancePos()` /
`createObservablePoint()`, lê membros do enum `Mode` e faz `new Timer()` — tudo
isso é uso de **valor**, e `import type` não serve (38 erros `TS1361`).

A dúvida que apareceu: "por que com o PixiJS dá para importar e estender, e com
o pacote do jogo não?". Resposta: **dá, e dá igual**. O esbuild compila o
`pacman-bward-ts` junto com o projeto, exatamente como faz com o `pixi.js`
(1,6 MB de bundle, `@pixi` dentro). E **não duplica**: ele deduplica por caminho
absoluto resolvido. Medido num bundle real de teste:

```
var Ghost                        ← 1 ocorrência no bundle inteiro
var Sonic = class extends ghost_default
```

O `Sonic` herda da mesma classe que o jogo usa. A duplicação só apareceria se o
mod fosse distribuído como `.js` já compilado, carregado por um segundo
`<script>` — que não é a arquitetura aqui.

Por isso a regra é: `import` onde o símbolo é valor, `import type` onde é só
anotação. `GameCoordinator` e `MovableEntity` ficam como `import type`; `Ghost`,
`Pacman`, `Timer`, `Mode` e as funções de `utils` viram `import` normal.

**Consequência de arquitetura:** um branch do mod **não pode manter
`app/scripts/` na árvore** se também instalar o peer. Medido: com o jogo nos
dois lugares, o bundle sai com `var Ghost` e `var Ghost2` — duas classes, e o
esbuild renomeia a segunda justamente porque colidiu. O branch do mod apaga os
arquivos do jogo e deixa o `node_modules` ser a única fonte.

### Bugs encontrados e corrigidos no caminho

- **`EmptyMod` importado do arquivo errado.** `gameCoordinator.ts` fazia
  `import EmptyMod from "../../mods/mod.ts"`, mas `mod.ts` só exporta `Mod` e
  `mods`. O TypeScript não reclama porque `import X from` aceita renomear o
  default — então `EmptyMod` era silenciosamente a classe base `Mod`, com
  `name = ""` em vez de `"none"`. Não quebrava porque o `applyMod()` troca pelo
  `EmptyMod` verdadeiro no primeiro carregamento, mas escondia uma diferença
  real.
- **Ciclo de import em runtime.** `empty-mod.ts` importava `GameCoordinator`
  como valor, e `gameCoordinator.ts` importa o `EmptyMod` de volta. Ambos
  passaram a `import type`, o que apaga o ciclo na compilação.
- **`app/mods/implementations/`** era pasta vazia sobrando, removida.
- **60 arquivos `.d.ts` / `.d.ts.map` gerados** estavam versionados em
  `app/scripts/**` (resíduo de execuções anteriores ao `outDir`). Removidos do
  disco e do git.

### `.gitignore` com exceção explícita

```
*.d.ts
*.d.ts.map
!app/@types/*.d.ts
```

A exceção importa: `app/@types/declarations.d.ts` é **escrito à mão** e declara
o `window.gc`, `window.debug`, `window.settings`, `window.f` e
`HTMLImageElement.load`. Um `git rm --cached '*.d.ts'` já tinha Levado os dois
arquivos de `app/@types` junto, e com eles fora do repo o `tsconfig.json`
(linha 56, `include`) aponta para um arquivo inexistente e o `files` do
pacote publica uma pasta vazia. Restaurados com `git add -f`.

### `tsconfig.json` — só declarações

```jsonc
"rootDir": "./app",
"outDir": "./dist",
"emitDeclarationOnly": true
```

O `rootDir` é obrigatório: sem ele o tsc erro com *"The common source directory
of 'tsconfig.json' is './app'"*. Com `emitDeclarationOnly`, o tsc produz
`.d.ts` e `.d.ts.map` sem `.js` — o executável é sempre o bundle do esbuild em
`build/`. Os dois sistemas não se misturam.

### Caminho morto removido

`settingsManager.loadFromFiles()` fazia fetch de
`app/mods/implementations/${name}/app/configs/game.config`. Esse caminho não
existe mais. Não quebrava nada com o jogo puro — `game.mods=['none']` e o
filtro `m !== 'none'` descartavam tudo — mas o flood falharia ao ser
registrado. O `Promise.all` foi removido; `modTexts` fica vazio e
`mergeFromSources` já ignora entrada nula. `game.mods` e `mergeFromSources`
não foram tocados: a lista de mods continua vindo do `game.config`, e é ela
que o `applyMod()` usa para escolher qual instanciar.

### O branch do mod

`flood-mod-crude`, commit `e5e6a0b` — *"Seperando e importando o pacman core
para o mod flood por usa-lo"* (184 arquivos, +4992 / −21558). Renomeado de
`opencode-ai`. Contém só o código do flood, com o jogo vindo de
`peerDependencies`:

```jsonc
"peerDependencies": { "pacman-bward-ts": "github:ambastos/pacman-bward-ts" }
```

Durante o trabalho, `core/flood.ts` e `core/registerListeners.ts`(sumiram da
árvore e foram recuperados do `HEAD` pelo caminho antigo
`implementations/mods/flood/`. `flood.ts` é o núcleo do mod — 5 arquivos
dependem dele.

### Pendências

1. Commitar e pushar o master. O trabalho de 2026-09-28 está **sem commit**.
2. `npm install github:ambastos/pacman-bward-ts --force` no branch do mod, para
   pegar a versão com o `mods` exportado e o `app/@types` no pacote.
3. Escrever o `initial.ts` do mod — o do peer não registra nada, e o
   `settingsManager` dele só conhece o `none`:
   ```ts
   import { mods } from "pacman-bward-ts/mod"
   import FloodModImp from "./app/mods/implementations/flood-mod-imp.ts"
   mods["flood"] = FloodModImp
   ```
   Precisa rodar **antes** de `new SettingsManager(window.gc)`, senão o
   `applyMod()` não acha o `flood`.
4. `app/@types/module.d.ts` está com 0 bytes e não é referenciado por nada.
   Pode sair, trocando por `app/@types/declarations.d.ts` no `files`.
5. **Não decidido: a tag de versão.** O peer aponta para `github:` sem ref, o
   que resolve para a branch padrão. Enquanto não houver `v1.0.0`, um
   `pacman-bward-ts@1.0.0` no `package.json` é fiction — a versão só fica
   real no momento em que a tag existir.
6. `README.md`, `gulpfile old.js` e `gulpfile-text.js` aparecem modificados ou
   deletados no `git status` e **não foram feitos por mim** — conferir antes
   de commitar.

### Verificação do master em 2026-09-28

- `npx tsc --noEmit` → **0 erros** fora de `app/t-old-tests/`
- `npx esbuild app/scripts/initial.ts --bundle --format=iife --platform=browser`
  → 1,5 MB, sem erro
- `npm pack --dry-run` → 29 arquivos, com `app/@types/declarations.d.ts` dentro

Os 1520 erros do `tsc` estão todos em `app/t-old-tests/`, que são testes
antigos em JavaScript. São pré-existentes e não foram tocados.

Nota sobre verificação: `npx tsc` **não** é o compilador. O pacote `tsc` no
registro do npm é um shim que responde *"This is not the tsc command you are
looking for"*. O `typescript` não está instalado no `node_modules` deste
projeto, então checagem de tipo aqui é só o que o `npx tsc` faz — e ela não
está checando. O esbuild é o único portão real de build.


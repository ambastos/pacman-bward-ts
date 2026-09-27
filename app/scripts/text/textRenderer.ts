/**
 * Console de texto (ASCII) do Pac-Man.
 *
 * Esta classe nao substitui a logica do jogo: ela apenas desenha, num canvas
 * 2D, o mesmo estado que o renderer PIXI desenharia. O fluxo real do jogo
 * continua intacto -- os assets sao carregados pelo mesmo AssetsManager, o
 * botao PLAY aparece, e o GameEngine assume o controle. Aqui apenas tomamos o
 * lugar do desenho (`GameCoordinator.render`) e interceptamos os textos
 * temporarios que o jogo exibe (`GameCoordinator.displayText`).
 */

/* ========================================================================== *
 * Geometria do console
 * ======================================================================== */

/** Largura do labirinto, em tiles (app/scripts/mazes/maze-1.ts). */
const MAZE_COLS = 28
/** Altura do labirinto, em tiles (app/scripts/mazes/maze-1.ts). */
const MAZE_ROWS = 31

/** Linha dos rotulos do placar ("1UP", "HIGH SCORE"). */
const HUD_LABEL_ROW = 0
/** Linha dos valores do placar. */
const HUD_VALUE_ROW = 1
/** O labirinto comeca 3 linhas abaixo do placar. */
const MAZE_TOP = 3
/**
 * Linha das vidas e frutas. Fica 2 linhas de respiro abaixo do labirinto, como
 * no jogo original (ver o comentário sobre as 5 tiles de UI em
 * `GameCoordinator.determineScale`).
 */
const BOTTOM_ROW = MAZE_TOP + MAZE_ROWS + 2
/** Altura total do console, em linhas de texto. */
const TOTAL_ROWS = BOTTOM_ROW + 1

/**
 * Avanco horizontal de uma fonte monoespacada, relativo a altura da linha.
 * Uma linha de terminal tem a altura da fonte e a largura do avanco do
 * caractere; e por isso que o labirinto continua mais alto que largo, como no
 * jogo original.
 */
const CHAR_ASPECT = 0.6

/* ========================================================================== *
 * Paleta -- espelha app/style/scss/_variables.scss
 * ======================================================================== */

const COLORS = {
  background: '#000000',
  wall: '#2121ff',
  dot: '#3d3d9e',
  powerPellet: '#8a8aff',
  hud: '#ffffff',
  dim: '#3d3d7a',
  pacman: '#ffdf00',
  fruit: '#ffffff',
  eyes: '#ffffff',
  overlay: '#ffdf00',
  error: '#ff5555',
  blinky: '#ff0000',
  pinky: '#fcb5ff',
  inky: '#00ffff',
  clyde: '#f8bb55',
  scared: '#2121ff',
} as const

/* ========================================================================== *
 * Legenda
 * ======================================================================== */

const PACMAN_GLYPHS: Record<string, string> = {
  left: '<',
  right: '>',
  up: '^',
  down: 'v',
}

const GHOST_GLYPHS: Record<string, string> = {
  blinky: 'B',
  pinky: 'P',
  inky: 'I',
  clyde: 'C',
}

const PICKUP_GLYPHS: Record<string, string> = {
  pacdot: '.',
  powerPellet: 'O',
  fruit: '@',
}

const PICKUP_COLORS: Record<string, string> = {
  pacdot: COLORS.dot,
  powerPellet: COLORS.powerPellet,
  fruit: COLORS.fruit,
}

/** Parede, porta da casa dos fantasmas, e o "so-olhos" de um fantasma comido. */
const GLYPH = {
  wall: '#',
  door: '=',
  eyes: 'o',
} as const

/**
 * A casa dos fantasmas ocupa as linhas 13..15 do labirinto, com a parede
 * superior na linha 12. A porta fica na linha imediatamente acima dela.
 * Mesma posicao fixa usada por `Ghost.isInGhostHouse` (ghost.ts:295).
 */
const GHOST_HOUSE_DOOR = { row: 11, from: 10, to: 17 }

/** Textos que `displayText` recebe como alias de imagem. */
const OVERLAY_ALIASES: Record<string, string> = {
  ready: 'READY!',
  game_over: 'GAME OVER',
}

/**
 * Le um glifo de uma das legendas acima. O fallback existe porque o
 * `noUncheckedIndexedAccess` do projeto trata toda chave de `Record` como
 * possivelmente ausente, e um nome de fantasma desconhecido nao pode derrubar
 * o desenho de um quadro.
 */
function glyphOf(table: Record<string, string>, key: string, fallback: string): string {
  return table[key] ?? fallback
}

/** Logotipo usado nas telas de carregamento e de start. Sempre 23 colunas. */
const LOGO_WIDTH = 23
const LOGO: string[] = [
  '+---------------------+',
  '|  o o o o o o o o o  |',
  '|  o             o    |',
  '|  o     ___     o    |',
  '|  o    /   \\    o    |',
  '|  o    \\___/    o    |',
  '|  o             o    |',
  '|  o o o o o o o o o  |',
  '+---------------------+',
]

const CONTROLS: string[] = [
  'ARROWS / WASD   MOVE',
  'ESC             PAUSE',
  'Q               SOUND',
]

/* ========================================================================== *
 * Tipos
 * ======================================================================== */

type ConsoleState = 'loading' | 'menu' | 'playing' | 'paused' | 'gameover'

interface Cell {
  char: string
  color: string
}

interface Overlay {
  text: string
  until: number
}

/* ========================================================================== *
 * Console
 * ======================================================================== */

class TextConsole {
  private readonly gc: any
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private readonly cells: Cell[] = []
  private readonly fontFamily = '"DejaVu Sans Mono", "Liberation Mono", "Courier New", monospace'

  private fontSize = 16
  private cellWidth = 10
  private cellHeight = 16
  private viewWidth = 0
  private viewHeight = 0
  private frame = 0

  /**
   * Total de fontes que o `AssetsManager` foi carregar. O primeiro valor visto
   * de `remainingSources` ja e o total, porque ele e atribuido antes de
   * qualquer decremento.
   */
  private totalSources: number | null = null
  /** true depois que o jogador started o jogo ao menos uma vez. */
  private hasStarted = false
  private overlay: Overlay | null = null

  constructor(gc: any) {
    this.gc = gc

    const canvas = document.getElementById('text-console') as HTMLCanvasElement | null
    if (!canvas) {
      throw new Error('Elemento #text-console nao encontrado na pagina.')
    }
    this.canvas = canvas

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Canvas 2D indisponivel neste navegador.')
    }
    this.ctx = ctx

    for (let i = 0; i < MAZE_COLS * TOTAL_ROWS; i += 1) {
      this.cells.push({ char: '', color: '' })
    }

    this.intercept()
    this.fit()
    this.listenForStart()
    window.addEventListener('resize', () => this.fit())
    this.loop()
  }

  /* ---------------------------------------------------------------- *
   * Integracao com o jogo
   * ---------------------------------------------------------------- */

  /**
   * Assume o lugar do renderer PIXI.
   *
   * `GameEngine.draw()` chama `gameCoordinator.render()` a cada quadro, entao
   * basta neutralize esse metodo: o canvas PIXI (que fica escondido) nunca e
   * pintado e o console passa a ser a unica saida visivel.
   *
   * `displayText` e puramente decorativo -- cria um sprite temporario --, entao
   * pode ser substituido por um registro de texto, que e o que alimenta o
   * overlay ASCII (READY!, GAME OVER e os pontos das frutas).
   */
  private intercept() {
    this.gc.render = () => { /* desenhado pelo nosso proprio requestAnimationFrame */ }
    this.gc.displayText = (
      _position: unknown,
      amount: unknown,
      duration: number,
    ) => {
      const alias = String(amount)
      const text = OVERLAY_ALIASES[alias] ?? alias.replace(/_/g, ' ')
      this.overlay = { text, until: performance.now() + duration }
    }
  }

  /**
   * Enter, espaco ou um clique em qualquer lugar dao start. Chamamos o
   * `startButtonClick` original para que `reset()`, `init()` e
   * `startGameplay()` rodem exatamente como no jogo grafico.
   */
  private listenForStart() {
    const start = () => {
      const state = this.detectState()
      if (state !== 'menu' && state !== 'gameover') return
      this.hasStarted = true
      this.gc.startButtonClick()
    }

    window.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      start()
    })
    document.addEventListener('click', start)
  }

  /**
   * Traduz o estado interno do jogo em um dos estados do console.
   *
   * O `gameEngine` so existe depois do primeiro `startButtonClick`, porque e
   * criado em `GameCoordinator.init()`. Ate la o console esta em
   * carregamento/start. O menu principal so fica visivel quando o
   * `AssetsManager` termina de baixar os assets, e ele reaparece quando o
   * `gameOver()` libera o restart -- e por isso que `hasStarted` separa o
   * "menu inicial" do "fim de jogo".
   */
  private detectState(): ConsoleState {
    const gc = this.gc
    if (!gc.gameEngine) {
      return this.isMenuVisible() ? 'menu' : 'loading'
    }
    if (this.hasStarted && this.isMenuVisible()) {
      return 'gameover'
    }
    if (!gc.gameEngine.started) {
      return 'paused'
    }
    return 'playing'
  }

  /** O menu so aparece depois que todos os assets foram carregados. */
  private isMenuVisible(): boolean {
    const menu = this.gc.mainMenu
    return !!menu && menu.style.visibility === 'visible'
  }

  /**
   * Progresso do carregamento, de 0 a 1.
   *
   * O `AssetsManager` republished `remainingSources` do total ate zero, mas a
   * barra so e considerada completa quando o menu realmente aparece -- assim
   * nao dependemos da contagem de callbacks do carregador de imagens do PIXI.
   */
  private readLoadingProgress(): number {
    if (this.isMenuVisible()) return 1

    const remaining = this.gc.remainingSources
    if (typeof remaining !== 'number') return 0
    if (this.totalSources === null) {
      this.totalSources = remaining
      return 0
    }
    if (this.totalSources <= 0) return 1

    const progress = 1 - remaining / this.totalSources
    return Math.min(0.99, Math.max(0, progress))
  }

  /* ---------------------------------------------------------------- *
   * Medidas
   * ---------------------------------------------------------------- */

  /**
   * Dimensiona a fonte para que o console inteiro caiba na janela. A altura da
   * linha e a altura da fonte; a largura e o avanco do caractere
   * monoespacado, o que mantem a proporcao do labirinto original.
   */
  private fit() {
    const margin = 12
    const availableWidth = Math.max(window.innerWidth - margin * 2, MAZE_COLS * 6)
    const availableHeight = Math.max(window.innerHeight - margin * 2, TOTAL_ROWS * 8)

    const limitedByHeight = availableHeight / TOTAL_ROWS
    const limitedByWidth = availableWidth / (MAZE_COLS * CHAR_ASPECT)

    this.fontSize = Math.max(8, Math.floor(Math.min(limitedByHeight, limitedByWidth)))
    this.cellWidth = this.fontSize * CHAR_ASPECT
    this.cellHeight = this.fontSize
    this.viewWidth = Math.floor(MAZE_COLS * this.cellWidth)
    this.viewHeight = Math.floor(TOTAL_ROWS * this.cellHeight)

    const ratio = window.devicePixelRatio || 1
    this.canvas.width = Math.floor(this.viewWidth * ratio)
    this.canvas.height = Math.floor(this.viewHeight * ratio)
    this.canvas.style.width = `${this.viewWidth}px`
    this.canvas.style.height = `${this.viewHeight}px`

    const { ctx } = this
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.font = `${this.fontSize}px ${this.fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
  }

  /* ---------------------------------------------------------------- *
   * Laço de desenho
   * ---------------------------------------------------------------- */

  private loop = () => {
    this.frame += 1
    this.draw()
    requestAnimationFrame(this.loop)
  }

  private draw() {
    this.clearCells()

    const state = this.detectState()
    if (state === 'loading' || state === 'menu') {
      this.drawFrontScreen(state)
    } else {
      this.drawHud()
      this.drawMaze()
      this.drawPickups()
      this.drawGhosts()
      this.drawPacman()
      this.drawBottomBar()
      this.drawOverlay(state)
    }

    this.paint()
  }

  private clearCells() {
    for (const cell of this.cells) {
      cell.char = ''
    }
  }

  /**
   * Acesso a malha. O array e preenchido inteiro no construtor, entao o indice
   * so pode ser invalido se as medidas de layout mudarem -- o que nao acontece
   * em tempo de execucao.
   */
  private cellAt(row: number, col: number): Cell {
    return this.cells[row * MAZE_COLS + col] as Cell
  }

  private paint() {
    const { ctx } = this

    ctx.fillStyle = COLORS.background
    ctx.fillRect(0, 0, this.viewWidth, this.viewHeight)

    for (let row = 0; row < TOTAL_ROWS; row += 1) {
      for (let col = 0; col < MAZE_COLS; col += 1) {
        const cell = this.cellAt(row, col)
        if (!cell.char) continue
        ctx.fillStyle = cell.color
        ctx.fillText(
          cell.char,
          col * this.cellWidth + this.cellWidth / 2,
          row * this.cellHeight + this.cellHeight / 2,
        )
      }
    }
  }

  /* ---------------------------------------------------------------- *
   * Telas de carregamento e de start
   * ---------------------------------------------------------------- */

  private drawFrontScreen(state: ConsoleState) {
    this.writeCentered(HUD_LABEL_ROW, 'PAC-MAN :: TEXT CONSOLE', COLORS.dim)

    // Uma moldura ocupa exatamente a area do labirinto, para o jogo aparecer
    // "dentro" da tela em vez de flutuar no meio do console.
    const last = MAZE_TOP + MAZE_ROWS - 1
    this.write(MAZE_TOP, 0, `+${'-'.repeat(MAZE_COLS - 2)}+`, COLORS.wall)
    this.write(last, 0, `+${'-'.repeat(MAZE_COLS - 2)}+`, COLORS.wall)
    for (let row = MAZE_TOP + 1; row < last; row += 1) {
      this.write(row, 0, '|', COLORS.wall)
      this.write(row, MAZE_COLS - 1, '|', COLORS.wall)
    }

    const logoCol = 1 + Math.floor((MAZE_COLS - 2 - LOGO_WIDTH) / 2)
    LOGO.forEach((line, index) => {
      this.write(MAZE_TOP + 2 + index, logoCol, line, COLORS.wall)
    })

    if (state === 'loading') {
      this.drawLoadingProgress()
      return
    }

    // O prompt pisca, como o "< blink >" do jogo original.
    if (Math.floor(this.frame / 30) % 2 === 0) {
      this.writeCentered(MAZE_TOP + 13, '> PRESS ENTER TO PLAY <', COLORS.pacman)
    }
    this.writeCentered(MAZE_TOP + 15, 'texto puro, zero sprites', COLORS.dim)
    CONTROLS.forEach((line, index) => {
      this.writeCentered(MAZE_TOP + 17 + index, line, COLORS.hud)
    })
  }

  private drawLoadingProgress() {
    const percent = this.readLoadingProgress()
    const width = 20
    const filled = Math.round(percent * width)

    this.writeCentered(MAZE_TOP + 13, 'LOADING ASSETS', COLORS.hud)
    this.writeCentered(
      MAZE_TOP + 15,
      `[${'#'.repeat(filled)}${'-'.repeat(width - filled)}]`,
      filled === width ? COLORS.powerPellet : COLORS.dim,
    )
    this.writeCentered(MAZE_TOP + 16, `${Math.round(percent * 100)}%`, COLORS.powerPellet)
  }

  /* ---------------------------------------------------------------- *
   * HUD
   * ---------------------------------------------------------------- */

  private drawHud() {
    const gc = this.gc
    this.write(HUD_LABEL_ROW, 3, '1UP', COLORS.hud)
    this.write(HUD_LABEL_ROW, 14, 'HIGH SCORE', COLORS.hud)
    this.write(HUD_VALUE_ROW, 3, String(gc.points ?? 0).padStart(5, ' '), COLORS.pacman)
    this.write(HUD_VALUE_ROW, 17, String(gc.highScore ?? 0).padStart(7, ' '), COLORS.hud)
  }

  private drawBottomBar() {
    const lives = Math.max(0, Number(this.gc.lives) || 0)
    for (let i = 0; i < lives; i += 1) {
      this.write(BOTTOM_ROW, 2 + i * 2, glyphOf(PACMAN_GLYPHS, 'left', '<'), COLORS.pacman)
    }

    const fruits = this.countCollectedFruits()
    for (let i = 0; i < fruits; i += 1) {
      const col = MAZE_COLS - 2 - (fruits - 1 - i) * 2
      this.write(BOTTOM_ROW, col, glyphOf(PICKUP_GLYPHS, 'fruit', '@'), COLORS.fruit)
    }
  }

  /** As ultimas sete frutas comidas, o mesmo log que o RendererBottom mantem. */
  private countCollectedFruits(): number {
    const display = this.gc.bottomRender?.container?.getChildByName?.('fruitsDisplay')
    return display?.children?.length ?? 0
  }

  /* ---------------------------------------------------------------- *
   * Labirinto
   * ---------------------------------------------------------------- */

  private drawMaze() {
    const mazeArray = this.gc.mazeArray as string[][]
    for (let row = 0; row < MAZE_ROWS; row += 1) {
      for (let col = 0; col < MAZE_COLS; col += 1) {
        if (mazeArray[row]?.[col] === 'X') {
          this.put(MAZE_TOP + row, col, GLYPH.wall, COLORS.wall)
        }
      }
    }

    for (let col = GHOST_HOUSE_DOOR.from; col <= GHOST_HOUSE_DOOR.to; col += 1) {
      this.put(MAZE_TOP + GHOST_HOUSE_DOOR.row, col, GLYPH.door, COLORS.wall)
    }
  }

  /**
   * Pontos, power pellets e frutas vem dos `Pickup` vivos, e nao do `mazeArray`:
   * o labirinto continua marcando como 'o' os pontos ja comidos, entao so o
   * `Pickup.visible` sabe o que ainda esta na mesa.
   */
  private drawPickups() {
    const pickups = this.gc.pickups as any[] | undefined
    if (!Array.isArray(pickups)) return

    for (const pickup of pickups) {
      if (!pickup.visible) continue
      const type = String(pickup.type)
      if (!PICKUP_GLYPHS[type]) continue

      const col = Math.round(pickup.center.x / this.gc.scaledTileSize)
      const row = Math.round(pickup.center.y / this.gc.scaledTileSize)
      const glyph = glyphOf(PICKUP_GLYPHS, type, '.')
      this.put(MAZE_TOP + row, col, glyph, glyphOf(PICKUP_COLORS, type, COLORS.dot))
    }
  }

  private drawPacman() {
    const pacman = this.gc.pacman
    if (!pacman) return

    const grid = this.gridPositionOf(pacman)
    const glyph = glyphOf(PACMAN_GLYPHS, String(pacman.direction), '<')
    this.put(MAZE_TOP + Math.floor(grid.y), Math.floor(grid.x), glyph, COLORS.pacman)
  }

  private drawGhosts() {
    const ghosts = this.gc.ghosts
    if (!Array.isArray(ghosts)) return

    for (const ghost of ghosts) {
      if (!ghost.display) continue

      const name = String(ghost.name)
      const mode = String(ghost.mode)
      let glyph: string
      let color: string

      if (mode === 'eyes') {
        glyph = GLYPH.eyes
        color = COLORS.eyes
      } else if (mode === 'scared') {
        // Minusculo, porque em ASCII a cor e a unica pista de que o fantasma
        // esta asustado -- e a forma do glifo e a unica que sobra.
        glyph = glyphOf(GHOST_GLYPHS, name, '?').toLowerCase()
        color = COLORS.scared
      } else {
        glyph = glyphOf(GHOST_GLYPHS, name, '?')
        color = name === 'blinky' ? COLORS.blinky
          : name === 'pinky' ? COLORS.pinky
            : name === 'inky' ? COLORS.inky
              : COLORS.clyde
      }

      const grid = this.gridPositionOf(ghost)
      this.put(MAZE_TOP + Math.floor(grid.y), Math.floor(grid.x), glyph, color)
    }
  }

  /**
   * Mesma conta que o jogo usa para detectar colisao
   * (`CharacterUtil.determineGridPosition`), para que o tile desenhado e o tile
   * testado sejam sempre o mesmo.
   */
  private gridPositionOf(entity: any): { x: number; y: number } {
    return entity.characterUtil.determineGridPosition(
      entity.position,
      entity.scaledTileSize,
      entity.anchor,
      this.gc.scale,
    )
  }

  /* ---------------------------------------------------------------- *
   * Sobreposições
   * ---------------------------------------------------------------- */

  private drawOverlay(state: ConsoleState) {
    if (state === 'paused') {
      this.drawBanner('PAUSED')
      return
    }

    // O gameOver() do jogo reabre o menu principal para permitir o restart, e
    // e por isso que o console sabe que um ENTER soa como start de novo.
    if (state === 'gameover') {
      this.drawBanner('GAME OVER')
      this.writeCentered(MAZE_TOP + 18, '> PRESS ENTER TO RESTART <', COLORS.pacman)
      return
    }

    if (this.overlay && performance.now() < this.overlay.until) {
      this.writeCentered(MAZE_TOP + 16, this.overlay.text, COLORS.overlay)
    }
  }

  private drawBanner(text: string) {
    const width = Math.max(text.length + 4, 14)
    const col = Math.floor((MAZE_COLS - width) / 2)
    const row = MAZE_TOP + 14
    const rule = `+${'-'.repeat(width - 2)}+`
    const inner = width - 2
    const left = Math.floor((inner - text.length) / 2)
    const right = inner - text.length - left

    this.write(row, col, rule, COLORS.overlay)
    this.write(row + 1, col, `|${' '.repeat(left)}${text}${' '.repeat(right)}|`, COLORS.overlay)
    this.write(row + 2, col, rule, COLORS.overlay)
  }

  /* ---------------------------------------------------------------- *
   * Malha de caracteres
   * ---------------------------------------------------------------- */

  /**
   * Escreve um caractere. A coluna e enrolada para que o tunel funcione
   * visualmente, e as linhas fora da tela sao descartadas -- e assim que
   * Pacman e os fantasmas aparecem do outro lado durante o wrap.
   */
  private put(row: number, col: number, char: string, color: string) {
    if (row < 0 || row >= TOTAL_ROWS) return
    const wrapped = ((col % MAZE_COLS) + MAZE_COLS) % MAZE_COLS
    const cell = this.cellAt(row, wrapped)
    cell.char = char
    cell.color = color
  }

  /** Escreve um trecho. Espacos sao ignorados, para nao apagar o que ja existe. */
  private write(row: number, col: number, text: string, color: string) {
    for (let i = 0; i < text.length; i += 1) {
      const char = text[i]
      if (char === ' ' || char === undefined) continue
      this.put(row, col + i, char, color)
    }
  }

  /**
   * Centraliza um texto. Um texto mais largo que o console e truncado em vez
   * de dar a volta: `put` faz wrap de coluna para as entidades, mas um bloco de
   * texto largo destruiria a moldura em vez de simplesmente nao caber.
   */
  private writeCentered(row: number, text: string, color: string) {
    const width = Math.min(text.length, MAZE_COLS)
    this.write(row, Math.floor((MAZE_COLS - width) / 2), text.slice(0, width), color)
  }
}

/* ========================================================================== *
 * Inicialização
 * ======================================================================== */

/**
 * Espera o `GameCoordinator` ser criado por `app/scripts/initial.ts`, que o faz
 * dentro de `window.onload`. Como o script do console costuma rodar antes, o
 * jogo ainda nao existe neste ponto.
 */
function waitForGameCoordinator(timeoutMs = 20000): Promise<any> {
  return new Promise((resolve, reject) => {
    const deadline = performance.now() + timeoutMs
    const check = () => {
      const gc = window.gc
      if (gc && gc.mazeArray) {
        resolve(gc)
        return
      }
      if (performance.now() > deadline) {
        reject(new Error('O GameCoordinator nao foi inicializado em 20s.'))
        return
      }
      requestAnimationFrame(check)
    }
    check()
  })
}

function renderFatalError(canvas: HTMLCanvasElement, message: string) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = 720
  canvas.height = 96
  ctx.fillStyle = COLORS.background
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = COLORS.error
  ctx.font = '14px "DejaVu Sans Mono", "Courier New", monospace'
  ctx.textBaseline = 'top'
  ctx.fillText('FALHA AO INICIAR O CONSOLE DE TEXTO', 16, 16)
  ctx.fillText(message.slice(0, 80), 16, 44)
}

async function boot() {
  const canvas = document.getElementById('text-console') as HTMLCanvasElement | null
  if (!canvas) {
    throw new Error('Elemento #text-console nao encontrado na pagina.')
  }

  try {
    // Sem `store`, para nao manter o console vivo para sempre em testes.
    new TextConsole(await waitForGameCoordinator())
  } catch (error) {
    renderFatalError(canvas, error instanceof Error ? error.message : String(error))
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { void boot() })
} else {
  void boot()
}

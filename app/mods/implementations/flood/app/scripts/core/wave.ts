import { Container, Graphics, Sprite, Texture } from "pixi.js"
import WavesManager from "./wavesManager.ts"
import Maze from "../../../../../../scripts/mazes/maze.ts"
import MovableEntity from "../../../../../../scripts/characters/movableEntity.ts"

class Wave extends Sprite {
    speedY = 15
    startTime = 0
    started = false
    decreasing = false
    duration!: number
    maze: Maze
    wavesManager: WavesManager
    container: Container
    elements: Sprite[] = []
    queuedList: any[] = []

    private surface = new Graphics()
    private surfacePhase = 0
    private lastOscillation = 0

    constructor(wavesManager: WavesManager, maze: Maze, width: number, height: number) {
        super(Texture.WHITE)
        this.width = width
        this.visible = false
        this.alpha = 0
        this.zIndex = 1

        this.maze = maze
        this.wavesManager = wavesManager
        this.wavesManager.wave = this
        this.wavesManager.flood.gp.clear()

        this.container = this.wavesManager.container
        this.surface.zIndex = 2
        this.surface.visible = false
        this.container.addChild(this.surface)

        this.height = height
        this.updatePosition()

        this.generateBubbles()
        this.wavesManager.tryToGenerateEntities()
    }

    queueElement(type: string, element: Exclude<Sprite, MovableEntity>) {
        const id = `${type}-${this.queuedList.length}`
        element.name = type
        Object.defineProperty(element, "id", { value: id })
        this.queuedList.push(element)
    }
    queuedElementsBy(type: string): Sprite[] {
        return this.queuedList.filter(f => f.name == type)
    }
    protected dequeueElement(element: any): boolean {
        const found = this.queuedList.indexOf(element) > -1
        this.queuedList = this.queuedList.filter(f => f.id != element.id)
        return found
    }
    addElement(element: Sprite) {
        this.elements.push(element)
        this.container.addChild(element)
    }
    removeElement(element: Sprite) {
        this.elements.splice(this.elements.indexOf(element), 1)
        if (element.parent)
            this.container.removeChild(element)
    }
    clearElements() {
        this.elements.forEach(element => {
            if (element.parent)
                this.container.removeChild(element)
        })
        this.elements.length = 0
        this.queuedList.length = 0
        this.surface.clear()
        this.surface.closePath()
        if (this.surface.parent)
            this.container.removeChild(this.surface)
    }
    getElementsBy(name?: string): Sprite[] {
        return this.elements.filter(f => f.name == name)
    }
    private generateBubbles() {
        const amount = 1 + Math.floor(Math.random() * 3)
        const ways = this.maze.getWays()
        const cells = ways.flatMap(row => {
            return row.cols.map(col => ({ row: row.row, col }))
        })
        for (let i = 0; i < amount && cells.length > 0; i++) {
            const cell = cells[Math.floor(Math.random() * cells.length)]
            const bubble = new Sprite(this.wavesManager.flood.am.getTexture("bubbles"))
            const pixel = this.maze.getPixelCoordinates(cell!.col, cell!.row)
            bubble.width = this.maze.tileSize
            bubble.height = this.maze.tileSize
            bubble.position.set(pixel.x, pixel.y)
            this.queueElement("bubble", bubble)
        }
    }
    private getGeneratedBubbles() {
        const bubbles = this.queuedElementsBy("bubble")
        bubbles.forEach(bubble => {
            const worldGrid = this.maze.getGridPosition(bubble.x, bubble.y)
            const waterGrid = this.maze.getGridPosition(this.x, this.y)
            if (worldGrid.y >= waterGrid.y) {
                this.addElement(bubble)
                this.dequeueElement(bubble)
            }
        })
    }
    increase(elapsedMs: number) {
        if (!this.visible) return
        this.height += this.speedY * (elapsedMs / 1000)
        this.decreasing = false
        this.updatePosition()
        this.getGeneratedBubbles()
        this.wavesManager.entitiesManager.dequeAllEntities()
    }
    decrease(elapsedMs: number) {
        if (!this.visible) return
        this.height -= this.speedY * 1.3 * (elapsedMs / 1000)
        this.decreasing = true
        this.updatePosition()
        this.getElementsBy("bubble").forEach(bubble => {
            if (bubble.y <= this.y)
                this.removeElement(bubble)
        })
    }
    updatePosition() {
        this.y = this.maze.height - this.height
    }
    get isDescreasing() {
        return this.decreasing
    }
    get isAtMax() {
        return this.height >= this.wavesManager.maxHeight
    }
    containsEntity(entity: any): boolean {
        const waveArea = this.getBounds()
        const entityArea = entity.getBounds()
        return waveArea.intersects(entityArea)
    }
    cancel() {
        this.started = false
        this.visible = false
        this.clearElements()
    }
    show() {
        this.started = true
        this.visible = true
        this.alpha = 0
    }
    draw() {
        if (!this.visible || !this.started || this.height <= 0) return

        const g = this.surface
        g.visible = true
        g.clear()
        g.closePath()

        const waveTop = this.y
        const seaLevel = this.y + this.height
        const waterHeight = Math.max(0, seaLevel - waveTop)

        g.beginFill(0x56DBE3, 0.5)
        g.drawRect(0, waveTop, this.width, waterHeight)

        this.maze.ghostHouses.forEach((house: any) => {
            const topLeft = this.maze.getPixelCoordinates(house.x1, house.y1)
            const bottomLeft = this.maze.getPixelCoordinates(house.x1, house.y2)
            const bottomRight = this.maze.getPixelCoordinates(house.x2, house.y2)
            if (bottomLeft.y >= waveTop && topLeft.y <= seaLevel) {
                g.beginHole()
                g.moveTo(bottomLeft.x, bottomLeft.y)
                g.lineTo(bottomRight.x, bottomRight.y)
                if (topLeft.y >= waveTop) {
                    g.lineTo(bottomRight.x, topLeft.y)
                    g.lineTo(topLeft.x, topLeft.y)
                    g.lineTo(bottomLeft.x, bottomLeft.y)
                } else {
                    g.lineTo(bottomRight.x, waveTop)
                    g.lineTo(bottomLeft.x, waveTop)
                    g.lineTo(bottomLeft.x, bottomLeft.y)
                }
                g.endHole()
            }
        })
        g.endFill()

        g.lineStyle(3, 0xB3E5FC, 0.8)
        const segments = 40
        const amplitude = 3
        g.moveTo(0, waveTop)
        for (let i = 1; i <= segments; i++) {
            const x = (i / segments) * this.width
            const y = waveTop + Math.sin((i / segments) * Math.PI * 2 + this.surfacePhase) * amplitude
            g.lineTo(x, y)
        }
        g.lineStyle(0)

        if (Date.now() - this.lastOscillation >= 80) {
            this.lastOscillation = Date.now()
            this.surfacePhase += 0.4
        }
    }
}
export default Wave
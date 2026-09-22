import { Container, Graphics, Text } from "pixi.js"
import Animator from "../animations/animator.ts"
import Breath from "./breath.ts"
import Flood from "./flood.ts"
import EventEmitter from "eventemitter3"

import GameCoordinator from "../../../../../../../scripts/core/gameCoordinator.ts"
import Pacman from "../../../../../../../scripts/characters/pacman.ts"
import Ghost from "../../../../../../../scripts/characters/ghost.ts"
import MovableEntity from "../../../../../../../scripts/characters/movableEntity.ts"
import EntitiesManager from "./entitiesManager.ts"
import Sonic from "../entities/sonic.ts"
import { Mode } from "../../../../../../../scripts/characters/types.ts"
import { sound } from "@pixi/sound"
import Wave from "./wave.ts"

/** name spacing used to create the needed properties*/
const breathNamespace = "breath"
class WavesManager {
    wave!: Wave | null
    waveTime: any = null
    nextWaveTime: any = null
    maxHeight: number
    flood: Flood
    gc: GameCoordinator
    entitiesManager!: EntitiesManager
    animator: Animator
    gp: Graphics
    container: Container
    pacman!: Pacman
    ghosts!: Ghost[]
    emitter!: EventEmitter
    private breathIndicators: Map<any, Text> = new Map()
    constructor(flood: Flood) {
        this.flood = flood
        this.maxHeight = flood.maxHeight
        this.gc = flood.gc
        this.gp = flood.gp
        this.gc.ghostCombo = 0
        this.animator = new Animator(this)
        this.container = flood.container
    }
    initialize() {
        this.entitiesManager = new EntitiesManager(this.gc)
        this.gc = this.flood.gc
        this.pacman = this.flood.gc.pacman
        this.ghosts = this.flood.gc.ghosts
        this.emitter = this.gc.emitter
        this.createBreath(this.pacman, {
            breathing: 5,
            maxBreathing: 10,
            decreaseVelocityPerMs: 0.8,
        })
        this.ghosts.forEach(g => {
            this.createBreath(g)
        })
        this.animator.createAnimation("breath", 200, null, (args: any) => {
            const pacman = args.entity
        })
        this.emitter.on("flood-end", () => {
            this.stop()
        })
    }
    restart() {
        this.entitiesManager.restart()
    }
    createBreath(entity: MovableEntity, options?: any) {
        //@ts-ignore
        entity[breathNamespace] = new Breath(options)
    }
    resetEntitiesBreathing() {
        this.resetEntity(this.pacman)
        const ghosts = this.flood.gc.ghosts
        ghosts?.forEach(ghost => {
            this.resetEntity(ghost)
        })
    }
    private resetEntity(entity: any) {
        if (entity && entity[breathNamespace])
            entity[breathNamespace].reset()
    }
    tryToGenerateEntities() {
        this.entitiesManager.tryToGenerateEntities(this.wave)
    }
    stopDrown(entity: any) {
        entity[breathNamespace].stopped = true
    }
    tryDrownEntities(elapsedMs: number) {
        this.#tryDrownEntity(this.pacman, elapsedMs)
        this.ghosts.forEach(ghost => {
            this.#tryDrownEntity(ghost, elapsedMs)
        })
    }
    #tryDrownEntity(entity: any, elapsedMs: number) {
        const breath = entity[breathNamespace]
        const wave = this?.wave
        const waveActive = !!wave && wave.started

        let isInGhostHouse = false
        if (entity instanceof Ghost) {
            isInGhostHouse = entity.isInGhostHouse(entity.getGridPosition())
        }
        const isInsideTheWave = waveActive && entity.allowCollision && wave.containsEntity(entity)
        const submerged = isInsideTheWave && !isInGhostHouse && !breath.stopped

        this.updateBreathIndicator(entity, submerged, breath.breathing)

        if (!waveActive || !entity.allowCollision || breath.stopped) return

        if (submerged) {
            breath.elapsedTimeLastBreathMs += elapsedMs
            if (breath.elapsedTimeLastBreathMs >= 1000) {
                breath.elapsedTimeLastBreathMs = 0
                breath.breathing -= 1
                if (breath.breathing <= 0) {
                    breath.breathing = 0
                    this.killEntity(entity)
                }
            }
        } else {
            breath.elapsedTimeLastBreathMs += elapsedMs
            if (breath.elapsedTimeLastBreathMs >= 300) {
                breath.breathing += 1
                breath.elapsedTimeLastBreathMs = 0
                if (breath.breathing >= breath.maxBreathing)
                    breath.breathing = breath.maxBreathing
            }
        }
    }
    private updateBreathIndicator(entity: any, show: boolean, breathing: number) {
        let text = this.breathIndicators.get(entity)
        if (!show) {
            if (text)
                text.visible = false
            return
        }
        if (!text) {
            text = new Text("", {
                fontFamily: "Press Start 2P",
                fontSize: 10,
                fill: 0xffffff,
                align: "center",
            })
            text.anchor.set(0.5)
            text.resolution = 2
            text.zIndex = 5
            this.container.addChild(text)
            this.breathIndicators.set(entity, text)
        }
        text.visible = true
        text.text = String(Math.max(0, Math.floor(breathing)))
        text.position.set(
            entity.position.x,
            entity.position.y - entity.height * 0.5 - 10
        )
    }
    private clearBreathIndicators() {
        this.breathIndicators.forEach((t) => {
            if (t.parent)
                this.container.removeChild(t)
        })
        this.breathIndicators.clear()
    }
    killEntity(entity: MovableEntity) {
        if (!entity.allowCollision) return

        //@ts-ignore
        const breath = entity[breathNamespace] as Breath
        if (entity instanceof Pacman) {
            this.safePlaySound("sonic_drown")
            this.emitter.emit("pacman-death")
            breath.stop()
            breath.reset()
            this.updateBreathIndicator(entity, false, 0)
        } else if (entity instanceof Ghost) {
            const pauseDuration = 1000
            const { position, measurement } = entity
            entity.mode = Mode.eyes
            this.gc.eyeGhosts += 1;
            this.gc.ghostCombo += 1;
            const comboPoints = this.gc.determineComboPoints();
            this.emitter.emit("award-points", { detail: { points: comboPoints } })
            this.gc.displayText(position, comboPoints, pauseDuration, measurement);
            breath.stop()
            this.updateBreathIndicator(entity, false, 0)
            if (this.gc.ghostCombo > this.gc.ghosts.length) {
                this.gc.eyeGhosts = 0;
                this.gc.ghostCombo = 0;
            }
        }
    }
    private safePlaySound(alias: string) {
        try {
            if (sound.exists(alias))
                sound.play(alias)
        } catch {
            //ignore missing/unregistered sounds
        }
    }
    showBreathingStatus(entity: Pacman) {
        const { position, measurement } = entity
        //@ts-ignore
        const text = `Breathing ${entity[breathNamespace].breathing}`
        this.gc.displayText(position,
            text,
            4000, measurement, undefined,
            { x: 0, y: -measurement * 0.75 })
    }
    private clearEntities() {
        this.entitiesManager.clearEntities()
    }
    clear() {
        if (this.wave) {
            this.gp.clear()
            this.wave.clearElements()
            this.clearEntities()
            if (this.wave.parent)
                this.wave.parent.removeChild(this.wave)
        }
        this.clearBreathIndicators()
    }
    stop() {
        this.clear()
        this.wave = null
        this.waveTime = null
        this.nextWaveTime = null
        this.gc.ghostCombo = 0
    }
    update(elapsedMs: number) {
        const wave = this.wave
        if (wave?.started) {
            this.animator.update()
            const bubbles = wave.getElementsBy("bubble")
            const pacman = this.gc.pacman
            bubbles.forEach((b) => {
                if (b.getBounds().intersects(pacman.getBounds())) {
                    this.safePlaySound("sonic_bubbles")
                    this.emitter.emit("bubble-swallow")
                    wave.removeElement(b)
                    //@ts-ignore
                    pacman[breathNamespace].breathing = pacman[breathNamespace].maxBreathing
                    this.showBreathingStatus(pacman)
                }
            })
            if (wave.isDescreasing && wave.height < wave.maze.height / 2) {
                this.entitiesManager.makeSonicLeave()
            }
        }
        this.entitiesManager.update(elapsedMs)
    }
    draw() {
        if (this.wave?.started)
            this.wave.draw()
    }
}
export default WavesManager
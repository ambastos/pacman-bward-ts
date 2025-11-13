import Ghost from "../../../../../../../characters/ghost.js"
import Pacman from "../../../../../../../characters/pacman.js"
import Animator from "../animations/animator.js"
import { States } from "../states/state.js"
import Breath from "./breath.js"

/** name spacing used to create the needed properties*/ 
const breathNamespace = "breath"
class DrownManager {
    wave = null
    waveTime = null
    nextWaveTime = null
    maxHeight  
    gc
    animator
    constructor(flood) {
        this.flood = flood
        this.maxHeight = flood.maxHeight
        this.gc = flood.gc
        this.gp = flood.gp
        this.gc.ghostCombo = 0   
        this.animator = new Animator()
    }
    initialize() {
        this.gc = this.flood.gc
        this.factory = this.flood.factory
        this.pacman = this.flood.gc.pacman
        this.ghosts = this.flood.gc.ghosts
        this.emitter = this.gc.emitter        
        this.#createBreath(this.pacman, {
            breathing: 5,
            maxBreathing: 10,
            decreaseVelocityPerMs: 0.8,                        
        })   
        this.ghosts.forEach(g=>{
            this.#createBreath(g)
        })        
        this.animator.createAnimation("breath", 200,null,(args)=>{
            console.log("animation", args.entity)
        })
    }
    #createBreath(entity, options) {               
        entity[breathNamespace] = new Breath(options)
    }
    resetEntitiesBreathing() {
        this.#resetEntity(this.pacman)    
        this.ghosts.forEach(ghost=>{
            this.#resetEntity(ghost)    
        })    
    }
    #resetEntity(entity) {        
        entity[breathNamespace].reset()
    }
    stopDrown(entity) {
        entity[breathNamespace].stopped = true
    }
    tryDrownEntities(elapsedMs) {
        this.#tryDrownEntity(this.pacman, elapsedMs)
        this.ghosts.forEach(ghost=>{
            this.#tryDrownEntity(ghost, elapsedMs)
        })
    }
    #tryDrownEntity(entity, elapsedMs) {
        const breath = entity[breathNamespace]
        const wave = this.factory?.wave
        if (!wave || !wave.started || breath.stopped) return

        const sprite = entity.sprite.getBounds()
        let isInGhostHouse = false
        if (entity instanceof Ghost) {
            isInGhostHouse = entity.isInGhostHouse(entity.getGridPosition())
        }
        const isInsideTheWave = wave.getBounds().contains(sprite.x, sprite.y)
        if (entity.allowCollision && !isInGhostHouse && isInsideTheWave){
            breath.elapsedTimeLastBreathMs+=elapsedMs
            if (breath.elapsedTimeLastBreathMs >=1000) {
                breath.elapsedTimeLastBreathMs = 0
                breath.breathing -= 1
                if (breath.breathing <= 0) {
                    breath.breathing = 0
                    this.killEntity(entity)                                        
                }
            }
        }else {
            breath.elapsedTimeLastBreathMs+=elapsedMs
            if (breath.elapsedTimeLastBreathMs >=300) {
                breath.breathing +=1
                breath.elapsedTimeLastBreathMs = 0
                if (breath.breathing >= breath.defaultBreathing) 
                    breath.breathing = breath.defaultBreathing
            }
        }
    }
    killEntity(entity) {
        const breath = entity[breathNamespace]
        if (entity instanceof Pacman) {
           // window.dispatchEvent(new Event('deathSequence'));
            this.emitter.emit("pacman-death")
            breath.stop()
            breath.reset() 
            //this.terminateWave()
            this.flood.changeState(States.END_STATE)
        }else if (entity instanceof Ghost) {
            const event = {ghost:entity }
            //this.emitter.emit(`ghost-eaten-${entity.name}`,event)
            const pauseDuration = 1000
            const {position, measurement} = entity
            entity.mode = 'eyes'            
            this.gc.eyeGhosts += 1;
            this.gc.ghostCombo += 1;            
            const comboPoints = this.gc.determineComboPoints();
            this.emitter.emit("award-points", {detail: {points: comboPoints}})            
            this.gc.displayText(position, comboPoints, pauseDuration, measurement);
            breath.stop()
            breath.reset() 
            if (this.gc.ghostCombo > this.gc.ghosts.length) {
                this.gc.eyeGhosts = 0;
                this.gc.ghostCombo = 0;
            }
        }
        //console.log(entity.constructor.name, " is drowned!")
    }
   
    clear() {
        if (this.wave) { 
            this.gp.clear()
            this.flood.container.removeChild(this.wave)
        }        
    }
    stop() {
        this.clear()
        this.wave = null
        this.waveTime = null    
        this.nextWaveTime = null
        this.gc.ghostCombo = 0   
    }
    update(elapsedMs) {
        if (this.wave) {
            const container = this.flood.container
            const bubbles = container.children.filter((f)=>{
                return f.name == 'buble'
            })
            const pacman = this.gc.pacman
            bubbles.forEach((b)=>{
                if (b.getBounds().intersects(this.gc.pacman.sprite.getBounds())) {
                    container.removeChild(b)
                    pacman[breathNamespace].breathing = pacman[breathNamespace].maxBreathing
                    this.animator.play("breath", {entity: pacman})
                }
            })
        }
        this.animator.update()
    }
}
export default DrownManager
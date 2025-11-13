import Ghost from "../../../../../../../characters/ghost.js"
import Pacman from "../../../../../../../characters/pacman.js"
import { States } from "../states/state.js"
import Breath from "./breath.js"

/** name spacing used to create the needed properties*/ 
const breathNamespace = "breath"
class DrownManager {
    constructor(flood) {
        this.flood = flood
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
}
export default DrownManager
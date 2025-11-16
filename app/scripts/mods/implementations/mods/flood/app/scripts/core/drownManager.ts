import { Graphics } from "pixi.js"
import Ghost from "../../../../../../../characters/ghost.js"
import Pacman from "../../../../../../../characters/pacman.js"
import GameCoordinator from "../../../../../../../core/gameCoordinator.js"
import Animator from "../animations/animator.js"
import { States } from "../states/state.js"
import Breath from "./breath.js"
import Flood from "./flood.js"
import Wave from "./wave.js"
import EventEmitter from "eventemitter3"
import Entity from "../../../../../../../characters/entity.js"
import { enlarge } from "../utils/util.js"

/** name spacing used to create the needed properties*/ 
const breathNamespace = "breath"
class DrownManager {
    wave!:Wave | null
    waveTime:any = null
    nextWaveTime:any = null
    maxHeight:number  
    gc:GameCoordinator
    animator:Animator
    flood:Flood
    gp:Graphics
    pacman!:Pacman    
    ghosts!:Ghost[]
    emitter!:EventEmitter
    constructor(flood:Flood) {
        this.flood = flood
        this.maxHeight = flood.maxHeight
        this.gc = flood.gc
        this.gp = flood.gp
        this.gc.ghostCombo = 0   
        this.animator = new Animator(this)
    }
    initialize() {
        this.gc = this.flood.gc        
        this.pacman = this.flood.gc.pacman
        this.ghosts = this.flood.gc.ghosts
        this.emitter = this.gc.emitter        
        this.createBreath(this.pacman, {
            breathing: 5,
            maxBreathing: 10,
            decreaseVelocityPerMs: 0.8,                        
        })   
        this.ghosts.forEach(g=>{
            this.createBreath(g)
        })        
        this.animator.createAnimation("breath", 200,null,(args:any)=>{
            const pacman = args.entity           
            //console.log("animation", args)
        })
    }
    private createBreath(entity:Entity, options?:any) {   
        //@ts-ignore            
        entity[breathNamespace] = new Breath(options)
    }
    resetEntitiesBreathing() {
        this.resetEntity(this.pacman)    
        this.ghosts.forEach(ghost=>{
            this.resetEntity(ghost)    
        })    
    }
    private resetEntity(entity:any) {        
        entity[breathNamespace].reset()
    }
    stopDrown(entity:any) {
        entity[breathNamespace].stopped = true
    }
    tryDrownEntities(elapsedMs:number) {
        this.#tryDrownEntity(this.pacman, elapsedMs)
        this.ghosts.forEach(ghost=>{
            this.#tryDrownEntity(ghost, elapsedMs)
        })
    }
    #tryDrownEntity(entity:any, elapsedMs:number) {
        const breath = entity[breathNamespace]
        const wave = this?.wave
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
    killEntity(entity:any) {
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
    showBreathingStatus(entity: Pacman) {
         const {position, measurement} = entity
            //@ts-ignore
            const text = `Breathing ${entity[breathNamespace].breathing}`
            this.gc.displayText(position,
                text,
                5000, measurement)
    }   
    clear() {
        if (this.wave) { 
            this.gp.clear()
            this.gc.stage.removeChild(this.wave)
        }        
    }
    stop() {
        this.clear()
        this.wave = null
        this.waveTime = null    
        this.nextWaveTime = null
        this.gc.ghostCombo = 0   
    }
    update(elapsedMs: number) {
        if (this.wave) {
            this.animator.update()
            const container = this.gc.stage
            const bubbles = container.children.filter((f)=>{
                return f.name == 'buble'
            })
            const pacman = this.gc.pacman
            //@ts-ignore
            const hitArea = enlarge(pacman.sprite!.hitArea!.clone(),2)
            bubbles.forEach((b)=>{
                if (b.getBounds().contains(hitArea.x, hitArea.y)) {
                    container.removeChild(b)
                    //@ts-ignore
                    pacman[breathNamespace].breathing = pacman[breathNamespace].maxBreathing
                    this.showBreathingStatus(pacman)
                    //console.log("play breath")
                    //this.animator.play("breath", {entity: pacman})
                }
            })
        }        
    }
}
export default DrownManager
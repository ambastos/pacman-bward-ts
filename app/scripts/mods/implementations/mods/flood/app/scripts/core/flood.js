import { Container, Graphics} from "pixi.js"
import Mod from "../mod.js"
import Pacman from "../../../../../../../characters/pacman.js"
import Breath from "./breath.js"
import IdleState from "../states/idleState.js"
import {States} from '../states/state.js'
import StartState from "../states/startState.js"
import EndState from "../states/endState.js"
import CancelState from "../states/cancelState.js"
import StateFactory from "../states/stateFactory.js"

/** name spacing used to create the needed properties*/ 
const breathNamespace = "breath"
class Flood extends Mod{
    constructor(gameCoordinator) {
        super(gameCoordinator)
        this.width = gameCoordinator.width
        this.maxHeight = gameCoordinator.height
        this.tileSize = this.gc.tileSize 
        this.container = new Container()
        this.nextWaveTime
        this.gp = new Graphics()
        
    }
    initialize() {
        this.pacman = this.gc.pacman
        this.gc.lives = 10
        console.log("lives for debugging ", this.gc.lives)
        this.ghosts = this.gc.ghosts

        this.factory = new StateFactory(this)
        this.states = [new IdleState(this.factory), new StartState(this.factory),
            new EndState(this.factory), new CancelState(this.factory)
        ]
        this.state = this.states[States.IDLE_STATE]

        this.#createNewProperties(this.pacman, {
            breathing: 5,
            maxBreathing: 10,
            decreaseVelocityPerMs: 0.8,                        
        })   
        this.ghosts.forEach(g=>{
            this.#createNewProperties(g)
        })        
        this.#registerListeners()
    }
    #registerListeners() {
        this.emitter = this.gc.emitter
       this.#changePacmanDeathSequence() 
    }  
    #changePacmanDeathSequence() {
        this.gc.emitter.removeAllListeners("pacman-death")
        const _this = this 
        this.gc.emitter.on("pacman-death", ()=>{
             const wave = _this.factory.wave
            if (wave && wave.started) {
                const detail = {
                    detail: {
                        restart:false,
                        callbackAfter: ()=>{ 
                            _this.changeState(States.CANCEL_STATE)                            
                        }
                    }
                }
                this.gc.deathSequence(detail)                         
            }else {
                this.pacman.onDeath()
            }
        })
        // const deathSequence = this.gc.deathSequence 
        // const _this = this        
        // const deathSquence2 = function(){ 
        //     const wave = _this.factory.wave
        //     if (wave && wave.started) {
        //         //deathSequence.bind(_this.gc)()
        //         deathSequence.bind(_this.gc)({
        //             detail: {
        //                 restart:false,
        //                 callbackAfter: ()=>{ 
        //                     _this.changeState(States.CANCEL_STATE)                            
        //                 }
        //             }
        //         })                              
        //     }else {
        //         deathSequence.bind(_this.gc)()
        //     }
        // }.bind(this.gc)
        // this.gc.deathSequence = deathSquence2
        // this.gc.deathSquence2 = deathSequence
    }  
    #endFloodAnimation() {
        
    }
    #createNewProperties(entity, options) {               
        entity[breathNamespace] = new Breath(options)
    }
    changeState(state) {
        this.state.stop()
        this.state = this.states[state]
        this.state.start()
    }
    start() {
        super.start()
        this.pacman = this.gc.pacman
        this.ghosts = this.gc.ghosts
        this.gc.stage.removeChild(this.container)
        this.gc.stage.addChild(this.container)
        //Gp is the graphics to draw
        this.container.removeChild(this.gp)
        this.container.addChild(this.gp)
        this.state = this.states[States.IDLE_STATE]
        this.state.start()
    } 
    stop() { 
        super.stop()
        this.factory.stop()
    }
    generateWave(timeToStartMS) {
        this.changeState(States.IDLE_STATE)
        this.state.generateWave(timeToStartMS)
    }
    reset() {

    }
    resetEntitiesBreathing() {
        this.#resetEntity(this.pacman)        
    }
    #resetEntity(entity) {        
        entity[breathNamespace].reset()
    }
    stopDrown(entity) {
        entity[breathNamespace].stopped = true
    }
    startDrownEntity(entity, elapsedMs) {
        const breath = entity[breathNamespace]
        const wave = this.factory?.wave
        if (!wave || !wave.started || breath.stopped) return

        const sprite = entity.sprite.getBounds()
        if (wave.getBounds().contains(sprite.x, sprite.y) ){
            breath.elapsedTimeLastBreathMs+=elapsedMs
            if (breath.elapsedTimeLastBreathMs >=1000) {
                breath.elapsedTimeLastBreathMs = 0
                breath.breathing -= 1
                if (breath.breathing <= 0) {
                    breath.breathing = 0
                    this.killEntity(entity)                                        
                }
                console.log(entity.constructor.name, "breathing: ", breath.breathing)
            }
        }else {
            breath.elapsedTimeLastBreathMs+=elapsedMs
            if (breath.elapsedTimeLastBreathMs >=300) {
                breath.breathing +=1
                breath.elapsedTimeLastBreathMs = 0
                if (breath.breathing >= breath.defaultBreathing) 
                    breath.breathing = breath.defaultBreathing
                console.log(entity.constructor.name, "breathing: ", breath.breathing)
            }
        }
    }
    killEntity(entity) {
        const breath = entity[breathNamespace]
        if (entity instanceof Pacman ) {
           // window.dispatchEvent(new Event('deathSequence'));
            this.emitter.emit("pacman-death")
            breath.stop()
            breath.reset() 
            //this.terminateWave()
            this.changeState(States.END_STATE)
        }
        console.log(entity.constructor.name, " is drowned!")
    }
   
    update(elapsedMs) {
        if (!this.started) return
        
        this.state.update(elapsedMs)            
        if ( !(this.state instanceof CancelState) ) {
            //start to drown Pacman
            this.startDrownEntity(this.pacman, elapsedMs)
        }
        // }
    }
    draw() {
        if (!this.started) return
        if (this.factory?.wave) {
            this.factory.wave.draw()
        }
    }
}

if (!process.env.NYC_PROCESS_ID) 
  global.window.Flood = Flood
//removeIf(production)
export default Flood
//endRemoveIf
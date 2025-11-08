import { Container} from "pixi.js"
import Mod from "../mod.js"
import Pacman from "../../../../../../../characters/pacman.js"
import Wave from "./wave.js"
import Breath from "./breath.js"
import Animator from "../animations/animator.js"
import IdleState from "./states/idleState.js"
import {States} from './states/state.js'
import StartState from "./states/startState.js"
import EndState from "./states/endState.js"
import CancelState from "./states/cancelState.js"
import StateFactory from "./states/stateFactory.js"
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
        this.animator = new Animator(this)        
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
       this.#changePacmanDeathSequence() 
    }  
    #changePacmanDeathSequence() {
        const deathSequence = this.gc.deathSequence 
        const _this = this        
        const deathSquence2 = function(){ 
            const wave = _this.factory.wave
            if (wave && wave.started) {
                //deathSequence.bind(_this.gc)()
                deathSequence.bind(_this.gc)({
                    detail: {
                        restart:false,
                        callbackAfter: ()=>{ 
                            _this.changeState(States.CANCEL_STATE)                            
                        }
                    }
                })
                // window.dispatchEvent(new CustomEvent("deathSequence",{
                //     detail: {
                //         restart:false,
                //         callbackAfter: ()=>{ 
                //             _this.stop()
                //         }
                //     }
                // }))
                //this.animator.play("endFlood")                
            }else {
                deathSequence.bind(_this.gc)()
            }
        }.bind(this.gc)
        this.gc.deathSequence = deathSquence2
        this.gc.deathSquence2 = deathSequence
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
        this.state = this.states[States.IDLE_STATE]
        this.state.start()

        const {animator} = this
        // animator.createAnimation("endFlood",100,null,(args)=>{
        //     if (!this.wave)  return
        //     this.wave.cancel()
        //     if (this.wave && this.wave.height >4 ) {
        //         console.log("end flood animation")                
        //         this.wave.decrease(args[0])
        //         if (this.wave.isDescreasing && this.wave.height < 5) {
        //             this.terminateWave()                    
        //             this.stop()
        //         }
        //     }
        // })
    } 
    stop() { 
        super.stop()
        //this.terminateWave()
        //this.animator.stopAnimator()
        console.log("stop flood")
        this.factory.stop()
    }
    generateWave(timeToStartMS) {
        this.changeState(States.IDLE_STATE)
        this.state.generateWave(timeToStartMS)
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
            window.dispatchEvent(new Event('deathSequence'));
            breath.stop()
            breath.reset() 
            //this.terminateWave()
            this.changeState(States.END_STATE)
        }
        console.log(entity.constructor.name, " is drowned!")
    }
    // #cycleWave(elapsedMs) {
    //     let isTimeLimited = (Date.now() - this.wave.startTime)  >= this.wave.duration
    //         if (this.wave.isDescreasing && this.wave.height < 5) 
    //             this.terminateWave()        
    //         else if (this.wave.height >= this.maxHeight ||isTimeLimited)
    //             this.wave.decrease(elapsedMs)
    //         else 
    //             this.wave.increase(elapsedMs)

    // }
    update(elapsedMs) {
        if (!this.started) return
        
        //if (!this.nextWaveTime) this.generateWave()
        console.log(this.state.constructor.name)
        this.state.update(elapsedMs)
        // this.startWave()
        // this.animator.update(elapsedMs)
        // if (this.wave &&  this.wave.started) { 
        //     this.changeState(START_STATE)
        //     // this.#cycleWave(elapsedMs)        
        if ( !(this.state instanceof CancelState) ) {
            //start to drown Pacman
            this.startDrownEntity(this.pacman, elapsedMs)
        }
        // }
    }
    draw() {
        if (!this.started) return
    }
}

if (!process.env.NYC_PROCESS_ID) 
  global.window.Flood = Flood
//removeIf(production)
export default Flood
//endRemoveIf
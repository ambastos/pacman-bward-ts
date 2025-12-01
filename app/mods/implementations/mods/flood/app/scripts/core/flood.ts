import { Assets, Container, Graphics} from "pixi.js"
import Breath from "./breath.ts"
import IdleState from "../states/idleState.ts"
import StartState from "../states/startState.ts"
import EndState from "../states/endState.ts"
import CancelState from "../states/cancelState.ts"
import WavesManager from "./wavesManager.ts"
import Mod from "../mod.ts"
import { State, States } from "../states/state.ts"
import AssetsManager from "./assetsManager.ts"
import Pacman from "../../../../../../../scripts/characters/pacman.ts"
import Ghost from "../../../../../../../scripts/characters/ghost.ts"
import GameCoordinator from "../../../../../../../scripts/core/gameCoordinator.ts"
import Timer from "../../../../../../../scripts/utilities/timer.ts"

/** name spacing used to create the needed properties*/ 
const breathNamespace = "breath"
class Flood extends Mod{
    width:number
    maxHeight:number
    tileSize:number
    container:Container
    nextWaveTime:any
    gp:Graphics
    am: AssetsManager
    wavesManager!:WavesManager    
    pacman!:Pacman
    ghosts!:Ghost[]
    states!:State[]
    state!:State
    constructor(gameCoordinator:GameCoordinator) {
        super(gameCoordinator)
        this.width = gameCoordinator.width
        this.maxHeight = gameCoordinator.height
        this.tileSize = this.gc.tileSize 
        this.container = new Container()
        this.nextWaveTime = null
        this.am = new AssetsManager(this)
        this.gp = new Graphics()      
        console.log("Flood mod is active!")
    }
    async initialize() {
        this.wavesManager = new WavesManager(this)  
        this.pacman = this.gc.pacman
        this.gc.lives = 10
        console.log("lives for debugging ", this.gc.lives)
        this.ghosts = this.gc.ghosts

        this.wavesManager.initialize()
        this.states = [new IdleState(this.wavesManager), new StartState(this.wavesManager),
            new EndState(this.wavesManager), new CancelState(this.wavesManager)
        ]
        //@ts-ignore
        this.state = this.states[States.IDLE_STATE]

        //Assets.add({alias:"bubbles", src: "../../sprites/bubbles.png"})
        //await Assets.load(["bubbles"])
        this.#registerListeners()
    }
    
    #registerListeners() {
       this.emitter = this.gc.emitter
       this.#pacmanDeathSequenceEvent() 
       this.emitter.on("eat-ghost",(detail:any)=>{
        const em = this.wavesManager?.entitiesManager
         if (em) {
            const pauseDuration = 1000
            //Stop animating the entities
            em.entitiesDef.forEach((def)=>{
                const e = def.entity
                e.animate = false;
                e.moving = false
                e.pause(false);
                e.allowCollision = true;
            })
            //Restart animating the entities
            new Timer(()=>{
                em.entitiesDef.forEach((def)=>{
                    const e = def.entity
                    e.animate = true;
                    e.moving = true
                    e.pause(false);
                    e.allowCollision = true;
                })
            }, pauseDuration)
         }
       })
       this.emitter.on("game-over",()=>{
        this.stop()
       })
       this.emitter.on("flood-start",()=>{
        this.wavesManager.restart()
       })
       this.emitter.on("flood-end",()=>{
        this.ghosts.forEach(g=>{
            g.allowCollision = true
            g.skew.set(0,0)
            g.animate = true
        })
       })
    }  
    #pacmanDeathSequenceEvent() {
        this.gc.emitter.removeAllListeners("pacman-death")
        const _this = this 
        this.gc.emitter.on("advance-level",()=>{
            const entities = this.wavesManager.entitiesManager.entitiesDef.map(e=>e.entity)
            entities.forEach(e=>{
                e.display = false
            })
        })
        this.gc.emitter.on("pacman-death", ()=>{
            const wave = _this.wavesManager.wave
            this.gc.pacman.moving = false
            this.gc.pacman.allowCollision = false
            this.gc.allowPacmanMovement = false
            this.wavesManager.entitiesManager.stop()
            //this.wavesManager.stop()
            if (wave && wave.started) {
                const detail = {                    
                    restart:false,
                    callbackAfter: ()=>{ 
                        _this.changeState(States.CANCEL_STATE)                            
                    }
                }
                //@ts-ignore
                this.pacman.onDeath(detail)
            }else {
                this.pacman.onDeath()
            }
        })
        this.gc.emitter.on("post-death",()=>{
            this.wavesManager.entitiesManager.hide()
        })
    }  
    changeState(state:number) {
        this.state.stop() 
        //@ts-ignore
        this.state = this.states[state]
        this.state.start()
        
        console.log(this.state.constructor.name)
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
        //@ts-ignore
        this.state = this.states[States.IDLE_STATE]
        this.state.start()
        this.emitter.emit("flood-start")
    } 
    stop() { 
        super.stop()
        this.gp.clear()         
        this.emitter.emit("flood-end")
    }
    generateWave(timeToStartMS?: number) {
        this.changeState(States.IDLE_STATE)
        this.state.generateWave(timeToStartMS)
    }
    reset() {

    }
    
    update(elapsedMs:number) {
        if (!this.started) return
        
        this.wavesManager.update(elapsedMs)         
        this.state.update(elapsedMs)   
        if ( !(this.state instanceof CancelState) ) {
            //start to drown Pacman
            this.wavesManager.tryDrownEntities(elapsedMs)
        }
        // }
    }
    draw() {
        if (!this.started) return
        if (this.wavesManager?.wave) {
            this.wavesManager.wave.draw()
        }
    }
}
//removeIf(production)
export default Flood
//endRemoveIf
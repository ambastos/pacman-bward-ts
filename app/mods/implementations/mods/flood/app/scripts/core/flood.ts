import { Assets, Container, Graphics} from "pixi.js"
import Breath from "./breath.js"
import IdleState from "../states/idleState.js"
import StartState from "../states/startState.js"
import EndState from "../states/endState.js"
import CancelState from "../states/cancelState.js"
import DrownManager from "./drownManager.js"
import Mod from "../mod.js"
import { State, States } from "../states/state.js"
import AssetsManager from "./assetsManager.js"
import Pacman from "../../../../../../../scripts/characters/pacman.js"
import Ghost from "../../../../../../../scripts/characters/ghost.js"
import GameCoordinator from "../../../../../../../scripts/core/gameCoordinator.js"

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
    drownManager:DrownManager
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
        this.drownManager = new DrownManager(this)  
    }
    async initialize() {
        this.pacman = this.gc.pacman
        this.gc.lives = 10
        console.log("lives for debugging ", this.gc.lives)
        this.ghosts = this.gc.ghosts

        this.drownManager.initialize()
        this.states = [new IdleState(this.drownManager), new StartState(this.drownManager),
            new EndState(this.drownManager), new CancelState(this.drownManager)
        ]
        //@ts-ignore
        this.state = this.states[States.IDLE_STATE]

        //Assets.add({alias:"bubbles", src: "../../sprites/bubbles.png"})
        //await Assets.load(["bubbles"])
        this.#registerListeners()
    }
    
    #registerListeners() {
       this.emitter = this.gc.emitter
       this.emitter.on("game-over",()=>{
        this.stop()
       })
       this.#changePacmanDeathSequence() 
    }  
    #changePacmanDeathSequence() {
        this.gc.emitter.removeAllListeners("pacman-death")
        const _this = this 
        this.gc.emitter.on("pacman-death", ()=>{
             const wave = _this.drownManager.wave
            if (wave && wave.started) {
                const detail = {
                    detail: {
                        restart:false,
                        callbackAfter: ()=>{ 
                            _this.changeState(States.CANCEL_STATE)                            
                        }
                    } 
                }
                //@ts-ignore
                this.gc.deathSequence(detail)                         
            }else {
                this.pacman.onDeath()
            }
        })
    }  
    changeState(state:number) {
        this.state.stop()
        //@ts-ignore
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
        //@ts-ignore
        this.state = this.states[States.IDLE_STATE]
        this.state.start()
    } 
    stop() { 
        super.stop()
        this.gp.clear() 
        this.drownManager.stop()
    }
    generateWave(timeToStartMS?: number) {
        this.changeState(States.IDLE_STATE)
        this.state.generateWave(timeToStartMS)
    }
    reset() {

    }
    
    update(elapsedMs:number) {
        if (!this.started) return
        
        this.drownManager.update(elapsedMs)         
        this.state.update(elapsedMs)   
        if ( !(this.state instanceof CancelState) ) {
            //start to drown Pacman
            this.drownManager.tryDrownEntities(elapsedMs)
        }
        // }
    }
    draw() {
        if (!this.started) return
        if (this.drownManager?.wave) {
            this.drownManager.wave.draw()
        }
    }
}
//removeIf(production)
export default Flood
//endRemoveIf
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
       this.emitter.on("game-over",()=>{
        this.stop()
       })
       this.#changePacmanDeathSequence() 
    }  
    #changePacmanDeathSequence() {
        this.gc.emitter.removeAllListeners("pacman-death")
        const _this = this 
        this.gc.emitter.on("pacman-death", ()=>{
             const wave = _this.wavesManager.wave
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
                this.pacman.onDeath()
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
        this.wavesManager.stop()
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
import { Assets, Container, Graphics} from "pixi.js"
import Breath from "./breath.ts"
import IdleState from "../states/idleState.ts"
import StartState from "../states/startState.ts"
import EndState from "../states/endState.ts"
import CancelState from "../states/cancelState.ts"
import WaveManager from "./waveManager.ts"
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
    waveManager:WaveManager
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
        this.waveManager = new WaveManager(this)  
        console.log("Flood mod is active!")
    }
    async initialize() {
        this.pacman = this.gc.pacman
        this.gc.lives = 10
        console.log("lives for debugging ", this.gc.lives)
        this.ghosts = this.gc.ghosts

        this.waveManager.initialize()
        this.states = [new IdleState(this.waveManager), new StartState(this.waveManager),
            new EndState(this.waveManager), new CancelState(this.waveManager)
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
             const wave = _this.waveManager.wave
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
        this.waveManager.stop()
    }
    generateWave(timeToStartMS?: number) {
        this.changeState(States.IDLE_STATE)
        this.state.generateWave(timeToStartMS)
    }
    reset() {

    }
    
    update(elapsedMs:number) {
        if (!this.started) return
        
        this.waveManager.update(elapsedMs)         
        this.state.update(elapsedMs)   
        if ( !(this.state instanceof CancelState) ) {
            //start to drown Pacman
            this.waveManager.tryDrownEntities(elapsedMs)
        }
        // }
    }
    draw() {
        if (!this.started) return
        if (this.waveManager?.wave) {
            this.waveManager.wave.draw()
        }
    }
}
//removeIf(production)
export default Flood
//endRemoveIf
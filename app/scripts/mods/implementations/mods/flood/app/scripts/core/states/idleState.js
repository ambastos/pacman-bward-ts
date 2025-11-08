import Wave from "../wave.js"
import {State, States} from './state.js'
class IdleState extends State {    
    constructor(stateFactory) {
        super(stateFactory)        
    }    
    generateWave(timeToStartMS) {
        const mazeSprite = this.factory.gc.mazeSprite
        const width = this.factory.gc.width
        this.factory.wave = new Wave(mazeSprite, width, 0)
        const wave = this.factory.wave
        this.flood.container.children.length = 0        
        this.flood.container.addChild(wave)

        let waveTimeMs 
        if(timeToStartMS >=0)
            waveTimeMs = timeToStartMS
        else 
            while ((waveTimeMs = Math.random() * 40) <=15 ){}        
        this.factory.waveTime = waveTimeMs * 1000

        let durationMs
        while ((durationMs = Math.random() * 20) <=8 ){}
        wave.duration = durationMs * 1000
        this.factory.nextWaveTime = Date.now()+ this.factory.waveTime
    }
    start() {
        super.start()
        this.factory.clear()
    }
    update(elapsedMs) {        
        if (!this.started) return
        super.update(elapsedMs)
        if (!this.factory.nextWaveTime) this.generateWave()
        const wave = this.factory.wave    
        if (wave &&  !wave.started) {
            if (this.factory.nextWaveTime && Date.now() >= this.factory.nextWaveTime) {            
                this.flood.changeState(States.START_STATE)
            }
        }
    } 
    draw() {
        if (!this.started) return
    }
}
export default IdleState
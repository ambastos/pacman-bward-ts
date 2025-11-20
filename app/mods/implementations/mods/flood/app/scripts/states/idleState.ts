import WavesManager from '../core/wavesManager.ts'
import Wave from '../core/wave.ts'
import {State, States} from './state.ts'
class IdleState extends State {    
    constructor(wavesManager: WavesManager) {
        super(wavesManager)        
    }    
    generateWave(timeToStartMS?: number) {
        const maze = this.wavesManager.gc.maze
        const width = this.wavesManager.gc.width
        this.wavesManager.wave = new Wave(this.wavesManager, maze!, width, 0)
        const wave = this.wavesManager.wave
        //this.flood.container.children.length = 1        
        this.flood.container.addChildAt(wave,0)

        let waveTimeMs 
        if(timeToStartMS! >=0)
            waveTimeMs = timeToStartMS
        else 
            while ((waveTimeMs = Math.random() * 15) <=10 ){}   
        //between 15 and 40 seconds to generate a new wave     
        this.wavesManager.waveTime = waveTimeMs! * 1000

        let durationMs
        while ((durationMs = Math.random() * 20) <=10 ){}
        //the duration of the wave is between 8 and 20 seconds
        wave.duration = durationMs * 1000
        this.wavesManager.nextWaveTime = Date.now()+ this.wavesManager.waveTime
    }
    start() {
        if (this.wavesManager)
            this.wavesManager.stop()
        super.start()
    }
    update(elapsedMs: number) {        
        if (!this.started) return
        super.update(elapsedMs)
        if (!this.wavesManager.nextWaveTime) this.generateWave()
        const wave = this.wavesManager.wave    
        if (wave &&  !wave.started) {
            if ( 
                this.wavesManager.gc.gameEngine.started &&
                this.wavesManager.gc.allowKeyPresses &&
             (this.wavesManager.nextWaveTime && Date.now() >= this.wavesManager.nextWaveTime) ) {            
                this.flood.changeState(States.START_STATE)
            }
        }
    } 
    draw() {
        if (!this.started) return
    }
}
export default IdleState
import WavesManager from '../core/wavesManager.ts'
import {State, States} from './state.ts'
class EndState extends State {
    constructor(wavesManager: WavesManager) {
        super(wavesManager)
    }    
    terminateWave() {
        const wave = this.wavesManager.wave
        wave!.height = -1
        wave!.clearElements()
        
        this.flood.container.removeChild(wave!)
    //    console.log("wave ends")
        this.wavesManager.resetEntitiesBreathing()
        this.wavesManager.nextWaveTime = null
        this.wavesManager.wave = null
        
        this.flood.changeState(States.IDLE_STATE)
    }
    update(elapsedMs: number) {        
        if (!this.started) return
        super.update(elapsedMs)
        const wave = this.wavesManager.wave
        if (!wave) return
        wave.decrease(elapsedMs)       
        if (wave.isDescreasing && wave.height < 5) 
            this.terminateWave()             
    } 
    draw() {
        if (!this.started) return
    }
}
export default EndState
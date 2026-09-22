import WavesManager from '../core/wavesManager.ts'
import { State, States } from './state.ts'
class EndState extends State {
    constructor(wavesManager: WavesManager) {
        super(wavesManager)
    }
    start(): void {
        super.start()
    }
    terminateWave() {
        const wave = this.wavesManager.wave
        if (!wave) return
        wave.height = -1
        wave.started = false
        wave.clearElements()
        if (wave.parent)
            wave.parent.removeChild(wave)
        this.flood.gp.clear()
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
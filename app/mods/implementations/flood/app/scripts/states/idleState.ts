import WavesManager from '../core/wavesManager.ts'
import Wave from '../core/wave.ts'
import { State, States } from './state.ts'
class IdleState extends State {
    constructor(wavesManager: WavesManager) {
        super(wavesManager)
    }
    generateWave(timeToStartMS?: number) {
        const maze = this.wavesManager.gc.maze
        const width = this.wavesManager.gc.width

        this.wavesManager.wave = new Wave(this.wavesManager, maze!, width, 0)
        const wave = this.wavesManager.wave
        this.flood.container.addChildAt(wave, 0)

        //between the configured interval (default 10 and 30 seconds)
        //to generate a new wave
        const waveTimeMs = timeToStartMS != undefined && timeToStartMS >= 0
            ? timeToStartMS
            : this.randomWaveTimeMs()
        this.wavesManager.waveTime = waveTimeMs * 1000

        //the duration of the wave is between 8 and 20 seconds
        const durationMs = Math.floor(Math.random() * 12) + 8
        wave.duration = durationMs * 1000

        this.wavesManager.nextWaveTime = Date.now() + this.wavesManager.waveTime
    }
    randomWaveTimeMs(): number {
        const flood: any = this.wavesManager.flood
        const min = flood?.waveIntervalMin || 10
        const max = Math.max(min, flood?.waveIntervalMax || 30)
        const range = max - min
        return Math.floor(Math.random() * (range + 1)) + min
    }
    start() {
        if (this.wavesManager)
            this.wavesManager.restart()
        super.start()
    }
    update(elapsedMs: number) {
        if (!this.started) return

        super.update(elapsedMs)
        if (!this.wavesManager.nextWaveTime) this.generateWave()
        const wave = this.wavesManager.wave
        if (wave && !wave.started) {
            if (
                this.wavesManager.gc.gameEngine.started &&
                this.wavesManager.gc.allowKeyPresses &&
                (this.wavesManager.nextWaveTime && Date.now() >= this.wavesManager.nextWaveTime)
            ) {
                this.flood.changeState(States.START_STATE)
            }
        }
    }
    draw() {
        if (!this.started) return
    }
}
export default IdleState
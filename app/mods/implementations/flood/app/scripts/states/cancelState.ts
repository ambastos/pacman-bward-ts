import type WavesManager from "../core/wavesManager.ts"
import { State, States } from "./state.ts"
class CancelState extends State {
    constructor(wavesManager: WavesManager) {
        super(wavesManager)
    }
    start() {
        super.start()
        //Aqui ele aumenta a velocidade da onda quando é cancelado
        //para baixar mais rápido
        const wave = this.wavesManager.wave
        if (wave && wave.started)
            wave.speedY *= 3
    }
    endFlood() {
        const wave = this.wavesManager.wave
        if (wave) {
            wave.height = -1
            wave.started = false
            wave.cancel()
            if (wave.parent)
                wave.parent.removeChild(wave)
        }
        this.flood.gp.clear()
        //console.log("wave ends")
        this.wavesManager.resetEntitiesBreathing()
        this.wavesManager.nextWaveTime = null
        this.wavesManager.wave = null
        this.flood.stop()

        //sempre reinicia o ciclo: o cancelamento só é acionado dentro da
        //sequência de morte quando ainda havia vidas (o game-over correto
        //acontece na morte seguinte, com lives igual a 0)
        setTimeout(() => {
            this.flood.emitter.emit("start")
        }, 2250)
    }
    update(elapsedMs: number) {
        if (!this.started) return
        super.update(elapsedMs)
        const wave = this.wavesManager.wave
        //A onda pode ter terminado enquanto a sequência de morte rodava
        //(ou já foi substituída por uma nova onda ainda invisível/não iniciada),
        //portanto nada há para escoar: encerra o flood para repor o ciclo de jogo.
        if (!wave || !wave.started) {
            this.endFlood()
            return
        }

        wave.decrease(elapsedMs)

        if (wave.isDescreasing && wave.height < 5)
            this.endFlood()
    }
    draw() {
        if (!this.started) return
    }
}
export default CancelState
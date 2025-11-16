import { State, States } from './state.js';
class EndState extends State {
    constructor(drownManager) {
        super(drownManager);
    }
    terminateWave() {
        const wave = this.drownManager.wave;
        wave.height = -1;
        this.flood.container.removeChild(wave);
        //    console.log("wave ends")
        this.drownManager.resetEntitiesBreathing();
        this.drownManager.nextWaveTime = null;
        this.drownManager.wave = null;
        this.flood.changeState(States.IDLE_STATE);
    }
    update(elapsedMs) {
        if (!this.started)
            return;
        super.update(elapsedMs);
        const wave = this.drownManager.wave;
        if (!wave)
            return;
        wave.decrease(elapsedMs);
        if (wave.isDescreasing && wave.height < 5)
            this.terminateWave();
    }
    draw() {
        if (!this.started)
            return;
    }
}
export default EndState;
//# sourceMappingURL=endState.js.map
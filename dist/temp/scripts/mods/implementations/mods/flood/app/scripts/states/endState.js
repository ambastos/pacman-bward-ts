"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_js_1 = require("./state.js");
class EndState extends state_js_1.State {
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
        this.flood.changeState(state_js_1.States.IDLE_STATE);
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
exports.default = EndState;
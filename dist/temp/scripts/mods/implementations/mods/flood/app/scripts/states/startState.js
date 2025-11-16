"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_js_1 = require("./state.js");
class StartState extends state_js_1.State {
    constructor(drownManager) {
        super(drownManager);
    }
    update(elapsedMs) {
        if (!this.started)
            return;
        super.update(elapsedMs);
        const wave = this.drownManager.wave;
        if (!wave)
            return;
        if (!wave.started) {
            wave.startTime = Date.now();
            wave.started = true;
            wave.show();
        }
        let isTimeLimited = (Date.now() - wave.startTime) >= wave.duration;
        wave.increase(elapsedMs);
        if (wave.height >= this.drownManager.maxHeight || isTimeLimited)
            this.flood.changeState(state_js_1.States.END_STATE);
    }
    draw() {
        if (!this.started)
            return;
    }
}
exports.default = StartState;
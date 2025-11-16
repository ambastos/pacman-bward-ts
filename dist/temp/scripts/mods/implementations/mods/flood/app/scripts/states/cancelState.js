"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_js_1 = require("./state.js");
class CancelState extends state_js_1.State {
    constructor(drownManager) {
        super(drownManager);
    }
    start() {
        super.start();
        if (this.drownManager.wave)
            this.drownManager.wave.speedY *= 3;
    }
    endFlood() {
        const wave = this.drownManager.wave;
        if (!wave)
            return;
        wave.height = -1;
        this.drownManager.wave.cancel();
        this.flood.container.removeChild(wave);
        //    console.log("wave ends")
        this.drownManager.resetEntitiesBreathing();
        this.drownManager.nextWaveTime = null;
        this.drownManager.wave = null;
        this.flood.stop();
        // this.flood.pacman.moving = true
        // this.flood.ghosts.forEach(g=>{
        //     g.moving = true
        // })
        setTimeout(() => {
            this.flood.emitter.emit("start");
        }, 2250);
    }
    update(elapsedMs) {
        if (!this.started)
            return;
        super.update(elapsedMs);
        const wave = this.drownManager.wave;
        if (!wave)
            return;
        wave.decrease(elapsedMs);
        // this.flood.pacman.moving = false
        // this.flood.ghosts.forEach(g=>{
        //     g.moving = false
        // })
        if (wave.isDescreasing && wave.height < 5)
            this.endFlood();
    }
    draw() {
        if (!this.started)
            return;
    }
}
exports.default = CancelState;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wave_js_1 = __importDefault(require("../core/wave.js"));
const state_js_1 = require("./state.js");
class IdleState extends state_js_1.State {
    constructor(drownManager) {
        super(drownManager);
    }
    generateWave(timeToStartMS) {
        const maze = this.drownManager.gc.maze;
        const width = this.drownManager.gc.width;
        this.drownManager.wave = new wave_js_1.default(this.drownManager, maze, width, 0);
        const wave = this.drownManager.wave;
        //this.flood.container.children.length = 1        
        this.flood.container.addChildAt(wave, 0);
        let waveTimeMs;
        if (timeToStartMS >= 0)
            waveTimeMs = timeToStartMS;
        else
            while ((waveTimeMs = Math.random() * 15) <= 10) { }
        //between 15 and 40 seconds to generate a new wave     
        this.drownManager.waveTime = waveTimeMs * 1000;
        let durationMs;
        while ((durationMs = Math.random() * 20) <= 10) { }
        //the duration of the wave is between 8 and 20 seconds
        wave.duration = durationMs * 1000;
        this.drownManager.nextWaveTime = Date.now() + this.drownManager.waveTime;
    }
    start() {
        if (this.drownManager)
            this.drownManager.stop();
        super.start();
    }
    update(elapsedMs) {
        if (!this.started)
            return;
        super.update(elapsedMs);
        if (!this.drownManager.nextWaveTime)
            this.generateWave();
        const wave = this.drownManager.wave;
        if (wave && !wave.started) {
            if (this.drownManager.gc.allowKeyPresses &&
                (this.drownManager.nextWaveTime && Date.now() >= this.drownManager.nextWaveTime)) {
                this.flood.changeState(state_js_1.States.START_STATE);
            }
        }
    }
    draw() {
        if (!this.started)
            return;
    }
}
exports.default = IdleState;
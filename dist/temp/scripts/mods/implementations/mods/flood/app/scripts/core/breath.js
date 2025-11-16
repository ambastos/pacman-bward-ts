"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Breath {
    stopped = false;
    defaultBreathing = 0;
    breathing = 0;
    text;
    constructor(options) {
        let defaultOptions = {
            breathing: 5,
            maxBreathing: 10,
            decreaseVelocityPerMs: 0.7,
            invincible: false,
            elapsedTimeLastBreathMs: null,
        };
        for (let opt in options)
            //@ts-ignore
            defaultOptions[opt] = options[opt];
        for (let opt in defaultOptions)
            //@ts-ignore
            this[opt] = defaultOptions[opt];
        this.defaultBreathing = this.breathing;
    }
    showBreathingStatus() {
        if (this.text) {
        }
    }
    reset() {
        this.breathing = this.defaultBreathing;
        this.stopped = false;
    }
    stop() {
        this.stopped = true;
    }
}
exports.default = Breath;
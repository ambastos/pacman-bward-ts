"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const animation_js_1 = __importDefault(require("./animation.js"));
class Animator {
    thisClass;
    animations = new Map();
    started;
    onStart;
    onStop;
    constructor(thisClass) {
        this.thisClass = thisClass;
        this.started = true;
    }
    createAnimation(name, interval, duration, callback) {
        const an = new animation_js_1.default(interval, duration, callback, this.thisClass);
        this.animations.set(name, an);
    }
    /**
     * Plays the animation with this name
     * @param {String} name
     * @param {any} args
     */
    play(name, args) {
        const an = this.animations.get(name);
        if (!an)
            throw new Error(`There is no Animation with name ${name}.`);
        an.play(args);
    }
    /**
     * Stops the animation with this name
     * @param {String} animationName
     */
    stopAnimation(animationName) {
        this.animations.get(animationName).stop();
    }
    setOnStart(callback) {
        this.onStart = callback;
    }
    setOnStop(callback) {
        this.onStop = callback;
    }
    startAnimator() {
        if (!this.started && this.onStart) {
            this.started = true;
            this.onStart();
        }
    }
    stopAnimator() {
        if (this.started && this.onStop) {
            this.started = false;
            this.onStop();
        }
        this.animations.forEach(an => {
            an.stop();
        });
    }
    update(args) {
        let shouldStop = false;
        this.startAnimator();
        this.animations.forEach(an => {
            an.update(args);
            if (an.endTime > 0)
                shouldStop = true;
        });
        if (shouldStop)
            this.stopAnimator();
    }
}
exports.default = Animator;
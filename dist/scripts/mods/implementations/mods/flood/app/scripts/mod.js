/**
 * Module class to pacmam-bward game
 */
class Mod {
    emitter;
    gc;
    started = false;
    paused = false;
    initialized = false;
    scale = 1;
    constructor(gameCoordinator) {
        this.gc = gameCoordinator;
    }
    initialize() {
        this.initialized = true;
    }
    reset() {
    }
    start() {
        this.started = true;
    }
    stop() {
        this.started = false;
    }
    pause() {
        this.paused = true;
    }
    unPause() {
        this.paused = false;
    }
    update(elapsedMs) {
    }
    draw() {
    }
}
export default Mod;
//# sourceMappingURL=mod.js.map
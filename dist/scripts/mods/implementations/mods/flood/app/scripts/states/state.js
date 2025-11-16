const States = {
    IDLE_STATE: 0,
    START_STATE: 1,
    END_STATE: 2,
    CANCEL_STATE: 3,
};
class State {
    drownManager;
    started = false;
    flood;
    constructor(drownManager) {
        this.drownManager = drownManager;
        this.started = false;
        this.flood = drownManager.flood;
    }
    start() {
        this.started = true;
    }
    stop() {
        this.started = false;
    }
    generateWave(timeToStartMS) {
    }
    update(elapsedMs) {
    }
    draw() {
    }
}
export { State, States };
//# sourceMappingURL=state.js.map
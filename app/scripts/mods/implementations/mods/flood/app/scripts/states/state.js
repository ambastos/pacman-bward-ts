const States = {
    IDLE_STATE:0, 
    START_STATE:1, 
    END_STATE:2,
    CANCEL_STATE: 3,
}

class State {
    flood = null
    constructor(drownManager) {
        this.drownManager = drownManager
        this.started = false
        this.flood = drownManager.flood
    }
    start() {
        this.started = true
    }
    stop() {
        this.started = false
    }
    update() {        
    }
    draw() {
    }
}
export {State, States}
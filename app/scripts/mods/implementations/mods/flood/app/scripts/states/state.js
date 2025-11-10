const States = {
    IDLE_STATE:0, 
    START_STATE:1, 
    END_STATE:2,
    CANCEL_STATE: 3,
}

class State {
    flood = null
    constructor(factory) {
        this.factory = factory
        this.started = false
        this.flood = factory.flood
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
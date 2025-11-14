class Breath {
    stopped = false
    constructor(options) {
         let defaultOptions = {
            breathing: 5, 
            maxBreathing: 10,
            decreaseVelocityPerMs: 0.7,     
            invincible: false,
            elapsedTimeLastBreathMs: null,       
        }

        for (let opt in options) 
            defaultOptions[opt] = options[opt]
        for (let opt in defaultOptions) 
            this[opt] = defaultOptions[opt] 
        this.defaultBreathing = this.breathing
    }
    showBreathingStatus() {
        if (this.text) {
            
        }
    }
    reset() {
        this.breathing = this.defaultBreathing
        this.stopped = false
    }
    stop() {
        this.stopped = true
    }
}
export default Breath
class Breath {
    stopped = false
    defaultBreathing:number = 0
    breathing: number = 0
    text!: string
    constructor(options: any) {
         let defaultOptions = {
            breathing: 5, 
            maxBreathing: 10,
            decreaseVelocityPerMs: 0.7,     
            invincible: false,
            elapsedTimeLastBreathMs: 0,       
        }
        for (let opt in options) 
            //@ts-ignore
            defaultOptions[opt] = options[opt]
        for (let opt in defaultOptions) 
            //@ts-ignore
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
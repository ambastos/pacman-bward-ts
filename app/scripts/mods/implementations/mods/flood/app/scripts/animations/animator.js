import Animation from "./animation.js"

class Animator {
    thisClass
    animations = new Map()
    started 
    onStart
    onStop
    constructor(thisClass) {
        this.thisClass = thisClass
        this.started = true
    }
    createAnimation(name, interval, duration, callback) {
        const an = new Animation(interval, duration, callback, this.thisClass)
        this.animations.set(name, an)        
    }
    /**
     * Plays the animation with this name
     * @param {String} name 
     * @param {any} value 
     */
    play(name, value) {
        const an = this.animations.get(name)
        if (!an)
            throw new Error(`There is no Animation with name ${name}.`)
        an.play(value)
    }
    /**
     * Stops the animation with this name
     * @param {String} animationName 
     */
    stopAnimation(animationName) {
        this.animations.get(animationName).stop()
    }
    setOnStart(callback) {
        this.onStart = callback
    }
    setOnStop(callback) {
        this.onStop = callback
    }
    startAnimator() {
        if (!this.started && this.onStart) {
            this.started = true
            this.onStart()
        }
    } 
    stopAnimator() {
        if (this.started && this.onStop) {
            this.started = false
            this.onStop()
        }
        this.animations.forEach(an=>{
            an.stop()
        })
    }   
    update(args) {  
        let shouldStop = false      
        this.startAnimator()
        this.animations.forEach(an=>{
            an.update(args)
            if (an.endTime > 0)
                shouldStop = true
        })
        if (shouldStop)
            this.stopAnimator()
    }
}
export default Animator
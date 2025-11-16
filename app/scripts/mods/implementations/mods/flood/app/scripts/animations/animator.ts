import Animation from "./animation.js"

class Animator {
    thisClass:any
    animations = new Map()
    started 
    onStart!:any
    onStop!:any
    constructor(thisClass:any) {
        this.thisClass = thisClass
        this.started = true
    }
    createAnimation(name: string, interval: number, 
        duration: number | null, callback: (args: any) => void) {
        const an = new Animation(interval, duration, callback, this.thisClass)
        this.animations.set(name, an)        
    }
    /**
     * Plays the animation with this name
     * @param {String} name 
     * @param {any} args 
     */
    play(name: any, args: any) {
        const an = this.animations.get(name)
        if (!an)
            throw new Error(`There is no Animation with name ${name}.`)
        an.play(args)
    }
    /**
     * Stops the animation with this name
     * @param {String} animationName 
     */
    stopAnimation(animationName: any) {
        this.animations.get(animationName).stop()
    }
    setOnStart(callback: any) {
        this.onStart = callback
    }
    setOnStop(callback: any) {
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
    update(args?: any) {  
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
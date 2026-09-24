import Animation from "./animation.ts"

class Animator {
    thisClass:any
    animations = new Map<string, Animation>()
    currentAnimation:{name:string | null, animation:Animation | null} = 
        {name: null, animation: null}
    started 
    onStart!:any
    onStop!:any
    constructor(thisClass:any) {
        this.thisClass = thisClass
        this.started = true
    }
    createAnimation(name: string, interval: number, 
        duration: number | null, callback: (args: any) => void):Animation {
        const an = new Animation(interval, duration, callback, this.thisClass)
        this.animations.set(name, an)       
        return an 
    }
    /**
     * Reset the current animation to replay again
     * @param name 
     */
    restart(name:string) {
        const an = this.animations.get(name)
        if (an) {
            an.reset()
        }
    }
    isPlaying(name:string) {
        const an = this.animations.get(name)
        return (an && an.playing)
    }
    /**
     * Plays the animation with this name 
     * @param {string} name 
     * Default is pause previous animations, if it's true keep play previous ones
     * @param keepRunningPreviousAnimation {boolean} 
     * @param {any} args 
     */
    play(name: string, args?: any, keepRunningPreviousAnimation?: boolean) {
        if (!keepRunningPreviousAnimation) {
            const anims = this.animations.keys().filter(k=>k!=name)
            let key = anims.next()
            while(key?.value != undefined) {
                this.animations.get(key.value!)?.pause()
                key = anims.next()
            }
        }
        const an = this.animations.get(name)
        if (!an)
            throw new Error(`There is no Animation with name ${name}.`)
        if (an.end) {
            console.warn("Animation: '", name, "' was finished. Run 'restart' to play it again")
            return 
        }
        an.play(args)
        this.currentAnimation.name = name
        this.currentAnimation.animation = an     
    }
    /**
     * Stops the animation with this name
     * @param {String} animationName 
     */
    stopAnimation(animationName: any) {
        this.animations.get(animationName)?.stop()
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
        })
        // if (shouldStop)
        //     this.stopAnimator()
    }
}
export default Animator
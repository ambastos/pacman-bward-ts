class Animation {
    startTime:number | null = 0
    currentTime:number | null = 0
    interval = 0
    duration:number | null = null
    playing = false
    end = false
    endTime:number | null = 0
    callback!:Function
    args:any[] = []
    thisClass: any    
    startEvent!:Function
    endEvent!:Function
    constructor(interval: number, duration: number | null, callback: ((args: any) => void), thisClass: any) {
        this.interval = interval
        this.duration = duration
        this.callback = callback
        this.thisClass = thisClass
        if (this.callback)
            this.callback.bind(this.thisClass)
    }
    reset() {
        this.startTime = null
        this.currentTime = null
        this.end = false
        this.endTime = null
    }
    play(keys_values_args: any) {
        this.playing = true
        this.startTime = Date.now()
        this.currentTime = this.startTime
        if (keys_values_args)
           this.updateArguments(keys_values_args, false)
        if (this.startEvent) this.startEvent(this.args)
    }
    pause() {
        this.playing = false
    }
    unpause() {
        this.playing = true
    }
    stop() {
        this.#end()
    }   
    onStart(callback:Function) {
        this.startEvent = callback
        return this
    }
    onEnd(callback:Function) {
        this.endEvent = callback      
        return this
    }
    update(args: any) {
        if (!this.playing) return
        const elapsedTime = Date.now() - this.currentTime!
        if (this.interval > 0 && elapsedTime >=this.interval) {
            //console.log(this.currentTime)
            if (this.callback) {
                //update the args                
                this.updateArguments(args, true)
                this.callback.bind(this.thisClass)
                .apply(this.callback, this.args)
            }
            this.currentTime = Date.now()
        }
        if (this.duration! > 0 &&
            (Date.now() - this.startTime!) >= this.duration!) {
            this.#end()
        }
    }
    updateArguments(args: any, passArgsFirst: boolean) {
        let numberOfArgs = 0
        for (let argName in args) {
            numberOfArgs++
        if (numberOfArgs > 0) {
            //delete the first arguments            
            for (let i = 0; i < this.args.length; i++) {
                if (this.args[i]![i]) {
                    this.args.splice(i, 1) 
                    i--
                }
            }
            
            }
            let index = 0
             if (passArgsFirst)
                index = 0
            else 
                index = numberOfArgs -1
            //include the arguments in first line of all arguments
            for (let argName in args) {
                let arg = args[argName]
                if (args instanceof Object) {
                    //@ts-ignore
                    this.args.splice(index, index, args)
                } else {
                    let obj = {}
                    //@ts-ignore
                    obj[argName] = arg                                       
                    //@ts-ignore
                    this.args.splice(index, index, obj)
                }
            }
        }
    }

    #end() {
        this.endTime = Date.now()
        this.end = true
        this.playing = false
        if (this.endEvent) this.endEvent(this.args)
    }
}
export default Animation
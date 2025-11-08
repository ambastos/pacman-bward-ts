class Animation {
    startTime = 0
    currentTime = 0
    interval = 0
    duration = 0
    playing = false
    end = false
    endTime = 0
    callback = null
    args = []
    constructor(interval, duration, callback, thisClass) {
        this.interval = interval
        this.duration = duration
        this.callback = callback
        this.thisClass = thisClass
        if (this.callback)
            this.callback.bind(this.thisClass)
    }
    play(keys_values_args) {
        this.playing = true
        this.startTime = Date.now()
        this.currentTime = this.startTime
        if (keys_values_args)
            for (const obj of keys_values_args ) 
                this.args.push(obj) 
    }
    stop() {
        this.#end()
    }
    update(args) {
        if (!this.playing) return
        const elapsedTime = Date.now() - this.currentTime
        if (this.interval > 0 && elapsedTime >=this.interval) {
            //console.log(this.currentTime)
            if (this.callback) {
                //update the args                
                if (arguments.length>0) {
                    //delete the first arguments
                    for (let i =0; i < this.args.length; i++) {
                        if (this.args[i][i]) {
                            this.args.splice(i,1)
                            i--
                        }
                    }
                    //include the arguments in first line of all arguments
                    for (let i =0; i < arguments.length; i++) {
                        let arg = arguments[i]
                        if (args instanceof Object) {
                            this.args.splice(0,0,arg)
                        }else {
                            let obj = {}
                            obj[i] = arg
                            this.args.splice(0,0,obj)
                        }
                    }
                }
                this.callback.bind(this.thisClass)
                .apply(this.callback, this.args)
            }
            this.currentTime = Date.now()
        }
        if (this.duration > 0 &&
            (Date.now() - this.startTime) >= this.duration) {
            this.#end()
        }
    }
    #end() {
        this.endTime = Date.now()
        this.end = true
        this.playing = false
    }
}
export default Animation
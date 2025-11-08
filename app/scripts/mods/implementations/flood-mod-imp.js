//import Flood from '../../../../flood-pacman-bward/app/scripts/flood.js'
//import Flood from 'flood-pacman-bward''
import Mod from '../mod.js'
import Flood from './mods/flood/app/scripts/core/flood.js'

class FloodModImp extends Mod{
    flood
    constructor(gameCoodinator) { 
        super(gameCoodinator) 
        this.flood = new Flood(gameCoodinator) 
    }
    initialize() {
        this.flood.initialize()
    } 
    start() {
        this.flood.start()
    }
    stop() {
        this.flood.stop()
    }
    pause() {
        this.flood.pause()
    }    
    update(elapsedMs) {        
        super.update()
        this.flood.update(elapsedMs)
    }
    draw() {
        super.draw()
        this.flood.draw()
    }
} 
if (!process.env.NYC_PROCESS_ID) 
  global.window.FloodModImp = FloodModImp
//removeIf(production)
export default FloodModImp
//endRemoveIf
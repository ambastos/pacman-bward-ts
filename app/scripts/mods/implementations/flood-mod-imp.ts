//import Flood from '../../../../flood-pacman-bward/app/scripts/flood.js'
//import Flood from 'flood-pacman-bward''
import GameCoordinator from '../../core/gameCoordinator.js'
import Mod from '../mod.js'
import Flood from './mods/flood/app/scripts/core/flood.js'

class FloodModImp extends Mod{
    flood
    constructor(gameCoodinator: GameCoordinator) { 
        super(gameCoodinator) 
        this.flood = new Flood(gameCoodinator) 
    }
    initialize() {
        this.flood.initialize()
    } 
    reset() {
        this.flood.reset()
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
    update(elapsedMs: number) {        
        super.update(elapsedMs)
        this.flood.update(elapsedMs)
    }
    draw() {
        super.draw()
        this.flood.draw()
    }
} 
// if (!process.env.NYC_PROCESS_ID) 
//   global.window.FloodModImp = FloodModImp
//removeIf(production)
export default FloodModImp
//endRemoveIf
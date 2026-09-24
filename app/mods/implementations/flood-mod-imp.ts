//import Flood from '../../../../flood-pacman-bward/app/scripts/flood.js'
//import Flood from 'flood-pacman-bward''
import { ProgressCallback } from 'pixi.js'
import Mod from '../mod.ts'
import Flood from './flood/app/scripts/core/flood.ts'
import GameCoordinator from '../../scripts/core/gameCoordinator.ts'

class FloodModImp extends Mod{
    name = "flood"
    flood
    constructor(gameCoodinator: GameCoordinator) { 
        super(gameCoodinator) 
        this.flood = new Flood(gameCoodinator) 
    }
    initialize() {
        this.flood.initialize()
    } 
    getResources() {
        return this.flood.am.getResources()
    }
    loadAssets(callback:ProgressCallback): Promise<Record<string, any>> {
        return this.flood.am.loadAssets(callback)
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
import EventEmitter from "eventemitter3"
import type GameCoordinator from "../core/gameCoordinator.ts"

/**
 * Module class to pacmam-bward game
 */
class Mod {    
    name:string = ""
    emitter:EventEmitter 
    started:boolean = false
    paused:boolean = false
    initialized:boolean = false
    scale:number = 1
    gc:GameCoordinator
    constructor(gameCoordinator:GameCoordinator) {
        this.gc = gameCoordinator   
        this.emitter = this.gc.emitter     
    }
    initialize() {
        this.initialized = true
    }
    getResources():string[] {
        return []
    }
    async loadAssets(callback:unknown):Promise<Record<string, any> | null> {
      return null
    }
    reset() {

    }
    start() {
        this.started = true
    }
    stop() {
        this.started = false
    }
    pause() {
        this.paused = true
    }
    unPause() {
        this.paused = false
    }
   
    update(elapsedMs:number) {

    }
    draw() {

    }
}
export default Mod

/**
 * Registro de mods, para que um mod de outro projeto possa se cadastrar
 * em runtime. Exposto pelo pacote (pacman-bward-ts/mod) e lido pelo
 * SettingsManager. O jogo puro nao registra nada aqui.
 */
export const mods: Record<string, any> = {}

import { Assets, Cache, ProgressCallback, Texture } from "pixi.js";
import Flood from "./flood.js";
class AssetsManager {
    flood: Flood;
    constructor(flood: Flood) {
        this.flood = flood
    }
    getResources():string[] {
        return ["bubbles", "sonic"]
    }
    async loadAssets(callbackProgress?:ProgressCallback) {
        const path = 'app/mods/implementations/mods/flood/app/sprites/' 
        Assets.add({alias: "bubbles", src: `${path}bubbles.png`}) 
        Assets.add({alias: "sonic", src: `${path}sonic_sprites.png`}) 
         
        const resources =  this.getResources()        
        const textures = await Assets.load(resources, callbackProgress)     
        //Add textures to the main assetsManager cache
        for (const name in textures)  
            this.flood.gc.am.textures.set(name, textures[name]) 
        return textures
    }
    getTexture(textureName:string, frameX?:number, frameY?:number,
        width?:number, height?:number, spWidth?:number, spHeight?:number
    ):Texture | undefined {
        return this.flood.gc.am.getTexture(textureName,frameX, frameY,
            width,height,spWidth,spHeight)
    }   
}
export default AssetsManager
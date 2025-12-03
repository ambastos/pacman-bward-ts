import { Assets, Cache, ProgressCallback, Texture } from "pixi.js";
import { sound,Sound } from '@pixi/sound'
import Flood from "./flood.ts";
class AssetsManager {
    flood: Flood;
    constructor(flood: Flood) {
        this.flood = flood
    }
    getResources(): string[] {
        return ["bubbles", "sonic", "sonic_break", "sonic_bubbles", "sonic_death", 
            "sonic_drown", "sonic_impact", "sonic_jump", "sonic_attack"]
    }
    async loadAssets(callbackProgress?: ProgressCallback) {
        const path = 'app/mods/implementations/mods/flood/app/sprites/'
        const pathSound = 'app/mods/implementations/mods/flood/app/sounds/'        
        Sound.from(`${pathSound}sonic_break_CB.wav`)
        
        Assets.add({ alias: "bubbles", src: `${path}bubbles.png` })
        Assets.add({ alias: "sonic", src: `${path}sonic_sprites.png` })
        Assets.add({ alias: "sonic_break", src: `${pathSound}sonic_break_CB.wav` })
        Assets.add({ alias: "sonic_bubbles", src: `${pathSound}sonic_bubbles_AD.wav` })
        Assets.add({ alias: "sonic_death", src: `${pathSound}sonic_death_A3.wav` })
        Assets.add({ alias: "sonic_drown", src: `${pathSound}sonic_drown_B2.wav` })
        Assets.add({ alias: "sonic_impact", src: `${pathSound}sonic_impact_C1.wav` })
        Assets.add({ alias: "sonic_jump", src: `${pathSound}sonic_jump_A0.wav` })
        Assets.add({ alias: "sonic_attack", src: `${pathSound}sonic_speed_attack_BE.wav` })

        const resources = this.getResources()
        const assets = await Assets.load(resources, callbackProgress)
        //Add textures to the main assetsManager cache
        for (const name in assets) {
            this.flood.gc.am.textures.set(name, assets[name])
        }
        return assets
    }
    getTexture(textureName: string, frameX?: number, frameY?: number,
        width?: number, height?: number, spWidth?: number, spHeight?: number
    ): Texture | undefined {
        return this.flood.gc.am.getTexture(textureName, frameX, frameY,
            width, height, spWidth, spHeight)
    }
}
export default AssetsManager
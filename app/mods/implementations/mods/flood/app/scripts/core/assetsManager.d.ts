import { ProgressCallback, Texture } from "pixi.js";
import Flood from "./flood.ts";
declare class AssetsManager {
    flood: Flood;
    constructor(flood: Flood);
    getResources(): string[];
    loadAssets(callbackProgress?: ProgressCallback): Promise<Record<string, any>>;
    getTexture(textureName: string, frameX?: number, frameY?: number, width?: number, height?: number, spWidth?: number, spHeight?: number): Texture | undefined;
}
export default AssetsManager;
//# sourceMappingURL=assetsManager.d.ts.map
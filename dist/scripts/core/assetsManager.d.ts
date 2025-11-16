import { Texture } from "pixi.js";
import GameCoordinator from "./gameCoordinator.js";
declare class AssetsManager {
    #private;
    gameCoordinator: GameCoordinator;
    textures: Map<String, Texture>;
    constructor(gameCoordinator: GameCoordinator);
    load(): Promise<void>;
    getTexture(textureName: string, frameX?: number, frameY?: number, width?: number, height?: number, spWidth?: number, spHeight?: number): any;
}
export default AssetsManager;
//# sourceMappingURL=assetsManager.d.ts.map
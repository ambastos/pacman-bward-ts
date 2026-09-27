import { Texture } from "pixi.js";
import GameCoordinator from "./gameCoordinator.ts";
declare class AssetsManager {
    gameCoordinator: GameCoordinator;
    textures: Map<String, Texture>;
    constructor(gameCoordinator: GameCoordinator);
    load(): Promise<void>;
    /**
     * Iterates through a list of sources and updates the loading bar as the assets load in
     * @param {String[]} sources
     * @param {('img'|'audio')} type
     * @param {Number} totalSources
     * @param {Object} gameCoord
     * @returns {Promise}
     */
    createElements(sources: string[], type: string, totalSources: number, gameCoord: any): Promise<void>;
    private createTextures;
    private createPacmanSprite;
    private createGhostsSprites;
    private createPickupsSprite;
    getTexture(textureName: string, frameX?: number, frameY?: number, width?: number, height?: number, spWidth?: number, spHeight?: number): Texture | undefined;
}
export default AssetsManager;
//# sourceMappingURL=assetsManager.d.ts.map
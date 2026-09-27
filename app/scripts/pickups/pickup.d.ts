import { ObservablePoint, Texture } from "pixi.js";
import StaticEntity from "../characters/staticEntity.ts";
import GameCoordinator from "../core/gameCoordinator.ts";
import Pacman from "../characters/pacman.ts";
declare class Pickup extends StaticEntity {
    type: string;
    pacman: Pacman;
    mazeDiv: any;
    points: number;
    nearPacman: boolean;
    sprites: [] | null;
    fruitImages: any;
    size: number;
    center: any;
    constructor(type: string, column: number, row: number, points: number, gameCoordinator: GameCoordinator);
    /**
     * Resets the pickup's visibility
     */
    reset(): void;
    /**
     * Sets various style measurements for the pickup depending on its type
     * @param {('pacdot'|'powerPellet'|'fruit')} type - The classification of pickup
     * @param {number} scaledTileSize
     * @param {number} column
     * @param {number} row
     * @param {number} points
     */
    setStyleMeasurements(type: string, scaledTileSize: number, column: number, row: number, points: number): void;
    getFruitName(points: number): any;
    getTexture(type: string): Texture<import("pixi.js").Resource> | undefined;
    setTexture(type: string): void;
    /**
     * Shows a bonus fruit, resetting its point value and image
     * @param {number} points
     */
    showFruit(points: number): void;
    /**
     * Makes the fruit invisible (happens if Pacman was too slow)
     */
    hideFruit(): void;
    /**
     * Returns true if the Pickup is touching a bounding box at Pacman's center
     * @param {({ x: number, y: number, size: number})} pickup
     * @param {({ x: number, y: number, size: number})} originalPacman
     * @returns {boolean}
     */
    checkForCollision(pickup: Pickup, originalPacman: Pacman): boolean;
    /**
     * Checks to see if the pickup is close enough to Pacman to be considered for collision detection
     * @param {number} maxDistance - The maximum distance Pacman can travel per cycle
     * @param {({ x:number, y:number })} pacmanCenter - The center of Pacman's hitbox
     * @param {Boolean} debugging - Flag to change the appearance of pickups for testing
     */
    checkPacmanProximity(maxDistance: number, pacmanCenter: ObservablePoint, debugging: boolean): void;
    /**
     * Checks if the pickup is visible and close to Pacman
     * @returns {Boolean}
     */
    shouldCheckForCollision(): boolean;
    /**
     * If the Pickup is still visible, it checks to see if it is colliding with Pacman.
     * It will turn itself invisible and cease collision-detection after the first
     * collision with Pacman.
     */
    update(elapsedMs: number): void;
}
export default Pickup;
//# sourceMappingURL=pickup.d.ts.map
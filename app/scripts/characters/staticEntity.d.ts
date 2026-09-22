import { ObservablePoint, Point, Rectangle, Sprite } from "pixi.js";
import GameCoordinator from "../core/gameCoordinator.ts";
import EventEmitter from "eventemitter3";
declare class StaticEntity extends Sprite {
    allowCollision: boolean;
    emitter: EventEmitter;
    gameCoordinator: GameCoordinator;
    scaledTileSize: number;
    hitArea: Rectangle | null;
    msSinceLastSprite: number;
    msBetweenSprites: number;
    frame: number;
    spriteFrames: number;
    animate: boolean;
    measurement: number;
    loopAnimation: boolean;
    mazeArray: any;
    display: boolean;
    constructor(gameCoordinator: GameCoordinator, name: string);
    registerEventListeners(): void;
    onReset(): void;
    onDeath(): void;
    reset(): void;
    get axis(): ObservablePoint<Point>;
    update(elapsedMs: number): void;
    private createHitArea;
    draw(interp: number): void;
}
export default StaticEntity;
//# sourceMappingURL=staticEntity.d.ts.map
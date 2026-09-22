import { ObservablePoint, Point, Resource, Texture } from "pixi.js";
import Flood from "../core/flood.ts";
import Animator from "../animations/animator.ts";
import Ghost from "../../../../../../../scripts/characters/ghost.ts";
import Pacman from "../../../../../../../scripts/characters/pacman.ts";
import Timer from "../../../../../../../scripts/utilities/timer.ts";
import MovableEntity from "../../../../../../../scripts/characters/movableEntity.ts";
import { Mode } from "../../../../../../../scripts/characters/types.ts";
declare class Sonic extends Ghost {
    flood: Flood;
    animator: Animator;
    frameY: number;
    bad: boolean;
    seenTarget: boolean;
    targetDef: TargetDef;
    attackSpeed: number;
    activeTimers: Timer[];
    constructor(flood: Flood);
    private createAnimations;
    reset(fullGameReset?: boolean): void;
    registerEventListeners(): void;
    setDefaultMode(): void;
    setMovementStats(pacman: Pacman, name: string, level: number): void;
    private generateTargetType;
    setSpriteAnimationStats(): void;
    setDefaultPosition(scaledTileSize: number, name: string): void;
    setStyleMeasurements(scaledTileSize: number, spriteFrames: number): void;
    setSpriteSheet(name: string, direction: string, mode: string): void;
    setTexture(name: string, direction: string, frameX: number, emotion: string | null, frameY?: number, width?: number, height?: number): void;
    getTexture(name: string, direction: string, frameX: number, emotion: string): Texture<Resource> | undefined;
    determineVelocity(position: ObservablePoint, mode: Mode): any;
    getTarget(name: string, gridPosition: ObservablePoint, pacmanGridPosition: ObservablePoint, mode: string): ObservablePoint<Point> | undefined;
    private scheduleGoOut;
    private handleAnimations;
    handleMovement(elapsedMs: number): ObservablePoint;
    checkCollision(position: ObservablePoint, target: MovableEntity): void;
    private onGhostKick;
    update(elapsedMs: number): void;
    draw(interp: number): void;
}
export default Sonic;
type TargetDef = {
    type: "point" | "pacman" | "ghost";
    nextTargetTime: number;
    targetPoint?: ObservablePoint | undefined;
    targetReached?: boolean;
};
//# sourceMappingURL=sonic.d.ts.map
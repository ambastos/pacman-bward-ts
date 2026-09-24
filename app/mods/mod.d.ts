import EventEmitter from "eventemitter3";
import GameCoordinator from "../scripts/core/gameCoordinator.ts";
/**
 * Module class to pacmam-bward game
 */
declare class Mod {
    name: string;
    emitter: EventEmitter;
    started: boolean;
    paused: boolean;
    initialized: boolean;
    scale: number;
    gc: GameCoordinator;
    constructor(gameCoordinator: GameCoordinator);
    initialize(): void;
    getResources(): string[];
    loadAssets(callback: unknown): Promise<Record<string, any> | null>;
    reset(): void;
    start(): void;
    stop(): void;
    pause(): void;
    unPause(): void;
    update(elapsedMs: number): void;
    draw(): void;
}
export default Mod;
//# sourceMappingURL=mod.d.ts.map
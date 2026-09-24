import { ProgressCallback } from 'pixi.js';
import Mod from '../mod.ts';
import Flood from './mods/flood/app/scripts/core/flood.ts';
import GameCoordinator from '../../scripts/core/gameCoordinator.ts';
declare class FloodModImp extends Mod {
    name: string;
    flood: Flood;
    constructor(gameCoodinator: GameCoordinator);
    initialize(): void;
    getResources(): string[];
    loadAssets(callback: ProgressCallback): Promise<Record<string, any>>;
    reset(): void;
    start(): void;
    stop(): void;
    pause(): void;
    update(elapsedMs: number): void;
    draw(): void;
}
export default FloodModImp;
//# sourceMappingURL=flood-mod-imp.d.ts.map
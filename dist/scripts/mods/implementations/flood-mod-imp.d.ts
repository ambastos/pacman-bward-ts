import GameCoordinator from '../../core/gameCoordinator.js';
import Mod from '../mod.js';
import Flood from './mods/flood/app/scripts/core/flood.js';
declare class FloodModImp extends Mod {
    flood: Flood;
    constructor(gameCoodinator: GameCoordinator);
    initialize(): void;
    reset(): void;
    start(): void;
    stop(): void;
    pause(): void;
    update(elapsedMs: number): void;
    draw(): void;
}
export default FloodModImp;
//# sourceMappingURL=flood-mod-imp.d.ts.map
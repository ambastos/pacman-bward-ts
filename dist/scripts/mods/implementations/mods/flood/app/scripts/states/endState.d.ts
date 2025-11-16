import DrownManager from '../core/drownManager.js';
import { State } from './state.js';
declare class EndState extends State {
    constructor(drownManager: DrownManager);
    terminateWave(): void;
    update(elapsedMs: number): void;
    draw(): void;
}
export default EndState;
//# sourceMappingURL=endState.d.ts.map
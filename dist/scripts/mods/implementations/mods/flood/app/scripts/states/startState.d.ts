import DrownManager from '../core/drownManager.js';
import { State } from './state.js';
declare class StartState extends State {
    constructor(drownManager: DrownManager);
    update(elapsedMs: number): void;
    draw(): void;
}
export default StartState;
//# sourceMappingURL=startState.d.ts.map
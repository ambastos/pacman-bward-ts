import DrownManager from '../core/drownManager.js';
import { State } from './state.js';
declare class IdleState extends State {
    constructor(drownManager: DrownManager);
    generateWave(timeToStartMS?: number): void;
    start(): void;
    update(elapsedMs: number): void;
    draw(): void;
}
export default IdleState;
//# sourceMappingURL=idleState.d.ts.map
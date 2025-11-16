import DrownManager from "../core/drownManager.js";
import { State } from "./state.js";
declare class CancelState extends State {
    constructor(drownManager: DrownManager);
    start(): void;
    endFlood(): void;
    update(elapsedMs: number): void;
    draw(): void;
}
export default CancelState;
//# sourceMappingURL=cancelState.d.ts.map
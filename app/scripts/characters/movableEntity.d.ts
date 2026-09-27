import { ObservablePoint, Point } from "pixi.js";
import GameCoordinator from "../core/gameCoordinator.ts";
import CharacterUtil from "../utilities/characterUtil.ts";
import StaticEntity from "./staticEntity.ts";
declare class MovableEntity extends StaticEntity {
    characterUtil: CharacterUtil;
    defaultPosition: ObservablePoint<any>;
    oldPosition: ObservablePoint<any>;
    moving: boolean;
    paused: boolean;
    level: number;
    direction: string;
    constructor(gameCoordinator: GameCoordinator, name: string, characterUtil: CharacterUtil);
    /**
   * Sets a flag to indicate when the ghost should pause its movement
   * @param {Boolean} newValue
   */
    pause(newValue: boolean): void;
    getGridPosition(): ObservablePoint<Point>;
}
export default MovableEntity;
//# sourceMappingURL=movableEntity.d.ts.map
import GameCoordinator from "../core/gameCoordinator.ts";
import CharacterUtil from "../utilities/characterUtil.ts";
import { createObservablePoint } from "../utilities/utils.ts";
import StaticEntity from "./staticEntity.ts";

class MovableEntity extends StaticEntity{
    defaultPosition = createObservablePoint(this,0,0);
    oldPosition = createObservablePoint(this,0,0); 
    moving!:boolean
    level!:number
    direction!:string
    constructor(gameCoordinator:GameCoordinator, name:string, characterUtil:CharacterUtil) {
        super(gameCoordinator,name, characterUtil)
    }
}
export default MovableEntity
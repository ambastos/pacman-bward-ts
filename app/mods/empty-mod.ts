import GameCoordinator from "../scripts/core/gameCoordinator.js";
import Mod from "./mod.js";

class EmptyMod extends Mod{
    constructor(gameCoordinator:GameCoordinator) {
        super(gameCoordinator)
    }
   
}
export default EmptyMod
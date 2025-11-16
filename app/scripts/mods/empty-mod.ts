import GameCoordinator from "../core/gameCoordinator.js";
import Mod from "./mod.js";

class EmptyMod extends Mod{
    constructor(gameCoordinator:GameCoordinator) {
        super(gameCoordinator)
    }
   
}
export default EmptyMod
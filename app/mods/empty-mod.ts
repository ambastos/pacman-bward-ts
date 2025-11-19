import GameCoordinator from "../scripts/core/gameCoordinator.ts";
import Mod from "./mod.ts";

class EmptyMod extends Mod{
    constructor(gameCoordinator:GameCoordinator) {
        super(gameCoordinator)
    }
   
}
export default EmptyMod
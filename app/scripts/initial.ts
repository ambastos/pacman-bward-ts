// import GameCoordinator from "./core/gameCoordinator.js";
// import Debugger from "./utilities/debugger.js";
// import FloodModImp from "../mods/implementations/flood-mod-imp.js";

import GameCoordinator from "./core/gameCoordinator.js"
import FloodModImp from "./mods/implementations/flood-mod-imp.js"
import Debugger from "./utilities/debugger.js"

  window.onload = () =>{
    window.gc = new GameCoordinator() 
    const mod = new FloodModImp(window.gc) 
    window.gc.setMod(mod)
    window.debug = new Debugger(window.gc) 
}
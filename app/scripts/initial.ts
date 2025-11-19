// import GameCoordinator from "./core/gameCoordinator.ts";
// import Debugger from "./utilities/debugger.ts";
// import FloodModImp from "../mods/implementations/flood-mod-imp.ts";

import FloodModImp from "../mods/implementations/flood-mod-imp.ts"
import GameCoordinator from "./core/gameCoordinator.ts"
//import Debugger from "./utilities/debugger.ts"

  window.onload = () =>{
    window.gc = new GameCoordinator() 
    const mod = new FloodModImp(window.gc) 
    window.gc.setMod(mod)     
    //window.debug = new Debugger(window.gc) 
}
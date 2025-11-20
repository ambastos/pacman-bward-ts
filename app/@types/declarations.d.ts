import GameCoordinator from "../scripts/core/gameCoordinator.ts";

  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
  declare global {
    interface Window {
      webkitAudioContext: any
      //For debug puporses
      gc: any
      debug:any
      f:any
      PIXI: any
    }    
  }
  declare global {
    interface HTMLImageElement {
      load:Function
    }
  }
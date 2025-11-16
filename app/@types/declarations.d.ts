import GameCoordinator from "../scripts/core/gameCoordinator.ts";

  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
  declare global {
    interface Window {
      gc: any
      debug:any
      webkitAudioContext: any
      PIXI: any
    }    
  }
  declare global {
    interface HTMLImageElement {
      load:Function
    }
  }
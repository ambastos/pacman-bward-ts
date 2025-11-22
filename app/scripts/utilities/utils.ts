import { ObservablePoint } from "pixi.js";

export function copyPosition(classThis:any, position:ObservablePoint ):ObservablePoint {
    return new ObservablePoint(()=>{}, classThis, position.x, position.y) 
}
export function createObservablePoint(classThis:any, x:number, y:number) {
    return new ObservablePoint(()=>{}, classThis,x, y)
}
export function getGridPosition(classThis:any, position:ObservablePoint, 
    scaledTileSize:number) {
    return createObservablePoint(
      classThis,
        (position.x / scaledTileSize) + 0.5,
        (position.y / scaledTileSize) + 0.5,
    );
}
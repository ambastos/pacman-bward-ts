import { ObservablePoint } from "pixi.js";

export function copyPosition(classThis:any, position:ObservablePoint ):ObservablePoint {
    return new ObservablePoint(()=>{}, classThis, position.x, position.y) 
}
export function createObservablePoint(classThis:any, x:number, y:number) {
    return new ObservablePoint(()=>{}, classThis,x, y)
}
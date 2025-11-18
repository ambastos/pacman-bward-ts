import Animator from "../animations/animator.js"
import Flood from "../core/flood.js"

interface Entity  {
    flood:Flood
    animator:Animator
    update(elapsedMs:number):void    
}
export default Entity
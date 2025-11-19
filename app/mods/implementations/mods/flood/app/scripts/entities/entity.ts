import Animator from "../animations/animator.ts"
import Flood from "../core/flood.ts"

interface Entity  {
    flood:Flood
    animator:Animator
    update(elapsedMs:number):void    
}
export default Entity
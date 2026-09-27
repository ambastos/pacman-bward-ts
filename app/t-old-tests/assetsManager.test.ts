import sinon from 'sinon'
import AssetsManager from '../scripts/core/assetsManager.ts'
import { fail, ok } from 'assert'
import assert from 'assert'
import GameCoordinator from '../scripts/core/gameCoordinator.ts'
//import {beforeEach} from 'mocha'

let assetsManager
let game = {

} as GameCoordinator

beforeEach(()=>{
    // const Assets = class { 
    //     add() { }
    // };
    global.Assets = {
        add() {}
    }
    global.window.Assets = {
        add() {}
    }
    //const spy = sinon.spy(global, 'Assets')
    //global.window.Assets = spy

   assetsManager = new AssetsManager(game)
})
describe.skip("Assets Manager tests", ()=>{          
    it("should load all assets",async ()=>{
        try {
            await assetsManager.load()    
        }catch(err) {
            console.log(err)
            fail("Fail to load the textures")
        }
        ok(true, "load works!")        
    })
    it("should return the pacman textures", ()=> {
        const pac = assetsManager.get("pacman")
        
        assert.equal(1, assetsManager.sprites.size)
        // assert.equal(258, pac.width)
        // assert.equal(16, pac.height)
    })
})

function beforeEach(arg0: () => void) {
    throw new Error('Function not implemented.')
}

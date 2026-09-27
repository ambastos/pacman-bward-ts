// const assert = require('assert');
// const CharacterUtil = require('../scripts/utilities/characterUtil');
import assert from 'assert'
import CharacterUtil from '../scripts/utilities/characterUtil.ts'
let cu

const scaledTileSize = 16
const velocityPerMs = 0.176
const elapsedMs = 8.33333334
let mazeArray = [
    ['XXXXXXXXXXXXXXXXXXXXXXXXXXXX'],
    ['XooooooooooooXXooooooooooooX'],
    ['XoXXXXoXXXXXoXXoXXXXXoXXXXoX'],
    ['XOXXXXoXXXXXoXXoXXXXXoXXXXOX'],
    ['XoXXXXoXXXXXoXXoXXXXXoXXXXoX'],
    ['XooooooooooooooooooooooooooX'],
    ['XoXXXXoXXoXXXXXXXXoXXoXXXXoX'],
    ['XoXXXXoXXoXXXXXXXXoXXoXXXXoX'],
    ['XooooooXXooooXXooooXXooooooX'],
    ['XXXXXXoXXXXX XX XXXXXoXXXXXX'],
    ['XXXXXXoXXXXX XX XXXXXoXXXXXX'],
    ['XXXXXXoXX          XXoXXXXXX'],
    ['XXXXXXoXX XXXXXXXX XXoXXXXXX'],
    ['XXXXXXoXX X      X XXoXXXXXX'],
    ['      o   X      X   o      '],
    ['XXXXXXoXX X      X XXoXXXXXX'],
    ['XXXXXXoXX XXXXXXXX XXoXXXXXX'],
    ['XXXXXXoXX          XXoXXXXXX'],
    ['XXXXXXoXX XXXXXXXX XXoXXXXXX'],
    ['XXXXXXoXX XXXXXXXX XXoXXXXXX'],
    ['XooooooooooooXXooooooooooooX'],
    ['XoXXXXoXXXXXoXXoXXXXXoXXXXoX'],
    ['XoXXXXoXXXXXoXXoXXXXXoXXXXoX'],
    ['XOooXXooooooo  oooooooXXooOX'],
    ['XXXoXXoXXoXXXXXXXXoXXoXXoXXX'],
    ['XXXoXXoXXoXXXXXXXXoXXoXXoXXX'],
    ['XooooooXXooooXXooooXXooooooX'],
    ['XoXXXXXXXXXXoXXoXXXXXXXXXXoX'],
    ['XoXXXXXXXXXXoXXoXXXXXXXXXXoX'],
    ['XooooooooooooooooooooooooooX'],
    ['XXXXXXXXXXXXXXXXXXXXXXXXXXXX'],
  ];


before(()=>{
    mazeArray.forEach((row, rowIndex) => {
        mazeArray[rowIndex] = row[0].split('');
    });
})

beforeEach(()=>{
    cu = new CharacterUtil()
})

describe('determineGridPosition tests', ()=>{
    it('the grid position(tile coordinates) from the given pixel position', ()=>{
        assert.deepEqual(cu.determineGridPosition({top: 360, left: 88}, scaledTileSize), 
        {x: 6, y: 23})

        assert.deepEqual(cu.determineGridPosition({top: 360, left: 89.666666667}, scaledTileSize), 
         {x: 6.1041666666875, y: 23}) 
    })
})

describe('determineNewPositions tests', ()=>{
    it('new position for the right direction', ()=>{
        const result = cu.determineNewPositions({top:360, left: 88},'right', velocityPerMs, elapsedMs,scaledTileSize)
        assert.deepEqual(result, {newGridPosition:{x:6.09166666674,y:23}, newPosition:{top:360, left: 89.46666666784
        }})
    })

    it('new position for the up direction', ()=>{
        const result = cu.determineNewPositions({top:360, left: 88},'up', velocityPerMs, elapsedMs,scaledTileSize)
        assert.deepEqual(result, {newGridPosition:{x:6,y:22.90833333326}, 
            newPosition:{top:358.53333333216, left: 88
        }})
    })
})

describe('check for wall collision', ()=>{
    it('should collides with the wall',()=>{
        const desiredNewGridPosition = {x:5.908333333333333,y:23}
        const result = cu.checkForWallCollision(desiredNewGridPosition, mazeArray,'left')
        assert.equal(result, true)
    })

    it('should NOT collides with the wall',()=>{
        const desiredNewGridPosition = {x:5.908333333333333,y:23}
        const result = cu.checkForWallCollision(desiredNewGridPosition, mazeArray,'right')
        assert.equal(result, false)
    })

    it('should NOT collides if direction is up', ()=>{
        let desiredNewGridPosition = {x:6,y:22.908333333333335}
        let result = cu.checkForWallCollision(desiredNewGridPosition, mazeArray,'up')
        assert.equal(result, false)
        desiredNewGridPosition = {x:6,y:21.908333333333335}
        result = cu.checkForWallCollision(desiredNewGridPosition, mazeArray,'up')
        assert.equal(result, false)
        desiredNewGridPosition = {x:6,y:20.908333333333335}
        result = cu.checkForWallCollision(desiredNewGridPosition, mazeArray,'up')
        assert.equal(result, false)
    })

    it('should collides if direction is up and pacman is in the edge of the maze', ()=>{
        let desiredNewGridPosition = {x:6,y:0.9083333333333333}
        let result = cu.checkForWallCollision(desiredNewGridPosition, mazeArray,'up')
        assert.equal(result, true)
    })
    
})
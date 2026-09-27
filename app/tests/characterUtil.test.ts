//const assert = require('assert');
//const CharacterUtil = require('../scripts/utilities/characterUtil');
import assert from 'assert'
import CharacterUtil from '../scripts/utilities/characterUtil.ts'
import { ObservablePoint } from 'pixi.js';
import { createObservablePoint } from '../scripts/utilities/utils.js';
import MovableEntity from '../scripts/characters/movableEntity.js';

let characterUtil:CharacterUtil;
const oldPosition = { x: 0,y: 0 } as ObservablePoint;
const position = { x: 10,y: 100 } as ObservablePoint;
const mazeArray:string[][] = [
  ['X', 'X', 'X'],
  ['X', ' ', ' '],
  ['X', ' ', 'X'],
];
const anchor = createObservablePoint(this, 0.5,0.5)
const scale = 2
const scaledTileSize = 8;

beforeEach(() => {
  characterUtil = new CharacterUtil();
});

describe('characterUtil', () => {
  describe('checkForStutter', () => {
    it('returns VISIBLE if the character moves less than five tiles', () => {
      expect(characterUtil.checkForStutter(
        oldPosition, { x: 0,y: 0 } as ObservablePoint,
      )).toBe('visible');
      assert.strictEqual(characterUtil.checkForStutter(
        oldPosition, { x: 0,y: 5 } as ObservablePoint,
      ), 'visible');
      assert.strictEqual(characterUtil.checkForStutter(
        oldPosition, { x: 5,y: 0 } as ObservablePoint,
      ), 'visible');
      assert.strictEqual(characterUtil.checkForStutter(
        oldPosition, { x: 5,y: 5 } as ObservablePoint,
      ), 'visible');
    });

    it('returns HIDDEN if the character moves more than five tiles', () => {
      assert.strictEqual(characterUtil.checkForStutter(
        oldPosition, { x: 0,y: 6 } as ObservablePoint,
      ), 'hidden');
      assert.strictEqual(characterUtil.checkForStutter(
        oldPosition, { x: 0,y: -6 } as ObservablePoint,
      ), 'hidden');
      assert.strictEqual(characterUtil.checkForStutter(
        oldPosition, { x: 6,y: 0 } as ObservablePoint,
      ), 'hidden');
      assert.strictEqual(characterUtil.checkForStutter(
        oldPosition, { x: -6,y: 0 } as ObservablePoint,
      ), 'hidden');
    });

    it('returns VISIBLE by default if either param is missing', () => {
      assert.strictEqual(characterUtil.checkForStutter(), 'visible');
    });
  });

  describe('getPropertyToChange', () => {
    it('returns TOP if the character is moving UP or DOWN', () => {
      assert.strictEqual(characterUtil.getPropertyToChange('up'), 'y');
      assert.strictEqual(characterUtil.getPropertyToChange('down'), 'y');
    });

    it('returns LEFT if the character is moving LEFT or RIGHT', () => {
      assert.strictEqual(characterUtil.getPropertyToChange('left'), 'x');
      assert.strictEqual(characterUtil.getPropertyToChange('right'), 'x');
    });

    it('returns LEFT by default', () => {
      assert.strictEqual(characterUtil.getPropertyToChange(), 'x');
    });
  });

  describe('getVelocity', () => {
    it('returns a positive number for DOWN or RIGHT', () => {
      assert.strictEqual(characterUtil.getVelocity('down', 100), 100);
      assert.strictEqual(characterUtil.getVelocity('right', 100), 100);
    });

    it('returns a negative number for UP or LEFT', () => {
      assert.strictEqual(characterUtil.getVelocity('up', 100), -100);
      assert.strictEqual(characterUtil.getVelocity('left', 100), -100);
    });
  });

  describe('calculateNewDrawValue', () => {
    it('calculates a new value given all parameters', () => {
      assert.strictEqual(characterUtil.calculateNewDrawValue(
        1, 'y', oldPosition, position,
      ), 100);
      assert.strictEqual(characterUtil.calculateNewDrawValue(
        1, 'x', oldPosition, position,
      ), 10);
    });

    it('factors in interp when calculating the new value', () => {
      assert.strictEqual(characterUtil.calculateNewDrawValue(
        0.5, 'y', oldPosition, position,
      ), 50);
      assert.strictEqual(characterUtil.calculateNewDrawValue(
        0.5, 'x', oldPosition, position,
      ), 5);
    });
  });

  describe('determineGridPosition', () => {
    it('returns an x-y object given a valid position', () => {
      const topLeftGrid = characterUtil.determineGridPosition(
        oldPosition, scaledTileSize, anchor, scale
      );
      assert.strictEqual(topLeftGrid.x, -0.5);
      assert.strictEqual(topLeftGrid.y, -0.5);

      const otherGrid = characterUtil.determineGridPosition(
        position, scaledTileSize, anchor, scale
      );
      assert.strictEqual(otherGrid.x, 0.75);
      assert.strictEqual(otherGrid.y, 12);
    });
  });

  describe('turningAround', () => {
    it('returns TRUE if direction and desired direction are opposites', () => {
      assert(characterUtil.turningAround('up', 'down'));
      assert(characterUtil.turningAround('down', 'up'));
      assert(characterUtil.turningAround('left', 'right'));
      assert(characterUtil.turningAround('right', 'left'));
    });

    it('returns FALSE if continuing straight or turning to the side', () => {
      assert(!characterUtil.turningAround('up', 'up'));
      assert(!characterUtil.turningAround('up', 'left'));
      assert(!characterUtil.turningAround('up', 'right'));
    });
  });

  describe('getOppositeDirection', () => {
    it('returns the opposite of any given direction', () => {
      assert.strictEqual(characterUtil.getOppositeDirection('up'), 'down');
      assert.strictEqual(characterUtil.getOppositeDirection('down'), 'up');
      assert.strictEqual(characterUtil.getOppositeDirection('left'), 'right');
      assert.strictEqual(characterUtil.getOppositeDirection('right'), 'left');
    });
  });

  describe('determineRoundingFunction', () => {
    it('returns MATH.FLOOR for UP or LEFT', () => {
      assert.strictEqual(
        characterUtil.determineRoundingFunction('up'), Math.floor,
      );
      assert.strictEqual(
        characterUtil.determineRoundingFunction('left'), Math.floor,
      );
    });

    it('returns MATH.CEIL for DOWN or RIGHT', () => {
      assert.strictEqual(
        characterUtil.determineRoundingFunction('down'), Math.ceil,
      );
      assert.strictEqual(
        characterUtil.determineRoundingFunction('right'), Math.ceil,
      );
    });
  });

  describe('changingGridPosition', () => {
    it('returns TRUE if changing grid positions', () => {
      assert(characterUtil.changingGridPosition(
        { x:0,y:0 } as ObservablePoint, { x:0,y:1 } as ObservablePoint,
      ));
      assert(characterUtil.changingGridPosition(
        { x: 0, y: 0 } as ObservablePoint, { x: 1, y: 0 } as ObservablePoint,
      ));
      assert(characterUtil.changingGridPosition(
        { x: 0, y: 0 } as ObservablePoint, { x: 1, y: 1 } as ObservablePoint,
      ));
    });

    it('returns FALSE if not', () => {
      assert(!characterUtil.changingGridPosition(
        { x: 0, y: 0 } as ObservablePoint, { x: 0, y: 0 } as ObservablePoint,
      ));
      assert(!characterUtil.changingGridPosition(
        { x: 0, y: 0 } as ObservablePoint, { x: 0.1, y: 0.9 } as ObservablePoint,
      ));
    });
  });

  describe('checkForWallCollision', () => {
    it('returns TRUE if running into a wall', () => {
      assert(characterUtil.checkForWallCollision(
        { x:0,y:1 } as ObservablePoint, mazeArray, 'left',
      ));
      assert(characterUtil.checkForWallCollision(
        { x:1,y:0 } as ObservablePoint, mazeArray, 'up',
      ));
    });

    it('returns FALSE if running to a free tile', () => {
      assert(!characterUtil.checkForWallCollision(
        { x:2,y:1 } as ObservablePoint, mazeArray, 'right',
      ));
      assert(!characterUtil.checkForWallCollision(
        { x:1,y:2 } as ObservablePoint, mazeArray, 'down',
      ));
      assert(!characterUtil.checkForWallCollision(
        { x:1,y:1 } as ObservablePoint, mazeArray, 'left',
      ));
      assert(!characterUtil.checkForWallCollision(
        { x:1,y:1 } as ObservablePoint, mazeArray, 'up',
      ));
    });

    it('returns FALSE if moving outside the maze', () => {
      assert(!characterUtil.checkForWallCollision(
        { x: -1, y: -1 } as ObservablePoint, mazeArray, 'right',
      ));
      assert(!characterUtil.checkForWallCollision(
        { x: Infinity, y: Infinity } as ObservablePoint, mazeArray, 'right',
      ));
    });
  });

  describe('determineNewPositions', () => {
    it('returns an object containing a position and gridPosition', () => {
      const newPositions = characterUtil.determineNewPositions(
        { x: 500,y: 500 } as ObservablePoint, 'up', 5, 20, scaledTileSize,
        anchor, scale
      );
      assert.strictEqual(newPositions.newPosition.x, 500);
      assert.strictEqual(newPositions.newPosition.y, 400);
      assert.strictEqual(newPositions.newGridPosition.x, 62);
      assert.strictEqual(newPositions.newGridPosition.y, 49.5);
    });
  });

  describe('snapToGrid', () => {
    const unsnappedPosition = { x:1.5,y:1.5 } as ObservablePoint;

    it('returns a snapped value when traveling in any direction', () => {
      const up = characterUtil.snapToGrid(
        unsnappedPosition, 'up', scaledTileSize,
        anchor, scale
      );
      assert.strictEqual(up.x, 16);
      assert.strictEqual(up.y, 12);

      const down = characterUtil.snapToGrid(
        unsnappedPosition, 'down', scaledTileSize,
        anchor, scale
      );
      assert.strictEqual(down.x, 16);
      assert.strictEqual(down.y, 20);

      const left = characterUtil.snapToGrid(
        unsnappedPosition, 'left', scaledTileSize,
        anchor, scale
      );
      assert.strictEqual(left.x, 12);
      assert.strictEqual(left.y, 16);

      const right = characterUtil.snapToGrid(
        unsnappedPosition, 'right', scaledTileSize,
        anchor, scale
      );
      assert.strictEqual(right.x, 20);
      assert.strictEqual(right.y, 16);
    });
  });

  describe('handleWarp', () => {
    it('warps if leaving the maze', () => {
      const left = characterUtil.handleWarp('left',
        { x: -10, y: 0 } as ObservablePoint, scaledTileSize, mazeArray,
        anchor, scale
      );
      assert.strictEqual(left.x, 21);
      assert.strictEqual(left.y, 0);

      const right = characterUtil.handleWarp('right',
        { x: 30, y: 0 } as ObservablePoint, scaledTileSize, mazeArray,
        anchor, scale
      );
      assert.strictEqual(right.x, -5);
      assert.strictEqual(right.y, 0);
    });

    it('doesn\'t warp otherwise', () => {
      const kept = characterUtil.handleWarp('down',
        { x: 0, y: 0 } as ObservablePoint, scaledTileSize, mazeArray,
        anchor, scale
      );
      assert.strictEqual(kept.x, 0);
      assert.strictEqual(kept.y, 0);
    });
  });

  describe('advanceSpriteSheet', () => {
    let character:MovableEntity;

    beforeEach(() => {
      character = {
        animate: true,
        loopAnimation: true,
        msSinceLastSprite: 15,
        msBetweenSprites: 10,
        moving: true,        
        frame: 1,
        measurement: 25,
        spriteFrames: 5,
      } as MovableEntity;
    });

    it('advances animation by one frame if enough time has passed', () => {
      const updatedProperties = characterUtil.advanceSpriteSheet(character);
      assert.strictEqual(updatedProperties.msSinceLastSprite, 0);
      assert.strictEqual(updatedProperties.frame, 2);
    });

    it('returns to the first frame at the spritesheet\'s end', () => {
      character.frame = character.spriteFrames - 1;

      const updatedProperties = characterUtil.advanceSpriteSheet(character);
      assert.strictEqual(updatedProperties.msSinceLastSprite, 0);
      assert.strictEqual(updatedProperties.frame, 0);
    });

    it('waits for sufficient time between frames', () => {
      character.msSinceLastSprite = 5;

      const updatedProperties = characterUtil.advanceSpriteSheet(character);
      assert.strictEqual(updatedProperties.msSinceLastSprite, 5);
      assert.strictEqual(updatedProperties.frame, character.frame);
    });

    it('only animates if the character is animatable', () => {
      character.animate = false;

      const updatedProperties = characterUtil.advanceSpriteSheet(character);
      assert.strictEqual(updatedProperties.msSinceLastSprite, 15);
      assert.strictEqual(updatedProperties.frame, character.frame);
    });

    it('only loops animation if loopAnimation is true', () => {
      character.loopAnimation = false;
      character.frame = character.spriteFrames - 1;

      const updatedProperties = characterUtil.advanceSpriteSheet(character);
      assert.strictEqual(updatedProperties.msSinceLastSprite, 0);
      assert.strictEqual(updatedProperties.frame, character.spriteFrames - 1);
    });
  });
});

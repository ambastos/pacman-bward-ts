"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//const assert = require('assert');
//const CharacterUtil = require('../scripts/utilities/characterUtil');
var assert_1 = require("assert");
var characterUtil_js_1 = require("../scripts/utilities/characterUtil.js");
var characterUtil;
var oldPosition = { top: 0, left: 0 };
var position = { top: 10, left: 100 };
var mazeArray = [
    ['X', 'X', 'X'],
    ['X', ' ', ' '],
    ['X', ' ', 'X'],
];
var scaledTileSize = 8;
beforeEach(function () {
    characterUtil = new characterUtil_js_1.default();
});
describe('characterUtil', function () {
    describe('checkForStutter', function () {
        it('returns VISIBLE if the character moves less than five tiles', function () {
            assert_1.default.strictEqual(characterUtil.checkForStutter(oldPosition, { top: 0, left: 0 }), 'visible');
            assert_1.default.strictEqual(characterUtil.checkForStutter(oldPosition, { top: 0, left: 5 }), 'visible');
            assert_1.default.strictEqual(characterUtil.checkForStutter(oldPosition, { top: 5, left: 0 }), 'visible');
            assert_1.default.strictEqual(characterUtil.checkForStutter(oldPosition, { top: 5, left: 5 }), 'visible');
        });
        it('returns HIDDEN if the character moves more than five tiles', function () {
            assert_1.default.strictEqual(characterUtil.checkForStutter(oldPosition, { top: 0, left: 6 }), 'hidden');
            assert_1.default.strictEqual(characterUtil.checkForStutter(oldPosition, { top: 0, left: -6 }), 'hidden');
            assert_1.default.strictEqual(characterUtil.checkForStutter(oldPosition, { top: 6, left: 0 }), 'hidden');
            assert_1.default.strictEqual(characterUtil.checkForStutter(oldPosition, { top: -6, left: 0 }), 'hidden');
        });
        it('returns VISIBLE by default if either param is missing', function () {
            assert_1.default.strictEqual(characterUtil.checkForStutter(), 'visible');
        });
    });
    describe('getPropertyToChange', function () {
        it('returns TOP if the character is moving UP or DOWN', function () {
            assert_1.default.strictEqual(characterUtil.getPropertyToChange('up'), 'top');
            assert_1.default.strictEqual(characterUtil.getPropertyToChange('down'), 'top');
        });
        it('returns LEFT if the character is moving LEFT or RIGHT', function () {
            assert_1.default.strictEqual(characterUtil.getPropertyToChange('left'), 'left');
            assert_1.default.strictEqual(characterUtil.getPropertyToChange('right'), 'left');
        });
        it('returns LEFT by default', function () {
            assert_1.default.strictEqual(characterUtil.getPropertyToChange(), 'left');
        });
    });
    describe('getVelocity', function () {
        it('returns a positive number for DOWN or RIGHT', function () {
            assert_1.default.strictEqual(characterUtil.getVelocity('down', 100), 100);
            assert_1.default.strictEqual(characterUtil.getVelocity('right', 100), 100);
        });
        it('returns a negative number for UP or LEFT', function () {
            assert_1.default.strictEqual(characterUtil.getVelocity('up', 100), -100);
            assert_1.default.strictEqual(characterUtil.getVelocity('left', 100), -100);
        });
    });
    describe('calculateNewDrawValue', function () {
        it('calculates a new value given all parameters', function () {
            assert_1.default.strictEqual(characterUtil.calculateNewDrawValue(1, 'top', oldPosition, position), 10);
            assert_1.default.strictEqual(characterUtil.calculateNewDrawValue(1, 'left', oldPosition, position), 100);
        });
        it('factors in interp when calculating the new value', function () {
            assert_1.default.strictEqual(characterUtil.calculateNewDrawValue(0.5, 'top', oldPosition, position), 5);
            assert_1.default.strictEqual(characterUtil.calculateNewDrawValue(0.5, 'left', oldPosition, position), 50);
        });
    });
    describe('determineGridPosition', function () {
        it('returns an x-y object given a valid position', function () {
            assert_1.default.deepEqual(characterUtil.determineGridPosition(oldPosition, scaledTileSize), { x: 0.5, y: 0.5 });
            assert_1.default.deepEqual(characterUtil.determineGridPosition(position, scaledTileSize), { x: 13, y: 1.75 });
        });
    });
    describe('turningAround', function () {
        it('returns TRUE if direction and desired direction are opposites', function () {
            (0, assert_1.default)(characterUtil.turningAround('up', 'down'));
            (0, assert_1.default)(characterUtil.turningAround('down', 'up'));
            (0, assert_1.default)(characterUtil.turningAround('left', 'right'));
            (0, assert_1.default)(characterUtil.turningAround('right', 'left'));
        });
        it('returns FALSE if continuing straight or turning to the side', function () {
            (0, assert_1.default)(!characterUtil.turningAround('up', 'up'));
            (0, assert_1.default)(!characterUtil.turningAround('up', 'left'));
            (0, assert_1.default)(!characterUtil.turningAround('up', 'right'));
        });
    });
    describe('getOppositeDirection', function () {
        it('returns the opposite of any given direction', function () {
            assert_1.default.strictEqual(characterUtil.getOppositeDirection('up'), 'down');
            assert_1.default.strictEqual(characterUtil.getOppositeDirection('down'), 'up');
            assert_1.default.strictEqual(characterUtil.getOppositeDirection('left'), 'right');
            assert_1.default.strictEqual(characterUtil.getOppositeDirection('right'), 'left');
        });
    });
    describe('determineRoundingFunction', function () {
        it('returns MATH.FLOOR for UP or LEFT', function () {
            assert_1.default.strictEqual(characterUtil.determineRoundingFunction('up'), Math.floor);
            assert_1.default.strictEqual(characterUtil.determineRoundingFunction('left'), Math.floor);
        });
        it('returns MATH.CEIL for DOWN or RIGHT', function () {
            assert_1.default.strictEqual(characterUtil.determineRoundingFunction('down'), Math.ceil);
            assert_1.default.strictEqual(characterUtil.determineRoundingFunction('right'), Math.ceil);
        });
    });
    describe('changingGridPosition', function () {
        it('returns TRUE if changing grid positions', function () {
            (0, assert_1.default)(characterUtil.changingGridPosition({ x: 0, y: 0 }, { x: 0, y: 1 }));
            (0, assert_1.default)(characterUtil.changingGridPosition({ x: 0, y: 0 }, { x: 1, y: 0 }));
            (0, assert_1.default)(characterUtil.changingGridPosition({ x: 0, y: 0 }, { x: 1, y: 1 }));
        });
        it('returns FALSE if not', function () {
            (0, assert_1.default)(!characterUtil.changingGridPosition({ x: 0, y: 0 }, { x: 0, y: 0 }));
            (0, assert_1.default)(!characterUtil.changingGridPosition({ x: 0, y: 0 }, { x: 0.1, y: 0.9 }));
        });
    });
    describe('checkForWallCollision', function () {
        it('returns TRUE if running into a wall', function () {
            (0, assert_1.default)(characterUtil.checkForWallCollision({ x: 0, y: 1 }, mazeArray, 'left'));
            (0, assert_1.default)(characterUtil.checkForWallCollision({ x: 1, y: 0 }, mazeArray, 'up'));
        });
        it('returns FALSE if running to a free tile', function () {
            (0, assert_1.default)(!characterUtil.checkForWallCollision({ x: 2, y: 1 }, mazeArray, 'right'));
            (0, assert_1.default)(!characterUtil.checkForWallCollision({ x: 1, y: 2 }, mazeArray, 'down'));
            (0, assert_1.default)(!characterUtil.checkForWallCollision({ x: 1, y: 1 }, mazeArray, 'left'));
            (0, assert_1.default)(!characterUtil.checkForWallCollision({ x: 1, y: 1 }, mazeArray, 'up'));
        });
        it('returns FALSE if moving outside the maze', function () {
            (0, assert_1.default)(!characterUtil.checkForWallCollision({ x: -1, y: -1 }, mazeArray, 'right'));
            (0, assert_1.default)(!characterUtil.checkForWallCollision({ x: Infinity, y: Infinity }, mazeArray, 'right'));
        });
    });
    describe('determineNewPositions', function () {
        it('returns an object containing a position and gridPosition', function () {
            var newPositions = characterUtil.determineNewPositions({ top: 500, left: 500 }, 'up', 5, 20, scaledTileSize);
            assert_1.default.deepEqual(newPositions, {
                newPosition: { top: 400, left: 500 },
                newGridPosition: { x: 63, y: 50.5 },
            });
        });
    });
    describe('snapToGrid', function () {
        var unsnappedPosition = { x: 1.5, y: 1.5 };
        it('returns a snapped value when traveling in any direction', function () {
            assert_1.default.deepEqual(characterUtil.snapToGrid(unsnappedPosition, 'up', scaledTileSize), { top: 4, left: 8 });
            assert_1.default.deepEqual(characterUtil.snapToGrid(unsnappedPosition, 'down', scaledTileSize), { top: 12, left: 8 });
            assert_1.default.deepEqual(characterUtil.snapToGrid(unsnappedPosition, 'left', scaledTileSize), { top: 8, left: 4 });
            assert_1.default.deepEqual(characterUtil.snapToGrid(unsnappedPosition, 'right', scaledTileSize), { top: 8, left: 12 });
        });
    });
    describe('handleWarp', function () {
        it('warps if leaving the maze', function () {
            assert_1.default.deepEqual(characterUtil.handleWarp({ top: 0, left: -100 }, scaledTileSize, mazeArray), { top: 0, left: 18 });
            assert_1.default.deepEqual(characterUtil.handleWarp({ top: 0, left: 100 }, scaledTileSize, mazeArray), { top: 0, left: -10 });
        });
        it('doesn\'t warp otherwise', function () {
            assert_1.default.deepEqual(characterUtil.handleWarp({ top: 0, left: 0 }, scaledTileSize, mazeArray), { top: 0, left: 0 });
        });
    });
    describe('advanceSpriteSheet', function () {
        var character;
        beforeEach(function () {
            character = {
                animate: true,
                loopAnimation: true,
                msSinceLastSprite: 15,
                msBetweenSprites: 10,
                moving: true,
                animationTarget: {
                    style: {},
                },
                backgroundOffsetPixels: 50,
                measurement: 25,
                spriteFrames: 5,
            };
        });
        it('advances animation by one frame if enough time has passed', function () {
            var updatedProperties = characterUtil.advanceSpriteSheet(character);
            assert_1.default.strictEqual(updatedProperties.msSinceLastSprite, 0);
            assert_1.default.strictEqual(updatedProperties.animationTarget.style.backgroundPosition, '-75px 0px');
            assert_1.default.strictEqual(updatedProperties.backgroundOffsetPixels, 75);
        });
        it('returns to the first frame at the spritesheet\'s end', function () {
            character.backgroundOffsetPixels = 250;
            var updatedProperties = characterUtil.advanceSpriteSheet(character);
            assert_1.default.strictEqual(updatedProperties.msSinceLastSprite, 0);
            assert_1.default.strictEqual(updatedProperties.animationTarget.style.backgroundPosition, '-0px 0px');
            assert_1.default.strictEqual(updatedProperties.backgroundOffsetPixels, 0);
        });
        it('waits for sufficient time between frames', function () {
            character.msSinceLastSprite = 5;
            characterUtil.advanceSpriteSheet(character);
            assert_1.default.strictEqual(character.msSinceLastSprite, 5);
        });
        it('only animates if the character is moving', function () {
            character.moving = false;
            characterUtil.advanceSpriteSheet(character);
            assert_1.default.strictEqual(character.msSinceLastSprite, 15);
        });
        it('only loops animation if loopAnimation is true', function () {
            character.loopAnimation = false;
            character.backgroundOffsetPixels = 250;
            var updatedProperties = characterUtil.advanceSpriteSheet(character);
            assert_1.default.strictEqual(updatedProperties.backgroundOffsetPixels, 250);
        });
    });
});

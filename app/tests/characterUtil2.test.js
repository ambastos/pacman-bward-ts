"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const assert = require('assert');
// const CharacterUtil = require('../scripts/utilities/characterUtil');
var assert_1 = require("assert");
var characterUtil_js_1 = require("../scripts/utilities/characterUtil.js");
var cu;
var scaledTileSize = 16;
var velocityPerMs = 0.176;
var elapsedMs = 8.33333334;
var mazeArray = [
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
before(function () {
    mazeArray.forEach(function (row, rowIndex) {
        mazeArray[rowIndex] = row[0].split('');
    });
});
beforeEach(function () {
    cu = new characterUtil_js_1.default();
});
describe('determineGridPosition tests', function () {
    it('the grid position(tile coordinates) from the given pixel position', function () {
        assert_1.default.deepEqual(cu.determineGridPosition({ top: 360, left: 88 }, scaledTileSize), { x: 6, y: 23 });
        assert_1.default.deepEqual(cu.determineGridPosition({ top: 360, left: 89.666666667 }, scaledTileSize), { x: 6.1041666666875, y: 23 });
    });
});
describe('determineNewPositions tests', function () {
    it('new position for the right direction', function () {
        var result = cu.determineNewPositions({ top: 360, left: 88 }, 'right', velocityPerMs, elapsedMs, scaledTileSize);
        assert_1.default.deepEqual(result, { newGridPosition: { x: 6.09166666674, y: 23 }, newPosition: { top: 360, left: 89.46666666784
            } });
    });
    it('new position for the up direction', function () {
        var result = cu.determineNewPositions({ top: 360, left: 88 }, 'up', velocityPerMs, elapsedMs, scaledTileSize);
        assert_1.default.deepEqual(result, { newGridPosition: { x: 6, y: 22.90833333326 },
            newPosition: { top: 358.53333333216, left: 88
            } });
    });
});
describe('check for wall collision', function () {
    it('should collides with the wall', function () {
        var desiredNewGridPosition = { x: 5.908333333333333, y: 23 };
        var result = cu.checkForWallCollision(desiredNewGridPosition, mazeArray, 'left');
        assert_1.default.equal(result, true);
    });
    it('should NOT collides with the wall', function () {
        var desiredNewGridPosition = { x: 5.908333333333333, y: 23 };
        var result = cu.checkForWallCollision(desiredNewGridPosition, mazeArray, 'right');
        assert_1.default.equal(result, false);
    });
    it('should NOT collides if direction is up', function () {
        var desiredNewGridPosition = { x: 6, y: 22.908333333333335 };
        var result = cu.checkForWallCollision(desiredNewGridPosition, mazeArray, 'up');
        assert_1.default.equal(result, false);
        desiredNewGridPosition = { x: 6, y: 21.908333333333335 };
        result = cu.checkForWallCollision(desiredNewGridPosition, mazeArray, 'up');
        assert_1.default.equal(result, false);
        desiredNewGridPosition = { x: 6, y: 20.908333333333335 };
        result = cu.checkForWallCollision(desiredNewGridPosition, mazeArray, 'up');
        assert_1.default.equal(result, false);
    });
    it('should collides if direction is up and pacman is in the edge of the maze', function () {
        var desiredNewGridPosition = { x: 6, y: 0.9083333333333333 };
        var result = cu.checkForWallCollision(desiredNewGridPosition, mazeArray, 'up');
        assert_1.default.equal(result, true);
    });
});

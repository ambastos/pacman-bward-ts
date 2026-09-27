"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const assert = require('assert');
// const sinon = require('sinon');
// const Ghost = require('../scripts/characters/ghost');
// const CharacterUtil = require('../scripts/utilities/characterUtil');
var assert_1 = require("assert");
var sinon_1 = require("sinon");
var ghost_js_1 = require("../scripts/characters/ghost.js");
var characterUtil_js_1 = require("../scripts/utilities/characterUtil.js");
var scaledTileSize = 8;
var mazeArray = [
    ['X', 'X', 'X'],
    ['X', ' ', ' '],
    ['X', ' ', 'X'],
];
var pacman;
var comp;
var game;
beforeEach(function () {
    global.document = {
        getElementById: function () { return ({
            style: {},
        }); },
    };
    pacman = {
        velocityPerMs: 1,
        moving: true,
        position: {
            top: 100,
            left: 100,
        },
    };
    game = {
        scaledTileSize: 16,
        pacman: pacman,
    };
    comp = new ghost_js_1.default(game, undefined, 1, new characterUtil_js_1.default(), undefined);
});
describe('ghost', function () {
    describe('setMovementStats', function () {
        it('sets the ghost\'s various movement stats', function () {
            comp.setMovementStats(pacman, undefined, 1);
            assert_1.default.strictEqual(comp.slowSpeed, 0.76);
            assert_1.default.strictEqual(comp.mediumSpeed, 0.885);
            assert_1.default.strictEqual(comp.fastSpeed, 1.01);
            assert_1.default.strictEqual(comp.scaredSpeed, 0.5);
            assert_1.default.strictEqual(comp.transitionSpeed, 0.4);
            assert_1.default.strictEqual(comp.eyeSpeed, 2);
            assert_1.default.strictEqual(comp.velocityPerMs, 0.76);
            assert_1.default.strictEqual(comp.defaultDirection, 'left');
            assert_1.default.strictEqual(comp.direction, 'left');
            assert_1.default.strictEqual(comp.moving, false);
        });
        it('sets the correct direction for each ghost', function () {
            comp.setMovementStats(pacman, 'blinky');
            assert_1.default.strictEqual(comp.direction, 'left');
            comp.setMovementStats(pacman, 'pinky');
            assert_1.default.strictEqual(comp.direction, 'down');
            comp.setMovementStats(pacman, 'inky');
            assert_1.default.strictEqual(comp.direction, 'up');
            comp.setMovementStats(pacman, 'clyde');
            assert_1.default.strictEqual(comp.direction, 'up');
        });
    });
    describe('setSpriteAnimationStats', function () {
        it('sets various stats for the ghost\'s sprite animation', function () {
            comp.setSpriteAnimationStats();
            assert_1.default.strictEqual(comp.msBetweenSprites, 250);
            assert_1.default.strictEqual(comp.msSinceLastSprite, 0);
            assert_1.default.strictEqual(comp.spriteFrames, 2);
            assert_1.default.strictEqual(comp.backgroundOffsetPixels, 0);
        });
    });
    describe('setStyleMeasurements', function () {
        it('sets the ghost\'s measurement properties', function () {
            comp.animationTarget.style = {};
            comp.setStyleMeasurements(scaledTileSize, 2);
            assert_1.default.strictEqual(comp.measurement, 16);
            assert_1.default.deepEqual(comp.animationTarget.style, {
                height: '16px',
                width: '16px',
                backgroundSize: '32px',
            });
        });
    });
    describe('setDefaultPosition', function () {
        it('sets the correct position for each ghost', function () {
            comp.setDefaultPosition(scaledTileSize, 'blinky');
            assert_1.default.deepEqual(comp.defaultPosition, {
                top: comp.scaledTileSize * 10.5,
                left: comp.scaledTileSize * 13,
            });
            comp.setDefaultPosition(scaledTileSize, 'pinky');
            assert_1.default.deepEqual(comp.defaultPosition, {
                top: comp.scaledTileSize * 13.5,
                left: comp.scaledTileSize * 13,
            });
            comp.setDefaultPosition(scaledTileSize, 'inky');
            assert_1.default.deepEqual(comp.defaultPosition, {
                top: scaledTileSize * 13.5,
                left: scaledTileSize * 11,
            });
            comp.setDefaultPosition(scaledTileSize, 'clyde');
            assert_1.default.deepEqual(comp.defaultPosition, {
                top: scaledTileSize * 13.5,
                left: scaledTileSize * 15,
            });
            comp.setDefaultPosition(scaledTileSize, undefined);
            assert_1.default.deepEqual(comp.defaultPosition, { top: 0, left: 0 });
        });
        it('updates various position properties', function () {
            comp.setDefaultPosition(scaledTileSize, 'blinky');
            assert_1.default.deepEqual(comp.position, comp.defaultPosition);
            assert_1.default.deepEqual(comp.oldPosition, comp.position);
            assert_1.default.strictEqual(comp.animationTarget.style.top, "".concat(comp.position.top, "px"));
            assert_1.default.strictEqual(comp.animationTarget.style.left, "".concat(comp.position.left, "px"));
        });
    });
    describe('setSpriteSheet', function () {
        it('sets the correct spritesheet if the ghost is scared', function () {
            comp.mode = 'scared';
            comp.scaredColor = 'blue';
            comp.setSpriteSheet(undefined, undefined, 'scared');
            assert_1.default.strictEqual(comp.animationTarget.style.backgroundImage, 'url(app/style/graphics/spriteSheets/characters/ghosts/'
                + 'scared_blue.svg)');
            comp.scaredColor = 'white';
            comp.setSpriteSheet(undefined, undefined, 'scared');
            assert_1.default.strictEqual(comp.animationTarget.style.backgroundImage, 'url(app/style/graphics/spriteSheets/characters/ghosts/'
                + 'scared_white.svg)');
        });
        it('sets the correct spritesheets for eyes mode', function () {
            var url = 'url(app/style/graphics/spriteSheets/characters/ghosts/';
            comp.setSpriteSheet('blinky', 'up', 'eyes');
            assert_1.default.strictEqual(comp.animationTarget.style.backgroundImage, "".concat(url, "eyes_up.svg)"));
            comp.setSpriteSheet('blinky', 'down', 'eyes');
            assert_1.default.strictEqual(comp.animationTarget.style.backgroundImage, "".concat(url, "eyes_down.svg)"));
            comp.setSpriteSheet('blinky', 'left', 'eyes');
            assert_1.default.strictEqual(comp.animationTarget.style.backgroundImage, "".concat(url, "eyes_left.svg)"));
            comp.setSpriteSheet('blinky', 'right', 'eyes');
            assert_1.default.strictEqual(comp.animationTarget.style.backgroundImage, "".concat(url, "eyes_right.svg)"));
        });
        it('sets the correct spritesheet for any given direction', function () {
            var url = 'url(app/style/graphics/spriteSheets/characters/ghosts/';
            comp.setSpriteSheet('blinky', 'up');
            assert_1.default.strictEqual(comp.animationTarget.style.backgroundImage, "".concat(url, "blinky/blinky_up.svg)"));
            comp.setSpriteSheet('blinky', 'down');
            assert_1.default.strictEqual(comp.animationTarget.style.backgroundImage, "".concat(url, "blinky/blinky_down.svg)"));
            comp.setSpriteSheet('blinky', 'left');
            assert_1.default.strictEqual(comp.animationTarget.style.backgroundImage, "".concat(url, "blinky/blinky_left.svg)"));
            comp.setSpriteSheet('blinky', 'right');
            assert_1.default.strictEqual(comp.animationTarget.style.backgroundImage, "".concat(url, "blinky/blinky_right.svg)"));
        });
        it('adds emotion if the ghost is moving quickly', function () {
            var url = 'url(app/style/graphics/spriteSheets/characters/ghosts/';
            comp.defaultSpeed = comp.mediumSpeed;
            comp.setSpriteSheet('blinky', 'up', 'chase');
            assert_1.default.strictEqual(comp.animationTarget.style.backgroundImage, "".concat(url, "blinky/blinky_up_annoyed.svg)"));
            comp.defaultSpeed = comp.fastSpeed;
            comp.setSpriteSheet('blinky', 'up', 'chase');
            assert_1.default.strictEqual(comp.animationTarget.style.backgroundImage, "".concat(url, "blinky/blinky_up_angry.svg)"));
        });
    });
    describe('reset', function () {
        it('resets the character to its default state', function () {
            comp.name = 'blinky';
            comp.position = '';
            comp.direction = '';
            comp.animationTarget.style.backgroundImage = '';
            comp.backgroundOffsetPixels = '';
            comp.animationTarget.style.backgroundPosition = '';
            comp.reset();
            assert_1.default.deepEqual(comp.position, comp.defaultPosition);
            assert_1.default.strictEqual(comp.direction, comp.defaultDirection);
            assert_1.default.strictEqual(comp.animationTarget.style.backgroundImage, 'url(app/style/graphics/spriteSheets/characters/ghosts/blinky'
                + '/blinky_left.svg)');
            assert_1.default.strictEqual(comp.backgroundOffsetPixels, 0);
            assert_1.default.strictEqual(comp.animationTarget.style.backgroundPosition, '0px 0px');
        });
        it('resets extra params for full game resets', function () {
            comp.defaultSpeed = 123;
            comp.cruiseElroy = true;
            comp.reset(true);
            assert_1.default.notStrictEqual(comp.defaultSpeed, 123);
            assert_1.default.strictEqual(comp.cruiseElroy, undefined);
        });
    });
    describe('setDefaultMode', function () {
        it('starts ghosts in scatter mode', function () {
            comp.setDefaultMode();
            assert_1.default.strictEqual(comp.defaultMode, 'scatter');
            assert_1.default.strictEqual(comp.mode, 'scatter');
        });
        it('sets idleMode for all ghosts except blinky', function () {
            comp.name = 'blinky';
            comp.idleMode = undefined;
            comp.setDefaultMode();
            assert_1.default.strictEqual(comp.idleMode, undefined);
            comp.name = 'pinky';
            comp.setDefaultMode();
            assert_1.default.strictEqual(comp.idleMode, 'idle');
        });
    });
    describe('isInTunnel', function () {
        it('returns TRUE if the ghost is in either warp tunnel', function () {
            (0, assert_1.default)(comp.isInTunnel({ x: 0, y: 14 }));
            (0, assert_1.default)(comp.isInTunnel({ x: 30, y: 14 }));
        });
        it('returns FALSE otherwise', function () {
            (0, assert_1.default)(!comp.isInTunnel({ x: 15, y: 14 }));
            (0, assert_1.default)(!comp.isInTunnel({ x: 0, y: 0 }));
        });
    });
    describe('isInGhostHouse', function () {
        it('returns TRUE if the ghost is in the Ghost House', function () {
            (0, assert_1.default)(comp.isInGhostHouse({ x: 10, y: 15 }));
        });
        it('returns FALSE otherwise', function () {
            (0, assert_1.default)(!comp.isInGhostHouse({ x: 0, y: 0 }));
        });
    });
    describe('getTile', function () {
        it('returns a tile if the given coordinates are free', function () {
            var tile = comp.getTile(mazeArray, 1, 1);
            assert_1.default.deepEqual(tile, { x: 1, y: 1 });
        });
        it('returns FALSE if the given coordinates are a wall', function () {
            var tile = comp.getTile(mazeArray, 0, 0);
            assert_1.default.strictEqual(tile, false);
        });
        it('returns FALSE if the given coordinates are outside the maze', function () {
            var tile = comp.getTile(mazeArray, -1, -1);
            assert_1.default.strictEqual(tile, false);
        });
    });
    describe('determinePossibleMoves', function () {
        it('returns a list of moves given valid coordinates', function () {
            var possibleMoves = comp.determinePossibleMoves({ x: 1, y: 1 }, 'right', mazeArray);
            assert_1.default.deepEqual(possibleMoves, {
                down: { x: 1, y: 2 },
                right: { x: 2, y: 1 },
            });
        });
        it('does not allow the ghost to turn around at a crossroads', function () {
            var possibleMoves = comp.determinePossibleMoves({ x: 1, y: 1 }, 'up', mazeArray);
            assert_1.default.deepEqual(possibleMoves, {
                right: { x: 2, y: 1 },
            });
        });
        it('returns an empty object if no moves are available', function () {
            var possibleMoves = comp.determinePossibleMoves({ x: -1, y: -1 }, 'up', mazeArray);
            assert_1.default.deepEqual(possibleMoves, {});
        });
    });
    describe('calculateDistance', function () {
        it('uses the Pythagorean Theorem to measure distance', function () {
            var distance = comp.calculateDistance({ x: 0, y: 0 }, { x: 3, y: 4 });
            assert_1.default.strictEqual(distance, 5);
        });
        it('returns zero if the two given positions are identical', function () {
            var distance = comp.calculateDistance({ x: 0, y: 0 }, { x: 0, y: 0 });
            assert_1.default.strictEqual(distance, 0);
        });
    });
    describe('getPositionInFrontOfPacman', function () {
        it('returns the correct result for any orientation', function () {
            var pacmanPos = { x: 10, y: 10 };
            comp.pacman.direction = 'up';
            assert_1.default.deepEqual(comp.getPositionInFrontOfPacman(pacmanPos, 4), { x: 10, y: 6 });
            comp.pacman.direction = 'down';
            assert_1.default.deepEqual(comp.getPositionInFrontOfPacman(pacmanPos, 4), { x: 10, y: 14 });
            comp.pacman.direction = 'left';
            assert_1.default.deepEqual(comp.getPositionInFrontOfPacman(pacmanPos, 4), { x: 6, y: 10 });
            comp.pacman.direction = 'right';
            assert_1.default.deepEqual(comp.getPositionInFrontOfPacman(pacmanPos, 4), { x: 14, y: 10 });
        });
    });
    describe('determinePinkyTarget', function () {
        it('returns the correct target for Pinky', function () {
            comp.getPositionInFrontOfPacman = sinon_1.default.fake();
            var pacmanPos = { x: 10, y: 10 };
            comp.determinePinkyTarget(pacmanPos);
            (0, assert_1.default)(comp.getPositionInFrontOfPacman.calledWith(pacmanPos, 4));
        });
    });
    describe('determineInkyTarget', function () {
        it('returns the correct target for Inky', function () {
            var pacmanPos = { x: 10, y: 10 };
            comp.blinky = {};
            comp.characterUtil.determineGridPosition = sinon_1.default.fake.returns({ x: 0, y: 0 });
            comp.getPositionInFrontOfPacman = sinon_1.default.fake.returns({ x: 12, y: 10 });
            var result = comp.determineInkyTarget(pacmanPos);
            assert_1.default.deepEqual(result, { x: 24, y: 20 });
        });
    });
    describe('determineClydeTarget', function () {
        it('returns Pacman\'s position when far away', function () {
            comp.calculateDistance = sinon_1.default.fake.returns(10);
            var result = comp.determineClydeTarget({ x: 1, y: 1 }, { x: 2, y: 2 });
            (0, assert_1.default)(comp.calculateDistance.calledWith({ x: 1, y: 1 }, { x: 2, y: 2 }));
            assert_1.default.deepEqual(result, { x: 2, y: 2 });
        });
        it('returns the bottom-left corner\'s position when close', function () {
            comp.calculateDistance = sinon_1.default.fake.returns(1);
            var result = comp.determineClydeTarget();
            assert_1.default.deepEqual(result, { x: 0, y: 30 });
        });
    });
    describe('getTarget', function () {
        var pacmanPos = { x: 1, y: 1 };
        it('returns the ghost-house\'s door for eyes mode', function () {
            var result = comp.getTarget(undefined, undefined, undefined, 'eyes');
            assert_1.default.deepEqual(result, { x: 13.5, y: 10 });
        });
        it('returns Pacman\'s position for scared mode', function () {
            var result = comp.getTarget(undefined, undefined, pacmanPos, 'scared');
            assert_1.default.deepEqual(result, pacmanPos);
        });
        it('returns corners for scatter mode', function () {
            var result = comp.getTarget('blinky', undefined, pacmanPos, 'scatter');
            assert_1.default.deepEqual(result, { x: 27, y: 0 });
            comp.cruiseElroy = true;
            result = comp.getTarget('blinky', undefined, pacmanPos, 'scatter');
            assert_1.default.deepEqual(result, pacmanPos);
            result = comp.getTarget('pinky', undefined, pacmanPos, 'scatter');
            assert_1.default.deepEqual(result, { x: 0, y: 0 });
            result = comp.getTarget('inky', undefined, pacmanPos, 'scatter');
            assert_1.default.deepEqual(result, { x: 27, y: 30 });
            result = comp.getTarget('clyde', undefined, pacmanPos, 'scatter');
            assert_1.default.deepEqual(result, { x: 0, y: 30 });
            result = comp.getTarget(undefined, undefined, pacmanPos, 'scatter');
            assert_1.default.deepEqual(result, { x: 0, y: 0 });
        });
        it('returns various targets for chase mode', function () {
            var result = comp.getTarget('blinky', undefined, pacmanPos, 'chase');
            assert_1.default.deepEqual(result, pacmanPos);
            comp.determinePinkyTarget = sinon_1.default.fake();
            result = comp.getTarget('pinky', undefined, pacmanPos, 'chase');
            (0, assert_1.default)(comp.determinePinkyTarget.calledWith(pacmanPos));
            comp.determineInkyTarget = sinon_1.default.fake();
            result = comp.getTarget('inky', undefined, pacmanPos, 'chase');
            (0, assert_1.default)(comp.determineInkyTarget.calledWith(pacmanPos));
            comp.determineClydeTarget = sinon_1.default.fake();
            result = comp.getTarget('clyde', { x: 1, y: 1 }, pacmanPos, 'chase');
            (0, assert_1.default)(comp.determineClydeTarget.calledWith({ x: 1, y: 1 }, pacmanPos));
            result = comp.getTarget(undefined, undefined, pacmanPos, 'chase');
            assert_1.default.deepEqual(result, pacmanPos);
        });
    });
    describe('determineBestMove', function () {
        var possibleMoves;
        var pacmanPos;
        beforeEach(function () {
            possibleMoves = {
                up: { x: 1, y: 0 },
                down: { x: 1, y: 2 },
                left: { x: 0, y: 1 },
                right: { x: 2, y: 1 },
            };
            pacmanPos = { x: 3, y: 1 };
            comp.getTarget = sinon_1.default.fake.returns(pacmanPos);
        });
        it('returns the greatest distance from Pacman when scared', function () {
            var result = comp.determineBestMove('blinky', possibleMoves, undefined, pacmanPos, 'scared');
            assert_1.default.strictEqual(result, 'left');
        });
        it('returns the shortest distance to the target otherwise', function () {
            var result = comp.determineBestMove('blinky', possibleMoves, undefined, pacmanPos, 'chase');
            assert_1.default.strictEqual(result, 'right');
        });
        it('returns UNDEFINED if there are no possible moves', function () {
            var result = comp.determineBestMove('blinky', {}, undefined, pacmanPos, 'chase');
            assert_1.default.strictEqual(result, undefined);
        });
    });
    describe('determineDirection', function () {
        it('returns the new direction if there is only one possible move', function () {
            comp.determinePossibleMoves = sinon_1.default.fake.returns({ up: '' });
            var direction = comp.determineDirection();
            assert_1.default.strictEqual(direction, 'up');
        });
        it('calls determineBestMove if there are multiple possible moves', function () {
            comp.determinePossibleMoves = sinon_1.default.fake.returns({ up: '', down: '' });
            var bestSpy = comp.determineBestMove = sinon_1.default.fake.returns('down');
            var direction = comp.determineDirection();
            (0, assert_1.default)(bestSpy.called);
            assert_1.default.strictEqual(direction, 'down');
        });
        it('returns the ghost\'s default direction if there are no moves', function () {
            comp.determinePossibleMoves = sinon_1.default.fake.returns({});
            var direction = comp.determineDirection(undefined, undefined, undefined, 'right');
            assert_1.default.strictEqual(direction, 'right');
        });
    });
    describe('handleSnappedMovement', function () {
        it('calls determineDirection to decide where to turn', function () {
            comp.characterUtil.determineGridPosition = sinon_1.default.fake();
            var directionSpy = comp.determineDirection = sinon_1.default.fake();
            comp.characterUtil.getPropertyToChange = sinon_1.default.fake.returns('top');
            comp.characterUtil.getVelocity = sinon_1.default.fake.returns(10);
            var newPosition = comp.handleSnappedMovement(50);
            (0, assert_1.default)(directionSpy.called);
            assert_1.default.deepEqual(newPosition, { top: 500, left: 0 });
        });
    });
    describe('enteringGhostHouse', function () {
        it('returns TRUE for eyes mode at the correct coordinates', function () {
            var entering = comp.enteringGhostHouse('eyes', { x: 13.5, y: 11 });
            (0, assert_1.default)(entering);
        });
        it('returns FALSE otherwise', function () {
            var entering = comp.enteringGhostHouse('chase', { x: 13.5, y: 11 });
            (0, assert_1.default)(!entering);
        });
    });
    describe('enteredGhostHouse', function () {
        it('returns TRUE for eyes mode at the correct coordinates', function () {
            var entered = comp.enteredGhostHouse('eyes', { x: 13.5, y: 14 });
            (0, assert_1.default)(entered);
        });
        it('returns FALSE otherwise', function () {
            var entered = comp.enteredGhostHouse('chase', { x: 13.5, y: 14 });
            (0, assert_1.default)(!entered);
        });
    });
    describe('leavingGhostHouse', function () {
        it('returns TRUE for chase mode at the correct coordinates', function () {
            var leaving = comp.leavingGhostHouse('chase', { x: 13.5, y: 10.9 });
            (0, assert_1.default)(leaving);
        });
        it('returns FALSE otherwise', function () {
            var leaving = comp.leavingGhostHouse('eyes', { x: 13.5, y: 10.9 });
            (0, assert_1.default)(!leaving);
        });
    });
    describe('handleGhostHouse', function () {
        it('snaps x to 13.5 and sends ghost down when entering', function () {
            comp.enteringGhostHouse = sinon_1.default.fake.returns(true);
            comp.characterUtil.snapToGrid = sinon_1.default.fake();
            var result = comp.handleGhostHouse({ x: 0, y: 0 });
            assert_1.default.strictEqual(comp.direction, 'down');
            assert_1.default.deepEqual(result, { x: 13.5, y: 0 });
            (0, assert_1.default)(comp.characterUtil.snapToGrid.called);
        });
        it('snaps y to 14 and sends ghost up once entered', function () {
            comp.enteredGhostHouse = sinon_1.default.fake.returns(true);
            comp.characterUtil.snapToGrid = sinon_1.default.fake();
            window.dispatchEvent = sinon_1.default.fake();
            global.Event = sinon_1.default.fake();
            var result = comp.handleGhostHouse({ x: 0, y: 0 });
            assert_1.default.strictEqual(comp.direction, 'up');
            assert_1.default.deepEqual(result, { x: 0, y: 14 });
            (0, assert_1.default)(comp.characterUtil.snapToGrid.called);
            assert_1.default.strictEqual(comp.mode, comp.defaultMode);
            (0, assert_1.default)(window.dispatchEvent.calledWith(new Event('restoreGhost')));
        });
        it('snaps y to 11 and sends ghost left once exited', function () {
            comp.leavingGhostHouse = sinon_1.default.fake.returns(true);
            comp.characterUtil.snapToGrid = sinon_1.default.fake();
            var result = comp.handleGhostHouse({ x: 0, y: 0 });
            assert_1.default.strictEqual(comp.direction, 'left');
            assert_1.default.deepEqual(result, { x: 0, y: 11 });
            (0, assert_1.default)(comp.characterUtil.snapToGrid.called);
        });
    });
    describe('handleIdleMovement', function () {
        var elapsedMs;
        var position;
        var velocity;
        beforeEach(function () {
            elapsedMs = 100;
            position = { x: undefined, y: undefined };
            velocity = 200;
            comp.characterUtil.getPropertyToChange = sinon_1.default.fake();
            comp.characterUtil.getVelocity = sinon_1.default.fake();
        });
        it('bounces the ghost up and down while idling', function () {
            comp.idleMode = 'idle';
            position.y = 13.5;
            comp.handleIdleMovement(elapsedMs, position, velocity);
            assert_1.default.strictEqual(comp.direction, 'down');
            position.y = 14.5;
            comp.handleIdleMovement(elapsedMs, position, velocity);
            assert_1.default.strictEqual(comp.direction, 'up');
        });
        it('vacates the ghost when idleMode is LEAVING', function () {
            global.window = {
                dispatchEvent: sinon_1.default.fake(),
            };
            global.Event = sinon_1.default.fake();
            comp.idleMode = 'leaving';
            position = { x: 13.5, y: 10.9 };
            var result = comp.handleIdleMovement(elapsedMs, position, velocity);
            assert_1.default.strictEqual(comp.idleMode, undefined);
            assert_1.default.strictEqual(result.top, comp.scaledTileSize * 10.5);
            assert_1.default.strictEqual(comp.direction, 'left');
            (0, assert_1.default)(window.dispatchEvent.calledWith(new Event('releaseGhost')));
            comp.idleMode = 'leaving';
            position = { x: 13.41, y: 10 };
            result = comp.handleIdleMovement(elapsedMs, position, velocity);
            assert_1.default.strictEqual(result.left, comp.scaledTileSize * 13);
            assert_1.default.strictEqual(comp.direction, 'up');
            position = { x: 11, y: 14 };
            result = comp.handleIdleMovement(elapsedMs, position, velocity);
            assert_1.default.strictEqual(result.top, comp.scaledTileSize * 13.5);
            assert_1.default.strictEqual(comp.direction, 'right');
            position = { x: 15, y: 14 };
            result = comp.handleIdleMovement(elapsedMs, position, velocity);
            assert_1.default.strictEqual(result.top, comp.scaledTileSize * 13.5);
            assert_1.default.strictEqual(comp.direction, 'left');
            position = { x: 1, y: 1 };
            comp.handleIdleMovement(elapsedMs, position, velocity);
        });
    });
    describe('endIdleMode', function () {
        it('sets idleMode to LEAVING', function () {
            comp.idleMode = 'idle';
            comp.endIdleMode();
            assert_1.default.strictEqual(comp.idleMode, 'leaving');
        });
    });
    describe('handleUnsnappedMovement', function () {
        beforeEach(function () {
            sinon_1.default.stub(comp, 'handleGhostHouse').callsFake(function (input) { return input; });
        });
        it('returns the desired new position', function () {
            var desired = {
                newPosition: { top: 25, left: 50 },
            };
            comp.characterUtil.determineNewPositions = sinon_1.default.fake.returns(desired);
            comp.characterUtil.changingGridPosition = sinon_1.default.fake.returns(false);
            var newPosition = comp.handleUnsnappedMovement();
            assert_1.default.deepEqual(newPosition, desired.newPosition);
        });
        it('returns a snapped position if changing tiles', function () {
            var snappedPosition = { top: 125, left: 150 };
            comp.characterUtil.determineNewPositions = sinon_1.default.fake.returns({
                newGridPosition: '',
            });
            comp.characterUtil.changingGridPosition = sinon_1.default.fake.returns(true);
            comp.characterUtil.snapToGrid = sinon_1.default.fake.returns(snappedPosition);
            var newPosition = comp.handleUnsnappedMovement();
            assert_1.default.deepEqual(newPosition, snappedPosition);
        });
    });
    describe('handleMovement', function () {
        beforeEach(function () {
            comp.characterUtil.determineGridPosition = sinon_1.default.fake();
            comp.determineVelocity = sinon_1.default.fake();
            comp.handleIdleMovement = sinon_1.default.fake();
            comp.handleSnappedMovement = sinon_1.default.fake();
            comp.handleUnsnappedMovement = sinon_1.default.fake();
            comp.characterUtil.handleWarp = sinon_1.default.fake();
            comp.checkCollision = sinon_1.default.fake();
        });
        it('calls handleWarp and checkCollision', function () {
            comp.handleMovement(100);
            (0, assert_1.default)(comp.characterUtil.handleWarp.called);
            (0, assert_1.default)(comp.checkCollision.called);
        });
        it('calls the correct movement handlers', function () {
            comp.idleMode = true;
            comp.handleMovement(100);
            (0, assert_1.default)(comp.handleIdleMovement.called);
            comp.idleMode = false;
            comp.position = {};
            comp.characterUtil.snapToGrid = sinon_1.default.fake.returns(comp.position);
            comp.handleMovement(100);
            (0, assert_1.default)(comp.handleSnappedMovement.called);
            comp.position = undefined;
            comp.handleMovement(100);
            (0, assert_1.default)(comp.handleUnsnappedMovement.called);
        });
    });
    describe('changeMode', function () {
        it('updates the defaultMode', function () {
            comp.defaultMode = 'chase';
            comp.mode = 'chase';
            comp.isInGhostHouse = sinon_1.default.fake.returns(false);
            comp.characterUtil.getOppositeDirection = sinon_1.default.fake.returns('down');
            comp.changeMode('scatter');
            assert_1.default.strictEqual(comp.defaultMode, 'scatter');
            assert_1.default.strictEqual(comp.mode, 'scatter');
            assert_1.default.strictEqual(comp.direction, 'down');
        });
        it('won\'t turn the ghost around when in the Ghost House', function () {
            comp.isInGhostHouse = sinon_1.default.fake.returns(true);
            comp.characterUtil.getOppositeDirection = sinon_1.default.fake();
            comp.changeMode('scatter');
            (0, assert_1.default)(!comp.characterUtil.getOppositeDirection.called);
        });
        it('won\'t update mode under certain conditions', function () {
            comp.mode = 'scared';
            comp.changeMode('scatter');
            assert_1.default.strictEqual(comp.mode, 'scared');
            comp.mode = 'chase';
            comp.cruiseElroy = true;
            comp.changeMode('scatter');
            assert_1.default.strictEqual(comp.mode, 'chase');
        });
    });
    describe('toggleScaredColor', function () {
        it('toggles between blue and white, calls setSpriteSheet', function () {
            comp.scaredColor = 'blue';
            comp.setSpriteSheet = sinon_1.default.fake();
            comp.toggleScaredColor();
            assert_1.default.strictEqual(comp.scaredColor, 'white');
            (0, assert_1.default)(comp.setSpriteSheet.calledOnce);
            comp.toggleScaredColor();
            assert_1.default.strictEqual(comp.scaredColor, 'blue');
            (0, assert_1.default)(comp.setSpriteSheet.calledTwice);
        });
    });
    describe('becomeScared', function () {
        it('starts the ghost\'s scared behavior', function () {
            comp.name = 'blinky';
            comp.mode = '';
            comp.isInGhostHouse = sinon_1.default.fake.returns(false);
            comp.characterUtil.getOppositeDirection = sinon_1.default.fake.returns('down');
            comp.setSpriteSheet = sinon_1.default.fake();
            comp.becomeScared();
            assert_1.default.strictEqual(comp.mode, 'scared');
            (0, assert_1.default)(comp.characterUtil.getOppositeDirection.called);
            (0, assert_1.default)(comp.setSpriteSheet.calledWith('blinky', 'down', 'scared'));
        });
        it('only u-turns if the ghost is not in the Ghost House', function () {
            comp.mode = '';
            comp.isInGhostHouse = sinon_1.default.fake.returns(true);
            comp.characterUtil.getOppositeDirection = sinon_1.default.fake();
            comp.becomeScared();
            (0, assert_1.default)(!comp.characterUtil.getOppositeDirection.called);
        });
        it('does nothing if in EYES mode', function () {
            comp.setSpriteSheet = sinon_1.default.fake();
            comp.mode = 'eyes';
            comp.becomeScared();
            (0, assert_1.default)(!comp.setSpriteSheet.called);
        });
    });
    describe('endScared', function () {
        it('sets the mode to CHASE and calls setSpriteSheet', function () {
            comp.mode = 'scared';
            comp.setSpriteSheet = sinon_1.default.fake();
            comp.endScared();
            assert_1.default.strictEqual(comp.mode, comp.defaultMode);
            (0, assert_1.default)(comp.setSpriteSheet.called);
        });
    });
    describe('speedUp', function () {
        it('increases the default speed', function () {
            comp.defaultSpeed = comp.slowSpeed;
            comp.speedUp();
            assert_1.default.strictEqual(comp.defaultSpeed, comp.mediumSpeed);
            comp.speedUp();
            assert_1.default.strictEqual(comp.defaultSpeed, comp.fastSpeed);
        });
        it('does nothing if the ghost is at top speed', function () {
            comp.defaultSpeed = comp.fastSpeed;
            comp.speedUp();
            assert_1.default.strictEqual(comp.defaultSpeed, comp.fastSpeed);
        });
    });
    describe('resetDefaultSpeed', function () {
        it('resets the defaultSpeed and calls setSpriteSheet', function () {
            comp.defaultSpeed = comp.fastSpeed;
            comp.setSpriteSheet = sinon_1.default.fake();
            comp.resetDefaultSpeed();
            assert_1.default.strictEqual(comp.defaultSpeed, comp.slowSpeed);
            (0, assert_1.default)(comp.setSpriteSheet.called);
        });
    });
    describe('pause', function () {
        it('updates the paused param', function () {
            comp.pause(true);
            (0, assert_1.default)(comp.paused);
            comp.pause(false);
            (0, assert_1.default)(!comp.paused);
        });
    });
    describe('checkCollision', function () {
        it('switches to eyes mode after Pacman eats the ghost', function () {
            global.window = {
                dispatchEvent: sinon_1.default.fake(),
            };
            global.CustomEvent = sinon_1.default.fake();
            comp.mode = 'scared';
            comp.checkCollision({ x: 0, y: 0 }, { x: 0.9, y: 0 });
            assert_1.default.strictEqual(comp.mode, 'eyes');
            (0, assert_1.default)(global.window.dispatchEvent.calledWith(new CustomEvent('eatGhost', { detail: { ghost: comp } })));
        });
        it('emits the deathSequence event when <1 tile away from Pacman', function () {
            global.window = {
                dispatchEvent: sinon_1.default.fake(),
            };
            global.Event = sinon_1.default.fake();
            comp.mode = 'chase';
            comp.checkCollision({ x: 0, y: 0 }, { x: 1, y: 0 });
            (0, assert_1.default)(!global.window.dispatchEvent.called);
            comp.checkCollision({ x: 0, y: 0 }, { x: 0.9, y: 0 });
            (0, assert_1.default)(global.window.dispatchEvent.calledWith(new Event('deathSequence')));
        });
    });
    describe('determineVelocity', function () {
        it('returns eyeSpeed for eyes mode', function () {
            var result = comp.determineVelocity({}, 'eyes');
            assert_1.default.strictEqual(result, comp.eyeSpeed);
        });
        it('returns ZERO when the ghost is paused', function () {
            comp.paused = true;
            var result = comp.determineVelocity({}, 'chase');
            assert_1.default.strictEqual(result, 0);
        });
        it('returns tunnelSpeed when in the tunnel', function () {
            comp.isInTunnel = sinon_1.default.fake.returns(true);
            var result = comp.determineVelocity({}, 'scared');
            assert_1.default.strictEqual(result, comp.transitionSpeed);
        });
        it('returns scaredSpeed for scared mode', function () {
            var result = comp.determineVelocity({}, 'scared');
            assert_1.default.strictEqual(result, comp.scaredSpeed);
        });
        it('returns defaultSpeed otherwise', function () {
            var result = comp.determineVelocity({}, 'chase');
            assert_1.default.strictEqual(result, comp.slowSpeed);
        });
    });
    describe('draw', function () {
        it('updates various css properties and animates the spritesheet', function () {
            var drawValueSpy = sinon_1.default.fake.returns(100);
            var stutterSpy = sinon_1.default.fake.returns('visible');
            var spriteSpy = sinon_1.default.fake.returns({
                msSinceLastSprite: '',
                animationTarget: '',
                backgroundOffsetPixels: '',
            });
            comp.characterUtil.calculateNewDrawValue = drawValueSpy;
            comp.characterUtil.checkForStutter = stutterSpy;
            comp.characterUtil.advanceSpriteSheet = spriteSpy;
            comp.draw(1);
            (0, assert_1.default)(drawValueSpy.calledTwice);
            (0, assert_1.default)(stutterSpy.called);
            (0, assert_1.default)(spriteSpy.called);
        });
        it('won\'t call checkForStutter if display is FALSE', function () {
            var stutterSpy = sinon_1.default.fake();
            comp.characterUtil.checkForStutter = stutterSpy;
            comp.display = false;
            comp.draw(1);
            (0, assert_1.default)(!stutterSpy.called);
        });
    });
    describe('update', function () {
        it('updates oldPosition', function () {
            comp.oldPosition = undefined;
            comp.position = {};
            comp.update();
            assert_1.default.deepEqual(comp.oldPosition, comp.position);
        });
        it('updates various properties when moving', function () {
            comp.msSinceLastSprite = 0;
            comp.moving = true;
            comp.handleMovement = sinon_1.default.fake();
            comp.setSpriteSheet = sinon_1.default.fake();
            comp.update(100);
            (0, assert_1.default)(comp.handleMovement.calledWith(100));
            (0, assert_1.default)(comp.setSpriteSheet.called);
            assert_1.default.strictEqual(comp.msSinceLastSprite, 100);
        });
    });
});

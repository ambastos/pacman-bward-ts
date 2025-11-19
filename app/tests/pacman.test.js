"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const assert = require('assert');
// const sinon = require('sinon');
// const Pacman = require('../scripts/characters/pacman');
// const CharacterUtil = require('../scripts/utilities/characterUtil');
var assert_1 = require("assert");
var sinon_1 = require("sinon");
var pacman_js_1 = require("../scripts/characters/pacman.js");
var characterUtil_js_1 = require("../scripts/utilities/characterUtil.js");
var scaledTileSize = 8;
var pacman;
beforeEach(function () {
    global.document = {
        getElementById: function () { return ({
            style: {},
        }); },
    };
    global.window = {
        addEventListener: function () { return true; },
    };
    pacman = new pacman_js_1.default(scaledTileSize, undefined, new characterUtil_js_1.default());
});
describe('pacman', function () {
    describe('reset', function () {
        it('resets the character to its default state', function () {
            pacman.setMovementStats = sinon_1.default.fake();
            pacman.setSpriteAnimationStats = sinon_1.default.fake();
            pacman.setStyleMeasurements = sinon_1.default.fake();
            pacman.setDefaultPosition = sinon_1.default.fake();
            pacman.setSpriteSheet = sinon_1.default.fake();
            pacman.reset();
            (0, assert_1.default)(pacman.setMovementStats.calledWith(pacman.scaledTileSize));
            (0, assert_1.default)(pacman.setSpriteAnimationStats.called);
            (0, assert_1.default)(pacman.setStyleMeasurements.calledWith(pacman.scaledTileSize, pacman.spriteFrames));
            (0, assert_1.default)(pacman.setDefaultPosition.calledWith(pacman.scaledTileSize));
            (0, assert_1.default)(pacman.setSpriteSheet.calledWith(pacman.direction));
            assert_1.default.strictEqual(pacman.pacmanArrow.style.backgroundImage, 'url(app/style/graphics/spriteSheets/characters/pacman/arrow_'
                + "".concat(pacman.direction, ".svg)"));
        });
    });
    describe('setStyleMeasurements', function () {
        it('sets pacman\'s measurement properties', function () {
            pacman.animationTarget.style = {};
            pacman.setStyleMeasurements(scaledTileSize, 4);
            assert_1.default.strictEqual(pacman.measurement, 16);
            assert_1.default.deepEqual(pacman.animationTarget.style, {
                height: '16px',
                width: '16px',
                backgroundSize: '64px',
            });
        });
        it('sets pacman\'s measurement to scaledTileSize times two', function () {
            pacman.setStyleMeasurements(1);
            assert_1.default.strictEqual(pacman.measurement, 2);
            pacman.setStyleMeasurements(8);
            assert_1.default.strictEqual(pacman.measurement, 16);
            pacman.setStyleMeasurements(1000);
            assert_1.default.strictEqual(pacman.measurement, 2000);
        });
        it('sets pacman\'s backgroundSize to scaledTileSize times eight', function () {
            pacman.setStyleMeasurements(1, 4);
            assert_1.default.strictEqual(pacman.animationTarget.style.backgroundSize, '8px');
            pacman.setStyleMeasurements(8, 4);
            assert_1.default.strictEqual(pacman.animationTarget.style.backgroundSize, '64px');
            pacman.setStyleMeasurements(1000, 4);
            assert_1.default.strictEqual(pacman.animationTarget.style.backgroundSize, '8000px');
        });
    });
    describe('setSpriteAnimationStats', function () {
        it('sets various stats for pacman\'s sprite animation', function () {
            pacman.setSpriteAnimationStats();
            assert_1.default.strictEqual(pacman.msBetweenSprites, 50);
            assert_1.default.strictEqual(pacman.msSinceLastSprite, 0);
            assert_1.default.strictEqual(pacman.spriteFrames, 4);
            assert_1.default.strictEqual(pacman.backgroundOffsetPixels, 0);
        });
    });
    describe('setDefaultPosition', function () {
        it('sets the defaultPosition, position, and oldPositions', function () {
            pacman.setDefaultPosition(scaledTileSize);
            assert_1.default.deepEqual(pacman.defaultPosition, {
                left: 104,
                top: 180,
            });
            assert_1.default.deepEqual(pacman.position, pacman.defaultPosition);
            assert_1.default.deepEqual(pacman.position, pacman.oldPosition);
        });
    });
    describe('calculateVelocityPerMs', function () {
        it('returns the input multiplied by 11, then divided by 1000', function () {
            assert_1.default.strictEqual(pacman.calculateVelocityPerMs(8), 0.088);
            assert_1.default.strictEqual(pacman.calculateVelocityPerMs(64), 0.704);
            assert_1.default.strictEqual(pacman.calculateVelocityPerMs(200), 2.2);
        });
    });
    describe('setSpriteSheet', function () {
        var baseUrl = 'url(app/style/graphics/spriteSheets/characters/pacman/';
        it('sets the correct spritesheet for any given direction', function () {
            pacman.setSpriteSheet('up');
            assert_1.default.strictEqual(pacman.animationTarget.style.backgroundImage, "".concat(baseUrl, "pacman_up.svg)"));
            pacman.setSpriteSheet('down');
            assert_1.default.strictEqual(pacman.animationTarget.style.backgroundImage, "".concat(baseUrl, "pacman_down.svg)"));
            pacman.setSpriteSheet('left');
            assert_1.default.strictEqual(pacman.animationTarget.style.backgroundImage, "".concat(baseUrl, "pacman_left.svg)"));
            pacman.setSpriteSheet('right');
            assert_1.default.strictEqual(pacman.animationTarget.style.backgroundImage, "".concat(baseUrl, "pacman_right.svg)"));
        });
    });
    describe('prepDeathAnimation', function () {
        it('sets properties to prep the animation', function () {
            pacman.prepDeathAnimation();
            (0, assert_1.default)(!pacman.loopAnimation);
            assert_1.default.strictEqual(pacman.msBetweenSprites, 125);
            assert_1.default.strictEqual(pacman.spriteFrames, 12);
            (0, assert_1.default)(pacman.specialAnimation);
            assert_1.default.strictEqual(pacman.backgroundOffsetPixels, 0);
            assert_1.default.strictEqual(pacman.animationTarget.style.backgroundSize, "".concat(pacman.measurement * pacman.spriteFrames, "px"));
            assert_1.default.strictEqual(pacman.animationTarget.style.backgroundImage, 'url(app/style/graphics/spriteSheets/characters/pacman/'
                + 'pacman_death.svg)');
            assert_1.default.strictEqual(pacman.animationTarget.style.backgroundPosition, '0px 0px');
            assert_1.default.strictEqual(pacman.pacmanArrow.style.backgroundImage, '');
        });
    });
    describe('changeDirection', function () {
        it('sets direction, sets the arrow, and sets moving to TRUE', function () {
            pacman.desiredDirection = 'up';
            pacman.pacmanArrow.style.backgroundImage = '';
            pacman.moving = false;
            pacman.changeDirection('down', true);
            assert_1.default.strictEqual(pacman.desiredDirection, 'down');
            assert_1.default.strictEqual(pacman.pacmanArrow.style.backgroundImage, 'url(app/'
                + 'style/graphics/spriteSheets/characters/pacman/arrow_down.svg)');
            (0, assert_1.default)(pacman.moving);
        });
        it('won\'t start Pacman moving if startMoving is FALSE', function () {
            pacman.desiredDirection = 'up';
            pacman.pacmanArrow.style.backgroundImage = '';
            pacman.moving = false;
            pacman.changeDirection('down', false);
            assert_1.default.strictEqual(pacman.desiredDirection, 'down');
            assert_1.default.strictEqual(pacman.pacmanArrow.style.backgroundImage, 'url(app/'
                + 'style/graphics/spriteSheets/characters/pacman/arrow_down.svg)');
            (0, assert_1.default)(!pacman.moving);
        });
    });
    describe('updatePacmanArrowPosition', function () {
        it('updates the css positioning of the Pacman Arrow', function () {
            assert_1.default.strictEqual(pacman.pacmanArrow.style.top, undefined);
            assert_1.default.strictEqual(pacman.pacmanArrow.style.left, undefined);
            pacman.updatePacmanArrowPosition({ top: 100, left: 100 }, scaledTileSize);
            assert_1.default.strictEqual(pacman.pacmanArrow.style.top, '92px');
            assert_1.default.strictEqual(pacman.pacmanArrow.style.left, '92px');
        });
    });
    describe('movement handlers', function () {
        var desiredPosition;
        var alternatePosition;
        var snappedPosition;
        beforeEach(function () {
            pacman.direction = 'left';
            pacman.desiredDirection = 'up';
            pacman.characterUtil.determineNewPositions = function (position, direction) {
                desiredPosition = { top: 10, left: 10 };
                alternatePosition = { top: 100, left: 100 };
                snappedPosition = { top: 50, left: 50 };
                if (direction === 'up') {
                    return {
                        newPosition: desiredPosition,
                        newGridPosition: { x: 5, y: 5 },
                    };
                }
                return {
                    newPosition: alternatePosition,
                    newGridPosition: { x: 50, y: 50 },
                };
            };
        });
        describe('handleSnappedMovement', function () {
            it('sets Pacman\'s direction if his desired position is clear', function () {
                var spriteSpy = pacman.setSpriteSheet = sinon_1.default.fake();
                pacman.characterUtil.checkForWallCollision = sinon_1.default.fake.returns(false);
                var newPosition = pacman.handleSnappedMovement();
                assert_1.default.strictEqual(pacman.direction, 'up');
                (0, assert_1.default)(spriteSpy.calledWith('up'));
                assert_1.default.deepEqual(newPosition, desiredPosition);
            });
            it('returns the alternate new position if needed', function () {
                var firstCall = true;
                pacman.characterUtil.checkForWallCollision = function () {
                    if (firstCall) {
                        firstCall = false;
                        return true;
                    }
                    return false;
                };
                var newPosition = pacman.handleSnappedMovement();
                assert_1.default.deepEqual(newPosition, alternatePosition);
            });
            it('returns Pacman\'s current position if he can\'t move', function () {
                pacman.characterUtil.checkForWallCollision = sinon_1.default.fake.returns(true);
                pacman.moving = true;
                var newPosition = pacman.handleSnappedMovement();
                assert_1.default.strictEqual(pacman.moving, false);
                assert_1.default.deepEqual(newPosition, pacman.position);
            });
        });
        describe('handleUnsnappedMovement', function () {
            it('sets Pacman\'s direction if he is turning around', function () {
                var spriteSpy = pacman.setSpriteSheet = sinon_1.default.fake();
                pacman.characterUtil.turningAround = sinon_1.default.fake.returns(true);
                var newPosition = pacman.handleUnsnappedMovement();
                assert_1.default.strictEqual(pacman.direction, 'up');
                (0, assert_1.default)(spriteSpy.calledWith('up'));
                assert_1.default.deepEqual(newPosition, desiredPosition);
            });
            it('returns Pacman\'s current position, snapped to the grid', function () {
                pacman.characterUtil.turningAround = sinon_1.default.fake.returns(false);
                pacman.characterUtil.changingGridPosition = sinon_1.default.fake.returns(true);
                pacman.characterUtil.snapToGrid = sinon_1.default.fake.returns(snappedPosition);
                var newPosition = pacman.handleUnsnappedMovement();
                assert_1.default.deepEqual(newPosition, snappedPosition);
            });
            it('returns the alternate position', function () {
                pacman.characterUtil.turningAround = sinon_1.default.fake.returns(false);
                pacman.characterUtil.changingGridPosition = sinon_1.default.fake.returns(false);
                var newPosition = pacman.handleUnsnappedMovement();
                assert_1.default.deepEqual(newPosition, alternatePosition);
            });
        });
    });
    describe('draw', function () {
        it('updates css properties and animate Pacman\'s spritesheet', function () {
            var drawValueSpy = sinon_1.default.fake.returns(100);
            var stutterSpy = sinon_1.default.fake.returns('visible');
            var arrowSpy = sinon_1.default.fake();
            var spriteSpy = sinon_1.default.fake.returns({
                msSinceLastSprite: '',
                animationTarget: '',
                backgroundOffsetPixels: '',
            });
            pacman.characterUtil.calculateNewDrawValue = drawValueSpy;
            pacman.characterUtil.checkForStutter = stutterSpy;
            pacman.updatePacmanArrowPosition = arrowSpy;
            pacman.characterUtil.advanceSpriteSheet = spriteSpy;
            pacman.draw(1);
            (0, assert_1.default)(drawValueSpy.calledTwice);
            (0, assert_1.default)(stutterSpy.called);
            (0, assert_1.default)(arrowSpy.called);
            (0, assert_1.default)(spriteSpy.called);
        });
        it('hides Pacman if display is FALSE', function () {
            pacman.display = false;
            pacman.draw(1);
            assert_1.default.strictEqual(pacman.animationTarget.style.visibility, 'hidden');
        });
    });
    describe('update', function () {
        it('calls handleSnappedMovement if Pacman is snapped', function () {
            var snappedSpy = pacman.handleSnappedMovement = sinon_1.default.fake();
            pacman.characterUtil.determineGridPosition = sinon_1.default.fake();
            pacman.characterUtil.handleWarp = sinon_1.default.fake();
            pacman.characterUtil.snapToGrid = sinon_1.default.fake.returns(pacman.position);
            pacman.moving = true;
            pacman.update();
            (0, assert_1.default)(snappedSpy.called);
        });
        it('calls handleUnsnappedMovement if Pacman is unsapped', function () {
            var unsnappedSpy = pacman.handleUnsnappedMovement = sinon_1.default.fake();
            pacman.characterUtil.determineGridPosition = sinon_1.default.fake();
            pacman.characterUtil.handleWarp = sinon_1.default.fake();
            pacman.characterUtil.snapToGrid = sinon_1.default.fake.returns({});
            pacman.moving = true;
            pacman.update();
            (0, assert_1.default)(unsnappedSpy.called);
        });
        it('won\'t call movement handlers unless Pacman is moving', function () {
            var snappedSpy = pacman.handleSnappedMovement = sinon_1.default.fake();
            var unsnappedSpy = pacman.handleUnsnappedMovement = sinon_1.default.fake();
            pacman.moving = false;
            pacman.update();
            (0, assert_1.default)(!snappedSpy.called);
            (0, assert_1.default)(!unsnappedSpy.called);
        });
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const assert = require('assert');
// const sinon = require('sinon');
// const Pickup = require('../scripts/pickups/pickup');
var assert_1 = require("assert");
var sinon_1 = require("sinon");
var pickup_js_1 = require("../scripts/pickups/pickup.js");
var pickup;
var pacman;
var mazeDiv;
beforeEach(function () {
    global.document = {
        createElement: function () { return ({
            classList: {
                add: function () { },
            },
            style: {},
        }); },
    };
    pacman = {
        position: {
            top: 10,
            left: 10,
        },
        measurement: 16,
    };
    mazeDiv = {
        appendChild: function () { },
    };
    pickup = new pickup_js_1.default('pacdot', 8, 1, 1, pacman, mazeDiv);
});
describe('pickup', function () {
    describe('reset', function () {
        it('sets visibility according to type', function () {
            pickup.animationTarget.style.visibility = 'blah';
            pickup.type = 'pacdot';
            pickup.reset();
            assert_1.default.strictEqual(pickup.animationTarget.style.visibility, 'visible');
            pickup.type = 'fruit';
            pickup.reset();
            assert_1.default.strictEqual(pickup.animationTarget.style.visibility, 'hidden');
        });
    });
    describe('setStyleMeasurements', function () {
        it('sets measurements for pacdots', function () {
            pickup.setStyleMeasurements('pacdot', 8, 1, 1);
            assert_1.default.strictEqual(pickup.size, 2);
            assert_1.default.strictEqual(pickup.x, 11);
            assert_1.default.strictEqual(pickup.y, 11);
            assert_1.default.deepEqual(pickup.animationTarget.style, {
                backgroundImage: 'url(app/style/graphics/spriteSheets/pickups/'
                    + 'pacdot.svg)',
                backgroundSize: '2px',
                height: '2px',
                left: '11px',
                position: 'absolute',
                top: '11px',
                visibility: 'visible',
                width: '2px',
            });
        });
        it('sets measurements for powerPellets', function () {
            pickup.setStyleMeasurements('powerPellet', 8, 1, 1);
            assert_1.default.strictEqual(pickup.size, 8);
            assert_1.default.strictEqual(pickup.x, 8);
            assert_1.default.strictEqual(pickup.y, 8);
            assert_1.default.deepEqual(pickup.animationTarget.style, {
                backgroundImage: 'url(app/style/graphics/spriteSheets/pickups/'
                    + 'powerPellet.svg)',
                backgroundSize: '8px',
                height: '8px',
                left: '8px',
                position: 'absolute',
                top: '8px',
                visibility: 'visible',
                width: '8px',
            });
        });
        it('sets measurements for fruits', function () {
            pickup.type = 'fruit';
            pickup.setStyleMeasurements('fruit', 8, 1, 1, 100);
            assert_1.default.strictEqual(pickup.size, 16);
            assert_1.default.strictEqual(pickup.x, 4);
            assert_1.default.strictEqual(pickup.y, 4);
            assert_1.default.deepEqual(pickup.animationTarget.style, {
                backgroundImage: 'url(app/style/graphics/spriteSheets/pickups/'
                    + 'cherry.svg)',
                backgroundSize: '16px',
                height: '16px',
                left: '4px',
                position: 'absolute',
                top: '4px',
                width: '16px',
                visibility: 'hidden',
            });
        });
    });
    describe('determineImage', function () {
        var baseUrl;
        beforeEach(function () {
            baseUrl = 'url(app/style/graphics/spriteSheets/pickups/';
        });
        it('returns correct images for fruits', function () {
            assert_1.default.strictEqual(pickup.determineImage('fruit', 100), "".concat(baseUrl, "cherry.svg)"));
            assert_1.default.strictEqual(pickup.determineImage('fruit', 300), "".concat(baseUrl, "strawberry.svg)"));
            assert_1.default.strictEqual(pickup.determineImage('fruit', 500), "".concat(baseUrl, "orange.svg)"));
            assert_1.default.strictEqual(pickup.determineImage('fruit', 700), "".concat(baseUrl, "apple.svg)"));
            assert_1.default.strictEqual(pickup.determineImage('fruit', 1000), "".concat(baseUrl, "melon.svg)"));
            assert_1.default.strictEqual(pickup.determineImage('fruit', 2000), "".concat(baseUrl, "galaxian.svg)"));
            assert_1.default.strictEqual(pickup.determineImage('fruit', 3000), "".concat(baseUrl, "bell.svg)"));
            assert_1.default.strictEqual(pickup.determineImage('fruit', 5000), "".concat(baseUrl, "key.svg)"));
        });
        it('returns cherry by default for unrecognized fruit', function () {
            var unknown = pickup.determineImage('fruit', undefined);
            assert_1.default.strictEqual(unknown, "".concat(baseUrl, "cherry.svg)"));
        });
        it('returns correct images for other pickups', function () {
            var pacdot = pickup.determineImage('pacdot', undefined);
            assert_1.default.strictEqual(pacdot, "".concat(baseUrl, "pacdot.svg)"));
            var powerPellet = pickup.determineImage('powerPellet', undefined);
            assert_1.default.strictEqual(powerPellet, "".concat(baseUrl, "powerPellet.svg)"));
        });
    });
    describe('showFruit', function () {
        it('sets the point value, image, and visibility', function () {
            pickup.points = 0;
            pickup.animationTarget.style.backgroundImage = '';
            pickup.animationTarget.style.visibility = '';
            pickup.determineImage = sinon_1.default.fake.returns('svg');
            pickup.showFruit(100);
            assert_1.default.strictEqual(pickup.points, 100);
            assert_1.default.strictEqual(pickup.animationTarget.style.backgroundImage, 'svg');
            assert_1.default.strictEqual(pickup.animationTarget.style.visibility, 'visible');
        });
    });
    describe('hideFruit', function () {
        it('sets the visibility to HIDDEN', function () {
            pickup.animationTarget.style.visibility = 'visible';
            pickup.hideFruit();
            assert_1.default.strictEqual(pickup.animationTarget.style.visibility, 'hidden');
        });
    });
    describe('checkForCollision', function () {
        it('returns TRUE if the Pickup is colliding', function () {
            (0, assert_1.default)(pickup.checkForCollision({ x: 7.4, y: 7.4, size: 5 }, { x: 0, y: 0, size: 10 }));
        });
        it('returns FALSE if it is not', function () {
            (0, assert_1.default)(!pickup.checkForCollision({ x: 7.5, y: 7.5, size: 5 }, { x: 0, y: 0, size: 10 }));
        });
    });
    describe('checkPacmanProximity', function () {
        beforeEach(function () {
            pickup.center = { x: 0, y: 0 };
        });
        it('returns TRUE if the pickup is close to Pacman', function () {
            pickup.checkPacmanProximity(5, { x: 3, y: 4 });
            (0, assert_1.default)(pickup.nearPacman);
        });
        it('returns FALSE otherwise', function () {
            pickup.checkPacmanProximity(4.9, { x: 3, y: 4 });
            (0, assert_1.default)(!pickup.nearPacman);
        });
        it('sets background color when debugging', function () {
            pickup.checkPacmanProximity(5, { x: 3, y: 4 }, true);
            assert_1.default.strictEqual(pickup.animationTarget.style.background, 'lime');
            pickup.checkPacmanProximity(4.9, { x: 3, y: 4 }, true);
            assert_1.default.strictEqual(pickup.animationTarget.style.background, 'red');
        });
        it('skips execution if the pickup is hidden', function () {
            pickup.animationTarget.style.visibility = 'hidden';
            pickup.nearPacman = false;
            pickup.checkPacmanProximity(5, { x: 3, y: 4 });
            (0, assert_1.default)(!pickup.nearPacman);
        });
    });
    describe('shouldCheckForCollision', function () {
        it('only returns TRUE when the Pickup is near Pacman and visible', function () {
            pickup.animationTarget.style.visibility = 'visible';
            pickup.nearPacman = true;
            (0, assert_1.default)(pickup.shouldCheckForCollision());
            pickup.nearPacman = false;
            (0, assert_1.default)(!pickup.shouldCheckForCollision());
            pickup.animationTarget.style.visibility = 'hidden';
            (0, assert_1.default)(!pickup.shouldCheckForCollision());
            pickup.nearPacman = true;
            (0, assert_1.default)(!pickup.shouldCheckForCollision());
        });
    });
    describe('update', function () {
        beforeEach(function () {
            global.window = {
                dispatchEvent: sinon_1.default.fake(),
            };
        });
        it('turns the Pickup\'s visibility to HIDDEN after collision', function () {
            pickup.shouldCheckForCollision = sinon_1.default.fake.returns(true);
            pickup.checkForCollision = sinon_1.default.fake.returns(true);
            pickup.update();
            assert_1.default.strictEqual(pickup.animationTarget.style.visibility, 'hidden');
        });
        it('leaves the Pickup\'s visibility until collision', function () {
            pickup.shouldCheckForCollision = sinon_1.default.fake.returns(true);
            pickup.checkForCollision = sinon_1.default.fake.returns(false);
            pickup.update();
            assert_1.default.notStrictEqual(pickup.animationTarget.style.visibility, 'hidden');
        });
        it('emits the awardPoints event after a collision', function () {
            pickup.points = 100;
            pickup.shouldCheckForCollision = sinon_1.default.fake.returns(true);
            pickup.checkForCollision = sinon_1.default.fake.returns(true);
            pickup.update();
            (0, assert_1.default)(global.window.dispatchEvent.calledWith(new CustomEvent('awardPoints', {
                detail: {
                    points: pickup.points,
                },
            })));
        });
        it('emits dotEaten event if a pacdot collides with Pacman', function () {
            pickup.type = 'pacdot';
            pickup.shouldCheckForCollision = sinon_1.default.fake.returns(true);
            pickup.checkForCollision = sinon_1.default.fake.returns(true);
            pickup.update();
            (0, assert_1.default)(global.window.dispatchEvent.calledWith(new Event('dotEaten')));
        });
        it('emits powerUp event if a powerPellet collides with Pacman', function () {
            pickup.type = 'powerPellet';
            pickup.shouldCheckForCollision = sinon_1.default.fake.returns(true);
            pickup.checkForCollision = sinon_1.default.fake.returns(true);
            pickup.update();
            (0, assert_1.default)(global.window.dispatchEvent.calledWith(new Event('dotEaten')));
            (0, assert_1.default)(global.window.dispatchEvent.calledWith(new Event('powerUp')));
        });
        it('emits no events if an unrecognized item collides with Pacman', function () {
            pickup.type = 'blah';
            pickup.shouldCheckForCollision = sinon_1.default.fake.returns(true);
            pickup.checkForCollision = sinon_1.default.fake.returns(true);
            pickup.update();
        });
        it('does nothing if shouldCheckForCollision returns FALSE', function () {
            pickup.shouldCheckForCollision = sinon_1.default.fake.returns(false);
            pickup.checkForCollision = sinon_1.default.fake();
            pickup.update();
            (0, assert_1.default)(!pickup.checkForCollision.called);
        });
    });
});

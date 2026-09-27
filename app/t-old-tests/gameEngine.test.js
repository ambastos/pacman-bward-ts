"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const assert = require('assert');
// const sinon = require('sinon');
// const GameEngine = require('../scripts/core/gameEngine');
var assert_1 = require("assert");
var sinon_1 = require("sinon");
var gameEngine_js_1 = require("../scripts/core/gameEngine.js");
var gameEngine;
var maxFps = 120;
beforeEach(function () {
    global.document = {
        getElementById: function () { return ({}); },
    };
    global.window = {
        addEventListener: function () { },
    };
    global.requestAnimationFrame = function (callback) {
        callback(1000);
    };
    gameEngine = new gameEngine_js_1.default(maxFps);
});
describe('gameEngine', function () {
    describe('changePausedState', function () {
        it('pauses the game if it is running', function () {
            var stopSpy = gameEngine.stop = sinon_1.default.fake();
            gameEngine.changePausedState(true);
            (0, assert_1.default)(stopSpy.called);
        });
        it('resumes the game if it is paused', function () {
            var startSpy = gameEngine.start = sinon_1.default.fake();
            gameEngine.changePausedState(false);
            (0, assert_1.default)(startSpy.called);
        });
    });
    describe('updateFpsDisplay', function () {
        it('updates the FPS display if more than one second has passed', function () {
            gameEngine.framesThisSecond = maxFps;
            gameEngine.updateFpsDisplay(1001);
            assert_1.default.strictEqual(gameEngine.fps, maxFps);
            assert_1.default.strictEqual(gameEngine.lastFpsUpdate, 1001);
            assert_1.default.strictEqual(gameEngine.framesThisSecond, 1);
            assert_1.default.strictEqual(gameEngine.fpsDisplay.textContent, '120 FPS');
        });
        it('calculates the FPS display as an average', function () {
            gameEngine.framesThisSecond = 60;
            gameEngine.updateFpsDisplay(1001);
            assert_1.default.strictEqual(gameEngine.fps, 90);
            assert_1.default.strictEqual(gameEngine.lastFpsUpdate, 1001);
            assert_1.default.strictEqual(gameEngine.framesThisSecond, 1);
            assert_1.default.strictEqual(gameEngine.fpsDisplay.textContent, '90 FPS');
        });
        it('doesn\'t update the FPS until a second has passed', function () {
            gameEngine.framesThisSecond = 60;
            gameEngine.updateFpsDisplay(1000);
            assert_1.default.strictEqual(gameEngine.fps, 120);
            assert_1.default.strictEqual(gameEngine.lastFpsUpdate, 0);
            assert_1.default.strictEqual(gameEngine.framesThisSecond, 61);
            assert_1.default.strictEqual(gameEngine.fpsDisplay.textContent, '120 FPS');
        });
    });
    describe('draw', function () {
        it('calls the DRAW function for each entity', function () {
            var drawSpy1 = sinon_1.default.fake();
            var drawSpy2 = sinon_1.default.fake();
            var entityList = [
                { draw: drawSpy1 },
                { draw: drawSpy2 },
            ];
            gameEngine.draw(50, entityList);
            (0, assert_1.default)(drawSpy1.calledWith(50));
            (0, assert_1.default)(drawSpy2.calledWith(50));
        });
        it('won\'t crash if the DRAW property is not a function', function () {
            var entityList = [
                { draw: 123 },
                {},
            ];
            gameEngine.draw(50, entityList);
        });
    });
    describe('update', function () {
        it('calls the UPDATE function for each entity', function () {
            var updateSpy1 = sinon_1.default.fake();
            var updateSpy2 = sinon_1.default.fake();
            var entityList = [
                { update: updateSpy1 },
                { update: updateSpy2 },
            ];
            gameEngine.update(100, entityList);
            (0, assert_1.default)(updateSpy1.calledWith(100));
            (0, assert_1.default)(updateSpy2.calledWith(100));
        });
        it('won\'t crash if the UPDATE property is not a function', function () {
            var entityList = [
                { update: 123 },
                {},
            ];
            gameEngine.update(50, entityList);
        });
    });
    describe('panic', function () {
        it('resets the elapsedMs value to zero', function () {
            gameEngine.elapsedMs = 100;
            gameEngine.panic();
            assert_1.default.strictEqual(gameEngine.elapsedMs, 0);
        });
    });
    describe('start', function () {
        it('calls the mainLoop function to start the engine', function () {
            var mainLoopSpy = gameEngine.mainLoop = sinon_1.default.fake();
            var drawSpy = gameEngine.draw = sinon_1.default.fake();
            gameEngine.started = false;
            gameEngine.start();
            (0, assert_1.default)(gameEngine.started);
            (0, assert_1.default)(drawSpy.called);
            (0, assert_1.default)(gameEngine.running);
            assert_1.default.strictEqual(gameEngine.lastFrameTimeMs, 1000);
            assert_1.default.strictEqual(gameEngine.lastFpsUpdate, 1000);
            assert_1.default.strictEqual(gameEngine.framesThisSecond, 0);
            (0, assert_1.default)(mainLoopSpy.called);
        });
        it('doesn\'t call the mainLoop again once the engine starts', function () {
            var mainLoopSpy = gameEngine.mainLoop = sinon_1.default.fake();
            gameEngine.started = true;
            gameEngine.start();
            (0, assert_1.default)(mainLoopSpy.notCalled);
        });
    });
    describe('stop', function () {
        it('stops the engine and cancels the current animation frame', function () {
            var cancelSpy = global.cancelAnimationFrame = sinon_1.default.fake();
            gameEngine.running = true;
            gameEngine.started = true;
            gameEngine.stop();
            (0, assert_1.default)(!gameEngine.running);
            (0, assert_1.default)(!gameEngine.started);
            (0, assert_1.default)(cancelSpy.called);
        });
    });
    describe('processFrames', function () {
        it('calls the update function once per queued timestep', function () {
            var updateSpy = gameEngine.update = sinon_1.default.fake();
            gameEngine.elapsedMs = 3;
            gameEngine.timestep = 1;
            gameEngine.processFrames();
            (0, assert_1.default)(updateSpy.calledThrice);
        });
        it('calls the panic function if blocked for over a second', function () {
            var updateSpy = gameEngine.update = sinon_1.default.fake();
            var panicSpy = gameEngine.panic = sinon_1.default.fake();
            gameEngine.elapsedMs = (gameEngine.maxFps * gameEngine.timestep) + 1;
            gameEngine.processFrames();
            assert_1.default.strictEqual(updateSpy.callCount, gameEngine.maxFps);
            (0, assert_1.default)(panicSpy.called);
        });
    });
    describe('engineCycle', function () {
        it('won\'t call functions until a timestep passes', function () {
            var mainLoopSpy = gameEngine.mainLoop = sinon_1.default.fake();
            var updateFpsDisplaySpy = gameEngine.updateFpsDisplay = sinon_1.default.fake();
            var processFramesSpy = gameEngine.processFrames = sinon_1.default.fake();
            var drawSpy = gameEngine.draw = sinon_1.default.fake();
            gameEngine.elapsedMs = 10000;
            gameEngine.lastFrameTimeMs = 9000;
            gameEngine.engineCycle(0);
            (0, assert_1.default)(mainLoopSpy.called);
            (0, assert_1.default)(!updateFpsDisplaySpy.called);
            (0, assert_1.default)(!processFramesSpy.called);
            (0, assert_1.default)(!drawSpy.called);
            assert_1.default.strictEqual(gameEngine.elapsedMs, 10000);
            assert_1.default.strictEqual(gameEngine.lastFrameTimeMs, 9000);
        });
        it('calls functions after a timestep passes', function () {
            var mainLoopSpy = gameEngine.mainLoop = sinon_1.default.fake();
            var updateFpsDisplaySpy = gameEngine.updateFpsDisplay = sinon_1.default.fake();
            var processFramesSpy = gameEngine.processFrames = sinon_1.default.fake();
            var drawSpy = gameEngine.draw = sinon_1.default.fake();
            gameEngine.elapsedMs = 10000;
            gameEngine.lastFrameTimeMs = 9000;
            gameEngine.engineCycle(11000);
            (0, assert_1.default)(mainLoopSpy.called);
            (0, assert_1.default)(updateFpsDisplaySpy.called);
            (0, assert_1.default)(processFramesSpy.called);
            (0, assert_1.default)(drawSpy.called);
            assert_1.default.strictEqual(gameEngine.elapsedMs, 12000);
            assert_1.default.strictEqual(gameEngine.lastFrameTimeMs, 11000);
        });
    });
    describe('mainLoop', function () {
        it('calls the engineCycle function with a timestamp', function () {
            var engineCycleSpy = gameEngine.engineCycle = sinon_1.default.fake();
            gameEngine.mainLoop(1000);
            (0, assert_1.default)(engineCycleSpy.calledWith(1000));
        });
    });
});

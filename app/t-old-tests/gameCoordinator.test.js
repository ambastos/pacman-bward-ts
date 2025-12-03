"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const assert = require('assert');
// const sinon = require('sinon');
// const GameCoordinator = require('../scripts/core/gameCoordinator');
var assert_1 = require("assert");
var sinon_1 = require("sinon");
var gameCoordinator_js_1 = require("../scripts/core/gameCoordinator.js");
var comp;
var mazeArray = [
    ['X', 'X', 'X'],
    ['X', 'o', 'O'],
    ['X', ' ', 'X'],
];
var clock;
describe('gameCoordinator', function () {
    beforeEach(function () {
        global.Pacman = /** @class */ (function () {
            function Pacman() {
            }
            Pacman.prototype.reset = function () { };
            return Pacman;
        }());
        global.CharacterUtil = /** @class */ (function () {
            function CharacterUtil() {
            }
            return CharacterUtil;
        }());
        global.Ghost = /** @class */ (function () {
            function Ghost() {
            }
            Ghost.prototype.reset = function () { };
            Ghost.prototype.changeMode = function () { };
            Ghost.prototype.endIdleMode = function () { };
            Ghost.prototype.pause = function () { };
            return Ghost;
        }());
        global.Pickup = /** @class */ (function () {
            function Pickup(type) {
                this.type = type;
            }
            Pickup.prototype.reset = function () { };
            return Pickup;
        }());
        global.Timer = /** @class */ (function () {
            function Timer(callback, delay) {
                setTimeout(callback, delay);
            }
            return Timer;
        }());
        global.GameEngine = /** @class */ (function () {
            function GameEngine() {
            }
            GameEngine.prototype.start = function () { };
            return GameEngine;
        }());
        global.SoundManager = /** @class */ (function () {
            function SoundManager() {
            }
            SoundManager.prototype.setCutscene = function () { };
            SoundManager.prototype.setMasterVolume = function () { };
            SoundManager.prototype.play = function () { };
            SoundManager.prototype.setAmbience = function () { };
            SoundManager.prototype.playDotSound = function () { };
            SoundManager.prototype.resumeAmbience = function () { };
            SoundManager.prototype.stopAmbience = function () { };
            return SoundManager;
        }());
        global.document = {
            documentElement: {
                clientHeight: 1000,
                clientWidth: 1000,
            },
            getElementsByTagName: function () { return ([
                { appendChild: function () { } },
            ]); },
            getElementById: function () { return ({
                appendChild: function () { },
                removeChild: function () { },
                addEventListener: function () { },
                style: {},
            }); },
            createElement: function () { return ({
                classList: {
                    add: function () { },
                },
                appendChild: function () { },
                setAttribute: function () { },
                style: {},
            }); },
        };
        global.localStorage = {
            getItem: function () { },
            setItem: function () { },
        };
        global.Image = /** @class */ (function () {
            function Image() {
            }
            return Image;
        }());
        global.Audio = /** @class */ (function () {
            function Audio() {
            }
            Audio.prototype.addEventListener = function () { };
            return Audio;
        }());
        clock = sinon_1.default.useFakeTimers();
        comp = new gameCoordinator_js_1.default();
        comp.mazeDiv.style = {};
        comp.gameUi.style = {};
        comp.reset();
    });
    afterEach(function () {
        clock.restore();
    });
    describe('determineScale', function () {
        it('recursively calls itself to find the biggest possible scale', function () {
            sinon_1.default.spy(comp, 'determineScale');
            global.window.innerHeight = 1000;
            global.window.innerWidth = 1000;
            var result = comp.determineScale(1);
            assert_1.default.strictEqual(result, 3);
            assert_1.default.strictEqual(comp.determineScale.callCount, 4);
        });
    });
    describe('startButtonClick', function () {
        it('calls init on firstGame', function () {
            comp.init = sinon_1.default.fake();
            comp.firstGame = false;
            comp.startButtonClick();
            (0, assert_1.default)(!comp.init.called);
            assert_1.default.strictEqual(comp.leftCover.style.left, '-50%');
            assert_1.default.strictEqual(comp.rightCover.style.right, '-50%');
            assert_1.default.strictEqual(comp.mainMenu.style.opacity, 0);
            assert_1.default.strictEqual(comp.gameStartButton.disabled, true);
            clock.tick(1000);
            assert_1.default.strictEqual(comp.mainMenu.style.visibility, 'hidden');
            comp.firstGame = true;
            comp.startButtonClick();
            (0, assert_1.default)(comp.init.called);
            (0, assert_1.default)(!comp.firstGame);
        });
    });
    describe('soundButtonClick', function () {
        it('calls setMasterVolume and toggles the soundButton icon', function () {
            comp.soundManager.setMasterVolume = sinon_1.default.fake();
            comp.soundManager.masterVolume = 1;
            comp.soundButtonClick();
            (0, assert_1.default)(comp.soundManager.setMasterVolume.calledWith(0));
            assert_1.default.strictEqual(comp.soundButton.innerHTML, 'volume_off');
            comp.soundManager.masterVolume = 0;
            comp.soundButtonClick();
            (0, assert_1.default)(comp.soundManager.setMasterVolume.calledWith(1));
            assert_1.default.strictEqual(comp.soundButton.innerHTML, 'volume_up');
        });
    });
    describe('displayErrorMessage', function () {
        it('removes the loading container and reveals the error message', function () {
            var spy = sinon_1.default.fake();
            global.document.getElementById = sinon_1.default.fake.returns({
                style: {},
                remove: spy,
            });
            comp.displayErrorMessage();
            clock.tick(1500);
            (0, assert_1.default)(spy.called);
        });
    });
    describe('preloadAssets', function () {
        it('calls createElements for images and audio', function () {
            var spy = sinon_1.default.fake();
            global.document.getElementById = sinon_1.default.fake.returns({
                style: {},
                scrollWidth: 500,
                remove: spy,
            });
            comp.createElements = sinon_1.default.fake.resolves();
            comp.preloadAssets().then(function () {
                (0, assert_1.default)(comp.createElements.calledTwice);
                clock.tick(1500);
                (0, assert_1.default)(spy.called);
            });
        });
    });
    describe('createElements', function () {
        it('creates elements given a list of sources', function () {
            var spy = sinon_1.default.fake();
            global.document.getElementById = sinon_1.default.fake.returns({
                appendChild: spy,
                style: {},
                scrollWidth: 500,
            });
            Object.defineProperties(global.Image.prototype, {
                src: {
                    set: function () {
                        this.onload();
                    },
                },
            });
            comp.createElements(['src1', 'src2'], 'img', 100, comp).then(function () {
                (0, assert_1.default)(spy.called);
            });
            comp.createElements(['src'], 'audio', 100, comp).then(function () {
                (0, assert_1.default)(spy.called);
            });
        });
    });
    describe('reset', function () {
        it('resets gameCoordinator values to their default states', function () {
            global.localStorage.getItem = sinon_1.default.fake();
            comp.collisionDetectionLoop = sinon_1.default.fake();
            comp.drawMaze = sinon_1.default.fake();
            comp.reset();
            assert_1.default.deepEqual(comp.activeTimers, []);
            assert_1.default.strictEqual(comp.points, 0);
            assert_1.default.strictEqual(comp.level, 1);
            assert_1.default.strictEqual(comp.lives, 2);
            assert_1.default.strictEqual(comp.extraLifeGiven, false);
            assert_1.default.strictEqual(comp.remainingDots, 0);
            assert_1.default.strictEqual(comp.allowKeyPresses, true);
            assert_1.default.strictEqual(comp.allowPacmanMovement, false);
            assert_1.default.strictEqual(comp.allowPause, false);
            assert_1.default.strictEqual(comp.cutscene, true);
            (0, assert_1.default)(global.localStorage.getItem.calledWith('highScore'));
            assert_1.default.strictEqual(comp.highScore, global.localStorage.getItem('highScore'));
            assert_1.default.strictEqual(comp.entityList.length, 6);
            assert_1.default.strictEqual(comp.ghosts.length, 4);
            assert_1.default.deepEqual(comp.scaredGhosts, []);
            assert_1.default.strictEqual(comp.eyeGhosts, 0);
            (0, assert_1.default)(comp.drawMaze.calledWith(comp.mazeArray, comp.entityList));
            assert_1.default.strictEqual(comp.pointsDisplay.innerHTML, '00');
            assert_1.default.strictEqual(comp.highScoreDisplay.innerHTML, '00');
            clock.tick(500);
            (0, assert_1.default)(comp.collisionDetectionLoop.called);
        });
        it('does not call drawMaze if firstGame is FALSE', function () {
            comp.firstGame = false;
            comp.drawMaze = sinon_1.default.fake();
            comp.reset();
            (0, assert_1.default)(!comp.drawMaze.called);
        });
    });
    describe('init', function () {
        it('calls necessary setup functions to start the game', function () {
            comp.registerEventListeners = sinon_1.default.fake();
            comp.collisionDetectionLoop = sinon_1.default.fake();
            global.SoundManager = /** @class */ (function () {
                function SoundManager() {
                }
                return SoundManager;
            }());
            comp.init();
            (0, assert_1.default)(comp.registerEventListeners.called);
            (0, assert_1.default)(!comp.collisionDetectionLoop.called);
            clock.tick(500);
            (0, assert_1.default)(comp.collisionDetectionLoop.called);
        });
    });
    describe('drawMaze', function () {
        it('creates the maze and adds entities for a given maze array', function () {
            var entityList = [];
            comp.mazeDiv.style = {};
            comp.gameUi.style = {};
            comp.drawMaze(mazeArray, entityList);
            assert_1.default.strictEqual(comp.mazeDiv.style.height, "".concat(comp.scaledTileSize * 31, "px"));
            assert_1.default.strictEqual(comp.mazeDiv.style.width, "".concat(comp.scaledTileSize * 28, "px"));
            assert_1.default.strictEqual(comp.gameUi.style.width, "".concat(comp.scaledTileSize * 28, "px"));
            assert_1.default.strictEqual(entityList.length, 2);
        });
    });
    describe('collisionDetectionLoop', function () {
        it('calls checkPacmanProximity for each pickup', function () {
            comp.pacman.position = { left: 0, top: 0 };
            comp.pacman.velocityPerMs = 1;
            var spy = sinon_1.default.fake();
            comp.pickups = [{ checkPacmanProximity: spy }];
            comp.collisionDetectionLoop();
            (0, assert_1.default)(spy.called);
        });
        it('does nothing if Pacman\'s position is undefined', function () {
            comp.pacman.position = undefined;
            comp.collisionDetectionLoop();
        });
    });
    describe('startGameplay', function () {
        it('calls displayText, then kicks off movement', function () {
            comp.displayText = sinon_1.default.fake();
            comp.updateExtraLivesDisplay = sinon_1.default.fake();
            var ambientSpy = sinon_1.default.fake();
            comp.soundManager = {
                setAmbience: ambientSpy,
                setCutscene: sinon_1.default.fake(),
            };
            comp.startGameplay();
            (0, assert_1.default)(comp.displayText.calledWith({
                left: comp.scaledTileSize * 11,
                top: comp.scaledTileSize * 16.5,
            }, 'ready', 2000, comp.scaledTileSize * 6, comp.scaledTileSize * 2));
            (0, assert_1.default)(comp.updateExtraLivesDisplay.called);
            clock.tick(2000);
            (0, assert_1.default)(comp.allowPacmanMovement);
            (0, assert_1.default)(comp.pacman.moving);
            (0, assert_1.default)(comp.soundManager.setAmbience.calledWith(comp.determineSiren(comp.remainingDots)));
        });
        it('waits longer for the initialStart', function () {
            comp.displayText = sinon_1.default.fake();
            comp.updateExtraLivesDisplay = sinon_1.default.fake();
            var playSpy = sinon_1.default.fake();
            var ambientSpy = sinon_1.default.fake();
            comp.soundManager = {
                play: playSpy,
                setAmbience: ambientSpy,
                setCutscene: sinon_1.default.fake(),
            };
            comp.startGameplay(true);
            (0, assert_1.default)(playSpy.calledWith('game_start'));
            (0, assert_1.default)(comp.displayText.calledWith({
                left: comp.scaledTileSize * 11,
                top: comp.scaledTileSize * 16.5,
            }, 'ready', 4500, comp.scaledTileSize * 6, comp.scaledTileSize * 2));
            (0, assert_1.default)(comp.updateExtraLivesDisplay.called);
            clock.tick(4500);
            (0, assert_1.default)(comp.allowPacmanMovement);
            (0, assert_1.default)(comp.pacman.moving);
            (0, assert_1.default)(comp.soundManager.setAmbience.calledWith(comp.determineSiren(comp.remainingDots)));
        });
    });
    describe('updateExtraLivesDisplay', function () {
        it('displays extra life images for each remaining life', function () {
            comp.extraLivesDisplay.firstChild = true;
            comp.extraLivesDisplay.removeChild = sinon_1.default.stub(function () {
                comp.extraLivesDisplay.firstChild = false;
            });
            var spy = sinon_1.default.fake();
            global.document.createElement = function () { return ({
                setAttribute: spy,
                style: {},
            }); };
            comp.lives = 3;
            comp.updateExtraLivesDisplay();
            (0, assert_1.default)(spy.calledWith('src', 'app/style/graphics/extra_life.svg'));
            (0, assert_1.default)(spy.calledThrice);
        });
    });
    describe('updateFruitDisplay', function () {
        it('adds a fruit pic to the fruitDisplay', function () {
            var removeSpy = sinon_1.default.fake();
            var appendSpy = sinon_1.default.fake();
            comp.fruitDisplay = {
                children: { length: 1 },
                removeChild: removeSpy,
                appendChild: appendSpy,
            };
            var attributeSpy = sinon_1.default.fake();
            global.document.createElement = function () { return ({
                setAttribute: attributeSpy,
                style: {},
            }); };
            comp.updateFruitDisplay('url(image.svg)');
            (0, assert_1.default)(!removeSpy.called);
            (0, assert_1.default)(attributeSpy.calledWith('src', 'image.svg'));
            (0, assert_1.default)(appendSpy.called);
            comp.fruitDisplay.children.length = 7;
            comp.updateFruitDisplay('url(image.svg)');
            (0, assert_1.default)(removeSpy.called);
        });
    });
    describe('ghostCycle', function () {
        it('changes ghosts to Chase mode after seven seconds', function () {
            comp.ghosts = [{ changeMode: sinon_1.default.fake() }];
            comp.ghostCycle('scatter');
            clock.tick(7000);
            (0, assert_1.default)(comp.ghosts[0].changeMode.calledWith('chase'));
        });
    });
    describe('releaseGhost', function () {
        it('releases a ghost after a delay', function () {
            var spy = sinon_1.default.fake();
            comp.idleGhosts = [{ endIdleMode: spy }];
            comp.level = 1;
            comp.releaseGhost();
            clock.tick(8000);
        });
        it('does nothing unless there is an idle ghost to release', function () {
            comp.idleGhosts = [];
            comp.releaseGhost();
        });
    });
    describe('registerEventListeners', function () {
        it('registers listeners for various game events', function () {
            global.window = {
                addEventListener: sinon_1.default.fake(),
            };
            comp.registerEventListeners();
            (0, assert_1.default)(global.window.addEventListener.calledWith('keydown'));
            (0, assert_1.default)(global.window.addEventListener.calledWith('awardPoints'));
            (0, assert_1.default)(global.window.addEventListener.calledWith('deathSequence'));
            (0, assert_1.default)(global.window.addEventListener.calledWith('dotEaten'));
            (0, assert_1.default)(global.window.addEventListener.calledWith('powerUp'));
            (0, assert_1.default)(global.window.addEventListener.calledWith('eatGhost'));
            (0, assert_1.default)(global.window.addEventListener.calledWith('addTimer'));
            (0, assert_1.default)(global.window.addEventListener.calledWith('removeTimer'));
            (0, assert_1.default)(global.window.addEventListener.calledWith('releaseGhost'));
        });
        it('registers directional button touch events', function () {
            comp.changeDirection = sinon_1.default.fake();
            global.document = {
                getElementById: sinon_1.default.stub().returns({
                    addEventListener: sinon_1.default.stub().callsFake(function (eventType, callback) {
                        callback();
                    }),
                }),
            };
            comp.registerEventListeners();
            (0, assert_1.default)(global.document.getElementById.calledWith('button-up'));
            (0, assert_1.default)(global.document.getElementById.calledWith('button-down'));
            (0, assert_1.default)(global.document.getElementById.calledWith('button-left'));
            (0, assert_1.default)(global.document.getElementById.calledWith('button-right'));
            (0, assert_1.default)(comp.changeDirection.calledWith('up'));
            (0, assert_1.default)(comp.changeDirection.calledWith('down'));
            (0, assert_1.default)(comp.changeDirection.calledWith('left'));
            (0, assert_1.default)(comp.changeDirection.calledWith('right'));
        });
    });
    describe('handleKeyDown', function () {
        beforeEach(function () {
            comp.gameEngine = {};
        });
        it('calls handlePauseKey when esc is pressed', function () {
            comp.handlePauseKey = sinon_1.default.fake();
            comp.handleKeyDown({ keyCode: 27 });
            (0, assert_1.default)(comp.handlePauseKey.called);
        });
        it('calls soundButtonClick when Q is pressed', function () {
            comp.soundButtonClick = sinon_1.default.fake();
            comp.handleKeyDown({ keyCode: 81 });
            (0, assert_1.default)(comp.soundButtonClick.called);
        });
        it('calls Pacman\'s changeDirection when a move key is pressed', function () {
            comp.gameEngine.running = true;
            var changeSpy = sinon_1.default.fake();
            comp.pacman.changeDirection = changeSpy;
            // W Key
            comp.handleKeyDown({ keyCode: 87 });
            assert_1.default.strictEqual(changeSpy.callCount, 1);
            // A Key
            comp.handleKeyDown({ keyCode: 65 });
            assert_1.default.strictEqual(changeSpy.callCount, 2);
            // S Key
            comp.handleKeyDown({ keyCode: 83 });
            assert_1.default.strictEqual(changeSpy.callCount, 3);
            // D Key
            comp.handleKeyDown({ keyCode: 68 });
            assert_1.default.strictEqual(changeSpy.callCount, 4);
            // Up Arrow
            comp.handleKeyDown({ keyCode: 38 });
            assert_1.default.strictEqual(changeSpy.callCount, 5);
            // Down Arrow
            comp.handleKeyDown({ keyCode: 40 });
            assert_1.default.strictEqual(changeSpy.callCount, 6);
            // Left Arrow
            comp.handleKeyDown({ keyCode: 37 });
            assert_1.default.strictEqual(changeSpy.callCount, 7);
            // Right Arrow
            comp.handleKeyDown({ keyCode: 39 });
            assert_1.default.strictEqual(changeSpy.callCount, 8);
        });
        it('won\'t call changeDirection unless the gameEngine is running', function () {
            comp.gameEngine.running = false;
            var changeSpy = sinon_1.default.fake();
            comp.pacman.changeDirection = changeSpy;
            comp.handleKeyDown({ keyCode: 87 });
            (0, assert_1.default)(!changeSpy.called);
        });
        it('won\'t call changeDirection if allowKeyPresses is FALSE', function () {
            comp.allowKeyPresses = false;
            comp.handlePauseKey = sinon_1.default.fake();
            comp.pacman.changeDirection = sinon_1.default.fake();
            comp.handleKeyDown({ keyCode: 27 });
            (0, assert_1.default)(comp.handlePauseKey.called);
            comp.handleKeyDown({ keyCode: 87 });
            (0, assert_1.default)(!comp.pacman.changeDirection.called);
        });
        it('won\'t call anything if an unrecognized key is pressed', function () {
            comp.gameEngine.changePausedState = sinon_1.default.fake();
            comp.pacman.changeDirection = sinon_1.default.fake();
            // P Key
            comp.handleKeyDown({ keyCode: 80 });
            (0, assert_1.default)(!comp.gameEngine.changePausedState.called);
            (0, assert_1.default)(!comp.pacman.changeDirection.called);
        });
    });
    describe('handlePauseKey', function () {
        beforeEach(function () {
            comp.gameEngine = {
                changePausedState: sinon_1.default.fake(),
            };
            comp.activeTimers = [{}];
            comp.allowPause = true;
            comp.cutscene = false;
            comp.soundManager.play = sinon_1.default.fake();
            comp.soundManager.resumeAmbience = sinon_1.default.fake();
            comp.soundManager.stopAmbience = sinon_1.default.fake();
            comp.soundManager.setAmbience = sinon_1.default.fake();
        });
        it('calls changePausedState', function () {
            comp.activeTimers = [];
            comp.handlePauseKey();
            (0, assert_1.default)(comp.gameEngine.changePausedState.called);
            (0, assert_1.default)(comp.soundManager.play.calledWith('pause'));
        });
        it('resumes all timers after starting the engine', function () {
            comp.gameEngine.started = true;
            comp.activeTimers[0].resume = sinon_1.default.fake();
            comp.handlePauseKey();
            (0, assert_1.default)(comp.soundManager.resumeAmbience.called);
            assert_1.default.strictEqual(comp.gameUi.style.filter, 'unset');
            assert_1.default.strictEqual(comp.pausedText.style.visibility, 'hidden');
            (0, assert_1.default)(comp.activeTimers[0].resume.called);
        });
        it('pauses all timers after starting the engine', function () {
            comp.gameEngine.pause = true;
            comp.activeTimers[0].pause = sinon_1.default.fake();
            comp.handlePauseKey();
            (0, assert_1.default)(comp.activeTimers[0].pause.called);
        });
        it('waits before allowing another pause key press', function () {
            comp.activeTimers[0].pause = sinon_1.default.fake();
            (0, assert_1.default)(comp.allowPause);
            comp.handlePauseKey();
            (0, assert_1.default)(!comp.allowPause);
            clock.tick(500);
            (0, assert_1.default)(comp.allowPause);
        });
        it('won\'t call changePausedState unless allowPause is TRUE', function () {
            comp.allowPause = false;
            comp.handlePauseKey();
            (0, assert_1.default)(!comp.gameEngine.changePausedState.called);
        });
        it('won\'t set allowPause to TRUE if a cutscene is playing', function () {
            comp.activeTimers[0].pause = sinon_1.default.fake();
            comp.handlePauseKey();
            comp.cutscene = true;
            (0, assert_1.default)(!comp.allowPause);
            clock.tick(500);
            (0, assert_1.default)(!comp.allowPause);
        });
    });
    describe('awardPoints', function () {
        beforeEach(function () {
            comp.updateFruitDisplay = sinon_1.default.fake();
            comp.fruit.determineImage = sinon_1.default.fake();
        });
        it('adds to the total number of points', function () {
            comp.points = 0;
            global.localStorage.setItem = sinon_1.default.fake();
            comp.awardPoints({ detail: { points: 50 } });
            assert_1.default.strictEqual(comp.points, 50);
            assert_1.default.strictEqual(comp.highScore, 50);
            assert_1.default.strictEqual(comp.highScoreDisplay.innerText, 50);
            (0, assert_1.default)(global.localStorage.setItem.calledWith('highScore', 50));
        });
        it('only updates the highScore when it is surpassed', function () {
            comp.points = 0;
            comp.highScore = 100;
            comp.awardPoints({ detail: { points: 50 } });
            assert_1.default.strictEqual(comp.points, 50);
            assert_1.default.strictEqual(comp.highScore, 100);
        });
        it('calls displayText when a fruit is eaten', function () {
            comp.points = 0;
            comp.displayText = sinon_1.default.fake();
            comp.awardPoints({ detail: { points: 50, type: 'fruit' } });
            assert_1.default.strictEqual(comp.points, 50);
            (0, assert_1.default)(comp.displayText.calledWith({
                left: comp.scaledTileSize * 13,
                top: comp.scaledTileSize * 16.5,
            }, 50, 2000, comp.scaledTileSize * 2, comp.scaledTileSize * 2));
        });
        it('displays a wider image when fruit worth four figures is eaten', function () {
            comp.points = 0;
            comp.displayText = sinon_1.default.fake();
            comp.awardPoints({ detail: { points: 1000, type: 'fruit' } });
            assert_1.default.strictEqual(comp.points, 1000);
            (0, assert_1.default)(comp.displayText.calledWith({
                left: comp.scaledTileSize * 12.5,
                top: comp.scaledTileSize * 16.5,
            }, 1000, 2000, comp.scaledTileSize * 3, comp.scaledTileSize * 2));
        });
        it('gives an extra life when reaching 10k points', function () {
            comp.points = 0;
            comp.lives = 0;
            comp.extraLifeGiven = false;
            comp.updateExtraLivesDisplay = sinon_1.default.fake();
            comp.soundManager.play = sinon_1.default.fake();
            comp.awardPoints({ detail: { points: 10000, type: 'fruit' } });
            assert_1.default.strictEqual(comp.extraLifeGiven, true);
            (0, assert_1.default)(comp.soundManager.play.calledWith('extra_life'));
            assert_1.default.strictEqual(comp.lives, 1);
            (0, assert_1.default)(comp.updateExtraLivesDisplay.called);
        });
    });
    describe('deathSequence', function () {
        beforeEach(function () {
            comp.allowKeyPresses = true;
            comp.blinky.display = true;
            comp.pacman.moving = true;
            comp.blinky.moving = true;
            comp.lives = 2;
            comp.mazeCover.style = {
                visibility: 'hidden',
            };
            comp.pacman.prepDeathAnimation = sinon_1.default.fake();
            comp.pacman.reset = sinon_1.default.fake();
            comp.blinky.reset = sinon_1.default.fake();
            comp.fruit.hideFruit = sinon_1.default.fake();
            comp.updateExtraLivesDisplay = sinon_1.default.fake();
        });
        it('kills Pacman, subtracts a life, and resets the characters', function () {
            comp.deathSequence();
            (0, assert_1.default)(!comp.allowKeyPresses);
            (0, assert_1.default)(!comp.pacman.moving);
            (0, assert_1.default)(!comp.blinky.moving);
            clock.tick(750);
            (0, assert_1.default)(!comp.blinky.display);
            (0, assert_1.default)(comp.pacman.prepDeathAnimation.called);
            assert_1.default.strictEqual(comp.lives, 1);
            clock.tick(2250);
            assert_1.default.strictEqual(comp.mazeCover.style.visibility, 'visible');
            clock.tick(500);
            (0, assert_1.default)(comp.allowKeyPresses);
            assert_1.default.strictEqual(comp.mazeCover.style.visibility, 'hidden');
            (0, assert_1.default)(comp.pacman.reset.called);
            (0, assert_1.default)(comp.blinky.reset.called);
            (0, assert_1.default)(comp.fruit.hideFruit.called);
        });
        it('cancels the fruitTimer if needed', function () {
            comp.timerExists = sinon_1.default.fake.returns(true);
            comp.removeTimer = sinon_1.default.fake();
            comp.deathSequence();
            (0, assert_1.default)(comp.removeTimer.called);
        });
        it('handles Game Over if needed', function () {
            comp.lives = 0;
            comp.gameOver = sinon_1.default.fake();
            comp.deathSequence();
            clock.tick(750);
            (0, assert_1.default)(comp.gameOver.called);
        });
    });
    describe('gameOver', function () {
        it('displays GAME OVER text and brings back the main menu', function () {
            comp.displayText = sinon_1.default.fake();
            comp.fruit.hideFruit = sinon_1.default.fake();
            global.localStorage.setItem = sinon_1.default.fake();
            comp.gameOver();
            (0, assert_1.default)(global.localStorage.setItem.calledWith('highScore', comp.highScore));
            clock.tick(2250);
            (0, assert_1.default)(comp.displayText.called);
            (0, assert_1.default)(comp.fruit.hideFruit.called);
            clock.tick(2500);
            assert_1.default.strictEqual(comp.leftCover.style.left, '0');
            assert_1.default.strictEqual(comp.rightCover.style.right, '0');
            clock.tick(1000);
            assert_1.default.strictEqual(comp.mainMenu.style.opacity, 1);
            assert_1.default.strictEqual(comp.gameStartButton.disabled, false);
            assert_1.default.strictEqual(comp.mainMenu.style.visibility, 'visible');
        });
    });
    describe('dotEaten', function () {
        it('subtracts 1 from remainingDots', function () {
            comp.remainingDots = 10;
            comp.dotEaten();
            assert_1.default.strictEqual(comp.remainingDots, 9);
        });
        it('creates a fruit at 174 and 74 remaining dots', function () {
            comp.createFruit = sinon_1.default.fake();
            comp.remainingDots = 175;
            comp.dotEaten();
            (0, assert_1.default)(comp.createFruit.calledOnce);
            comp.remainingDots = 75;
            comp.dotEaten();
            (0, assert_1.default)(comp.createFruit.calledTwice);
        });
        it('speeds up Blinky at 40 and 20 dots', function () {
            comp.speedUpBlinky = sinon_1.default.fake();
            comp.remainingDots = 41;
            comp.dotEaten();
            (0, assert_1.default)(comp.speedUpBlinky.calledOnce);
            comp.remainingDots = 21;
            comp.dotEaten();
            (0, assert_1.default)(comp.speedUpBlinky.calledTwice);
        });
        it('calls advanceLevel at 0 dots', function () {
            comp.advanceLevel = sinon_1.default.fake();
            comp.remainingDots = 1;
            comp.dotEaten();
            (0, assert_1.default)(comp.advanceLevel.called);
        });
    });
    describe('createFruit', function () {
        it('creates a bonus fruit for ten seconds', function () {
            comp.fruit.showFruit = sinon_1.default.fake();
            comp.fruit.hideFruit = sinon_1.default.fake();
            comp.createFruit();
            (0, assert_1.default)(comp.fruit.showFruit.called);
            clock.tick(10000);
            (0, assert_1.default)(comp.fruit.hideFruit.called);
        });
        it('cancels the fruitTimer if needed', function () {
            comp.timerExists = sinon_1.default.fake.returns(true);
            comp.removeTimer = sinon_1.default.fake();
            comp.fruit.showFruit = sinon_1.default.fake();
            comp.createFruit();
            (0, assert_1.default)(comp.removeTimer.called);
        });
        it('calls showFruit for 5000 points for unrecognized levels', function () {
            comp.level = Infinity;
            comp.fruit.showFruit = sinon_1.default.fake();
            comp.createFruit();
            (0, assert_1.default)(comp.fruit.showFruit.calledWith(5000));
        });
    });
    describe('speedUpBlinky', function () {
        beforeEach(function () {
            comp.blinky.speedUp = sinon_1.default.fake();
        });
        it('calls the speedUp function for Blinky', function () {
            comp.speedUpBlinky();
            (0, assert_1.default)(comp.blinky.speedUp.called);
        });
        it('calls setAmbience if there are no scared or eye ghosts', function () {
            comp.scaredGhosts = [];
            comp.eyeGhosts = 0;
            comp.soundManager.setAmbience = sinon_1.default.fake();
            comp.determineSiren = sinon_1.default.fake();
            comp.speedUpBlinky();
            (0, assert_1.default)(comp.soundManager.setAmbience.calledWith(comp.determineSiren(comp.remainingDots)));
        });
        it('does not call setAmbience otherwise', function () {
            comp.scaredGhosts = [];
            comp.eyeGhosts = 1;
            comp.soundManager.setAmbience = sinon_1.default.fake();
            comp.determineSiren = sinon_1.default.fake();
            comp.speedUpBlinky();
            (0, assert_1.default)(!comp.soundManager.setAmbience.called);
        });
    });
    describe('determineSiren', function () {
        it('determines the correct siren ambience', function () {
            assert_1.default.strictEqual(comp.determineSiren(100), 'siren_1');
            assert_1.default.strictEqual(comp.determineSiren(30), 'siren_2');
            assert_1.default.strictEqual(comp.determineSiren(10), 'siren_3');
        });
    });
    describe('advanceLevel', function () {
        it('runs the sequence for advancing to the next level', function () {
            var ghost = new Ghost();
            ghost.reset = sinon_1.default.fake();
            ghost.resetDefaultSpeed = sinon_1.default.fake();
            ghost.name = 'blinky';
            ghost.level = 1;
            var fruit = new Pickup();
            var pacdot = new Pickup();
            fruit.reset = sinon_1.default.fake();
            fruit.type = 'fruit';
            pacdot.reset = sinon_1.default.fake();
            comp.entityList = [
                ghost,
                fruit,
                pacdot,
            ];
            comp.mazeCover = { style: {} };
            comp.remainingDots = 0;
            comp.removeTimer = sinon_1.default.fake();
            comp.updateExtraLivesDisplay = sinon_1.default.fake();
            var imgBase = 'app/style//graphics/spriteSheets/maze/';
            comp.advanceLevel();
            (0, assert_1.default)(!comp.allowKeyPresses);
            (0, assert_1.default)(comp.removeTimer.calledWith({ detail: { timer: comp.ghostTimer } }));
            clock.tick(2000);
            assert_1.default.strictEqual(comp.mazeImg.src, "".concat(imgBase, "maze_white.svg"));
            clock.tick(250);
            assert_1.default.strictEqual(comp.mazeImg.src, "".concat(imgBase, "maze_blue.svg"));
            clock.tick(250);
            assert_1.default.strictEqual(comp.mazeImg.src, "".concat(imgBase, "maze_white.svg"));
            clock.tick(250);
            assert_1.default.strictEqual(comp.mazeImg.src, "".concat(imgBase, "maze_blue.svg"));
            clock.tick(250);
            assert_1.default.strictEqual(comp.mazeImg.src, "".concat(imgBase, "maze_white.svg"));
            clock.tick(250);
            assert_1.default.strictEqual(comp.mazeImg.src, "".concat(imgBase, "maze_blue.svg"));
            clock.tick(250);
            assert_1.default.strictEqual(comp.mazeCover.style.visibility, 'visible');
            clock.tick(500);
            assert_1.default.strictEqual(comp.mazeCover.style.visibility, 'hidden');
            assert_1.default.strictEqual(comp.level, 2);
            (0, assert_1.default)(comp.allowKeyPresses);
            assert_1.default.strictEqual(ghost.level, comp.level);
            (0, assert_1.default)(ghost.resetDefaultSpeed.called);
            assert_1.default.strictEqual(comp.remainingDots, 1);
        });
    });
    describe('flashGhosts', function () {
        it('calls itself recursively a number of times', function () {
            comp.scaredGhosts = [{
                    toggleScaredColor: sinon_1.default.fake(),
                    endScared: sinon_1.default.fake(),
                }];
            sinon_1.default.spy(comp, 'flashGhosts');
            comp.soundManager.setAmbience = sinon_1.default.fake();
            comp.determineSiren = sinon_1.default.fake();
            comp.eyeGhosts = 0;
            comp.flashGhosts(0, 9);
            clock.tick(10000);
            assert_1.default.strictEqual(comp.flashGhosts.callCount, 10);
            (0, assert_1.default)(comp.soundManager.setAmbience.calledWith(comp.determineSiren(comp.remainingDots)));
        });
        it('will not set ambience if there are eye ghosts', function () {
            comp.scaredGhosts = [{
                    toggleScaredColor: sinon_1.default.fake(),
                    endScared: sinon_1.default.fake(),
                }];
            sinon_1.default.spy(comp, 'flashGhosts');
            comp.soundManager.setAmbience = sinon_1.default.fake();
            comp.eyeGhosts = 1;
            comp.flashGhosts(0, 9);
            clock.tick(10000);
            assert_1.default.strictEqual(comp.flashGhosts.callCount, 10);
            (0, assert_1.default)(!comp.soundManager.setAmbience.called);
        });
        it('stops calls if there are no more scared ghosts', function () {
            comp.flashingGhosts = true;
            comp.scaredGhosts = [];
            sinon_1.default.spy(comp, 'flashGhosts');
            comp.flashGhosts(0, 9);
            clock.tick(10000);
            assert_1.default.strictEqual(comp.flashGhosts.callCount, 1);
        });
    });
    describe('powerUp', function () {
        beforeEach(function () {
            comp.removeTimer = sinon_1.default.fake();
            comp.ghosts = [
                { becomeScared: sinon_1.default.fake(), mode: 'eyes' },
                { becomeScared: sinon_1.default.fake(), mode: 'chase' },
            ];
            comp.flashGhosts = sinon_1.default.fake();
        });
        it('establishes scaredGhosts and calls flashGhosts', function () {
            comp.timerExists = sinon_1.default.fake.returns(true);
            comp.powerUp();
            clock.tick(6000);
            (0, assert_1.default)(comp.removeTimer.called);
            (0, assert_1.default)(comp.scaredGhosts[0].becomeScared.called);
            (0, assert_1.default)(comp.flashGhosts.calledWith(0, 9));
        });
        it('won\'t push EYES mode ghosts to the scaredGhosts array', function () {
            comp.timerExists = sinon_1.default.fake.returns(false);
            comp.powerUp();
            assert_1.default.strictEqual(comp.scaredGhosts.length, 1);
        });
        it('calls setAmbience if remainingDots is greater than zero', function () {
            comp.soundManager.setAmbience = sinon_1.default.fake();
            comp.remainingDots = 0;
            comp.powerUp();
            (0, assert_1.default)(!comp.soundManager.setAmbience.called);
            comp.remainingDots = 1;
            comp.powerUp();
            (0, assert_1.default)(comp.soundManager.setAmbience.calledWith('power_up'));
        });
    });
    describe('determineComboPoints', function () {
        it('returns the correct points based on combo', function () {
            comp.ghostCombo = 1;
            assert_1.default.strictEqual(comp.determineComboPoints(), 200);
            comp.ghostCombo = 2;
            assert_1.default.strictEqual(comp.determineComboPoints(), 400);
            comp.ghostCombo = 3;
            assert_1.default.strictEqual(comp.determineComboPoints(), 800);
            comp.ghostCombo = 4;
            assert_1.default.strictEqual(comp.determineComboPoints(), 1600);
        });
    });
    describe('eatGhost', function () {
        it('awards points and temporarily pauses movement', function () {
            comp.allowPacmanMovement = true;
            comp.displayText = sinon_1.default.fake();
            var ghost = {
                display: true,
                name: 'blinky',
                pause: sinon_1.default.fake(),
            };
            var e = {
                detail: {
                    ghost: ghost,
                },
            };
            comp.scaredGhosts = [ghost];
            comp.determineComboPoints = sinon_1.default.fake();
            global.window.dispatchEvent = sinon_1.default.fake();
            global.CustomEvent = /** @class */ (function () {
                function CustomEvent() {
                }
                return CustomEvent;
            }());
            comp.eatGhost(e);
            (0, assert_1.default)(!comp.allowPacmanMovement);
            (0, assert_1.default)(!e.detail.ghost.display);
            (0, assert_1.default)(!comp.pacman.moving);
            (0, assert_1.default)(!comp.blinky.moving);
            (0, assert_1.default)(global.window.dispatchEvent.calledWith(new CustomEvent('awardPoints', {
                detail: {
                    points: 200,
                },
            })));
            (0, assert_1.default)(comp.displayText.called);
            (0, assert_1.default)(comp.determineComboPoints.called);
            clock.tick(1000);
            (0, assert_1.default)(comp.allowPacmanMovement);
            (0, assert_1.default)(e.detail.ghost.display);
            (0, assert_1.default)(comp.pacman.moving);
        });
    });
    describe('restoreGhost', function () {
        beforeEach(function () {
            comp.determineSiren = sinon_1.default.fake();
            comp.soundManager.setAmbience = sinon_1.default.fake();
        });
        it('only calls setAmbience when there are zero eye ghosts', function () {
            comp.eyeGhosts = 2;
            comp.restoreGhost();
            (0, assert_1.default)(!comp.soundManager.setAmbience.called);
        });
        it('subtracts from eyeGhost and calls setAmbience', function () {
            comp.eyeGhosts = 1;
            comp.restoreGhost();
            assert_1.default.strictEqual(comp.eyeGhosts, 0);
            (0, assert_1.default)(comp.soundManager.setAmbience.calledWith(comp.determineSiren(comp.remainingDots)));
            comp.eyeGhosts = 1;
            comp.scaredGhosts = [1, 2, 3];
            comp.restoreGhost();
            (0, assert_1.default)(comp.soundManager.setAmbience.calledWith('power_up'));
        });
    });
    describe('displayText', function () {
        it('creates a temporary div and removes it with a set delay', function () {
            comp.mazeDiv = {
                appendChild: sinon_1.default.fake(),
                removeChild: sinon_1.default.fake(),
            };
            comp.displayText({ left: 10, top: 25 }, 200, 1000, 48);
            (0, assert_1.default)(comp.mazeDiv.appendChild.called);
            clock.tick(1000);
            (0, assert_1.default)(comp.mazeDiv.removeChild.called);
        });
    });
    describe('addTimer', function () {
        it('adds a timer object to the list of active timers', function () {
            comp.activeTimers = [];
            comp.addTimer({
                detail: 'newTimer',
            });
            assert_1.default.strictEqual(comp.activeTimers.length, 1);
        });
    });
    describe('timerExists', function () {
        it('checks if a given timerId exists', function () {
            (0, assert_1.default)(comp.timerExists({ detail: { timer: { timerId: 1 } } }));
            (0, assert_1.default)(!comp.timerExists({ detail: { timer: { timerId: undefined } } }));
        });
    });
    describe('pauseTimer', function () {
        it('pauses an existing timer', function () {
            var spy = sinon_1.default.fake();
            comp.timerExists = sinon_1.default.fake.returns(false);
            comp.pauseTimer({ detail: { timer: { pause: spy } } });
            (0, assert_1.default)(!spy.calledWith(true));
            comp.timerExists = sinon_1.default.fake.returns(true);
            comp.pauseTimer({ detail: { timer: { pause: spy } } });
            (0, assert_1.default)(spy.calledWith(true));
        });
    });
    describe('resumeTimer', function () {
        it('resumes an existing timer', function () {
            var spy = sinon_1.default.fake();
            comp.timerExists = sinon_1.default.fake.returns(false);
            comp.resumeTimer({ detail: { timer: { resume: spy } } });
            (0, assert_1.default)(!spy.calledWith(true));
            comp.timerExists = sinon_1.default.fake.returns(true);
            comp.resumeTimer({ detail: { timer: { resume: spy } } });
            (0, assert_1.default)(spy.calledWith(true));
        });
    });
    describe('removeTimer', function () {
        it('removes a timer from the active timers list based on timerId', function () {
            global.window.clearTimeout = sinon_1.default.fake();
            comp.activeTimers = [
                { timerId: 1 },
                { timerId: 2 },
            ];
            comp.removeTimer({
                detail: { timer: { timerId: 1 } },
            });
            (0, assert_1.default)(global.window.clearTimeout.calledWith(1));
            assert_1.default.strictEqual(comp.activeTimers.length, 1);
        });
        it('checks if a timer exists before removing it', function () {
            comp.timerExists = sinon_1.default.fake.returns(false);
            comp.removeTimer({
                detail: { id: 1 },
            });
            (0, assert_1.default)(comp.timerExists.called);
        });
    });
});

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// const assert = require('assert');
// const sinon = require('sinon');
// const SoundManager = require('../scripts/utilities/soundManager');
var assert_1 = require("assert");
var sinon_1 = require("sinon");
var soundManager_js_1 = require("../scripts/utilities/soundManager.js");
var comp;
describe('soundManager', function () {
    beforeEach(function () {
        global.Audio = /** @class */ (function () {
            function Audio() {
            }
            Audio.prototype.play = function () { };
            return Audio;
        }());
        var AudioContext = /** @class */ (function () {
            function AudioContext() {
            }
            return AudioContext;
        }());
        global.window = {
            AudioContext: AudioContext,
        };
        comp = new soundManager_js_1.default();
    });
    describe('constructor', function () {
        it('uses webkitAudioContext if needed', function () {
            global.window.AudioContext = undefined;
            global.window.webkitAudioContext = /** @class */ (function () {
                function webkitAudioContext() {
                }
                return webkitAudioContext;
            }());
            var testComp = new soundManager_js_1.default();
            assert_1.default.notEqual(testComp.ambience, undefined);
        });
    });
    describe('setCutscene', function () {
        it('sets new values for cutscene', function () {
            comp.cutscene = false;
            comp.setCutscene(true);
            assert_1.default.strictEqual(comp.cutscene, true);
        });
    });
    describe('setMasterVolume', function () {
        it('sets the master volume for all sounds and toggles ambience', function () {
            comp.stopAmbience = sinon_1.default.fake();
            comp.resumeAmbience = sinon_1.default.fake();
            comp.setMasterVolume(1);
            (0, assert_1.default)(comp.resumeAmbience.calledWith(comp.paused));
            comp.soundEffect = {};
            comp.dotPlayer = {};
            comp.setMasterVolume(0);
            assert_1.default.strictEqual(comp.soundEffect.volume, 0);
            assert_1.default.strictEqual(comp.dotPlayer.volume, 0);
            (0, assert_1.default)(comp.stopAmbience.called);
        });
    });
    describe('play', function () {
        it('plays a given sound effect', function () {
            var spy = sinon_1.default.spy(global, 'Audio');
            comp.play('some_sound');
            (0, assert_1.default)(spy.calledWith('app/style/audio/some_sound.mp3'));
        });
    });
    describe('playDotSound', function () {
        it('alternates between two dot sounds', function () {
            var spy = sinon_1.default.spy(global, 'Audio');
            comp.playDotSound();
            (0, assert_1.default)(spy.calledWith('app/style/audio/dot_1.mp3'));
            comp.dotPlayer = undefined;
            comp.playDotSound();
            (0, assert_1.default)(spy.calledWith('app/style/audio/dot_2.mp3'));
        });
        it('does nothing if another dot sound is already playing', function () {
            comp.dotPlayer = {};
            var spy = sinon_1.default.spy(global, 'Audio');
            comp.playDotSound();
            (0, assert_1.default)(!spy.called);
        });
    });
    describe('dotSoundEnded', function () {
        it('deletes the current dotPlayer', function () {
            comp.dotPlayer = {};
            comp.dotSoundEnded();
            assert_1.default.strictEqual(comp.dotPlayer, undefined);
        });
        it('calls playDotSound if queuedDotSound is TRUE', function () {
            comp.queuedDotSound = true;
            comp.playDotSound = sinon_1.default.fake();
            comp.dotSoundEnded();
            (0, assert_1.default)(comp.playDotSound.called);
        });
    });
    describe('setAmbience', function () {
        var arraySpy = sinon_1.default.fake();
        var connectSpy = sinon_1.default.fake();
        var startSpy = sinon_1.default.fake();
        beforeEach(function () {
            global.fetch = sinon_1.default.fake.returns({
                arrayBuffer: arraySpy,
            });
            comp.ambience.decodeAudioData = sinon_1.default.fake();
            comp.ambience.createBufferSource = sinon_1.default.fake.returns({
                connect: connectSpy,
                start: startSpy,
            });
            comp.cutscene = false;
        });
        it('does nothing if fetchingAmbience is TRUE', function () {
            comp.fetchingAmbience = true;
            comp.setAmbience('some_sound');
            (0, assert_1.default)(!arraySpy.called);
        });
        it('does not start new ambience if masterVolume is ZERO', function () {
            comp.masterVolume = 0;
            comp.setAmbience('some_sound');
            (0, assert_1.default)(!arraySpy.called);
        });
        it('loops an ambient sound', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, comp.setAmbience('some_sound')];
                    case 1:
                        _a.sent();
                        (0, assert_1.default)(global.fetch.calledWith('app/style/audio/some_sound.mp3'));
                        (0, assert_1.default)(arraySpy.called);
                        (0, assert_1.default)(comp.ambience.decodeAudioData.called);
                        (0, assert_1.default)(comp.ambience.createBufferSource.called);
                        (0, assert_1.default)(connectSpy.calledWith(comp.ambience.destination));
                        assert_1.default.strictEqual(comp.ambienceSource.loop, true);
                        (0, assert_1.default)(startSpy.called);
                        return [2 /*return*/];
                }
            });
        }); });
        it('stops previously running ambience', function () {
            comp.ambienceSource = {
                stop: sinon_1.default.fake(),
            };
            comp.setAmbience('some_sound');
            (0, assert_1.default)(comp.ambienceSource.stop.called);
        });
        it('keeps the current ambience if needed', function () {
            comp.currentAmbience = 'blah';
            comp.setAmbience('some_sound', true);
            assert_1.default.strictEqual(comp.currentAmbience, 'blah');
        });
    });
    describe('resumeAmbience', function () {
        it('resumes an existing ambience', function () {
            comp.setAmbience = sinon_1.default.fake();
            comp.resumeAmbience();
            (0, assert_1.default)(!comp.setAmbience.called);
            comp.ambienceSource = {};
            comp.resumeAmbience();
            (0, assert_1.default)(comp.setAmbience.calledWith(comp.currentAmbience));
        });
        it('sets ambience to pause_beat if the game is paused', function () {
            comp.setAmbience = sinon_1.default.fake();
            comp.ambienceSource = {};
            comp.resumeAmbience(true);
            (0, assert_1.default)(comp.setAmbience.calledWith('pause_beat'));
        });
    });
    describe('stopAmbience', function () {
        it('stops existing ambience', function () {
            comp.stopAmbience();
            comp.ambienceSource = {
                stop: sinon_1.default.fake(),
            };
            comp.stopAmbience();
            (0, assert_1.default)(comp.ambienceSource.stop.calledOnce);
        });
    });
});

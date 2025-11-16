declare class SoundManager {
    baseUrl: string;
    fileFormat: string;
    masterVolume: number;
    paused: boolean;
    cutscene: boolean;
    ambience: AudioContext;
    soundEffect: HTMLAudioElement;
    dotPlayer: HTMLAudioElement | undefined;
    queuedDotSound: boolean;
    dotSound: number;
    fetchingAmbience: boolean;
    currentAmbience: string;
    ambienceSource: AudioBufferSourceNode;
    constructor();
    /**
     * Sets the cutscene flag to determine if players should be able to resume ambience
     * @param {Boolean} newValue
     */
    setCutscene(newValue: boolean): void;
    /**
     * Sets the master volume for all sounds and stops/resumes ambience
     * @param {(0|1)} newVolume
     */
    setMasterVolume(newVolume: number): void;
    /**
     * Plays a single sound effect
     * @param {String} sound
     */
    play(sound: string): void;
    /**
     * Special method for eating dots. The dots should alternate between two
     * sound effects, but not too quickly.
     */
    playDotSound(): void;
    /**
     * Deletes the dotSound player and plays another dot sound if needed
     */
    dotSoundEnded(): void;
    /**
     * Loops an ambient sound
     * @param {String} sound
     */
    setAmbience(sound: string, keepCurrentAmbience?: boolean): Promise<void>;
    /**
     * Resumes the ambience
     */
    resumeAmbience(paused: boolean): void;
    /**
     * Stops the ambience
     */
    stopAmbience(): void;
}
export default SoundManager;
//# sourceMappingURL=soundManager.d.ts.map
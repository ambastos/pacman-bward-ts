import CancelState from '../mods/implementations/mods/flood/app/scripts/states/cancelState.ts'

interface FakeWave {
    started: boolean
    height: number
    speedY: number
    decreasing: boolean
    parent: { removeChild: (child: unknown) => void } | null
    increase: (ms: number) => void
    decrease: (ms: number) => void
    cancel: jest.Mock
    get isDescreasing(): boolean
}

function makeWave(overrides: Partial<FakeWave> = {}): FakeWave {
    const height = overrides.height ?? 100
    const decreasing = overrides.decreasing ?? false
    const wave: any = {
        started: overrides.started ?? true,
        speedY: overrides.speedY ?? 15,
        parent: null,
        cancel: jest.fn(),
        ...overrides,
        height,
        decreasing,
        decrease: jest.fn((ms: number) => { wave.height -= ms }),
        get isDescreasing() { return wave.decreasing },
    }
    return wave
}

function makeCancelState(wave: FakeWave | null = null, lives = 2) {
    const emit = jest.fn()
    const flood: any = {
        gp: { clear: jest.fn() },
        stop: jest.fn(),
        emitter: { emit },
        gc: { lives },
    }
    const wavesManager: any = {
        flood,
        wave,
        nextWaveTime: null,
        resetEntitiesBreathing: jest.fn(),
    }
    const cancelState = new CancelState(wavesManager)
    return { flood, wavesManager, cancelState, emit }
}

describe('CancelState (death by drowning / wave cancellation)', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(() => {
        jest.useRealTimers()
        jest.clearAllMocks()
    })

    it('ends the flood and restarts the game when the wave is already gone', () => {
        const { flood, wavesManager, cancelState, emit } = makeCancelState(null)
        cancelState.start()
        cancelState.update(16)

        expect(flood.stop).toHaveBeenCalledTimes(1)
        expect(wavesManager.resetEntitiesBreathing).toHaveBeenCalled()
        expect(wavesManager.wave).toBeNull()

        jest.advanceTimersByTime(2250)
        expect(emit).toHaveBeenCalledWith('start')
    })

    it('ends the flood when the wave was replaced by a fresh, not-yet-started one', () => {
        const wave = makeWave({ started: false, height: 0 })
        const { flood, wavesManager, cancelState, emit } = makeCancelState(wave)

        //the surge must not be accelerated since it was never activated
        cancelState.start()
        expect(wave.speedY).toBe(15)

        cancelState.update(16)
        expect(flood.stop).toHaveBeenCalledTimes(1)
        expect(wavesManager.wave).toBeNull()

        jest.advanceTimersByTime(2250)
        expect(emit).toHaveBeenCalledWith('start')
    })

    it('drains an active wave and only ends the flood once the water is low', () => {
        const wave = makeWave()
        const { flood, cancelState } = makeCancelState(wave)

        cancelState.start()
        //surge speed is tripled so the water drains faster
        expect(wave.speedY).toBe(45)

        cancelState.update(100)
        expect(wave.decrease).toHaveBeenCalled()
        expect(flood.stop).not.toHaveBeenCalled()

        wave.decreasing = true
        wave.height = 4
        cancelState.update(100)
        expect(flood.stop).toHaveBeenCalledTimes(1)
    })

    it('restarts the game even when the last life was spent (lives went down to 0)', () => {
        //after deathSequence decrements 1->0 the flood must still restart;
        //game over is handled on the next death, when lives is already 0
        const wave = makeWave({ height: 4, decreasing: true })
        const { flood, cancelState, emit } = makeCancelState(wave, 0)

        cancelState.start()
        cancelState.update(16)
        expect(flood.stop).toHaveBeenCalledTimes(1)

        jest.advanceTimersByTime(2250)
        expect(emit).toHaveBeenCalledWith('start')
    })
})
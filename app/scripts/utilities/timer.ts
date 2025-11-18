class Timer {
  callback:Function
  remaining:any
  start!:any
  timerId!:number
  oldTimerId!:number
  pausedBySystem!:boolean
  constructor(callback:Function, delay:number) {
    this.callback = callback;
    this.remaining = delay;
    this.resume(false);
  }

  /**
   * Pauses the timer marks whether the pause came from the player
   * or the system
   * @param {Boolean} systemPause
   */
  pause(systemPause?:boolean) {
    window.clearTimeout(this.timerId);
    this.remaining -= (new Date().valueOf() - this.start.valueOf());
    this.oldTimerId = this.timerId;

    if (systemPause) {
      this.pausedBySystem = true;
    }
  }

  /**
   * Creates a new setTimeout based upon the remaining time, giving the
   * illusion of 'resuming' the old setTimeout
   * @param {Boolean} systemResume
   */
  resume(systemResume?:boolean) {
    if (systemResume || !this.pausedBySystem) {
      this.pausedBySystem = false;

      this.start = new Date();
      this.timerId = window.setTimeout(() => {
        this.callback();
        window.dispatchEvent(new CustomEvent('removeTimer', {
          detail: {
            timer: this,
          },
        }));
      }, this.remaining);

      if (!this.oldTimerId) {
        window.dispatchEvent(new CustomEvent('addTimer', {
          detail: {
            timer: this,
          },
        }));
      }
    }
  }
}
// removeIf(production)
export default Timer
// endRemoveIf(production)
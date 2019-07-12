const MULTIPLIER = 60;

function tick(obj, timer) {
  if (timer === 'f') {
    obj._state.focusTimer.focusTime -= 1;
    currentTime = obj._state.focusTimer.focusTime;
  } else if (timer === 'p') {
    obj._state.pauseTimer.pauseTime -= 1;
    currentTime = obj._state.pauseTimer.pauseTime;
  }
  if (currentTime === 0) {
    obj.stop();
    obj._state.pauseTimer.runs = false;
    obj._state.focusTimer.runs = false;
  }
}

class PomodoroTimer {
  /**
   * Time in minutes
   * @param {number} focusTime
   * @param {number} pauseTime
   */
  constructor(focusTime, pauseTime) {
    this._state = {
      purpose: '',
      focusTimer: {
        focusTime: focusTime * MULTIPLIER,
        startTime: focusTime * MULTIPLIER,
        runs: false
      },
      pauseTimer: {
        pauseTime: pauseTime * MULTIPLIER,
        startTime: pauseTime * MULTIPLIER,
        runs: false
      }
    };
  }

  /**
   * Name of the timer "f" (focus) or "p" (pause)
   * @param {string} timer
   * @else both timer are turning off
   */
  toogleRunning(timer) {
    if (timer === 'f') {
      this._state.focusTimer.runs = !this._state.focusTimer.runs;
    } else if (timer === 'p') {
      this._state.pauseTimer.runs = !this._state.pauseTimer.runs;
    } else {
      this._state.pauseTimer.runs = false;
      this._state.focusTimer.runs = false;
    }
  }

  status() {
    return this._state;
  }

  stop() {
    if (this.hasRunningTimer()) {
      clearInterval(this.intervallId);
      this.toogleRunning();
      return true;
    } else {
      console.log('Nothing to Stop');
      return false;
    }
  }

  hasRunningTimer() {
    return this._state.focusTimer.runs || this._state.pauseTimer.runs;
  }

  changeTimer(time, timer) {
    if (timer === 'f') {
      this._state.focusTimer.focusTime = time * MULTIPLIER;
      this._state.focusTimer.startTime = time * MULTIPLIER;
    } else if (timer === 'p') {
      this._state.pauseTimer.pauseTime = time * MULTIPLIER;
      this._state.pauseTimer.startTime = time * MULTIPLIER;
    }
  }

  startFocustime(time = null) {
    if (!this.hasRunningTimer()) {
      if (time) this.changeTimer(time, 'f');
      this.toogleRunning('f');
      this.intervallId = setInterval(() => {
        tick(this, 'f');
      }, 1000);
      return true;
    } else {
      console.log('One Timer is running');
      return false;
    }
  }

  startPausetime(time = null) {
    if (!this.hasRunningTimer()) {
      if (time) this.changeTimer(time, 'p');
      this.toogleRunning('p');
      this.intervallId = setInterval(() => {
        tick(this, 'p');
      }, 1000);
      return true;
    } else {
      console.log('One Timer is running');
      return false;
    }
  }
}

module.exports = PomodoroTimer;

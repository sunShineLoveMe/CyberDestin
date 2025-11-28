export class Tween {
  private valuesStart: any = {};
  private valuesEnd: any = {};
  private duration: number = 1000;
  private delayTime: number = 0;
  private startTime: number | null = null;
  private easingFunction: (k: number) => number = Easing.Linear.None;
  private onUpdateCallback: ((object: any) => void) | null = null;
  private onCompleteCallback?: () => void;
  private isPlaying: boolean = false;
  private isYoyo: boolean = false;
  private repeatCount: number = 0;
  private reversed: boolean = false;
  private originalValues: Record<string, number> = {};

  constructor(public object: any) {}

  to(properties: Record<string, number>, duration: number) {
    this.valuesEnd = properties;
    this.duration = duration;
    return this;
  }

  start(time?: number) {
    add(this); // Add to global tweens list
    for (const property in this.valuesEnd) {
      this.valuesStart[property] = parseFloat(this.object[property]);
      // Store original values for yoyo
      this.originalValues[property] = this.valuesStart[property];
    }
    this.startTime = time !== undefined ? time : performance.now();
    this.startTime += this.delayTime;
    this.isPlaying = true;
    return this;
  }

  yoyo(enabled: boolean) {
    this.isYoyo = enabled;
    return this;
  }

  repeat(times: number) {
    this.repeatCount = times;
    return this;
  }

  stop() {
    this.isPlaying = false;
    remove(this);
    return this;
  }

  delay(amount: number) {
    this.delayTime = amount;
    return this;
  }

  easing(fn: (k: number) => number) {
    this.easingFunction = fn;
    return this;
  }

  onUpdate(callback: (object: any) => void) {
    this.onUpdateCallback = callback;
    return this;
  }

  onComplete(callback: () => void) {
    this.onCompleteCallback = callback;
    return this;
  }

  update(time: number): boolean {
    if (!this.isPlaying) return false;
    if (this.startTime === null || time < this.startTime) return true;

    let elapsed = (time - this.startTime) / this.duration;
    elapsed = elapsed > 1 ? 1 : elapsed;
    const value = this.easingFunction(elapsed);

    for (const property in this.valuesEnd) {
      const start = this.valuesStart[property];
      const end = this.valuesEnd[property];
      this.object[property] = start + (end - start) * value;
    }

    if (this.onUpdateCallback) {
      this.onUpdateCallback(this.object);
    }

    if (elapsed === 1) {
      if (this.isYoyo && !this.reversed) {
        // Reverse for yoyo
        this.reversed = true;
        const temp = this.valuesStart;
        this.valuesStart = this.valuesEnd;
        this.valuesEnd = temp;
        this.startTime = time;
        return true;
      }

      if (this.repeatCount > 0 || this.repeatCount === Infinity) {
        // Reset for repeat
        if (this.repeatCount !== Infinity) {
          this.repeatCount--;
        }

        if (this.isYoyo && this.reversed) {
          // After completing a yoyo cycle, reverse back
          this.reversed = false;
          const temp = this.valuesStart;
          this.valuesStart = this.valuesEnd;
          this.valuesEnd = temp;
        } else {
          // Regular repeat - reset to original
          for (const property in this.valuesEnd) {
            this.valuesStart[property] = this.originalValues[property];
          }
        }

        this.startTime = time;
        return true;
      }

      if (this.onCompleteCallback) {
        this.onCompleteCallback();
      }
      this.isPlaying = false;
      return false;
    }

    return true;
  }
}

export const Easing = {
  Linear: {
    None: (k: number) => k,
  },
  Quadratic: {
    In: (k: number) => k * k,
    Out: (k: number) => k * (2 - k),
    InOut: (k: number) => {
      if ((k *= 2) < 1) return 0.5 * k * k;
      return -0.5 * (--k * (k - 2) - 1);
    },
  },
  Exponential: {
    In: (k: number) => (k === 0 ? 0 : Math.pow(1024, k - 1)),
    Out: (k: number) => (k === 1 ? 1 : 1 - Math.pow(2, -10 * k)),
    InOut: (k: number) => {
      if (k === 0) return 0;
      if (k === 1) return 1;
      if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
      return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
    },
  },
  Back: {
    In: (k: number) => {
      const s = 1.70158;
      return k * k * ((s + 1) * k - s);
    },
    Out: (k: number) => {
      const s = 1.70158;
      return --k * k * ((s + 1) * k + s) + 1;
    },
    InOut: (k: number) => {
      const s = 1.70158 * 1.525;
      if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
      return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
    },
  },
  
  Sinusoidal: {
    In: (k: number) => {
      return 1 - Math.cos((k * Math.PI) / 2);
    },
    Out: (k: number) => {
      return Math.sin((k * Math.PI) / 2);
    },
    InOut: (k: number) => {
      return 0.5 * (1 - Math.cos(Math.PI * k));
    },
  },
};

const _tweens: Tween[] = [];

export function add(tween: Tween) {
  _tweens.push(tween);
}

export function remove(tween: Tween) {
  const i = _tweens.indexOf(tween);
  if (i !== -1) {
    _tweens.splice(i, 1);
  }
}

export function update(time?: number) {
  if (_tweens.length === 0) return false;
  let i = 0;
  const t = time !== undefined ? time : performance.now();
  while (i < _tweens.length) {
    if (_tweens[i].update(t)) {
      i++;
    } else {
      _tweens.splice(i, 1);
    }
  }
  return true;
}

export function removeAll() {
  _tweens.length = 0;
}

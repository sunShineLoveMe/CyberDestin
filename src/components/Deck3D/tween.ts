export class Tween {
  private object: any;
  private valuesStart: any = {};
  private valuesEnd: any = {};
  private duration: number = 1000;
  private delayTime: number = 0;
  private startTime: number | null = null;
  private easingFunction: (k: number) => number = (k) => k;
  private onUpdateCallback: ((object: any) => void) | null = null;
  private onCompleteCallback: ((object: any) => void) | null = null;
  private isPlaying: boolean = false;

  constructor(object: any) {
    this.object = object;
  }

  to(values: any, duration: number) {
    this.valuesEnd = values;
    if (duration !== undefined) {
      this.duration = duration;
    }
    return this;
  }

  start(time?: number) {
    for (const property in this.valuesEnd) {
      this.valuesStart[property] = parseFloat(this.object[property]);
    }
    this.startTime = time !== undefined ? time : performance.now();
    this.startTime += this.delayTime;
    this.isPlaying = true;
    return this;
  }

  stop() {
    this.isPlaying = false;
    return this;
  }

  delay(amount: number) {
    this.delayTime = amount;
    return this;
  }

  easing(easing: (k: number) => number) {
    this.easingFunction = easing;
    return this;
  }

  onUpdate(callback: (object: any) => void) {
    this.onUpdateCallback = callback;
    return this;
  }

  onComplete(callback: (object: any) => void) {
    this.onCompleteCallback = callback;
    return this;
  }

  update(time: number) {
    if (!this.isPlaying || this.startTime === null) {
      return false;
    }

    if (time < this.startTime) {
      return true;
    }

    const elapsed = (time - this.startTime) / this.duration;
    const value = elapsed > 1 ? 1 : elapsed;
    const progress = this.easingFunction(value);

    for (const property in this.valuesEnd) {
      const start = this.valuesStart[property];
      const end = this.valuesEnd[property];
      this.object[property] = start + (end - start) * progress;
    }

    if (this.onUpdateCallback) {
      this.onUpdateCallback(this.object);
    }

    if (elapsed === 1) {
      if (this.onCompleteCallback) {
        this.onCompleteCallback(this.object);
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

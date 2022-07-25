import { extend } from "../shared";

let activeEffect;
let shouldTrack;

export class ReactiveEffect {
  private _fn: any;
  deps = [];
  active = true;
  onStop?: () => void;
  public schedule: Function | undefined;
  constructor(fn, schedule?: Function) {
    this._fn = fn;
    this.schedule = schedule;
  }
  run() {
    if (!this.active) {
      return this._fn();
    }

    shouldTrack = true;
    activeEffect = this;
    const result = this._fn();
    shouldTrack = false;

    return result;
  }
  stop() {
    if (this.active) {
      clearupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function clearupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}

const targetMap = new Map();
export function track(target, key) {
  if (!isTracking()) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  trackEffects(dep);
}
export function isTracking() {
  return activeEffect !== undefined && shouldTrack;
}
export function trackEffects(dep) {
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  triggerEffects(dep);
}
export function triggerEffects(dep) {
  dep.forEach((effect) => {
    if (effect.schedule) {
      effect.schedule();
    } else {
      effect.run();
    }
  });
}
export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn);
  extend(_effect, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}

function dep(dep: any, arg1: (any: any) => void) {
  throw new Error("Function not implemented.");
}

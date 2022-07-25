import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class refImpl {
  private _value: any;
  public dep;
  private _rawValue: any;
  public __is_ref = true;
  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    if (hasChanged(this._rawValue, newVal)) {
      this._rawValue = newVal;
      this._value = convert(newVal);
      triggerEffects(this.dep);
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

export function ref(value) {
  return new refImpl(value);
}

export function isRef(value) {
  return !!value.__is_ref;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWidthRefs) {
  return new Proxy(objectWidthRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
        // return (target[key] = value);
      }
    },
  });
}

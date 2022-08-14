import { createRenderer } from "../runtime-core/render";

export function createElement(type) {
    return document.createElement(type)
}

export function patchProp(el, key, val) {
    const isOn = (key: string) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, val);
    } else {
      el.setAttribute(key, val);
    }
}

export function insert(el, parent) {
    parent.append(el)
}

export let renderer: any = createRenderer({
    createElement,
    patchProp,
    insert
})

export function createApp(...args) {
  return renderer.createApp(...args);
}

export * from "../runtime-core";

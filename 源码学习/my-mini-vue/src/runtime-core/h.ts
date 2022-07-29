import { createVnode } from "./vnode";

export function h(vnode, props?, children?) {
  return createVnode(vnode, props, children);
}

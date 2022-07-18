import {  mutableHandlers, readonlyHandlers } from "./baseHandler"

export const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly",
  }

export function reactive(raw) {
    return createReactiveObject(raw, mutableHandlers)
}

export function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE]
}

export function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers)
}

export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY]
}


function createReactiveObject(raw, baseHandlers) {
    return new Proxy(raw, baseHandlers)
}
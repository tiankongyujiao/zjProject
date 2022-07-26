import { isObject } from "../shared";

export function createComponentInstance(vnode) {
  return {
    vnode,
    type: vnode.type,
  };
}

export function setupComponent(instance) {
  // TODO
  // initProps()
  // initSlots()

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;

  const { setup } = Component;

  if (setup) {
    const setupResult = setup();

    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance: any, setupResult: any) {
  // function object
  // TODO function

  // object
  if (isObject(setupResult)) {
    instance.setupState = setupResult;
  }

  finshSetupComponent(instance);
}

function finshSetupComponent(instance: any) {
  const Component = instance.type;

  if (Component.render) {
    instance.render = Component.render;
  }
}

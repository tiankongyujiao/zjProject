import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const {createElement, patchProp, insert} = options

  function render(vnode, container) {
    patch(vnode, container, null);
  }
  
  function patch(vnode, container, parent) {
    const { type, shapeFlag } = vnode;
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parent);
        break;
      case Text:
        processText(vnode, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, container, parent);
        }
    }
  }
  
  function processText(vnode, container) {
    const { children } = vnode;
    const textNode = (vnode.$el = document.createTextNode(children));
    container.append(textNode);
  }
  
  function processFragment(vnode: any, container: any, parent) {
    mountChildren(vnode, container, parent);
  }
  
  function processElement(vnode: any, container: any, parent) {
    mountElement(vnode, container, parent);
  }
  
  function mountElement(vnode, container, parent) {
    const el = (vnode.el = createElement(vnode.type));
  
    const { children, props, shapeFlag } = vnode;
    for (const key in props) {
      const val = props[key];
      patchProp(el, key, val)
    }
  
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parent);
    }
  
    insert(el, container)
  }
  
  function mountChildren(vnode, container, parent) {
    vnode.children.forEach((v) => {
      patch(v, container, parent);
    });
  }
  
  function processComponent(vnode: any, container: any, parent) {
    mountComponent(vnode, container, parent);
  }
  
  function mountComponent(initialVNode: any, container: any, parent) {
    const instance = createComponentInstance(initialVNode, parent);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
  }
  
  function setupRenderEffect(instance: any, initialVNode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    patch(subTree, container, instance);
  
    initialVNode.el = subTree.el;
  }


  return {
    createApp: createAppApi(render)
  }
}


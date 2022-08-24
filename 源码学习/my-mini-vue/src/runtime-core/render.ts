import { effect } from "../reactivity/effect";
import { patchProp } from "../runtime-dom";
import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { Fragment, Text } from "./vnode";
const EMPTY_OBJ = {};
export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;

  function render(vnode, container) {
    patch(null, vnode, container, null, null);
  }

  function patch(n1, n2, container, parent, anchor) {
    const { type, shapeFlag } = n2;
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parent, anchor);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parent, anchor);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parent, anchor);
        }
    }
  }

  function processText(n1, n2, container) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processFragment(n1, n2: any, container: any, parent, anchor) {
    mountChildren(n2.children, container, parent, anchor);
  }

  function processElement(n1, n2: any, container: any, parent, anchor) {
    if (!n1) {
      mountElement(n2, container, parent, anchor);
    } else {
      patchElement(n1, n2, container, parent, anchor);
    }
  }

  function patchElement(n1, n2, container, parentComponent, anchor) {
    console.log("patchElement");
    console.log("n1", n1);
    console.log("n2", n2);
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    const el = (n2.el = n1.el);

    patchChildren(n1, n2, el, parentComponent, anchor);
    patchProps(el, oldProps, newProps);
  }

  function patchChildren(n1, n2, container, parentComponent, anchor) {
    const oldShapeFlag = n1.shapeFlag;
    const c1 = n1.children;
    const { shapeFlag } = n2;
    const c2 = n2.children;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 新的是文本，老的是数组，先删除老的
      if (oldShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1);
      }
      // 新的是文本，老的是数组，删除老的以后，添加新的文本 || 新的是文本，老的是文本，直接替换文本
      if (c1 !== c2) {
        hostSetElementText(container, c2);
      }
    } else {
      // 新的是数组，老的是文本
      if (oldShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, "");
        mountChildren(c2, container, parentComponent, anchor);
      } else {
        // 新的是数组，老的也是数组
        patchKeyedChildren(c1, c2, container, parentComponent, anchor);
      }
    }
  }

  // 新的是数组，老的也是数组
  function patchKeyedChildren(
    c1,
    c2,
    container,
    parentComponent,
    parentAnchor
  ) {
    let l1 = c1.length;
    let l2 = c2.length;
    let e1 = l1 - 1;
    let e2 = l2 - 1;
    let i = 0;

    function isSameVNodeType(n1, n2) {
      return n1.type === n2.type && n1.key === n2.key;
    }

    // 1. 左侧相同
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      i++;
    }
    // 2. 右侧相同
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      e1--;
      e2--;
    }

    // 3. 新的比老的长
    // （1）新的比老的长，左侧一样
    // 老的：a,b  新的 a,b,c
    // i = 2 e1=1 e2=2
    // （2）新的比老的长，右侧一样
    // 老的：a,b  新的：d,c,a,b
    // i=0 e1=-1 e2=1
    if (i > e1) {
      if (i <= e2) {
        // const nextPos = e2 + 1;
        // const anchor = nextPos < l2 ? c2[nextPos].el : null;
        // while (i <= e2) {
        //   patch(null, c2[i], container, parentComponent, anchor);
        //   i++;
        // }

        const nextPos = i + 1;
        const anchor = nextPos >= l1 ? null : c1[i].el;
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor);
          i++;
        }
      }
    } else if (i > e2) {
      // 4. 老的比新的长
      // （1）老的比新的长，左侧一样
      // 老的：a,b,c  新的：a,b
      // i = 2, e1 = 2, e2 = 1
      // （2）老的比新的长，右侧一样
      // 老的：a,b,c  新的：b,c
      // i = 0, e1 = 0, e2 = -1
      while (i <= e1) {
        hostRemove(c1[i].el);
        i++;
      }
    } else {
    }
  }

  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      hostRemove(children[i].el);
    }
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (let key in newProps) {
        const oldProp = oldProps[key];
        const newProp = newProps[key];
        patchProp(el, key, oldProp, newProp);
      }

      if (oldProps !== EMPTY_OBJ) {
        for (let key in oldProps) {
          if (!(key in newProps)) {
            patchProp(el, key, oldProps[key], null);
          }
        }
      }
    }
  }

  function mountElement(vnode, container, parent, anchor) {
    const el = (vnode.el = hostCreateElement(vnode.type));

    const { children, props, shapeFlag } = vnode;
    for (const key in props) {
      const val = props[key];
      hostPatchProp(el, key, null, val);
    }

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parent, anchor);
    }

    hostInsert(el, container, anchor);
  }

  function mountChildren(children, container, parent, anchor) {
    children.forEach((v) => {
      patch(null, v, container, parent, anchor);
    });
  }

  function processComponent(n1, n2: any, container: any, parent, anchor) {
    mountComponent(n2, container, parent, anchor);
  }

  function mountComponent(initialVNode: any, container: any, parent, anchor) {
    const instance = createComponentInstance(initialVNode, parent);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container, anchor);
  }

  function setupRenderEffect(instance: any, initialVNode, container, anchor) {
    effect(() => {
      if (!instance.isMounted) {
        console.log("init");
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        patch(null, subTree, container, instance, anchor);

        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log("update");
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;

        patch(prevSubTree, subTree, container, instance, anchor);
      }
    });
  }

  return {
    createApp: createAppApi(render),
  };
}

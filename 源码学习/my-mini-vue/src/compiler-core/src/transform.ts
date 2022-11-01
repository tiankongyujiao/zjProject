import { NodeTypes } from "../../parse-core/src/ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";

export function transform(root: any, options = {}) {
  const context = createTransformContext(root, options);
  traverseNode(root, context);
  createRootCodegen(root);

  root.helpers = [...context.helpers.keys()];
}

function createRootCodegen(root) {
  root.codegenNode = root.children[0];
}
// 生成上下文
function createTransformContext(root, options) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Map(),
    helper: (key) => {
      context.helpers.set(key, 1);
    },
  };
  return context;
}
// 转换节点
function traverseNode(node, context) {
  const nodeTransforms = context.nodeTransforms;
  for (let i = 0; i < nodeTransforms.length; i++) {
    nodeTransforms[i](node);
  }
  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING);
      break;

    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context);
      break;
    default:
      break;
  }
}
// 处理children
function traverseChildren(node, context) {
  const children = node.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const n = children[i];
      traverseNode(n, context);
    }
  }
}

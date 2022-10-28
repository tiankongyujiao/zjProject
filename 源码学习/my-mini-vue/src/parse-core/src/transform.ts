export function transform(root: any, options) {
  const context = createTransformContext(root, options);
  traverseNode(root, context);
}
// 生成上下文
function createTransformContext(root, options) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
  };
  return context;
}

function traverseNode(node, context) {
  const nodeTransforms = context.nodeTransforms;
  for (let i = 0; i < nodeTransforms.length; i++) {
    nodeTransforms[i](node);
  }
  traverseChildren(node, context);
}

function traverseChildren(node, context) {
  const children = node.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const n = children[i];
      traverseNode(n, context);
    }
  }
}

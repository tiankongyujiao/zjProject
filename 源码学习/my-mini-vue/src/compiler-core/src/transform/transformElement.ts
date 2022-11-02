import { NodeTypes } from "../../../parse-core/src/ast";
import { CREATE_ELEMENT_BLOCK } from "../runtimeHelpers";

export function transformElement(node, context) {
  if (node.type === NodeTypes.ELEMENT) {
    context.helper(CREATE_ELEMENT_BLOCK);
  }
}

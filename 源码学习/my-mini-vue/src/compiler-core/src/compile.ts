import { baseParse } from "../../parse-core/src/parse";
import { generate } from "./codegen";
import { transform } from "./transform";
import { transformElement } from "./transform/transformElement";
import { transformExpression } from "./transform/transformExpression";
import { transformText } from "./transform/transformText";

export function baseCompile(template) {
  const ast = baseParse("<div>hi, {{message}}</div>");
  transform(ast, {
    nodeTransforms: [transformExpression, transformElement, transformText],
  });
  return generate(ast);
}

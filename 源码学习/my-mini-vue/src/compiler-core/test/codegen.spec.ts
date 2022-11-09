import { baseParse } from "../../parse-core/src/parse";
import { generate } from "../src/codegen";
import { transform } from "../src/transform";
import { transformExpression } from "../src/transform/transformExpression";
import { transformElement } from "../src/transform/transformElement";
import { transformText } from "../src/transform/transformText";

describe("codegen", () => {
  it("string", () => {
    const ast = baseParse("hi");
    transform(ast);
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });

  it("interpolation", () => {
    const ast = baseParse("{{message}}");
    transform(ast, {
      nodeTransforms: [transformExpression],
    });
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });

  // it("element", () => {
  //   const ast = baseParse("<div></div>");
  //   transform(ast, {
  //     nodeTransforms: [transformElement],
  //   });
  //   const { code } = generate(ast);
  //   expect(code).toMatchSnapshot();
  // });

  it("element2", () => {
    const ast = baseParse("<div>hi, {{message}}</div>");
    transform(ast, {
      nodeTransforms: [transformExpression, transformElement, transformText],
    });
    // console.log(ast, ast.codegenNode.children, "-~~~~~~~~~~~--");
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });
});

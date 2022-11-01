import { baseParse } from "../../parse-core/src/parse";
import { generate } from "../src/codegen";
import { transform } from "../src/transform";
import { transformExpression } from "../src/transform/transformExpression";

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
});

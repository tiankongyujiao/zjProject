import { NodeTypes } from "../../parse-core/src/ast";
import { baseParse } from "../../parse-core/src/parse";
import { transform } from "../src/transform";

describe("transform", () => {
  it("happy path", () => {
    const ast = baseParse("<div>hi,{{message}}</div>");

    // 通过plugin的方式传入要查找替换的元素
    const plugin = (node) => {
      if (node.type === NodeTypes.TEXT) {
        node.content = node.content + " mini-vue";
      }
    };

    transform(ast, {
      nodeTransforms: [plugin],
    });

    const nodeText = ast.children[0].children[0].content;
    expect(nodeText).toBe("hi, mini-vue");
  });
});

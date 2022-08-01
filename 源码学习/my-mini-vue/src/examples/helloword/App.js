import { h } from "../../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";
window.self = null;
export const App = {
  render() {
    window.self = this;
    return h(
      "div",
      {
        class: ["red", "blue"],
        onClick: () => {
          console.log("click");
        },
        onMousedown: () => {
          console.log("mousedown");
        },
      },
      [h("div", {}, "hi " + this.msg), h(Foo, { count: 1 })]
      // "hi " + this.msg
      // [h("p", { class: "red" }, "hi "), h("p", { class: "blue" }, "mini vue")]
    );
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};

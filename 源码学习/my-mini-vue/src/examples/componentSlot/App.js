import {
  h,
  createTextVNode,
  getCurrentInstance,
} from "../../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";
console.log(90);
export const App = {
  name: "App",
  render() {
    const app = h("div", {}, "App");
    // object key
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => [
          h("p", {}, "header" + age),
          createTextVNode("你好呀"),
        ],
        footer: () => h("p", {}, "footer"),
      }
    );
    // 数组 vnode
    // const foo = h(Foo, {}, h("p", {}, "123"));
    return h("div", {}, [app, foo]);
  },
  setup() {
    const instance = getCurrentInstance();
    console.log("APP: ", instance);
    return {};
  },
};

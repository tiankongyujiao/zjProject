import {
  h,
  renderSlots,
  getCurrentInstance,
} from "../../../../lib/guide-mini-vue.esm.js";

export const Foo = {
  name: "Foo",
  setup() {
    const instance = getCurrentInstance();
    console.log("Foo:", instance);
    return {};
  },
  render() {
    const foo = h("p", {}, "foo");
    return h("div", {}, [
      renderSlots(this.$slots, "header", { age: 18 }),
      foo,
      renderSlots(this.$slots, "footer"),
    ]);
  },
};

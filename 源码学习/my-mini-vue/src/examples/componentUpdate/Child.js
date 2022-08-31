import { h } from "../../../lib/guide-mini-vue.esm.js";
export default {
  name: "Child",
  setup(props, { emit }) {
    const msg = props.msg;
    // return {
    //   msg,
    // };
  },
  render(proxy) {
    return h("div", {}, [
      h("div", {}, "child - props - msg: " + this.$props.msg),
    ]);
  },
};

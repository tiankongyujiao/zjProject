import { h } from "../../../../lib/guide-mini-vue.esm.js";

export const Foo = {
  setup(props, { emit }) {
    const emitAdd = () => {
      console.log("emitAdd");
      emit("add", 1, 23, 4);
    };
    return {
      emitAdd,
    };
  },
  render() {
    return h(
      "div",
      {
        onClick: this.emitAdd,
      },
      "emitAdd"
    );
  },
};

import { effect } from "../effect";
import { reactive } from "../reactive";
import { isRef, proxyRefs, ref, unRef } from "../ref";

describe("ref", () => {
  it("happy path", () => {
    const age = ref(1);
    expect(age.value).toBe(1);
  });

  it("should be reactive", () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = a.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);

    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  });

  it("should make nested properties reactive", () => {
    const a = ref({
      count: 1,
    });
    let dummy;
    effect(() => {
      dummy = a.value.count;
    });
    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);
  });

  it("isRef", () => {
    const a = ref(1);
    const user = reactive({
      age: 18,
    });
    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(user)).toBe(false);
  });

  it("unRef", () => {
    const a = ref(1);
    expect(unRef(a)).toBe(1);
    expect(unRef(1)).toBe(1);
  });

  it("proxyRefs", () => {
    const user = {
      age: ref(1),
      name: "jack",
    };
    expect(user.age.value).toBe(1);
    const proxyUser = proxyRefs(user);
    expect(proxyUser.age).toBe(1);

    proxyUser.age = 2;
    expect(user.age.value).toBe(2);
    expect(proxyUser.age).toBe(2);

    proxyUser.age = ref(3);
    expect(user.age.value).toBe(3);
    expect(proxyUser.age).toBe(3);

    proxyUser.name = ref("tom");
    expect(proxyUser.name).toBe("tom");
    expect(user.name.value).toBe("tom");
  });
});

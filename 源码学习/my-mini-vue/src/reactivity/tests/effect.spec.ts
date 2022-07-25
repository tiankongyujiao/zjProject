import { effect, stop } from "../effect";
import { isReactive, reactive } from "../reactive";

describe("effect", () => {
  it("happy path", () => {
    const user = reactive({
      age: 10,
    });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });

    expect(nextAge).toBe(11);

    // update
    user.age++;
    expect(nextAge).toBe(12);
  });

  it("should return runner when call effect", () => {
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return "foo";
    });
    expect(foo).toBe(11);

    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe("foo");
  });

  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    // obj.prop = 3;
    obj.prop++;
    expect(dummy).toBe(2);

    // stopped effect should still be manually callable
    runner();
    expect(dummy).toBe(3);
  });

  it("onStop", () => {
    const obj = reactive({
      foo: 1,
    });
    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        onStop,
      }
    );

    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });

  it("schedule", () => {
    const user = reactive({ age: 1 });
    let a = 1;
    let yumy;
    let run = effect(
      () => {
        yumy = user.age;
      },
      {
        schedule: () => {
          a++;
        },
      }
    );
    expect(yumy).toBe(1);

    user.age++;
    expect(yumy).toBe(1);
    expect(a).toBe(2);
    run();
    expect(yumy).toBe(2);
  });
});

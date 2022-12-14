ts语法注意点记录

1. ##### 所有的类型都是小写字母开头的，例如

   ```js
   //  Boolean 类型
   let isDone: boolean = false;
   // ES5：var isDone = false;
   
   // Number 类型
   let count: number = 10;
   // ES5：var count = 10;
   
   // String 类型
   let name: string = "semliker";
   // ES5：var name = 'semlinker';
   
   // Symbol 类型
   const sym = Symbol();
   let obj = {
     [sym]: "semlinker",
   };
   console.log(obj[sym]); // semlinker 
   
   // Array 类型
   let list: number[] = [1, 2, 3];
   // ES5：var list = [1,2,3];
   let list: Array<number> = [1, 2, 3]; // Array<number>泛型语法
   // ES5：var list = [1,2,3];
   
   // Any类型
   let notSure: any = 666;
   notSure = "semlinker";
   notSure = false;
   ```

2. Array<MyType> 和 MyType[] 是等价的，其中Array<MyType>是通用语法， MyType[] 是简写语法。 

3. ##### Unknown类型

   ```js
   let value: unknown;
   value = true; // OK
   value = 42; // OK
   value = "Hello World"; // OK
   
   let value2: unknown;
   let value1: unknown = value2; // OK
   let value2: any = value2; // OK
   let value3: boolean = value2; // Error
   let value4: number = value2; // Error
   
   // unknown 类型只能被赋值给 any 类型和 unknown 类型本身。直观地说，这是有道理的：只有能够保存任意类型值的容器才能保存 unknown 类型的值。毕竟我们不知道变量 value 中存储了什么类型的值。
   
   ```

   

4. ##### Tuple类型: 

   众所周知，数组一般由同种类型的值组成，但有时我们需要在单个变量中存储不同类型的值，这时候我们就可以使用元组。在 JavaScript 中是没有元组的，元组是 TypeScript 中特有的类型，其工作方式类似于数组。元组可用于定义具有*有限数量*的未命名属性的类型。每个属性都有一个关联的类型。使用元组时，*必须提供每个属性的值*。

   ```js
   let tupleType: [string, boolean];
   tupleType = ["semlinker", true];
   // 在上面代码中，我们定义了一个名为 tupleType 的变量，它的类型是一个类型数组 [string, boolean]，然后我们按照正确的类型依次初始化 tupleType 变量。与数组一样，我们可以通过下标来访问元组中的元素：
   console.log(tupleType[0]); // semlinker
   console.log(tupleType[1]); // true
   // 在元组初始化的时候，如果出现类型不匹配的话，比如：
   tupleType = [true, "semlinker"];
   // 此时，TypeScript 编译器会提示以下错误信息：
   // [0]: Type 'true' is not assignable to type 'string'.
   // [1]: Type 'string' is not assignable to type 'boolean'.
   ```

   

5. ##### Void类型：

   void 类型像是与 any 类型相反，它表示没有任何类型，需要注意的是，*声明一个 void 类型的变量没有什么作用*，因为在严格模式下，它的值只能为 `undefined`：

6. ##### Null和Undefined类型：

   TypeScript 里，`undefined` 和 `null` 两者有各自的类型分别为 `undefined` 和 `null`。

   ```js
   let u: undefined = undefined;
   let n: null = null;
   ```

7. ##### object和Object和{}类型：

   （1）object：TypeScript 2.2 引入的新类型，它用于表示非原始类型

   （2）它是所有 Object 类的实例的类型：

   ​		a. Object接口定义了Object.prototype原型对象上的属性；

   ​		b. ObjectConstructor 接口定义了 Object 类的属性.

   ​	Object 类的所有实例都继承了 Object 接口中的所有属性。

   （3）{} 类型：{} 类型描述了一个没有成员的对象。当你试图访问这样一个对象的任意属性时，TypeScript 会产生一个编译时错误。

   ```js
   // Type {}
   const obj = {};
   
   // Error: Property 'prop' does not exist on type '{}'.
   obj.prop = "semlinker";
   ```

   但是，你仍然可以使用在 Object 类型上定义的所有属性和方法，这些属性和方法可通过 JavaScript 的原型链隐式地使用：

   ```js
   // Type {}
   const obj = {};
   
   // "[object Object]"
   obj.toString();
   ```

8. ##### Never类型：

   `never` 类型表示的是那些永不存在的值的类型。

9. ##### 类型断言的方式：

（1）尖括号语法：

```js
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
```



（2）as语法：

```js
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```

4. 非空断言：

x! 将从 x 值域中排除 null 和 undefined

```js
function myFunc(maybeString: string | undefined | null) {
  // Type 'string | null | undefined' is not assignable to type 'string'.
  // Type 'undefined' is not assignable to type 'string'. 
  const onlyString: string = maybeString; // Error
  const ignoreUndefinedAndNull: string = maybeString!; // Ok
}
```

注意： *这里只是能语法通过，实际编译出来的语法会直接把！去掉，例如*

```js
const a: number | undefined = undefined;
const b: number = a!;
console.log(b); 
// 编译后的：
"use strict";
const a = undefined;
const b = a;
console.log(b);  // undefined
// 虽然在 TS 代码中，我们使用了非空断言，使得 const b: number = a!; 语句可以通过 TypeScript 类型检查器的检查。但在生成的 ES5 代码中，! 非空断言操作符被移除了，所以在浏览器中执行以上代码，在控制台会输出 undefined。
```

##### 	调用函数时忽略 undefined 类型:

```js
type NumGenerator = () => number;

function myFunc(numGenerator: NumGenerator | undefined) {
  // Object is possibly 'undefined'.(2532)
  // Cannot invoke an object which is possibly 'undefined'.(2722)
  const num1 = numGenerator(); // Error
  const num2 = numGenerator!(); //OK
}
```

4. **确定赋值断言**：

   在 TypeScript 2.7 版本中引入了确定赋值断言，即允许在实例属性和变量声明后面放置一个 `!` 号，从而告诉 TypeScript 该属性会被明确地赋值。

```js
let x!: number; // 如果不加！，ts语法检查不会通过，通过加！确定赋值断言，TypeScript 编译器就会知道该属性会被明确地赋值
initialize();
console.log(2 * x); // Ok

function initialize() {
  x = 10;
}
```

5. 枚举

   （1）常量枚举：它是使用 `const` 关键字修饰的枚举，常量枚举会使用内联语法，不会为枚举类型编译生成任何 JavaScript

   ```js
   const enum Direction {
     NORTH,
     SOUTH,
     EAST,
     WEST,
   }
   
   let dir: Direction = Direction.NORTH;
   
   // 以上代码对应的 ES5 代码如下：
   "use strict";
   var dir = 0 /* NORTH */;
   ```

   （2）数字枚举：

   ```js
   enum Direction {
     NORTH,
     SOUTH,
     EAST,
     WEST,
   }
   
   let dir: Direction = Direction.NORTH;
       
   // 默认情况下，NORTH 的初始值为 0，其余的成员会从 1 开始自动增长。换句话说，Direction.SOUTH 的值为 1，Direction.EAST 的值为 2，Direction.WEST 的值为 3。
   
   // 以上的枚举示例经编译后，对应的 ES5 代码如下：
   "use strict";
   var Direction;
   (function (Direction) {
     Direction[(Direction["NORTH"] = 0)] = "NORTH";
     Direction[(Direction["SOUTH"] = 1)] = "SOUTH";
     Direction[(Direction["EAST"] = 2)] = "EAST";
     Direction[(Direction["WEST"] = 3)] = "WEST";
   })(Direction || (Direction = {}));
   var dir = Direction.NORTH;
    
   // 打印Direction看看是什么
   console.log(Direction)
   // {
   //   0: "NORTH",
   //   1: "SOUTH",
   //   2: "EAST",
   //   3: "WEST",
   //   NORST: 0,
   //   SOUTH: 1,
   //   EAST: 2,
   //   WEST: 3                   
   // }
   ```

   也可以设置初始值，比如：

   ```js
   enum Direction {
     NORTH = 3,
     SOUTH,
     EAST,
     WEST,
   }
   // 后面的值依次自动为4，5，6
   ```

   （3）字符串枚举：在 TypeScript 2.4 版本，允许我们使用字符串枚举。在一个字符串枚举里，*每个成员都必须用字符串字面量*，或另外一个字符串枚举成员进行初始化。

   ```js
   enum Direction {
     NORTH = "NORTH",
     SOUTH = "SOUTH",
     EAST = "EAST",
     WEST = "WEST",
   }
   // 编译为es5：
   "use strict";
   var Direction;
   (function (Direction) {
       Direction["NORTH"] = "NORTH";
       Direction["SOUTH"] = "SOUTH";
       Direction["EAST"] = "EAST";
       Direction["WEST"] = "WEST";
   })(Direction || (Direction = {}));
       
   // 打印Direction看看是什么
   console.log(Direction)
   // {
   //   NORST: "NORST",
   //   SOUTH: "SOUTH",
   //   EAST: "EAST",
   //   WEST: "WEST"                   
   // }
   ```

   *通过观察数字枚举和字符串枚举的编译结果，我们可以知道数字枚举除了支持 **从成员名称到成员值** 的普通映射之外，它还支持 **从成员值到成员名称** 的反向映射，而字符串枚举是单向映射，而且每一项必须明确赋值。

（4）异构枚举：异构枚举的成员值是数字和字符串的混合

```js
enum Enum {
  A,
  B,
  C = "C",
  D = "D",
  E = 8,
  F,
}
// 编译为es5:
"use strict";
var Enum;
(function (Enum) {
    Enum[Enum["A"] = 0] = "A";
    Enum[Enum["B"] = 1] = "B";
    Enum["C"] = "C";
    Enum["D"] = "D";
    Enum[Enum["E"] = 8] = "E";
    Enum[Enum["F"] = 9] = "F";
})(Enum || (Enum = {}));
    
// 打印Enum看看是什么：
console.log(Enum);
// {
//   0: "A",
//   1: "B",
//   8: "E",
//   9: "F",
//   "A": 0,
//   "B": 1,
//   "C": "C",
//   "D": "D",
//   "E":8,
//   "F": 9
// }
// 通过观察上述生成的 ES5 代码，我们可以发现数字枚举相对字符串枚举多了 “反向映射”
```

6. ##### 类型守卫：

   类型保护可以确保一个字符串是一个字符串，尽管他也可以是一个数值。其主要思想是尝试监测属性，方法或原型，以确保如何处理值。目前有4中类型守卫的方法：

   （1）in关键字

   ```js
   interface Admin {
     name: string;
     privileges: string[];
   }
   
   interface Employee {
     name: string;
     startDate: Date;
   }
   
   type UnknownEmployee = Employee | Admin;
   
   function printEmployeeInformation(emp: UnknownEmployee) {
     console.log("Name: " + emp.name);
     if ("privileges" in emp) {
       console.log("Privileges: " + emp.privileges);
     }
     if ("startDate" in emp) {
       console.log("Start Date: " + emp.startDate);
     }
   }
   ```

   （2）typeof关键字

   ```js
   function padLeft(value: string, padding: string | number) {
     if (typeof padding === "number") {
         return Array(padding + 1).join(" ") + value;
     }
     if (typeof padding === "string") {
         return padding + value;
     }
     throw new Error(`Expected string or number, got '${padding}'.`);
   }
   ```

   （3）instanceof关键字

   ```js
   interface Padder {
     getPaddingString(): string;
   }
   
   class SpaceRepeatingPadder implements Padder {
     constructor(private numSpaces: number) {}
     getPaddingString() {
       return Array(this.numSpaces + 1).join(" ");
     }
   }
   
   class StringPadder implements Padder {
     constructor(private value: string) {}
     getPaddingString() {
       return this.value;
     }
   }
   
   let padder: Padder = new SpaceRepeatingPadder(6);
   
   if (padder instanceof SpaceRepeatingPadder) {
     // padder的类型收窄为 'SpaceRepeatingPadder'
   }
   ```

   （4）*自定义类型保护的类型谓词*

   ```js
   function isNumber(x: any): x is number {
     return typeof x === "number";
   }
   
   function isString(x: any): x is string {
     return typeof x === "string";
   }
   ```

7. ##### 联合类型和类型别名

   （1）联合类型

   联合类型通常与 `null` 或 `undefined` 一起使用：

   ```js
   const sayHello = (name: string | undefined) => {
     /* ... */
   };
   ```

   例如，这里 `name` 的类型是 `string | undefined` 意味着可以将 `string` 或 `undefined` 的值传递给`sayHello` 函数。

   ```js
   sayHello("semlinker");
   sayHello(undefined);
   ```

   通过这个示例，你可以凭直觉知道类型 A 和类型 B 联合后的类型是同时接受 A 和 B 值的类型。

   此外，对于联合类型来说，你可能会遇到以下的用法：

   ```js
   let num: 1 | 2 = 1;
   type EventNames = 'click' | 'scroll' | 'mousemove';
   ```

   以上示例中的 `1`、`2` 或 `'click'` 被称为字面量类型，用来约束取值只能是*某几个值中的一个*。

   （2）可辨别联合类型：可辨别，联合类型，类型守卫。

   比如：三个接口有一个共同的属性，这个属性成为可辨别属性；然后公共方法通过这个属性的值不同来做不同的操作，这叫类型守卫；联合类型是把三个接口联合起来：`type Vehicle = Motorcycle | Car | Truck; `

   （3）类型别名：

   类型别名用来给一个类型起个新名字。

   ```js
   type Message = string | string[];
   
   let greet = (message: Message) => {
     // ...
   };
   ```

8. ##### 泛型

   就像传递参数一样，我们传递了我们想要用于特定函数调用的类型。

   ![](E:\study\Github\zjProject\ts\泛型1.png)

参考上面的图片，当我们调用 ` identity<Number>(1)` ，`Number` 类型就像参数 `1` 一样，它将在出现 `T` 的任何位置填充该类型。图中 `<T>` 内部的 `T` 被称为类型变量，它是我们希望传递给 identity 函数的类型占位符，同时它被分配给 `value` 参数用来代替它的类型：此时 `T` 充当的是类型，而不是特定的 Number 类型。

其中 `T` 代表 **Type**，在定义泛型时通常用作第一个类型变量名称。但实际上 `T` 可以用任何有效名称代替。

除了 `T` 之外，以下是常见泛型变量代表的意思：

- K（Key）：表示对象中的键类型；

- V（Value）：表示对象中的值类型；

- E（Element）：表示元素类型。

  其实并不是只能定义一个类型变量，我们可以引入希望定义的任何数量的类型变量。比如我们引入一个新的类型变量 `U`，用于扩展我们定义的 `identity` 函数：

  ```js
  function identity <T, U>(value: T, message: U) : T {
    console.log(message);
    return value;
  }
  
  console.log(identity<Number, string>(68, "Semlinker"));
  ```

  ![](E:\study\Github\zjProject\ts\泛型2.png)

除了为类型变量显式设定值之外，一种更常见的做法是使编译器自动选择这些类型，从而使代码更简洁。我们可以完全省略尖括号，比如：

```js
function identity <T, U>(value: T, message: U) : T {
  console.log(message);
  return value;
}

console.log(identity(68, "Semlinker"));
```

对于上述代码，编译器足够聪明，能够知道我们的参数类型，并将它们赋值给 T 和 U，而不需要开发人员显式指定它们。

9. ##### 交叉类型

   在typescript中，交叉类型是将多个类型合并为一个类型。通过 `&` 可以将现有的多种类型叠加到一起成为一种类型，它包涵了所需的所有类型的特性：

   ```js
   type PartialPointX = { x: number; };
   type Point = PartialPointX & { y: number; };
   
   let point: Point = {
     x: 1,
     y: 1
   }
   ```

   假设在合并多个类型的过程中，刚好出现某些类型存在相同的成员（`基础属性`），但对应的类型又不一致，会导致该类型变成 `never` 

   如果是 `非基础数据类型`，是可以合并成功的。

10. ##### 接口和类型别名的区别

    接口：interface关键字定义的

    ```js
    interface Point {
      x: number;
      y: number;
    }
    
    interface SetPoint {
      (x: number, y: number): void;
    }
    ```

    类型别名：type关键字定义的

    ```js
    type Point = {
      x: number;
      y: number;
    };
    
    type SetPoint = (x: number, y: number) => void;
    ```

    与`接口类型`不一样，`类型别名`可以用于一些其他类型，比如`原始类型`、`联合类型`和`元组`：

    ```js
    // primitive
    type Name = string;
    
    // object
    type PartialPointX = { x: number; };
    type PartialPointY = { y: number; };
    
    // union 联合类型
    type PartialPoint = PartialPointX | PartialPointY;
    
    // tuple
    type Data = [number, string];
    ```

    接口和类型别名都能够被扩展，，但语法有所不同：

    ```js
    // Interface extends interface
    interface PartialPointX { x: number; }
    interface Point extends PartialPointX { 
      y: number; 
    }	
    // Type alias extends type alias
    type PartialPointX = { x: number; };
    type Point = PartialPointX & { y: number; };
    
    // Interface extends type alias
    type PartialPointX = { x: number; };
    interface Point extends PartialPointX { y: number; }
    
    // 接口可以扩展类型别名，反过来不行
    
    // Type alias extends interface
    interface PartialPointX { x: number; }
    type Point = PartialPointX & { y: number; };
    ```

    类可以以相同的方式实现接口或类型别名，但类不能实现使用类型别名定义的联合类型：

    ```js
    interface Point {
      x: number;
      y: number;
    }
    
    class SomePoint implements Point {
      x = 1;
      y = 2;
    }
    
    type Point2 = {
      x: number;
      y: number;
    };
    
    class SomePoint2 implements Point2 {
      x = 1;
      y = 2;
    }
    
    type PartialPoint = { x: number; } | { y: number; };
    
    // A class can only implement an object type or 
    // intersection of object types with statically known members.
    class SomePartialPoint implements PartialPoint { // Error
      x = 1;
      y = 2;
    }
    ```

    与类型别名不同，接口可以定义多次，会被自动合并为单个接口

    ```js
    interface Point { x: number; }
    interface Point { y: number; }
    
    const point: Point = { x: 1, y: 2 };
    ```

    10. ##### 装饰器

        （1）类装饰器：顾名思义就是用来装饰类的，他接收一个参数：`target`:**TFunction** （被装饰的类）

        ```js
        declare type ClassDecorator = <TFunction extends Function>(
          target: TFunction
        ) => TFunction | void;
        ```

        例子：

        ```js
        function Greeter(target: Function): void {
          target.prototype.greet = function (): void {
            console.log("Hello Semlinker!");
          };
        }
        
        @Greeter
        class Greeting {
          constructor() {
            // 内部实现
          }
        }
        
        let myGreeting = new Greeting();
        (myGreeting as any).greet(); // console output: 'Hello Semlinker!';
        ```

        上面的例子中，我们定义了 `Greeter` 类装饰器，同时我们使用了 `@Greeter` 语法糖，来使用装饰器。

        还可以自定义输出：

        ```js
        function Greeter(greeting: string) {
          return function (target: Function) {
            target.prototype.greet = function (): void {
              console.log(greeting);
            };
          };
        }
        
        @Greeter("Hello TS!")
        class Greeting {
          constructor() {
            // 内部实现
          }
        }
        
        let myGreeting = new Greeting();
        (myGreeting as any).greet(); // console output: 'Hello TS!';
        ```

        （2）方法装饰器：

        ```js
        declare type MethodDecorator = <T>(target:Object, propertyKey: string | symbol, 	 	
          descriptor: TypePropertyDescript<T>) => TypedPropertyDescriptor<T> | void;
        ```

        方法装饰器顾名思义，用来装饰类的方法。它接收三个参数：

        a. target: Object - 被装饰的类

        b. propertyKey: string | symbol - 方法名

        c. descriptor: TypePropertyDescript - 属性描述符

        例子：

        ```js
        function log(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
          let originalMethod = descriptor.value;
          descriptor.value = function (...args: any[]) {
            console.log("wrapped function: before invoking " + propertyKey);
            let result = originalMethod.apply(this, args);
            console.log("wrapped function: after invoking " + propertyKey);
            return result;
          };
        }
        
        class Task {
          @log
          runTask(arg: any): any {
            console.log("runTask invoked, args: " + arg);
            return "finished";
          }
        }
        
        let task = new Task();
        let result = task.runTask("learn ts");
        console.log("result: " + result);
        
        // "wrapped function: before invoking runTask" 
        // "runTask invoked, args: learn ts" 
        // "wrapped function: after invoking runTask" 
        // "result: finished" 
        ```

        （3）参数装饰器

        ```js
        declare type ParameterDecorator = (target: Object, propertyKey: string | symbol, 
          parameterIndex: number ) => void
        ```

        参数装饰器顾名思义，是用来装饰函数参数，它接收三个参数：

        a. target: Object - 被装饰的类

        b. propertyKey: string | symbol - 方法名 

        c. parameterIndex: number - 方法中参数的索引值

        ```js
        function Log(target: Function, key: string, parameterIndex: number) {
          let functionLogged = key || target.prototype.constructor.name;
          console.log(`The parameter in position ${parameterIndex} at ${functionLogged} has
        	been decorated`);
        }
        
        class Greeter {
          greeting: string;
          constructor(@Log phrase: string) {
        	this.greeting = phrase; 
          }
        }
        
        // "The parameter in position 0 at Greeter has been decorated" 
        ```

        （4）属性装饰器

        ```js
        declare type PropertyDecorator = (target:Object, 
          propertyKey: string | symbol ) => void;
        ```

        属性装饰器顾名思义，用来装饰类的属性。它接收两个参数：

        a. target: Object - 被装饰的类

        b. propertyKey: string | symbol - 被装饰类的属性名

        ```js
        function logProperty(target: any, key: string) {
          delete target[key];
        
          const backingField = "_" + key;
        
          Object.defineProperty(target, backingField, {
            writable: true,
            enumerable: true,
            configurable: true
          });
        
          // property getter
          const getter = function (this: any) {
            const currVal = this[backingField];
            console.log(`Get: ${key} => ${currVal}`);
            return currVal;
          };
        
          // property setter
          const setter = function (this: any, newVal: any) {
            console.log(`Set: ${key} => ${newVal}`);
            this[backingField] = newVal;
          };
        
          // Create new property with getter and setter
          Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
          });
        }
        
        class Person { 
          @logProperty
          public name: string;
        
          constructor(name : string) { 
            this.name = name;
          }
        }
        
        const p1 = new Person("semlinker");
        p1.name = "kakuqo";
        
        // 以上代码我们定义了一个 logProperty 函数，来跟踪用户对属性的操作，当代码成功运行后，在控制台会输出以下结果：
        // Set: name => semlinker
        // Set: name => kakuqo
        ```

        11. #### vscode中json to ts 使用工具

            在vscode的json文件中，先选择要转换的json，然后按住`Shift + Ctrl + Alt + S`会自动转换。





##### 作者：阿宝哥

链接：https://juejin.cn/post/6872111128135073806
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
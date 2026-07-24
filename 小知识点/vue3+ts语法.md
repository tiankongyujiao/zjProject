



1. vu3的响应式数据和真实数据不绑定在一个对象上

2. 没有用EventSource，而是用的fetch + response.body.getReader + TextDecoder，手动读ReadableStream的字节流，用的fetch模拟的SSE，不是EventSource。且手动做了缓冲。

3. store的结构会失去响应式，reactive（1）直接赋值（2）解构 （3）传递参数会失去响应式，所以一般用ref包裹

4. 联合类型，能收窄就别用as，当收窄不了才使用as强断言，as是兜底，as是逃生舱，不是习惯，滥用as会绕过类型检查，掩盖错误。比如你 as AssistantMessage 后访问 chartType，如果 msg 其实是 UserMessage，TS  不报错但运行时 undefined。

5. TS能推到出类型的，不写泛型也行，比如ref(false)，false 是个具体的字面量值，TS 直接从它推出布尔类型，不用写泛型。

   再比如ref<DatasetOption[]>([]) -- 必须写泛型，但不是因为"复杂"关键在初始值是空数组 []。空数组没有任何元素，TS 不知道元素是什么类型，会推导成 never[]（"永远不会有元素"的类型）。never 上访问 .id 会报错。所以必须写  ref<DatasetOption[]>([]) 显式告诉它元素是 DatasetOption。

   如果传非空数组 ref([{ id: '1', name: 'x' }])，TS 能从元素推导出类型，不写泛型也行。所以不是"复杂类型要明确"，是"空数组没元素可推"。

   如果不传初始值，必须制定泛型。

   总结：初始值能不能让 TS推出来（能就省泛型），这个值初始时存不存在（不存在就 ref<T>() 带
     undefined，存在就给初始值）。

6. enum的现在替代 as const对象

   as const是TS的“常量断言”，让类型推到变量变窄。

   ```
   对比：不加 vs 加 as const
   
   // 不加
   const x = { a: 1, b: 'x' };
   // 类型：{ a: number; b: string }
   // - a 被拓宽成 number，b 拓宽成 string
   // - 属性可变
   x.a = 2;    // ✅  OK
   x.b = 'y';  // ✅  OK
   
   // 加 as const
   const x = { a: 1, b: 'x' } as const;
   // 类型：{ readonly a: 1; readonly b: 'x' }
   // - a 是字面量 1，b 是字面量 'x'
   // - 属性 readonly
   x.a = 2;    // ❌  报错（1 不能赋 2）
   x.b = 'y';  // ❌  报错（'x' 不能赋 'y'）
   ```

     as const 做的三件事

     1. 字面量化：值类型从拓宽类型变成字面量。1 而非 number，'x' 而非 string。

     2. readonly：所有属性变只读。

     3. 深层递归：嵌套对象/数组也一并字面量化 + readonly。

        

   如果既想要"运行时值集合"又想要类型，现代 TS 更倾向：

   ```  
   const ChartType = { Bar: 'bar', Funnel: 'funnel', Kpi: 'kpi' } as const;
   ```

   一般用联合类型：

   ```
   export type ChartType = 'bar' | 'funnel' | 'kpi' | 'leaderboard' | 'line' | 'pie' | 'scatter' | 'table';
   ```

   联合类型是纯类型，编译后完全擦除，零运行时体积。根本不需要tree-shaking，都不会进JS，编译时就擦除了，tree-shaking是针对运行时JS的。

   enum 会编译成运行时 JS 对象

   ```
   as const = 把推导压到最窄（字面量 + readonly + 深层），数组变只读元组；配合 typeof + keyof 能从对象提取值联合，是enum 的轻量替代（有运行时对象 + 联合类型，还利于 tree-shaking）
   ```

7. any、unknown、never

   any处于最底层和最顶层，任何值都可以复制给any，any可以赋值给除了never的其他所有类型，unknow处于最高层，他是安全版的any，必须经过类型收窄，never处于最低层，代表永远不可能存在的值，没有任何类型可以赋值给never，除了never自身，但never可以赋值给任何类型。一般用于后端下发的参数的时候直接用any，类型由后端决定，或者工具函数的流转。

8. void的作用，返回undefined，

   void = 执行表达式但丢弃结果返回 undefined，这里用来标记"故意 fire-and-forget 这个
     Promise"，消除浮动 Promise 的 lint 警告、避免被误以为忘了 await。

9. type定义元祖，原始类型别名，这个只能type做，type不好扩展，主要定义**类型别名**（各种类型），不可以同名，不会合并，同名会报错

   interface一般是用来定义对象、函数、类的形状，可以继承，可以扩展，可以自动合并

10. :deep()是vue3里的语法，vue2.7是::v-deep，其他写法已废弃，他是把scope的子组件穿透到父组件data-v

11. vue3的作用域插槽传值是：子传父，父再传子，是通过函数的形式，定义形参，父组件拿到参数以后决定渲染具体的内容再传给子组件，子组件只决定大体框子，具体实现是在父组件的插槽实现的。

    普通的props是父传子，渲染什么完全又子组件定。

12. watch是懒执行，也可以设置immediate:true立马执行一次，可以拿到旧值，watch一个具体的值，比如ref，比如()=>()，或者一个数组，如果不是ref必须用()=>包裹，比如const a = ref({b:1})，如果要监听a.b也要()=>{}包裹，除非直接监听a可以直接写。watchEffect不写监听的项，隐士收集依赖，立马执行，可能会白跑一趟，拿不到旧值。

13. defineProps<{ loading?: boolean }>()是泛型声明，defineProps({ loading: { type: Boolean, default: false } })是运行时声明

    泛型声明编译时会擦除类型，不会进JS，默认值需要withDefaults补，不支持validator

    运行时声明不会擦除类型，会进JS，可以直接设置默认值，支持validator

14. <script setup>组件默认是封闭的，父组件通过ref拿到的子组件实例，默认什么都访问不到（子组件内部的变量，方法全拿不到），除非子组件通过defineExpose主动暴露


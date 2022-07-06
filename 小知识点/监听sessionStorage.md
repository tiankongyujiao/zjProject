#### 监听sessionStorage值变化
1. 创建一个全局的方法给sessionStorage赋值
```
var setSessionItem = function (key, newVal) {
  // 创建 StorageEvent 事件
  let newStorageEvent = document.createEvent("StorageEvent");
  const storage = {
    setItem: function (k, val) {
      sessionStorage.setItem(k, val);

      // 初始化 StorageEvent 事件
      newStorageEvent.initStorageEvent(
        "setItem", // 事件别名
        false,
        false,
        k,
        null,
        val,
        null,
        null
      );

      // 派发事件
      window.dispatchEvent(newStorageEvent);
    },
  };
  return storage.setItem(key, newVal);
};
```

2. 监听事件
```
window.addEventListener("setItem", () => {
  console.log('@@@@@@@@@@@@')
  this.role = sessionStorage.getItem("role");
});
```

3. 调用定义的全局方法赋值
```
setSessionItem("role", "管理员4");
// @@@@@@@@@@@@
```
const { SyncLoopHook } = require('tapable');

// 创建实列
const syncLoopHook = new SyncLoopHook(["name", "age"]);

// 定义辅助变量
let total1 = 0;
let total2 = 0;

// 注册事件
syncLoopHook.tap("1", (name, age) => {
  console.log("1", name, age, total1);
  return total1++ < 2 ? true : undefined;
});

syncLoopHook.tap("2", (name, age) => {
  console.log("2", name, age, total2);
  return total2++ < 2 ? true : undefined;
});

syncLoopHook.tap("3", (name, age) => {
  console.log("3", name, age);
});

// 触发事件，让监听函数执行
syncLoopHook.call("kongzhiEvent-1", 18);

// SyncLoopHook 为串行同步执行，事件处理函数返回true表示继续循环，如果返回undefined的话，表示结束循环
/**
 * 1 kongzhiEvent-1 18 0
1 kongzhiEvent-1 18 1
1 kongzhiEvent-1 18 2
2 kongzhiEvent-1 18 0
1 kongzhiEvent-1 18 3
2 kongzhiEvent-1 18 1
1 kongzhiEvent-1 18 4
2 kongzhiEvent-1 18 2
3 kongzhiEvent-1 18
 */
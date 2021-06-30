const { SyncWaterfallHook } = require('tapable');

// 创建实列
const syncWaterfallHook = new SyncWaterfallHook(["name", "age"]);

// 注册事件
syncWaterfallHook.tap("1", (name, age) => {
  console.log("第一个函数事件名称", name, age);
  return '1';
});

syncWaterfallHook.tap("2", (data) => {
  console.log("第二个函数事件名称", data);
  return '2';
});

syncWaterfallHook.tap("3", (data) => {
  console.log("第三个函数事件名称", data);
  return '3';
});

// 触发事件，让监听函数执行
const res = syncWaterfallHook.call("kongzhiEvent-1", 18);

console.log(res);

/**
 * SyncWaterfallHook 为串行同步执行，上一个事件处理函数的返回值作为参数传递给下一个事件处理函数，依次类推
 * 第一个函数事件名称 kongzhiEvent-1 18
第二个函数事件名称 1
第三个函数事件名称 2
3
 */
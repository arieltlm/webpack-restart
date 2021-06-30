const { SyncBailHook } = require('tapable');

// 创建实列

const syncBailHook = new SyncBailHook(["name", "age"]);

// 注册事件
syncBailHook.tap("1", (name, age) => {
  console.log("1", name, age);
});

syncBailHook.tap("2", (name, age) => {
  console.log("2", name, age);
  return '2';
});

syncBailHook.tap("3", (name, age) => {
  console.log("3", name, age);
});

// 触发事件，让监听函数执行
syncBailHook.call("kongzhiEvent-1", 18);

/**
 * SyncBailHook.js同样为串行同步执行，如果事件处理函数执行时有一个返回值不为空。则跳过剩下未执行的事件处理函数
 * 1 kongzhiEvent-1 18
    2 kongzhiEvent-1 18
 */
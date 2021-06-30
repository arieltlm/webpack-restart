const { SyncHook } = require('tapable');

// 创建实列
const syncHook = new SyncHook(["name", "age"]);

// 注册事件
syncHook.tap("1", (name, age) => {
  console.log("1", name, age);
});
syncHook.tap("2", (name, age) => {
  console.log("2", name, age);
});
syncHook.tap("3", (name, age) => {
  console.log("3", name, age);
});

// 触发事件，让监听函数执行
syncHook.call("kongzhiEvent-1", 18);

/**SyncHook.js 是处理串行同步执行的文件，在触发事件之后，会按照事件注册的先后顺序执行所有的事件处理函数。 */

/* > node ./src/tapable/synchook.js
>   1 kongzhiEvent-1 18
    2 kongzhiEvent-1 18
    3 kongzhiEvent-1 18 */

/* SyncHook是tapable中的一个类，首先我们需要创建一个实列，注册事件之前需要创建实列，
创建实列时需要传入一个数组，该数组的存储的事件是我们在注册事件时，需要传入的参数。实列中的tap方法用于注册事件，
该方法支持传入2个参数，第一个参数是 '事件名称', 第二个参数为事件处理函数，函数参数 为执行call(触发事件)时传入的参数的形参*/
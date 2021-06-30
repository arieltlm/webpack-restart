const { AsyncParallelHook } = require('tapable');
// 创建实列
const asyncParallelHook = new AsyncParallelHook(["name", "age"]);

// 注册事件
asyncParallelHook.tapPromise("1", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("1", name, age, new Date());
    }, 1000);
  });
});

asyncParallelHook.tapPromise("2", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("2", name, age, new Date());
    }, 2000);
  });
});

asyncParallelHook.tapPromise("3", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("3", name, age, new Date());
    }, 3000);
  });
});

// 触发事件，让监听函数执行
asyncParallelHook.promise("kongzhiEvent-1", 18);

/**
 * 1 kongzhiEvent-1 18 2021-06-30T00:24:52.569Z
2 kongzhiEvent-1 18 2021-06-30T00:24:53.578Z
3 kongzhiEvent-1 18 2021-06-30T00:24:54.571Z
 */
const { AsyncSeriesHook } = require('tapable');

// 创建实列
const asyncSeriesHook = new AsyncSeriesHook(["name", "age"]);

// 注册事件
asyncSeriesHook.tapPromise("1", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("1", name, age, new Date());
      resolve();
    }, 1000);
  })
});

asyncSeriesHook.tapPromise("2", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("2", name, age, new Date());
      resolve();
    }, 2000);
  });
});

asyncSeriesHook.tapPromise("3", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("3", name, age, new Date());
      resolve();
    }, 3000);
  });
});

// 触发事件，让监听函数执行
asyncSeriesHook.promise("kongzhiEvent-1", 18);

// 对比 AsyncParallelHook 代码可以看到，唯一不同的是 该asyncSeriesHook的Promsie内部需要调用 resolve() 函数才会执行到下一个函数，
// 否则的话，只会执行第一个函数，但是 AsyncParallelHook 不调用 resolve()方法会依次执行下面的函数

/**
 * 1 kongzhiEvent-1 18 2021-06-30T00:29:47.470Z
2 kongzhiEvent-1 18 2021-06-30T00:29:49.485Z
3 kongzhiEvent-1 18 2021-06-30T00:29:52.490Z
 */
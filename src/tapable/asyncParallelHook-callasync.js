const { AsyncParallelHook } = require('tapable');

// 创建实列
const asyncParallelHook = new AsyncParallelHook(["name", "age"]);

// 注册事件
asyncParallelHook.tapAsync("1", (name, age, done) => {
  setTimeout(() => {
    console.log("1", name, age, new Date());
    done();
  }, 1000);
});

asyncParallelHook.tapAsync("2", (name, age, done) => {
  setTimeout(() => {
    console.log("2", name, age, new Date());
    done();
  }, 2000);
});

asyncParallelHook.tapAsync("3", (name, age, done) => {
  setTimeout(() => {
    console.log("3", name, age, new Date());
    done();
  }, 3000);
});

// 触发事件，让监听函数执行
asyncParallelHook.callAsync("kongzhiEvent-1", 18, () => {
  console.log('函数执行完毕');
});

/* AsyncParallelHook 为异步并行执行，
如果是通过 tapAsync 注册的事件，那么我们需要通过callAsync触发，
如果我们通过tapPromise注册的事件，那么我们需要promise触发 */

/**
 * 1 kongzhiEvent-1 18 2021-06-30T00:20:14.891Z
2 kongzhiEvent-1 18 2021-06-30T00:20:15.912Z
3 kongzhiEvent-1 18 2021-06-30T00:20:16.894Z
函数执行完毕
 */



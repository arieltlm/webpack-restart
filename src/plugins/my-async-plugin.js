class MyAsyncPlugin{
    constructor(options) {
        this.options = options
    }

    apply(compiler) {
        compiler.hooks.done.tapAsync('MyAsyncPlugin',(stats,callback) => {
            // 异步的事件会附带两个参数，第二个参数为回调函数
            console.log('Hello ', this.options.title);

            setTimeout(() => {console.log(1);}, 1000);

            setTimeout(() => {console.log(2);}, 2000);

            setTimeout(() => {console.log(3);}, 3000);

            setTimeout(() => {
                callback();
            }, 4000)
        })
    }
}
module.exports = MyAsyncPlugin
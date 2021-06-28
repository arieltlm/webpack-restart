class MyAsyncPlugin{
    constructor(options) {
        this.options = options
    }

    apply(compiler) {
        compiler.hooks.done.tapAsync('MyAsyncPlugin',(stats,callback) => {
            // callback 是需要怎么传递进来？
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
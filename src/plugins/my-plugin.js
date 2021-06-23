class MyPlugin {

    constructor(options) {

        this.options = options;

    }

    apply(compiler){

        compiler.hooks.done.tap('MyPlugin', (params) => {
            // params中有compilation对象，endTime、startTime、hash
            // params.startTime；params.endTime 时间戳；
            // params.hash e016b7f067c2f2cf6b5c
            console.log('MyPlugin ', this.options);

        });

    }

}



module.exports = MyPlugin;

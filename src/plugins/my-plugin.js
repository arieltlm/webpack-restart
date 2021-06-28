class MyPlugin {

    constructor(options) {

        this.options = options;

    }

    apply(compiler){

        compiler.hooks.done.tap('MyPlugin', (stats) => {
            // stats中有compilation对象，endTime、startTime、hash
            // stats.startTime；stats.endTime 时间戳；
            // stats.hash e016b7f067c2f2cf6b5c
            console.log('MyPlugin ', this.options);

        });

    }

}



module.exports = MyPlugin;

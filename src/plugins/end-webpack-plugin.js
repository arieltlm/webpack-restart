
// 在 Webpack 即将退出时再附加一些额外的操作，例如在 Webpack 成功编译和输出了文件后执行发布操作把输出的文件上传到服务器。
// 同时该插件还能区分 Webpack 构建是否执行成功
class EndWebpackPlugin {
    constructor(doneCallback, failCallback) {
        // 存下在构造函数中传入的回调函数
        this.doneCallback = doneCallback;
        this.failCallback = failCallback;
    }

    apply(compiler) {
        compiler.hooks.done.tap('EndWebpackPlugin', (stats) => {
            // 在 done 事件中回调 doneCallback
            this.doneCallback(stats);
        });
        compiler.hooks.failed.tap('EndWebpackPlugin', (err) => {
            // 在 failed 事件中回调 failCallback
            this.failCallback(err);
        });
    }
}
// 导出插件 
module.exports = EndWebpackPlugin;
  
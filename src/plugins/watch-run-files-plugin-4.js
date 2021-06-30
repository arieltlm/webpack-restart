class WatchRunFiles{
    constructor(options) {
        this.options = options
    }
    apply(compiler){
        // 当依赖的文件发生变化时会触发 watch-run 事件
        compiler.hooks.watchRun.tap('WatchRunFiles', (watching, callback) => {
            /* tlm——webpack中此处已经发生改变，目前还没有确定用哪个好？
             变更文档参考https://webpack.docschina.org/blog/2020-10-10-webpack-5-release/# */compilationfilesysteminfo
            // 获取发生变化的文件列表
            const changedFiles = watching.watchFileSystem.watcher.mtimes;
            // changedFiles 格式为键值对，键为发生变化的文件路径。
            if (changedFiles[filePath] !== undefined) {
                // filePath 对应的文件发生了变化
                console.log(filePath,'filePath')
            }
            callback();
        });
    }
}

module.exports = WatchRunFiles
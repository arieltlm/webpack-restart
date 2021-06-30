/**
 * 打包文件前面增加一个build by tlm
 */
const webpack= require("webpack");

class AddNamePlugin {

    constructor(options) {

        this.options = options;

    }

    apply(compiler){
        // 使用emit报警告;与html-webpack-plugin一开始升级为webpack5时的报警告一致，下方的参考此插件完成修改

        /*BREAKING CHANGE: No more changes should happen to Compilation.assets after sealing the Compilation.
        Do changes to assets earlier, e. g. in Compilation.hooks.processAssets.
        Make sure to select an appropriate stage from Compilation.PROCESS_ASSETS_STAGE_*.*/
        // 在 emit 事件发生时，代表源文件的转换和组装已经完成，在这里可以读取到最终将输出的资源、代码块、模块及其依赖，并且可以修改输出资源的内容
        /* compiler.hooks.emit.tap('AddNamePlugin', (compilation) => {
            const {assets } = compilation
            const content = assets['print.bundle.js'].source()
            console.log('AddNamePlugin ', content);
            assets['print.bundle.js'] = {
                source() {
                    return '"build by tlm"\r\n' + content
                },
                size(){
                    return content.length;
                }
            }
        }) */
        compiler.hooks.thisCompilation.tap('AddNamePlugin', (compilation) => {
            compilation.hooks.processAssets.tapAsync(
                {
                    name: 'AddNamePlugin',
                    stage:webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE
                  },(compilationAssets,callback)=> {
                // 读取名称为 print.bundle.js 的输出资源 
                const printBunble = compilationAssets['print.bundle.js']
                // 获取输出资源的内容 
                const content = printBunble.source()
                // console.log('AddNamePlugin ', content);
                // 获取输出资源的文件大小 
                console.log(printBunble.size(),'printBunble.size()')
                
                const {name} = this.options

                compilationAssets['print.bundle.js'] = {
                    source() {
                        return `"build by ${name || 'zhangsan'}" \r\n ${content}`
                    },
                    size(){
                        return content.length;
                    }
                }
                callback()
            })
        })

    }

}



module.exports = AddNamePlugin;

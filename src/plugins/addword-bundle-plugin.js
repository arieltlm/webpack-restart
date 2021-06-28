const { Compilation } = require("webpack");

class AddWordPlugin {

    constructor(options) {

        this.options = options;

    }

    apply(compiler){

        // 使用emit报警告
        /*BREAKING CHANGE: No more changes should happen to Compilation.assets after sealing the Compilation.
        Do changes to assets earlier, e. g. in Compilation.hooks.processAssets.
        Make sure to select an appropriate stage from Compilation.PROCESS_ASSETS_STAGE_*.*/
        /* compiler.hooks.emit.tap('AddWordPlugin', (compilation) => {
            const {assets } = compilation
            const content = assets['print.bundle.js'].source()
            console.log('AddWordPlugin ', content);
            assets['print.bundle.js'] = {
                source() {
                    return '"build by tlm"\r\n' + content
                },
                size(){
                    return content.length;
                }
            }
        }) */
        // 报错了--(node:68109) UnhandledPromiseRejectionWarning: TypeError: asset.map is not a function
        compiler.hooks.thisCompilation.tap('AddWordPlugin', (compilation) => {
            compilation.hooks.processAssets.tapAsync('aaa',(assets,callback)=> {
                const content = assets['print.bundle.js'].source()
                console.log('AddWordPlugin ', content);
                assets['print.bundle.js'] = {
                    source() {
                        return '"build by tlm"\r\n' + content
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



module.exports = AddWordPlugin;

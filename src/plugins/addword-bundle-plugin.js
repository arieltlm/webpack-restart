class AddWordPlugin {

    constructor(options) {

        this.options = options;

    }

    apply(compiler){

        compiler.hooks.emit.tap('AddWordPlugin', (compilation) => {
            const {assets } = compilation
            const content = assets['app.bundle.js']
            console.log('AddWordPlugin ', content);
            assets['app.bundle.js'] = {
                source() {
                    return '"build by tlm"\r\n' + content
                },
                size(){
                    return content.length;
                }
            }

        });

    }

}



module.exports = AddWordPlugin;

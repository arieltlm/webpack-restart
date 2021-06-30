const fs = require('fs') // fs.readFile()读取文件
const util = require('util') // 利用util.promisify将异步代码转为promise异步
const path = require('path') // 处理路径
const webpack = require('webpack')
const { RawSource } = webpack.sources // 可以创建一个基于webpack风格的文件类型
const readFile = util.promisify(fs.readFile) // 将 fs.readFile 方法转为基于promise风格的异步方法
class Plugin2 {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('Plugin2', (compilation) => {
      compilation.hooks.additionalAssets.tapAsync('Plugin2', async (cb) => {
        // additionalAssets 异步串行钩子
        // return console.log(compilation)
        const content = 'hello plugin2'
        compilation.assets['a.txt'] = {
          // 往要输出资源中，添加一个a.txt
          size() {
            // 文件大小
            return content.length
          },
          source() {
            // 文件内容
            return content
          }
        }
        const data = await readFile(path.resolve(__dirname, '../example.txt')) // 读取某个文件（b.txt）打包到dist中
        // compilation.assets['b.txt'] = new RawSource(data) // 往要输出的资源中，添加一个b.txt文件，new RawSource()中传入数据转为a.txt创建时的对象结构（不用自己写那么多函数），创建文件
        compilation.emitAsset('b.txt', new RawSource(data)) // webpack5
        cb()
      })
    })
  }
}

module.exports = Plugin2
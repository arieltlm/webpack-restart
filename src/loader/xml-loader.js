// npm i xml2js
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const loaderUtils = require('loader-utils');

module.exports =  function(source) {
    // console.log(source) // 就是test.xml中的源代码;重启webapck 可以看到依次打印了两个xml的源代码文件
    // 在有些情况下，有些转换操作需要大量计算非常耗时，如果每次构建都重新执行重复的转换操作，构建将会变得非常缓慢。 
    // 为此，Webpack 会默认缓存所有 Loader 的处理结果，也就是说在需要被处理的文件或者其依赖的文件没有发生变化时， 是不会重新调用对应的 Loader 去执行转换操作的。
    this.cacheable && this.cacheable();
    // 关闭该 Loader 的缓存功能
    // this.cacheable(false);

    // 获取到用户给当前 Loader 传入的 options
    const options = loaderUtils.getOptions(this);
    console.log(options,'options') // { limit: 8192 } options

    const self = this;
    parser.parseString(source, function (err, result) {
        console.log('%c result===', 'color:#497EFC;background: #03FECF;', result)
        self.callback(err, !err && "module.exports = " + JSON.stringify(result));
       /*  ERROR in ./src/test.xml 1:7
        Module parse failed: Unexpected token (1:7)
        File was processed with these loaders:
        * ./src/loader/xml-loader.js
        You may need an additional loader to handle the result of these loaders.
        > {"note":{"to":["Mary"],"from":["John"],"heading":["Reminder  dd"],"body":["Call Cindy on Tuesday dd"]}}
        @ ./src/index.js 4:0-29 30:27-41 */
        // 不论rules其放在第几位都会报此错误
        // self.callback(err, !err && JSON.stringify(result));
    });
    // 使用return 或者this.callback()均可
    // return source;
};
/**
 * 移除js中的注释
 * [备注：这个loader，后续再研究一直报错-You may need an additional loader to handle the result of these loaders.]
 */
module.exports =  function(source) {
   // Webpack5.0开始，不在需要使用工具获取option了
    // 获取到webpack.config.js中配置的options
    let options = this.getOptions();
    let result = source;
    // 默认单行和多行注释都删除
    const defaultOption = {
        oneLine: true,
        multiline: true,
    }
    options = Object.assign({}, defaultOption, options);
    if (options.oneLine) {
        // 去除单行注释
        result = result.replace(/\/\/.*/g, "")
    }
    if (options.multiline) {
        // 去除多行注释
        result = result.replace(/\/\*.*?\*\//g, "")
    }
    // loader必须要有输出，否则Webpack构建报错
    // return `module.exports = ${result}`
    return result

}

// const loaderUtils = require('loader-utils');
module.exports =  function(source){
//   const options = loaderUtils.getOptions(this);
 // 从 webpack 5 开始，this.getOptions 可以获取到 loader 上下文对象。它用来替代来自 loader-utils 中的 getOptions 方法。
  const options = this.getOptions()

  source = source.replace(/\[name\]/g, options.name);

  return `module.exports = ${JSON.stringify(source)}`;
}
function HelloWorldPlugin(options) {
    // 使用 options 设置插件实例……
    this.options = options
}
  
HelloWorldPlugin.prototype.apply = function(compiler) {
    // done是编译完成
    // 第一个参数没什么意义，一般写自己插件名字
    compiler.hooks.done.tap('HelloWorldPlugin', function() {
        console.log('done.tap-Hello World!');
    });
};
  
module.exports = HelloWorldPlugin;
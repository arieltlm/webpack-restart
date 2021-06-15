# webpack loader和plugin

loader 主要的是处理静态资源，而 plugins 是可以贯穿在整个 webpack 构建的周期中；

loader 他可以用独立的运行环境;

plugins 不行，他必须编写好这个 plugin 之后在 webpack 构建中将 plugin 放在 plugins 的数组中执行

## loader

[https://webpack.docschina.org/api/loaders/](https://webpack.docschina.org/api/loaders/)

`webpack` 只能理解 `JavaScript` 和 `JSON` 文件。`loader` 让 `webpack` 能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖图中

`loader` 就是一个 `node` 模块，`loader` 导出一个函数，`loader` 会在转换源模块`resource`的时候调用该函数。在这个函数内部，我们可以通过传入 `this `上下文给 [Loader API](https://webpack.docschina.org/api/loaders/) 来使用它们。最终装换成可以直接引用的模块



由于 Loader 运行在 Node.js 中，你可以调用任何 Node.js 自带的 API，或者安装第三方模块进行调用

### 1.书写loader

```js
module.exports = function(source) {
  // source 为 compiler 传递给 Loader 的一个文件的原内容
  // 该函数需要返回处理后的内容，这里简单起见，直接把原内容返回了，相当于该 Loader 没有做任何转换
  return source;
};
```

> 注意：如果是处理顺序排在最后一个的 `loader`，那么它的返回值将最终交给 `webpack` 的 `require`，换句话说，它一定是一段可执行的` JS` 脚本 （用字符串来存储）

```js
// xml-loader.js
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

module.exports =  function(source) {
  this.cacheable && this.cacheable();
  const self = this;
  parser.parseString(source, function (err, result) {
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
    
    // return JSON.stringify(result) // 报错Module build failed: Error: Final loader (./src/loader/xml-loader.js) didn't return a Buffer or String
  });
};
```

### 2.获取loader的options——loader-utils

```js
npm install loader-utils
```

```js
const loaderUtils = require('loader-utils');
module.exports = function(source) {
  // 获取到用户给当前 Loader 传入的 options
  const options = loaderUtils.getOptions(this);
  return source;
};
```

### 3.webpack中本地加载此loader验证

```js
{
  test: /\.xml$/,
    use: [
      {
        loader:path.resolve('./src/loader/xml-loader.js') // 单独此去文件中找
      }
    ]
}
```

```js
module: {
  rules: [{
    test: /\.xml$/,
      use: [
        'xml-loader'
      ]
  }]
},
resolveLoader: {
    // 去哪些目录下寻找 Loader，有先后顺序之分
    modules: ['node_modules',path.join(__dirname, '/src/loader')]
},
```

### 4.处理二进制数据

### 5.同步与异步

[手把手教你写一个 Webpack Loader](https://segmentfault.com/a/1190000018980814)

### 6.测试--- 使用npm link即可


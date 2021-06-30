# webpack loader

loader 主要的是处理静态资源，而 plugins 是可以贯穿在整个 webpack 构建的周期中；

loader 他可以用独立的运行环境;

plugins 不行，他必须编写好这个 plugin 之后在 webpack 构建中将 plugin 放在 plugins 的数组中执行

## loader

[https://webpack.docschina.org/api/loaders/](https://webpack.docschina.org/api/loaders/)

[官方书写一个loader](https://webpack.docschina.org/contribute/writing-a-loader/)

[手把手教你写一个 Webpack Loader](https://segmentfault.com/a/1190000018980814)

[webpack 的 loader 和 plugin 开发的方法](https://juejin.cn/post/6972756491715477541?utm_source=gold_browser_extension)


`webpack` 只能理解 `JavaScript` 和 `JSON` 文件。`loader` 让 `webpack` 能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖图中

`loader` 就是一个 `node` 模块，`loader` 导出一个函数，`loader` 会在转换源模块`resource`的时候调用该函数。在这个函数内部，我们可以通过传入 `this `上下文给 [Loader API](https://webpack.docschina.org/api/loaders/) 来使用它们。最终装换成可以直接引用的模块



由于 Loader 运行在 Node.js 中，你可以调用任何 Node.js 自带的 API，或者安装第三方模块进行调用

loader 本质上是导出为函数的 JavaScript 模块。[loader runner](https://github.com/webpack/loader-runner) 会调用此函数，然后将上一个 loader 产生的结果或者资源文件传入进去。函数中的 `this` 作为上下文会被 webpack 填充，并且 [loader runner](https://github.com/webpack/loader-runner) 中包含一些实用的方法，比如可以使 loader 调用方式变为异步，或者获取 query 参数。

起始 loader 只有一个入参：资源文件的内容。compiler 预期得到最后一个 loader 产生的处理结果。这个处理结果应该为 `String` 或者 `Buffer`（能够被转换为 string）类型，代表了模块的 JavaScript 源码。另外，还可以传递一个可选的 SourceMap 结果（格式为 JSON 对象）。

如果是单个处理结果，可以在 [同步模式](https://webpack.docschina.org/api/loaders/#synchronous-loaders) 中直接返回。如果有多个处理结果，则必须调用 `this.callback()`。在 [异步模式](https://webpack.docschina.org/api/loaders/#asynchronous-loaders) 中，必须调用 `this.async()` 来告知 [loader runner](https://github.com/webpack/loader-runner) 等待异步结果，它会返回 `this.callback()` 回调函数。随后 loader 必须返回 `undefined` 并且调用该回调函数。



loader应该只做一个简单的任务。这不仅使得维护每个loader更容易，而且更方便链式调用；

### loader的链式调用

```js
// 此要注意先执行foo-loader，再用foo-loader的输出作为bar-loader的输入进行处理
// foo-loader将被传递原始资源，而bar-loader将接收到foo-loader的输出，并返回最终转换后的模块和一个源映射(如果需要的话)。
rules: [
  {
    test: /\.js/,
    use: ['bar-loader', 'foo-loader'],
  },
],
```

### 书写loader

```js
module.exports = function(source) {
  // source 为 compiler 传递给 Loader 的一个文件的原内容
  // 该函数需要返回处理后的内容，这里简单起见，直接把原内容返回了，相当于该 Loader 没有做任何转换
  return source;
};
```

> 注意：如果是处理顺序排在最后一个的 `loader`（同一个rules里面），那么它的返回值将最终交给 `webpack` 的 `require`，换句话说，它一定是一段可执行的` JS` 脚本 （用字符串来存储）

```js
// xml-loader.js
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

module.exports =  function(source) {
  this.cacheable && this.cacheable();
  const self = this;
  parser.parseString(source, function (err, result) {
    self.callback(err, !err && "module.exports = " + JSON.stringify(result));
};
```

### loader的返回值

**返回值可以有一个或者两个，第一个是string类型或者buffer类型的js 代码，第二个是一个sourceMap的js对象；**



* 简单的同步loader就使用`return`返回

* 通常复杂点的loader返回回调函数`this.callback(err, values...)`

* 异步的loader需要使用`this.async()`

  同步的 Loader，因为它们的转换流程都是同步的，转换完成后再返回结果。 但在有些场景下转换的步骤只能是异步完成的，例如你需要通过网络请求才能得出结果，如果采用同步的方式网络请求就会阻塞整个构建，导致构建非常缓慢。

  在转换步骤是异步时，你可以这样：

  ```js
  module.exports = function(source) {
      // 告诉 Webpack 本次转换是异步的，Loader 会在 callback 中回调结果
      var callback = this.async();
      someAsyncOperation(source, function(err, result, sourceMaps, ast) {
          // 通过 callback 返回异步执行后的结果
          callback(err, result, sourceMaps, ast);
      });
  };
  ```

  > loader 最初被设计为可以在同步 loader pipelines（如 Node.js ，使用 [enhanced-require](https://github.com/webpack/enhanced-require))，*以及* 在异步 pipelines（如 webpack）中运行。然而，由于同步计算过于耗时，在 Node.js 这样的单线程环境下进行此操作并不是好的方案，我们建议尽可能地使你的 loader 异步化。但如果计算量很小，同步 loader 也是可以的。

### this.callback

```js
this.callback(
  err: Error | null,
  content: string | Buffer,
  sourceMap?: SourceMap,
  meta?: any
);
```

1. 第一个参数必须是 `Error` 或者 `null`
2. 第二个参数是一个 `string` 或者 [`Buffer`](https://nodejs.org/api/buffer.html)。
3. 可选的：第三个参数必须是一个可以被 [this module](https://github.com/mozilla/source-map) 解析的 source map。
4. 可选的：第四个参数，会被 webpack 忽略，可以是任何东西（例如一些元数据）

### 获取loader的options——loader-utils

`this.getOptions(schema)` 接受一个可选的 JSON schema 作为参数

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

从 webpack 5 开始，`this.getOptions` 可以获取到 loader 上下文对象。它用来替代来自 [loader-utils](https://github.com/webpack/loader-utils#getoptions) 中的 `getOptions` 方法:

```js
module.exports = function(source) {
  // 获取到用户给当前 Loader 传入的 options
  const options = this.getOptions();
  return source;
};
```



### webpack中本地加载此loader验证

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

### 处理二进制数据

默认情况下，资源文件会被转化为 UTF-8 字符串，然后传给 loader。通过设置 `raw` 为 `true`，loader 可以接收原始的 `Buffer`。每一个 loader 都可以用 `String` 或者 `Buffer` 的形式传递它的处理结果。complier 将会把它们在 loader 之间相互转换。

```js
module.exports = function(source) {
    assert(content instanceof Buffer);
    return someSyncOperation(content);
    // 返回值也可以是一个 `Buffer`
    // 即使不是 "raw"，loader 也没问题
};
// 通过 exports.raw 属性告诉 Webpack 该 Loader 是否需要二进制数据 
module.exports.raw = true;
```

以上代码中最关键的代码是最后一行` module.exports.raw = true;`，没有该行 Loader 只能拿到字符串。

### 缓存加速

在有些情况下，有些转换操作需要大量计算非常耗时，如果每次构建都重新执行重复的转换操作，构建将会变得非常缓慢。 为此，Webpack 会默认缓存所有 Loader 的处理结果，也就是说在需要被处理的文件或者其依赖的文件没有发生变化时， 是不会重新调用对应的 Loader 去执行转换操作的

```js
module.exports = function(source) {
  // 开启缓存
  this.cacheable && this.cacheable();
  // 关闭缓存
  this.cacheable(false);
  return source
}
```

### 模块依赖

css中存在`@import`和`url(...)`。这种可以采用：

* 都转成`require`声明
* 使用`this.resolve`来解析他们的路径

此段来自[官方文档module-dependencies](https://webpack.docschina.org/contribute/writing-a-loader/#module-dependencies)没有完全理解咋写，后续再研究

### peerDependency

如果你正在处理的loader是另一个包的简单包装器，那么你应该把这个包作为peerDependency包含进来。这种方法允许应用程序开发人员在包中指定确切的版本;

比如`sass-loader`  依赖`node-sass`

```js
{
  "peerDependencies": {
    "node-sass": "^4.0.0"
  }
}
```

### `this.addDependency`

```js
addDependency(file: string)
dependency(file: string) // shortcut
```

加入一个文件作为产生 loader 结果的依赖，使它们的任何变化可以被监听到。例如，[`sass-loader`](https://github.com/webpack-contrib/sass-loader), [`less-loader`](https://github.com/webpack-contrib/less-loader) 就使用了这个技巧，当它发现无论何时导入的 `css` 文件发生变化时就会重新编译。

### 测试--- 使用npm link即可


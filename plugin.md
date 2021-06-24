# webpack插件

**参考**：

[Webpack5.0学习总结-进阶篇](https://juejin.cn/post/6975321674015047693?utm_source=gold_browser_extension#heading-15)
[webpack插件怎么手写](https://blog.csdn.net/wade3po/article/details/108493825)
[官方教程-编写一个插件](https://www.webpackjs.com/contribute/writing-a-plugin/)
[webpack06----自定义babel-loader、tapable、compiler的hooks使用、compilation的使用、自定义copy-webpack-plugin插件、自定义webpack](https://www.cnblogs.com/wuqilang/p/13962210.html)

Webpack的打包过程就像一个产品的流水线，按部就班地执行一个又一个环节。而插件就是在这条流水线各个阶段插入的额外功能，Webpack以此来扩展自身的功能


创建插件比创建 loader 更加高级，因为你将需要理解一些 webpack 底层的内部特性来做相应的钩子，所以做好阅读一些源码的准备


webpack本质上是一种事件流机制，核心就是tapable，通过注册事件，触发回调，完成插件在不同生命周期的调用，内部也是通过大量的插件实现的。tapable内部暴露的方法挺多的，主要就是同步和异步，异步分为并行和串行

插件能够 钩入(hook) 到在每个编译(compilation)中触发的所有关键事件。在编译的每一步，插件都具备完全访问 compiler 对象的能力，如果情况合适，还可以访问当前 compilation 对象

## Tapable工具类
[Tapable 工具类](https://github.com/webpack/tapable)
[官方文档](https://www.webpackjs.com/api/plugins/#tapable)

```js
const {
	SyncHook, // 同步钩子（hook），任务会依次执行
	SyncBailHook, // 一旦有返回值就会退出
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncParallelHook,
	AsyncParallelBailHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncSeriesWaterfallHook
 } = require("tapable")
```



## compiler对象
代表了完整的webpakc环境配置，可以访问整个环境。此对象在启动webpack时被创建；同时该对象也会被传入一些可控的配置，如 Options、Loaders、Plugins。当插件被实例化的时候，会收到一个 Compiler 对象，通过这个对象可以访问 Webpack 的内部环境。


## compilation
compilation 对象代表了一次资源版本构建。在运行过程中，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation提供了很多关键时机的回调供插件做自定义处理时使用

compilation，里面有assets是静态资源，可以进行操作；

> 关于提供的hook和参数，可以在webpack>lib>Compiler.js搜hooks，其实compiler和compilation都是继承tapable。
## 插件
插件其实就是一个类（构造函数或者class类），内部在prototype定义一个apply方法（会直接调用），并提供compiler，通过compiler提供的hooks注册事件和在相应的回调里面进行操作。而compiler提供的compilation的重要属性是assets，表示所有的静态资源

webpack 插件由以下组成
* 一个 JavaScript 命名函数。
* 在插件函数的 prototype 上定义一个 apply 方法。
* 指定一个绑定到 webpack 自身的事件钩子。
* 处理 webpack 内部实例的特定数据。
* 功能完成后调用 webpack 提供的回调。
## 已有插件探究
### 1.clean-webpack-plugin

```js

    apply(compiler: Compiler) {
        // ...
        this.outputPath = compiler.options.output.path;
        const hooks = compiler.hooks;

        if (this.cleanOnceBeforeBuildPatterns.length !== 0) {
            hooks.emit.tap('clean-webpack-plugin', (compilation) => { // 编译前
                this.handleInitial(compilation);
            });
        }

        hooks.done.tap('clean-webpack-plugin', (stats) => { // 编译完成后
            this.handleDone(stats);
        });
    }
```

### 2.html-webpack-plugin

```js
 compiler.hooks.initialize.tap('HtmlWebpackPlugin', () => {
      const userOptions = this.userOptions;

      // Default options
      /** @type {ProcessedHtmlWebpackOptions} */
      const defaultOptions = {
        // ...
      };

      /** @type {ProcessedHtmlWebpackOptions} */
      const options = Object.assign(defaultOptions, userOptions);
      this.options = options;

      //...

      // Hook all options into the webpack compiler
      entryOptions.forEach((instanceOptions) => {
        hookIntoCompiler(compiler, instanceOptions, this);
      });
 })


/**
 * connect the html-webpack-plugin to the webpack compiler lifecycle hooks
 *
 * @param {import('webpack').Compiler} compiler
 * @param {ProcessedHtmlWebpackOptions} options
 * @param {HtmlWebpackPlugin} plugin
 */
function hookIntoCompiler (compiler, options, plugin) {
  const webpack = compiler.webpack;
  // ...
  compiler.hooks.thisCompilation.tap('HtmlWebpackPlugin',
    /**
       * Hook into the webpack compilation
       * @param {WebpackCompilation} compilation
      */
    (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: 'HtmlWebpackPlugin',
          stage:
          /**
           * Generate the html after minification and dev tooling is done
           */
          webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE
        },
        /**
         * Hook into the process assets hook
         * @param {WebpackCompilation} compilationAssets
         * @param {(err?: Error) => void} callback
         */
        (compilationAssets, callback) => {
            //...
        })
    })
}
```

### 3.copy-webpack-plugin
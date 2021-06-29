# webpack插件

**参考**：

[webpack5变更官方说明](https://webpack.docschina.org/blog/2020-10-10-webpack-5-release/)
[Webpack5.0学习总结-进阶篇](https://juejin.cn/post/6975321674015047693?utm_source=gold_browser_extension#heading-15)
[webpack插件怎么手写](https://blog.csdn.net/wade3po/article/details/108493825)
[官方教程-编写一个插件](https://www.webpackjs.com/contribute/writing-a-plugin/)
[webpack06----自定义babel-loader、tapable、compiler的hooks使用、compilation的使用、自定义copy-webpack-plugin插件、自定义webpack](https://www.cnblogs.com/wuqilang/p/13962210.html)
[Webpack原理-编写Plugin](https://segmentfault.com/a/1190000012840742)
[输出结果 配置_从webpack配置工程师走向开发工程师进阶](https://blog.csdn.net/weixin_36285826/article/details/112590904)

Webpack的打包过程就像一个产品的流水线，按部就班地执行一个又一个环节。而插件就是在这条流水线各个阶段插入的额外功能，Webpack以此来扩展自身的功能


创建插件比创建 loader 更加高级，因为你将需要理解一些 webpack 底层的内部特性来做相应的钩子，所以做好阅读一些源码的准备


webpack本质上是一种事件流机制，核心就是tapable，通过注册事件，触发回调，完成插件在不同生命周期的调用，内部也是通过大量的插件实现的。tapable内部暴露的方法挺多的，主要就是同步和异步，异步分为并行和串行

插件能够 钩入(hook) 到在每个编译(compilation)中触发的所有关键事件。在编译的每一步，插件都具备完全访问 compiler 对象的能力，如果情况合适，还可以访问当前 compilation 对象

## Tapable工具类
[Tapable 工具类github](https://github.com/webpack/tapable)
[官方文档](https://www.webpackjs.com/api/plugins/#tapable)



Tapable的核心功能就是依据不同的钩子将注册的事件在被触发时按序执行。

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

**hook 类型**：
* Basic hook：按照事件注册顺序，依次执行`handler`，`handler`之间互不干扰
* Waterfall： 瀑布；按照事件注册顺序，依次执行`handler`，前一个`handler`的返回值将作为下一个`handler`的入参
* Bail：按照事件注册顺序，依次执行`handler`，若其中任一`handler`返回值不为`undefined`，则剩余的`handler`均不会执行；（一旦有返回值就会退出）
* Loop：按照事件注册顺序，依次执行`handler`，若任一`handler`的返回值不为`undefined`，则该事件链再次**从头**开始执行，直到所有`handler`均返回`undefined`

**hook分类**：
* Sync：同步。一般就是使用`myHook.tap()`
* AsyncSeries: 串行用，可以使用`myHook.tap()`, `myHook.tapAsync()` 和 `myHook.tapPromise()`
* AsyncParallel:并行用，可以使用`myHook.tap()`, `myHook.tapAsync()` 和 `myHook.tapPromise()`

## webpack工作流程

Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
2. 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；
3. 确定入口：根据配置中的 entry 找出所有的入口文件；
4. 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
5. 完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

![image-20210629203318745](/Users/tlm/Documents/web-front/test/keep-study/webpack-box/webpack-restart/typora-image/image-20210629203318745.png)

在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果;


## compiler对象
代表了完整的webpakc环境配置，可以访问整个环境。此对象在启动webpack时被创建；同时该对象也会被传入一些可控的配置，如 Options、Loaders、Plugins。当插件被实例化的时候，会收到一个 Compiler 对象，通过这个对象可以访问 Webpack 的内部环境。

**complier钩子**：
* entryOption：在 entry 配置项处理过之后，执行插件
* thisCompilation：触发 compilation 事件之前执行
* compilation：编译(compilation)创建之后，执行插件
* emit: 生成资源到 output 目录之前；在 `emit` 事件发生时，代表源文件的转换和组装已经完成，在这里可以读取到最终将输出的资源、代码块、模块及其依赖，并且可以修改输出资源的内容
* afterEmit:生成资源到 output 目录之后
* done: 编译(compilation)完成
* failed: 编译(compilation)失败



`compiler.options`中包含所有的webpack配置。

```js
// 当前配置所有使用的插件列表  
const plugins = compiler.options.plugins; 
```

## compilation
compilation 对象代表了一次资源版本构建。在运行过程中，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation提供了很多关键时机的回调供插件做自定义处理时使用

compilation，里面有assets是静态资源，可以进行操作；

Compilation 模块会被 Compiler 用来创建新的编译（或新的构建）。compilation 实例能够访问所有的模块和它们的依赖（大部分是循环依赖）。它会对应用程序的依赖图中所有模块进行字面上的编译(literal compilation)。在编译阶段，模块会被加载(loaded)、封存(sealed)、优化(optimized)、分块(chunked)、哈希(hashed)和重新创建(restored)

[官方API](https://www.webpackjs.com/api/compilation-hooks/)

在webpack/type.d.ts中可以看到compilation和compiler的hooks定义；具体代码需要读源码；

> 关于提供的hook和参数，可以在webpack>lib>Compiler.js搜hooks，其实compiler和compilation都是继承tapable。
***

Compiler 和 Compilation 的区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。

## 插件
插件其实就是一个类（构造函数或者class类），内部在prototype定义一个apply方法（会直接调用），并提供compiler，通过compiler提供的hooks注册事件和在相应的回调里面进行操作。而compiler提供的compilation的重要属性是assets，表示所有的静态资源

webpack 插件由以下组成
* 一个 JavaScript构造函数或者class类。

* 在插件函数的 prototype 上定义一个 apply 方法。

* 指定一个绑定到 webpack 自身的事件钩子。

* 处理 webpack 内部实例的特定数据。

* 功能完成后调用 webpack 提供的回调。

  

一个基本的插件写法：

```js
// my-plugin.js
class MyPlugin{
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options){
    this.options = options
  }
  
  // Webpack 会调用 MyPlugin 实例的 apply 方法给插件实例传入 compiler 对象
 apply(compiler){
   			/* 在 hook 被触及时，会将 stats 作为参数传入。 */
        compiler.hooks.done.tap('MyPlugin', (stats) => {
            // stats中有compilation对象，endTime、startTime、hash
            // stats.startTime；stats.endTime 时间戳；
            // stats.hash e016b7f067c2f2cf6b5c
          	console.log('MyPlugin ', this.options);
        });
    }
}

// 导出 Plugin
module.exports = MyPlugin;
```

使用：

```js
const MyPlugin = require('./my-plugin.js');
module.export = {
  plugins:[
    new MyPlugin(options),
  ]
}
```



在开发插件时，你可能会不知道该如何下手，因为你不知道该监听哪个事件才能完成任务。

**[在开发插件时，还需要注意以下两点](https://segmentfault.com/a/1190000012840742)：**

- 只要能拿到 Compiler 或 Compilation 对象，就能广播出新的事件，所以在新开发的插件中也能广播出事件，给其它插件监听使用。

- 传给每个插件的 Compiler 和 Compilation 对象都是同一个引用。也就是说在一个插件中修改了 Compiler 或 Compilation 对象上的属性，会影响到后面的插件。

- 有些事件是异步的，这些异步的事件会附带两个参数，第二个参数为回调函数，在插件处理完任务时需要调用回调函数通知 Webpack，才会进入下一处理流程

  ```js
   apply(compiler) {
     compiler.hooks.done.tapAsync('MyAsyncPlugin',(stats,callback) => {
       // 异步的事件会附带两个参数，第二个参数为回调函数
       console.log('Hello ', this.options.title);
  
       setTimeout(() => {console.log(1);}, 1000);
  
       setTimeout(() => {
         callback();
       }, 2000)
     })
   }
  ```

  

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

获取hooks，就是这个插件暴露出去的getHooks，即组件上自定义的hooks：

>  [webpack5变化之—冻结钩子对象](https://webpack.docschina.org/blog/2020-10-10-webpack-5-release/#hook-object-frozen)

> 有 `hooks` 的类会冻结其 `hooks` 对象，所以通过这种方式添加自定义钩子已经不可能了。
>
> **迁移**：推荐的添加自定义钩子的方式是使用 WeakMap 和一个静态的 `getXXXHooks(XXX)`(即`getCompilationHook(compilation)`)方法。内部类使用与自定义钩子相同的机制]

```js
/**
 * @type {WeakMap<WebpackCompilation, HtmlWebpackPluginHooks>}}
 */
const htmlWebpackPluginHooksMap = new WeakMap();

/**
 * Returns all public hooks of the html webpack plugin for the given compilation
 *
 * @param {WebpackCompilation} compilation
 * @returns {HtmlWebpackPluginHooks}
 */
function getHtmlWebpackPluginHooks (compilation) {
  let hooks = htmlWebpackPluginHooksMap.get(compilation);
  // Setup the hooks only once
  if (hooks === undefined) {
    hooks = createHtmlWebpackPluginHooks();
    htmlWebpackPluginHooksMap.set(compilation, hooks);
  }
  return hooks;
}

/**
 * Add hooks to the webpack compilation object to allow foreign plugins to
 * extend the HtmlWebpackPlugin
 *
 * @returns {HtmlWebpackPluginHooks}
 */
function createHtmlWebpackPluginHooks () {
  return {
    beforeAssetTagGeneration: new AsyncSeriesWaterfallHook(['pluginArgs']),
    alterAssetTags: new AsyncSeriesWaterfallHook(['pluginArgs']),
    alterAssetTagGroups: new AsyncSeriesWaterfallHook(['pluginArgs']),
    afterTemplateExecution: new AsyncSeriesWaterfallHook(['pluginArgs']),
    beforeEmit: new AsyncSeriesWaterfallHook(['pluginArgs']),
    afterEmit: new AsyncSeriesWaterfallHook(['pluginArgs'])
  };
}
```

### 3.copy-webpack-plugin

```js
apply(compiler) {
    const pluginName = this.constructor.name;
    const limit = pLimit(this.options.concurrency || 100);

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      const logger = compilation.getLogger("copy-webpack-plugin");
      const cache = compilation.getCache("CopyWebpackPlugin");

      compilation.hooks.processAssets.tapAsync(
        {
          name: "copy-webpack-plugin",
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        async (unusedAssets, callback) => {
          logger.log("starting to add additional assets...");
          // ...
        })
    }
}
```



## 4.webpack-bundle-analyzer

```js
 if (compiler.hooks) {
   compiler.hooks.done.tapAsync('webpack-bundle-analyzer', done); // 监听done事件
 } else {
   compiler.plugin('done', done); // webpack4使用
 }
```



## 5.InterpolateHtmlPlugin(新框架中的插件)

所有的配置都会传递给 `InterpolateHtmlPlugin` 插件，可在 `index.ejs` 中使用。使用方式： `%publicPath%`。并且可添加自定义内容：`[key: string]: any`

```js
const escapeStringRegexp = require('escape-string-regexp')

class InterpolateHtmlPlugin {
  constructor(htmlWebpackPlugin, replacements) {
    this.htmlWebpackPlugin = htmlWebpackPlugin
    this.replacements = replacements
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('InterpolateHtmlPlugin', compilation => {
      this.htmlWebpackPlugin
        .getHooks(compilation) // htmlWebpackPlugin的方法
      	// afterTemplateExecution为htmlWebpackPlugin自定义的hook
      	/**
      	afterTemplateExecution: AsyncSeriesWaterfallHook<{
          html: string;
          headTags: HtmlTagObject[];
          bodyTags: HtmlTagObject[];
          outputName: string;
          plugin: HtmlWebpackPlugin;
        }>;
      	**/
        .afterTemplateExecution.tap('InterpolateHtmlPlugin', data => {
          Object.keys(this.replacements).forEach(key => {
            const value = this.replacements[key]
            data.html = data.html.replace(
              new RegExp(`%${escapeStringRegexp(key)}%`, 'g'),
              value,
            )
          })
        })
    })
  }
}

module.exports = InterpolateHtmlPlugin
```

调用：

```js
new InterpolateHtmlPlugin(HtmlWebpackPlugin, defaultConfig)
```


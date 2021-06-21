# webpack插件

**参考**：

[Webpack5.0学习总结-进阶篇](https://juejin.cn/post/6975321674015047693?utm_source=gold_browser_extension#heading-15)

Webpack的打包过程就像一个产品的流水线，按部就班地执行一个又一个环节。而插件就是在这条流水线各个阶段插入的额外功能，Webpack以此来扩展自身的功能

## 1.Tapable工具类
[Tapable 工具类](https://github.com/webpack/tapable)
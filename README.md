[指南](https://v4.webpack.docschina.org/guides/getting-started/)

[webpack5发布指南](https://webpack.docschina.org/blog/2020-10-10-webpack-5-release/)

[从 v4 升级到 v5](https://webpack.docschina.org/migrate/5/)

# 1.webpack安装

* webpack4+中webpack和webpack-cli两个包分开，需要都安装
* 可以通过移除package.json中的main来防止意外发布你的代码
* Package.json中增加`private:true`，确保[安装包是私有的](https://v4.webpack.docschina.org/guides/getting-started/)？
* npm文档[package-json](https://docs.npmjs.com/cli/v7/configuring-npm/package-json)
* 没有webpack.config.js配置时，使用`npx webpack`会将我们的脚本 `src/index.js` 作为 [入口起点](https://v4.webpack.docschina.org/concepts/entry-points)，也会生成 `dist/main.js` 作为 [输出](https://v4.webpack.docschina.org/concepts/output)

# 2.资源管理

* 加载css：

  ```bash
  npm install --save-dev style-loader css-loader
  ```

  ```js
   module: {
     rules: [
       {
         test: /\.css$/,
         use: [
           'style-loader',
           'css-loader'
         ]
       }
     ]
   }
  ```

  css相关的loader：postcss、sass、less
  
* 加载images图像

  ```bash
  npm install --save-dev file-loader
  ```

  ```js
  {
      test: /\.(png|svg|jpg|gif)$/,
      use: ['file-loader']
  }
  ```

  file-loader将图片处理，在 `import MyImage from './my-image.png'` 时，此图像将被处理并添加到 `output` 目录，_并且_ `MyImage` 变量将包含该图像在处理后的最终 url；css-loader会处理css中的url('./my-image.png')；html-loader会处理html中的`<img src="./my-image.png" />`

* 加载fonts字体

  使用`url-loader`和`file-loader`可以接收并加载任何文件，将其输出到构建目录

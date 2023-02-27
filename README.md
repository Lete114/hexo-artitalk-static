# Hexo-Artitalk-Static

Artitalk 静态版，本地编写说说(就像写文章一样)，需要 `hexo g` 生成 ~~(不会有人天天发说说吧？)~~

## Installation

```bash
npm install hexo-artitalk-static
```

## Usage

在你的博客根目录的 `source/_data` 创建文件 `artitalk.yml`。 以后你的所有说说都会写在这里面

```yml
## 说说格式
- content: Hexo-Artitalk-Static 真不错，没有后端，没有请求，速度是真的快
- content: |
    如果你的 JavaScript 基础还不错
    你还可以为 Hexo-Artitalk-Static 写自定义插件，还可以自定义说说的模板
    自由度是真的高(也可以安装别人的插件)
```

> 以上方式不会自动实时生成说说的时间，只有在执行了 `hexo s` 或 `hexo g` 的时候才会自动生成说说的时间 (而且是当前执行这个命令的时间，并不是你写说说的时间)

你可以在写说说前执行 `hexo s` 命令，然后再打开 `source/_data/artitalk.yml` 编写新说说，这样它才会实时生成说说的时间

## Configuration

配置信息

```yaml
artitalk:
  enable: true
  title: Artitalk ## 标题
  path: artitalk/index.html ## 生成路径
  pageSize: 5 ## 显示几条说说
  avatar: ## 说说头像
  plugins: [] ## 插件，具体请看下文
  template: ## 说说模板，可查看仓库中的 main.ejs
  imports: ## 在说说模板的开头和结尾处插入内容
    before:
      -
    after:
      -
    # - <link rel="stylesheet" href="/css/index.css">
    # - '<style>body{color: red}</style>' ## 注意由于css的‘{}’是关键符号所以需要(单/双)引号''
    # - <script>alert(1)</script>
```

### Plugins

是一个数组，可以传入多个 js 文件路径，建议是绝对路径，如果是相对路径的话，那么它因该是相对于 hexo 的根目录

举例：自定义插件使得 Hexo-Artitalk-Static 支持 markdown 语法

在 hexo 根目录创建 `artitalk_plugins/markdown.js`，并安装解析 markdown 的第三方库，这里以 [marked](https://marked.js.org/) 作为演示 `npm i marked`

```js
// artitalk_plugins/markdown.js
const marked = require('marked')

/**
 * @param {{content:string,timestamp:number}[]} atData
 */
module.exports = (atData) => {
  for (const item of atData) {
    // 关于 marked 的可选参数以及代码高亮可以查看官网: https://marked.js.org/using_advanced#highlight
    // 或自己上网搜索解决
    item.content = marked(item.content)
  }
}
```

然后再 hexo 的配置文件中的 artitlk.plugins 数组中加上路径(一下配置只是演示，其它配置信息已省略)

```yaml
artitalk:
  enable: true
  plugins: ['artitalk_plugins/markdown.js']
```

当你自己写完一个插件后，你也可以分享给其它人使用，例如发布一个 npm 包让别人安装

包名建议命名为 `hexo-artitalk-static-xxx` (如上 markdown 插件 `hexo-artitalk-static-markdown`)

当别人安装你的插件后 `npm install hexo-artitalk-static-markdown` 在 artitlk.plugins 填写路径

```yaml
artitalk:
  enable: true
  plugins: ['node_modules/hexo-artitalk-static-markdown']
```

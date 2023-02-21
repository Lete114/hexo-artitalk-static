const { join } = require('path')
const ejs = require('ejs')
const YAML = require('yaml')
const { readFileSync } = require('hexo-fs')
const { getAbsolutePath, formatDate, getArtitalkFilePath, autoInjectTime, plugins } = require('./utils')

const logo = 'data:image/svg+xml;base64,' + Buffer.from(readFileSync(join(__dirname, 'logo.min.svg'))).toString('base64')

const defaultConfig = {
  enable: true,
  title: 'Artitalk',
  pageSize: 5,
  plugins: [],
  imports: { before: [], after: [] }
}
hexo.extend.generator.register('artitalk', async (locals) => {
  const { enable, title, pageSize, plugins: plugins_path, template, imports } = Object.assign({}, hexo.config.artitalk, defaultConfig)
  if (!enable) return

  const atFilePath = getArtitalkFilePath(hexo.source_dir)

  const atContent = readFileSync(atFilePath).toString()
  autoInjectTime(atFilePath, atContent)
  const atData = YAML.parse(atContent) || locals.data.artitalk || []
  plugins(hexo.base_dir, plugins_path, atData)

  const data = {
    formatDate,
    data: { logo, pageSize, avatar: defaultConfig.avatar, imports },
    artitalk: atData
  }

  const filename = getAbsolutePath(hexo.base_dir, template) || join(__dirname, 'main.ejs')
  const content = await ejs.renderFile(filename, data)

  return {
    path: 'artitalk.html',
    data: { type: 'artitalk', content, title },
    comments: false,
    layout: ['artitalk', 'page']
  }
})

const { join, isAbsolute } = require('path')
const { existsSync, writeFileSync } = require('hexo-fs')
const YAML = require('yaml')

function getAbsolutePath(base_dir, path) {
  if (!path) return
  return isAbsolute(path) ? template : join(base_dir, path)
}

function formatDate(nowDate) {
  const timeFormat = (time) => (time < 10 ? '0' + time : time)
  nowDate = /^\d+$/ ? new Date(nowDate) : nowDate
  const resDate = `${nowDate.getFullYear()}/${timeFormat(nowDate.getMonth() + 1)}/${timeFormat(nowDate.getDate())}`
  const resTime = `${timeFormat(nowDate.getHours())}:${timeFormat(nowDate.getMinutes())}:${timeFormat(nowDate.getSeconds())}`
  return `${resDate} ${resTime}`
}

function getArtitalkFilePath(source_dir) {
  let artitalkFilePath = join(source_dir, '_data/artitalk.yaml')
  artitalkFilePath = existsSync(artitalkFilePath) ? artitalkFilePath : artitalkFilePath.replace(/\.yaml$/, '.yml')
  if (!existsSync(artitalkFilePath)) writeFileSync(artitalkFilePath, '')
  return artitalkFilePath
}

/**
 *
 * @param {YAML.ParsedNode} node
 */
function addTimeComment(node) {
  if (YAML.isMap(node)) {
    if (node.items.length === 1) {
      const doc = new YAML.Document(new YAML.YAMLSeq())
      node.items.push(doc.createPair('timestamp', Date.now()))
    }

    node.items.forEach((item) => {
      if (item.key.value === 'timestamp') {
        item.value.value = item.value.value ? item.value.value : Date.now()
        const date = new Date(item.value.value)
        item.value.comment = ' ' + formatDate(date)
      }
    })
  } else if (YAML.isSeq(node)) {
    node.items.forEach(addTimeComment)
  }
}

function autoInjectTime(atFilePath, atContent) {
  const doc = YAML.parseDocument(atContent)
  addTimeComment(doc.contents)

  const newArtitalkContent = doc.toString()
  if (atContent !== newArtitalkContent && newArtitalkContent.trim() !== 'null') {
    writeFileSync(atFilePath, newArtitalkContent)
  }
}

/**
 *
 * @param {string} base_dir
 * @param {string|string[]} plugins_path
 * @param {{content:string,timestamp:number}[]} atData
 */
function plugins(base_dir, plugins_path, atData) {
  if (!plugins_path) return
  plugins_path = Array.isArray(plugins_path) ? plugins_path : [plugins_path]
  plugins_path.forEach((plugin_path) => {
    try {
      console.log('plugin_path', plugin_path)
      plugin_path = getAbsolutePath(base_dir, plugin_path)
      require(plugin_path)(atData)
    } catch (error) {
      console.error(error)
    }
  })
}
module.exports = { getAbsolutePath, formatDate, getArtitalkFilePath, addTimeComment, autoInjectTime, plugins }

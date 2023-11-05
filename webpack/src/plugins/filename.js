// 生成一个新的md文档，里面放着所有的文件名
class FilesPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    // compiler 要启动一次新的编译
    // 你在哪监听这个事件
    compiler.hooks.emit.tapAsync("EmitPlugin", (compilation, callback) => {
      let content = `## 文件列表\n\n`
      const assets = compilation.assets
      for (let path in assets) {
        content += `-- ${path}\n\n`
      }
      compilation.assets[this.options.filename || 'filelist.md'] = {
        source() {
          return content
        },
        size() {
          return Buffer.byteLength(content)
        }
      }
      callback()
    })

  }
}
module.exports = FilesPlugin

function name() {
  return new Promise((resolve, reject) => {

    resolve(setTimeout(() => console.log(78), 2000))
  })
}
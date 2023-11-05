const HtmlWebpackPlugin = require('html-webpack-plugin');
class InlinePlugin {
  apply(compiler) {
    // 1. 拿到compilation
    //2. 监听htmlwebapck插件的标签挂载前的事件， 这个要去看文档
    compiler.hooks.compilation.tap('compilation', function (compilation) {
      //compilation上面有别人添加的事件也有自己内部嵌套的， 我们监听别人的事件的时候， 就要看看人家的文档
      // 这里还是有问题的，具体的之后再看
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync("changeTag", async (data, callback) => {
        const body = data.body
        body.forEach(bodyTag => {
          // 在这里bodyTag是一个对象，类似虚拟dom，我们可以随意加属性，这并不是dom元素，只是一个js对象，渲染的时候会变成dom
          const src = bodyTag.attribute.src
          delete bodyTag.attribute.src
          const source = compilation.assets[src].source()
          delete compilation.assets[src]
          bodyTag.innerText = source
        })
        callback(null, data) //拿到数据之后，要往后传，因为有可能是别人也用到了这个插件，如果不传数据就丢失了
      })
    })
  }
}
module.exports = InlinePlugin
const path = require('path')
const fs = require('fs')
const url = require('url')
const http = require('http')
const mime = require('mime')
const zlib = require('zlib')
const handlebars = require('handlebars')
const config = require('./config')
const { promisify } = require('util')
const stat = promisify(fs.stat)
let readdir = promisify(fs.readdir)
console.log(config)

class Server {
  constructor() {
    this.config = config
  }
  start() {
    const serve = http.createServer()
    serve.on('request', (req, res) => {
      this.require(req, res)
    })
    console.log(this.config)
    serve.listen(this.config.port, () => {
      let url = `http://${this.config.host}:${this.config.port}`
      console.log(`server started at ${url}`)
    })
  }
  async require(req, res) {
    const { pathname } = url.parse(req.url)
    if (pathname == '/favicon.ico') {
      return this.sendError(req, res)
    }
    const filepath = path.join(this.config.root, pathname)
    console.log('绝对路径:', filepath)
    try {
      let statObj = await stat(filepath)
      if (statObj.isDirectory()) {
        // 如果是目录的话，应该显示目录下面的文件列表
        // 这里去读取文件列表渲染
      } else {
        res.setHeader('Content-Type', mime.getType(filepath))
        fs.createReadStream(filepath).pipe(res)
      }
    } catch (e) {
      this.sendError(req, res)
      console.log('错误原因', e)
    }
  }
  sendError(req, res) {
    res.statusCode = 500
    res.end('there is somthing wroing in the serve')
  }
}
let serve = new Server()
serve.start()

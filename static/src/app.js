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
//编译模板，得到一个渲染的方法,然后传入实际数据数据就可以得到渲染后的HTML了
function list() {
  let tmpl = fs.readFileSync(path.resolve(__dirname, 'template', 'list.html'), 'utf8')
  return handlebars.compile(tmpl)
}
/**
 * 1. 显示目录下面的文件列表和返回内容
 * 2. 实现压缩的功能
 * 3. 实现缓存
 * 4. 获取部分数据
 */
class Server {
  constructor() {
    this.config = config
    this.list = list()
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
  // 请求函数
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
        let files = await readdir(filepath)
        files = files.map(file => ({
          name: file,
          url: path.join(pathname, file),
        }))
        let html = this.list({
          title: pathname,
          files,
        })
        res.setHeader('Content-Type', 'text/html')
        res.end(html)
      } else {
        this.sendFile(req, res, filepath, statObj)
      }
    } catch (e) {
      this.sendError(req, res)
      console.log('错误原因：', e)
    }
  }
  // 发送文件
  sendFile(req, res, filepath, statObj) {
    if (this.handleCache(req, res, statObj)) return //如果走缓存，则直接返回
    res.setHeader('Content-Type', `${mime.getType(filepath)};charset=utf-8`)
    const encoding = this.setEncoding(req, res)
    let rs = this.getStream(req, res, filepath, statObj)
    if (encoding) {
      rs.pipe(encoding).pipe(res)
    } else {
      rs.pipe(res)
    }
  }
  // 获取部分传输数据
  getStream(req, res, filepath, statObj) {
    let start = 0
    let end = statObj.size - 1
    let range = req.headers['range']
    if (range) {
      res.setHeader('Accept-Range', 'bytes')
      res.statusCode = 206 //返回整个内容的某一块
      let result = range.match(/bytes=(\d*)-(\d*)/)
      if (result) {
        start = isNaN(result[1]) ? start : parseInt(result[1])
        end = isNaN(result[2]) ? end : parseInt(result[2]) - 1
      }
    }
    return fs.createReadStream(filepath, {
      start,
      end,
    })
  }
  // 设置缓存，第一次请求的时候没有缓存，后面的都有缓存
  handleCache(req, res, statObj) {
    const ifModifiedSince = req.headers['if-modified-since'] // 最后的修改时间
    const isNoneMatch = req.headers['is-none-match']
    res.setHeader('Cache-Control', 'private,max-age=30')
    res.setHeader('Expires', new Date(Date.now() + 30 * 1000).toGMTString())
    let etag = statObj.size
    let lastModified = statObj.ctime.toGMTString()
    res.setHeader('ETag', etag)
    res.setHeader('Last-Modified', lastModified)
    if (isNoneMatch && isNoneMatch != etag) {
      return fasle
    }
    if (ifModifiedSince && ifModifiedSince != lastModified) {
      return fasle
    }
    if (isNoneMatch || ifModifiedSince) {
      res.writeHead(304)
      res.end()
      return true
    } else {
      return false
    }
  }
  // 设置编码格式
  setEncoding(req, res) {
    const acceptEncoding = req.headers['accept-encoding']
    if (/\bgzip\b/.test(acceptEncoding)) {
      res.setHeader('Content-Encoding', 'gzip')
      return zlib.createGzip()
    } else if (/\bdeflate\b/.test(acceptEncoding)) {
      res.setHeader('Content-Encoding', 'deflate')
      return zlib.createDeflate()
    } else {
      return null
    }
  }
  // 服务器失败
  sendError(req, res) {
    res.statusCode = 500
    res.end('there is somthing wroing in the serve')
  }
}
let serve = new Server()
serve.start()

let express = require('express')
let app = express()
app.use(express.static(__dirname))
let whiteList = ['http://localhost:3000']
app.use((req, res, next) => {
  let origin = req.headers.origin
  if (whiteList.includes(origin)) {
    // 允许哪一个头访问我
    res.setHeader("Access-Control-Allow-Origin", origin)
    // 允许哪一个方法访问我
    res.setHeader("Access-Control-Allow-Methods", "PUT")
  }
  next()
})
app.get('/say', (req, res) => {
  res.end("get 跨域请求成功")
})
app.put('/info', (req, res) => {
  res.end("put 跨域请求成功")
})
app.listen(4000)
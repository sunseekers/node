let express = require('express')
let app = express()
app.get('/say', (req, res) => {
  let {
    cd
  } = req.query
  console.log(cd, 89);
  res.end(`${cd}('i like you')`)
})
app.listen(3000)
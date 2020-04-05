const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
app.get('/axios.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'axios.js'))

})
app.get('/users', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'axios.html'))
})
app.get('/users.json', (req, res) => {
  res.json({
    code: 0,
    users: [{
        name: 'sunseekers1'
      },
      {
        name: 'sunseekers2'
      },
      {
        name: 'sunseekers3'
      },
      {
        name: 'sunseekers4'
      },
    ]
  })
})
app.listen(8000)
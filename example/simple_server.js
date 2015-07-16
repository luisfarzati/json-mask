var http = require('http')
  , url = require('url')
  , spawn = require('../lib')(crypto)
  , server

server = http.createServer(function (req, res) {
  var fields = url.parse(req.url, true).query.fields
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(spawn(fields)))
})

server.listen(4000)

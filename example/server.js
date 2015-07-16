var http = require('http')
  , url = require('url')
  , crypto = require('crypto')
  , spawner = require('../lib')
  , server
  , generator
  , spawn

/**
 * Using json-spawn to mock response using the Google API Partial Responses
 * https://developers.google.com/+/api/#partial-responses
 */

generator = {
  kind: function () {
    return 'plus#activity'
  },
  updated: function () {
    return new Date()
  },
  url: function () {
    return 'https://plus.google.com/'+crypto.randomBytes(8).toJSON().data.join('')+'/posts/'+crypto.randomBytes(6).toString('base64')
  },
  content: function () {
    return 'A picture... of a space ship... launched from earth 40 years ago.'
  },
  randomName: function () {
    var names = ['Han','Boba','Luke','Leia','Padme','Anakin']
    return names[parseInt(Math.random()*names.length)]
  },
  uuid: function () {
    return crypto.randomBytes(8).toString('hex')
  },
  bool: function () {
    return Math.random() < .5
  }
}

spawn = spawner(generator)

server = http.createServer(function (req, res) {
  var parsedUrl = url.parse(req.url, true)
    , query = parsedUrl.query
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(spawn(query.fields), true, 2))
})

server.listen(4000, function () {
  var prefix = 'curl \'http://localhost:4000%s?fields=%s\''
  console.log('Server runnong on :4000, try the following:');
  console.log(prefix, '/', 'kind,updated')
  console.log(prefix, '/', 'url,object(content,attachments/url)')
  console.log(prefix, '/', 'name:randomName')
  console.log(prefix, '/', 'names:randomName\\{2;4\\}')
  console.log(prefix, '/', 'id:uuid,enabled:bool,posts\\{3\\}(id:uuid,url)')
})

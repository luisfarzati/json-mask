var jsonMask = require('json-mask')
  , spawn = require('./spawn')

function spawner(generator) {
  return function (mask) {
    return spawn(generator, jsonMask.compile(mask))
  }
}

spawner.compile = jsonMask.compile
spawner.filter = jsonMask.filter
spawner.spawn = spawn

module.exports = spawner

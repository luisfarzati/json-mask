var spawn = require('../lib/spawn')
  , assert = require('assert')
  , compiledMask
  , object
  , expected

//a,b(d:obj/z,b{2}(g:integer)),c:bool{3}
compiledMask = {
  a: {type: 'object'},
  b: {
    type: 'array',
    properties: {
      'd:obj': {
        type: 'object',
        properties: {
          z: {type: 'object'},
        }
      },
     'b{2}': {
        type: 'array',
        properties: {
          'g:integer': {type: 'object'}
        }
      }
    }
  },
  'c:bool{3}': {type: 'object'}
}

//a,b(d:obj/z,b{2}(g:integer)),c:bool{2,3}
expected = {
  a: 11,
  b: {
    d: {
      objprop: true,
      z: 22
    },
    b: [
      {g: 99},
      {g: 99}
    ]
  },
  c: [false,false,false]
}

var generator = {
  a: function () { return 11 },
  z: function () { return 22 },
  integer: function () { return 99 },
  obj: function () { return {objprop: true} },
  bool: function () { return false }
}

describe('spawn', function () {
  it('should spawn object for a compiled mask', function () {
    assert.deepEqual(spawn(generator, compiledMask), expected)
  })
})

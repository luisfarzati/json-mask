var spawner = require('../lib')
  , assert = require('assert')
  , deepEqual = require('deep-eql')
  , tests
  , generator

tests = [
{
  m: 'a',
  e: { a: 'a' }
},
{
  m: 'a,b',
  e: { a: 'a', b: 'b' }
},
{
  m: 'a/b',
  e: { a: { b: 'b' } }
},
{
  m: 'a/b/c',
  e: { a: { b: { c: 'c' } } }
},
{
  m: 'items(id,object/content)',
  e: {
    items: {
      id: 'id',
      object: {
        content: 'content'
      }
    }
  }
},
{
  m: 'a(b/c/id)',
  e: {
    a: {
      b: {c: {id: 'id'}}
    }
  }
},
{
  m: 'a{0}(b/c/id)',
  e: {
    a: []
  }
},
{
  m: 'a{1}(b/c/id)',
  e: {
    a: [{
      b: { c: { id: 'id' }}
    }]
  }
},
{
  m: 'a{1}(b{2}/c/id)',
  e: {
    a: [{
      b: [{ c: {id: 'id'} }, { c: {id: 'id'} }]
    }]
  }
},
{
  m: 'a,b/c,c/b,a/a/a',
  e: {
    a: 'a',
    b: { c: 'c' },
    c: { b: 'b' },
    a: { a: { a: 'a' }}
  }
},
{
  m: 'a(b(c(id)))',
  e: {
    a: { b: { c: { id: 'id' } } }
  }
},
{
  m: 'a(b(c(id),id/c/b/a(b/c/id)))',
  e: {
    a: { b: {
      c: { id: 'id' },
      id: { c: { b: { a: {
        b: { c: { id: 'id' }}
      }}}}}
    }
  }
}
]

generator = {
  a: function () { return 'a' },
  b: function () { return 'b' },
  c: function () { return 'c' },
  id: function () { return 'id' },
  content: function () { return 'content' }
}

describe('json-spawn', function () {
  var result, i
  for (i = 0; i < tests.length; i++) {
    (function (test) {
      it('should spawn ' + test.m + ' in test #' + i, function () {
        var result = spawner(generator)(test.m)
        assert.deepEqual(result, test.e)
      })
    }(tests[i]))
  }
})

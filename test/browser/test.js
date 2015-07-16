function assert(o) { if (!o) throw new Error('AssertionError') }
var generator = {
  string: function () {
    return 'string'
  },
  bool: function () {
    return true
  }
}
var r = jsonSpawn(generator)('p/a:string,z:bool')
assert(r.p.a)
assert(r.p.a === 'string')
assert(r.z)
assert(r.z === true)
document.getElementById('res').innerHTML = 'ok'

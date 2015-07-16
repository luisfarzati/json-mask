var util = require('./util')

module.exports = spawn

function spawn(generator, compiledMask) {

  function _properties(mask) {
    var maskedObj = {}, key, value, ret, retKey, typeFunc
    if (!mask) return undefined
    for (key in mask) {
      if (!util.has(mask, key)) continue
      value = mask[key]
      ret = undefined
      ret = _buildObject(key, value.properties)
      if ('undefined' !== typeof ret) maskedObj[_parseKey(key).name] = ret
    }
    return !util.isEmpty(maskedObj) ? maskedObj : undefined
  }

  function _complainer(propertyName, generatorName) {
    return function () {
      throw new Error('Generator function "' + generatorName + '" for property "' + propertyName + '" does not exist')
    }
  }

  function _noop() { }

  // a
  // a:string
  // a{2}
  // a{2;4}
  // a:string{2}
  // a:string{2;4}
  function _parseKey(key, generatorIsOptional) {
    var splitted = key.split('{')
      , nameFunc = splitted[0]
      , count = splitted[1] ? splitted[1].replace('}', '').split(';') : undefined
    var splitted = nameFunc.split(':')
      , name = splitted[0]
      , funcName = splitted[1] ? splitted[1] : name
      , func = generator[funcName] ? generator[funcName].bind(generator) : undefined
      , func = func || (generatorIsOptional ? _noop : _complainer(name, funcName))
    return { name: name, func: func, funcName: funcName, count: count, optional: generatorIsOptional }
  }

  function _merge(target, source) {
    if (!source) return target
    if (!target) return source
    target = (typeof target === 'object') ? target : {}
    for (var key in source || {}) {
      if (!util.has(source, key)) continue
      target[key] = source[key]
    }
    return target
  }

  // a              (implicit :a or throw)
  // a:string       (:string or throw)
  // a{2}           (implicit :a or throw, returns array of 2)
  // a{2;4}         (implicit :a or throw, returns array of 2-4 random)
  // a:string{2}    (:string or throw, returns aray of 2)
  // a:string{2;4}  (:string or throw, returns aray of 2-4 random)
  // a/b            (implicit :a if exists and if is object merge with b, otherwise just b)
  // a:string/b     (:string if exists and if is object merge with b, otherwise just b)
  function _buildObject(key, mask) {
    var parsed = _parseKey(key, !!mask)
      , ret = []
      , count = parsed.count || [1]
      , min = parseInt(count[0], 10)
      , max = parseInt(count[1], 10) || min
      , rnd = parseInt(Math.random()*(max+1-min)+min)
      , i = 1
    for (; i <= rnd; i++) {
      ret.push(_merge(parsed.func(), _properties(mask)))
    }
    return parsed.count ? ret : ret[0]
  }

  // a(b)      (implicit 1-element array)
  // a{2}(b)   (2-element array)
  // a{2;4}(b) (2-4 random element array)
  function _array(key, mask) {
    var parsed = _parseKey(key)
    if (key.indexOf(':') > 0) {
      throw new Error('Arrays cannot have generators: ' + key)
    }
    var ret = []
      , count = parsed.count || [1]
      , min = parseInt(count[0], 10)
      , max = parseInt(count[1], 10) || min
      , rnd = parseInt(Math.random()*(max+1-min)+min)
      , i = 1
    for (; i <= rnd; i++) {
      ret.push(_properties(mask))
    }
    return ret
  }

  return _properties(compiledMask)
}

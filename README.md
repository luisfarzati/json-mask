# json-spawn [![NPM version](https://badge.fury.io/js/json-spawn.png)](http://badge.fury.io/js/json-spawn)
[![Build Status](https://secure.travis-ci.org/luisfarzati/json-spawn.png)](http://travis-ci.org/luisfarzati/json-spawn) [![Dependency Status](https://gemnasium.com/luisfarzati/json-spawn.svg)](https://gemnasium.com/luisfarzati/json-spawn)

Create JSON objects using the [Partial Response](https://developers.google.com/+/web/api/rest/#partial-responses) query language.

```js
var spawner = require('json-spawn')
var chance = require('chance').Chance()

var spawn = spawner(chance)
spawn('id:guid,profile(name,age,twitter,city,country)')

// returns
//   { id: 'b09a25ea-a251-5d6e-9225-e4fe56215368',
//     profile:
//       { name: 'Milton Taylor',
//         age: 50,
//         twitter: '@vevcohaf',
//         city: 'Ekpithi',
//         country: 'TJ' } }
```

## Installation

```bash
$ npm install json-spawn
```

## Quick Start

### Spawning objects

```js
var spawner = require('json-spawn')
var spawn = spawner(/* your generator */)
```

A **generator** is any object exposing a set of methods that will be used for populating the fields in the JSON object.

A nice example of a generator is [Chance.js](http://chancejs.com/), the super cool library for random data of any type. Chance lets you do

```js
chance.name() // 'Shane Chandler'
chance.mont() // 'December'
chance.ssn()  // '868-56-5059'
```

Let's use Chance.js as our generator for spawning JSON objects:

```js
var chance = require('chance').Chance()
var spawn = spawner(chance)
```

That's it, now you are ready for generating objects by passing some queries to the `spawn` function! If you ever used some of the Google APIs in the past, the syntax will look familiar.

```js
var address = spawn('address,city,state,zip,geo/coordinates')

// { address: '1262 Tefi Grove',
//   city: 'Lilafem',
//   state: 'CO',
//   zip: '27328',
//   geo: { coordinates: '19.2724, 164.16494' } }
```

What spawn does is to inspect each field in the query, looking for a method with the same name in the generator object.

For more information about the Partial Response query syntax, check out the [documentation page](https://developers.google.com/+/web/api/rest/#partial-responses).

### Serving spawned objects from an API

It's easy to integrate JSON Spawn with Express:

```js
app.get('/api/*', function (req, res) {
	res.status(200).json(spawn(req.query.fields))
})
```

There you go. Now you have a full-mocked API that you can use while writing your client app.

## Advanced syntax

```js
spawn('hashtag{3}')

// { hashtag: [ '#nocnata', '#omfimore', '#ot' ] }
```
```js
spawn('folderId:guid,name:word,readOnly:bool')

// { folderId: '4c52b585-37a0-540a-84fa-083c30e71a96',
//   name: 'wusgo',
//   readOnly: false }
```
```js
spawn('friends(name,birthday,link:url)')

// { friends:
//   { name: 'Winnie Copeland',
//     birthday: Tue Feb 10 1953 01:38:13 GMT-0300 (ART),
//     link: 'http://lut.edu/bil' } }
```
```js
spawn('friends{1}(name,birthday,link:url)')

// { friends:
//   [ { name: 'Hulda Conner',
//       birthday: Wed May 18 1955 06:14:41 GMT-0300 (ART),
//       link: 'http://le.org/se' } ] }
```
```js
spawn('friends{0}(name,birthday,link:url)')

// { friends: [] }
```

## Pending features

* Parameters in generators *(perhaps something like* `x:word{length:5}`*?)*
* Implementation of `*`

## Tests

```bash
$ npm test          // Runs tests with Mocha
$ npm run test-cov  // Runs coverage report with Istanbul
```

## Credits

Thanks to [@nemtsov](https://github.com/nemtsov) for his [JSON Mask](https://github.com/nemtsov/json-mask) library, which is pretty much the base of this work.

## License

[MIT](/LICENSE)

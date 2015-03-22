var ractive = require('ractive')
  , test = require('tape')
  , rcu = require('rcu')

var makeOutput = require('../lib/make-output')
  , transform = require('../')

rcu.init(ractive)

test('if filename extension not .ract, pass through', function(t) {
  t.plan(1)

  var stream = transform('filename.xlsx')

  stream.on('data', function(data) {
    t.equal(data.toString(), 'oh, {{hi}}!')
    t.end()
  })

  stream.write('oh, {{hi}}!')
  stream.end()
})

test('if extension is .ract, parse it', function(t) {
  t.plan(1)

  var stream = transform('filename.ract')
  var template = 'oh, {{hi}}!'

  stream.on('data', function(data) {
    t.equal(data.toString(), makeOutput(rcu.parse(template)))
    t.end()
  })

  stream.write(template)
  stream.end()
})

test('extension is configurable', function(t) {
  t.plan(1)

  var stream = transform('filename.xlsx', {extension: 'xlsx'})
  var template = 'oh, {{hi}}!'

  stream.on('data', function(data) {
    t.equal(data.toString(), makeOutput(rcu.parse(template)))
    t.end()
  })

  stream.write(template)
  stream.end()
})

test('only exports template if specified', function(t) {
  t.plan(1)

  var stream = transform('filename.ract', {justTemplate: true})
  var template = 'oh, {{hi}}!'

  stream.on('data', function(data) {
    t.equal(data.toString(), makeOutput(rcu.parse(template).template))
    t.end()
  })

  stream.write(template)
  stream.end()
})

test('emits error for parse error', function(t) {
  t.plan(1)

  var stream = transform('filename.ract')
  var template = 'oh, {{#if}}herp!'

  stream.on('error', function(err) {
    t.ok(err)
  })

  stream.write(template)
  stream.end()
})
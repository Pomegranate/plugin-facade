const Promise = require('bluebird')
exports.options = {
  workDir: '/mockWorkDir'
}

exports.metadata = {
  frameworkVersion: 6,
  name: 'servicePlugin',
  type: 'service',
  param: 'service',
  depends: ['servicePlugin']
}

exports.plugin = {
  load: function(inject, loaded){
    return Promise.delay(2100).then(() => {
      return {a: 'ok'}
    })
  },
  start: function(done){},
  stop: function(done){}
}

exports.errors = {}

exports.commands = {}
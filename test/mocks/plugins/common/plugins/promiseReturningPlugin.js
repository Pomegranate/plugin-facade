const Promise = require('bluebird')
exports.options = {
  workDir: '/mockWorkDir'
}

exports.metadata = {
  frameworkVersion: 6,
  name: 'servicePlugin',
  type: 'service',
  param: 'service',
  depends: ['actionPlugin']
}

exports.plugin = {
  load: function(inject, loaded){
    // loaded(null, {name: 'service'})
    return Promise.delay(1000)
      .then((result) => {
        return this.postponeTimeout()
      })
      .delay(1000)
      .then(() => {
        return {name: 'service'}
      })
  },
  start: function(done){

  },
  stop: function(done){

  }
}

exports.errors = {}

exports.commands = {}
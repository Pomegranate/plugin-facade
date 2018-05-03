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
  load: function(Options, DelayTimeout, Logger){
    return Promise.delay(1000)
      .then((result) => {
        return DelayTimeout()
      })
      .delay(1000)
      .then(() => {
        return {name: 'service'}
      })
  },
  start: function(){
  },
  stop: function(){}
}

exports.errors = {}

exports.commands = {}
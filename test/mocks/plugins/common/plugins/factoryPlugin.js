exports.options = {
  workDir: '/mockWorkDir'
}

exports.metadata = {
  frameworkVersion: 6,
  name: 'factoryPlugin',
  type: 'factory',
  param: 'bob',
  depends: ['dynamicPlugin']
}

exports.plugin = {
  load: function(inject, loaded){
    return function(){}
  },
  start: function(done){},
  stop: function(done){}
}

exports.errors = {}

exports.commands = {}
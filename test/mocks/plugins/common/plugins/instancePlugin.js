exports.options = {
  workDir: '/mockWorkDir'
}

exports.metadata = {
  frameworkVersion: 6,
  name: 'instancePlugin',
  type: 'instance',
  param: 'instance',
  depends: ['factoryPlugin']
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
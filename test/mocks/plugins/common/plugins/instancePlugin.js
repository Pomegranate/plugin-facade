exports.options = {
  workDir: '/mockWorkDir'
}

exports.metadata = {
  name: 'instancePlugin',
  type: 'instance',
  param: 'instance',
  depends: ['factoryPlugin']
}

exports.plugin = {
  load: function(inject, loaded){
    loaded(null, function(){})
  },
  start: function(done){done()},
  stop: function(done){done()}
}

exports.errors = {}

exports.commands = {}
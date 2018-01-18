exports.options = {
  workDir: '/mockWorkDir'
}

exports.metadata = {
  name: 'factoryPlugin',
  type: 'factory',
  param: 'bob',
  depends: ['dynamicPlugin']
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
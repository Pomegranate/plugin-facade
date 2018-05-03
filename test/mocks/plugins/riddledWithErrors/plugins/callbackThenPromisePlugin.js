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
  load: function(){
    return {g: 'service'}
  },
  start: function(done){done()},
  stop: function(done){done()}
}

exports.errors = {}

exports.commands = {}
exports.options = {
  workDir: '/mockWorkDir'
}

exports.metadata = {
  name: 'servicePlugin',
  type: 'service',
  param: 'service',
  depends: ['servicePlugin']
}

exports.plugin = {
  start: function(done){done()},
  stop: function(done){done()}
}

exports.errors = {}

exports.commands = {}
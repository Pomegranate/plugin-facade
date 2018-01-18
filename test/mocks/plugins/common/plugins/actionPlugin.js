exports.options = {
  workDir: '/mockWorkDir'
}

exports.metadata = {
  name: 'actionPlugin',
  type: 'action'
}

exports.plugin = {
  load: function(inject, loaded){
    loaded(null)
  },
  start: function(done){done()},
  stop: function(done){done()}
}

exports.errors = {}

exports.commands = {}
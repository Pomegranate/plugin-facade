exports.options = {
  workDir: '/mockWorkDir'
}

exports.metadata = {
  name: 'nonePlugin',
  type: 'none',
  depends: ['mergePlugin']
}

exports.plugin = {
  load: function(inject, loaded){
    loaded(null, {f: 'none'})
  },
  start: function(done){done()},
  stop: function(done){done()}
}

exports.errors = {}

exports.commands = {}
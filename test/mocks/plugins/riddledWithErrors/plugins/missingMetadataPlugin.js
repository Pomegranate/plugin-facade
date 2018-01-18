exports.options = {
  workDir: '/mockWorkDir'
}

exports.plugin = {
  load: function(inject, loaded){
    loaded(null, {g: 'service'})
  },
  start: function(done){done()},
  stop: function(done){done()}
}

exports.errors = {}

exports.commands = {}
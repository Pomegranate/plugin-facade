exports.options = {
  workDir: '/mockWorkDir'
}

exports.plugin = {
  load: function(inject, loaded){
    return {g: 'service'}
  },
  start: function(done){},
  stop: function(done){}
}

exports.errors = {}

exports.commands = {}
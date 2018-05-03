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
  load: function(inject, loaded){
    throw new Error('Im broken')
  },
  start: function(done){},
  stop: function(done){}
}

exports.errors = {}

exports.commands = {}
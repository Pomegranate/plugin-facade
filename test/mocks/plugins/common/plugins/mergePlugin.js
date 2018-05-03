exports.options = {
  workDir: '/mockWorkDir'
}

exports.metadata = {
  frameworkVersion: 6,
  name: 'mergePlugin',
  type: 'merge',
  param: 'merge',
  depends: ['instancePlugin']
}

exports.plugin = {
  load: function(inject, loaded){
    return {e: 'merge'}
  },
  start: function(done){},
  stop: function(done){}
}

exports.errors = {}

exports.commands = {}
exports.options = {
  workDir: '/mockWorkDir'
}

exports.metadata = {
  name: 'mergePlugin',
  type: 'merge',
  param: 'merge',
  depends: ['instancePlugin']
}

exports.plugin = {
  load: function(inject, loaded){
    loaded(null, {e: 'merge'})
  },
  start: function(done){done()},
  stop: function(done){done()}
}

exports.errors = {}

exports.commands = {}
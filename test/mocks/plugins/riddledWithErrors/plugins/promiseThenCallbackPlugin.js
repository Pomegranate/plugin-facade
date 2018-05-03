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
    // loaded(null, {g: 'service'})
    setTimeout(() => {
      loaded(null, {g: 'service'})
    },1000)
    return {g: 'service'}
  },
  start: function(done){},
  stop: function(done){}
}

exports.errors = {}

exports.commands = {}
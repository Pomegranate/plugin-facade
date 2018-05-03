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
  start: function(LateError){
    setTimeout(() => {
      LateError(new Error('Have an error'))
    }, 100)
  },
  stop: function(done){}
}

exports.errors = {}

exports.commands = {}
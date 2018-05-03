exports.options = {
  workDir: '/mockWorkDir'
}

exports.metadata = {
  frameworkVersion: 6,
  name: 'nonePlugin',
  type: 'none',
  depends: ['mergePlugin']
}

exports.plugin = {
  load: function(){
    return {f: 'none'}
  },
  start: function(){},
  stop: function(){}
}

exports.errors = {}

exports.commands = {}
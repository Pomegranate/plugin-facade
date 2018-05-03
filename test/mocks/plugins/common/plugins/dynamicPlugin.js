exports.options = {
  workDir: '/mockWorkDir'
}

exports.metadata = {
  frameworkVersion: 6,
  name: 'dynamicPlugin',
  type: 'dynamic',
  param: 'dynamic',
  depends: ['actionPlugin']
}

exports.plugin = {
  load: function(inject, loaded){
    let W = {param: 'W', load: {name: 'dependency-d', obj: 'W'}}
    let D = {param: 'X', load: {name: 'dependency-d', obj: 'X'}}
    let Y = {param: 'Y', load: {name: 'dependency-d', obj: 'Y'}}
    let Z = {param: 'Z', load: {name: 'dependency-d', obj: 'Z'}}
    return [W,D,Y,Z]
  },
  start: function(done){},
  stop: function(done){}
}

exports.errors = {}

exports.commands = {}
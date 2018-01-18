exports.options = {
  workDir: '/mockWorkDir'
}

exports.metadata = {
  name: 'servicePlugin',
  type: 'service',
  param: 'service',
  depends: ['servicePlugin']
}

exports.plugin = {
  load: function(inject, loaded){
    return {g: 'service'}
  },
  start: function(done){
    setTimeout(() => {
      this.lateError(new Error('Have an error'))
    }, 100)
    done()
  },
  stop: function(done){done()}
}

exports.errors = {}

exports.commands = {}
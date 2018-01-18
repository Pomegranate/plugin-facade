/**
 * @file Context
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _fp = require('lodash/fp')
const fileBaseName = require('./ContextHelpers/fileBaseName')
const fileList = require('./ContextHelpers/fileList')
const fileListDeep = require('./ContextHelpers/fileListDeep')
const fileListNested = require('./ContextHelpers/fileListNested')
const walkWorkDir = require('./ContextHelpers/walkWorkDir')
const walkReduce = require('./ContextHelpers/walkReduce')
/**
 *
 * @module Context
 */


module.exports = function(){
  let context = {
    Logger: this.PluginLogger,
    options: this.computedOptions,
    lateError: (error) => {
      this.FrameworkEvents.emit('lateError', error)
    },
    postponeTimeout: () => {
      this.recycleTimeout()
    }
  }

  if(_fp.has('computedOptions.workDir', this)){
    let wd = this.computedOptions.workDir
    this.PluginLogger.log('Has a workDir, adding file handling methods to context.', 3)
    context.fileBaseName = fileBaseName
    context.fileList = fileList(wd)
    context.fileListDeep = fileListDeep(wd)
    context.fileListNested = fileListNested(wd)
    context.walkWorkDir = walkWorkDir(wd)
    context.walkReduce = walkReduce(wd)
  }

  return context
}
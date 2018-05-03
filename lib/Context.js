/**
 * @file Context
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _fp = require('lodash/fp')
const fileBaseName =   require('./FileHelpers/fileBaseName')
const fileList =       require('./FileHelpers/fileList')
const fileListDeep =   require('./FileHelpers/fileListDeep')
const fileListNested = require('./FileHelpers/fileListNested')
const walkWorkDir =    require('./FileHelpers/walkWorkDir')
const walkReduce =     require('./FileHelpers/walkReduce')
/**
 *
 * @module Context
 */


module.exports = function(){
  let context = {
    Logger: this.PluginLogger,
    options: this.computedOptions,
    lateError: (error) => {
      this.PluginLogger.error('Encountered a late error and cannot continue.')
      this.ErrorAccumulator.push(error)
      error.message && this.PluginLogger.error(error.message)
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
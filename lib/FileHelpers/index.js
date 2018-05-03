/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _fp = require('lodash/fp')
const fileBaseName =   require('./fileBaseName')
const fileList =       require('./fileList')
const fileListDeep =   require('./fileListDeep')
const fileListNested = require('./fileListNested')
const walkWorkDir =    require('./walkWorkDir')
const walkReduce =     require('./walkReduce')
/**
 *
 * @module index
 */

module.exports = function(wd){
  let PluginFiles = {}


  PluginFiles.fileBaseName = fileBaseName
  PluginFiles.fileList = fileList(wd)
  PluginFiles.fileListDeep = fileListDeep(wd)
  PluginFiles.fileListNested = fileListNested(wd)
  PluginFiles.walkWorkDir = walkWorkDir(wd)
  PluginFiles.walkReduce = walkReduce(wd)
  PluginFiles.ctors = {
    fileList: fileList,
    fileListDeep: fileListDeep,
    fileListNested: fileListNested,
    walkWorkDir: walkWorkDir,
    walkReduce: walkReduce,
  }


  return PluginFiles
}
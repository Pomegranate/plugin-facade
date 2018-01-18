/**
 * @file _getPlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";
const path = require('path')

module.exports = function(p, type){

  let typeBase = type.split('Plugin.js')[0]

  let moduleName = `${typeBase}Plugin`
  let requirePath = path.join(__dirname, 'plugins', p ,moduleName)
  let buildData = {
    require: requirePath,
    external: false,
    internal: true,
    systemPlugin: false,
    multiple: false,
    moduleName
  }
  return buildData
}
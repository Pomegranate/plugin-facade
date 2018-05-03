/**
 * @file Dynamic
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const PluginInterface = require('./_PluginInterface')
/**
 *
 * @module Dynamic
 */

class Dynamic extends PluginInterface{
  constructor({PluginData,Validator, FrameworkDI, PluginDI, PluginLogger}){
    super({PluginData,Validator, FrameworkDI, PluginDI, PluginLogger})
  }

  load(){
    return super.load()
      .then((result) => {
        return result
      })
  }

  start(){
    return super.start()
      .then((result) => {
        return result
      })
  }

  stop(){
    return super.stop()
      .then((result) => {
        return result
      })
  }
}

module.exports = Dynamic
/**
 * @file Service
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const PluginInterface = require('./_PluginInterface')
/**
 *
 * @module Service
 */

class ServiceInterface extends PluginInterface{
  constructor({Validator, FrameworkDI, PluginDI, PluginLogger}){
    super({Validator, FrameworkDI, PluginDI, PluginLogger})
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

module.exports = ServiceInterface
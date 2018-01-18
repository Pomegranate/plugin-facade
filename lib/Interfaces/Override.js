/**
 * @file Override
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const PluginInterface = require('./_PluginInterface')
const overrideLoad = require('../HookHandlers/overrideLoad')
/**
 *
 * @module Override
 */

class OverrideInterface extends PluginInterface{
  constructor({Validator, FrameworkDI, PluginDI, PluginLogger}){
    super({Validator, FrameworkDI, PluginDI, PluginLogger})
  }

  load(){
    return overrideLoad.apply(this)
  }
}

module.exports = OverrideInterface
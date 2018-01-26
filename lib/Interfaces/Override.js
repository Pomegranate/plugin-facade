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
    this.overrideMeta = Validator.getOverride()
  }

  getOverrideMeta(){
    return this.overrideMeta
  }
  getHooks(){
    this.Messenger.overriding(this.overrideMeta.name)
    return this.hooks
  }

  load(){
    return overrideLoad.apply(this)
  }
  start(){}
  stop(){}
}

module.exports = OverrideInterface
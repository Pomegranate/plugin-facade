/**
 * @file Action
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


'use strict';

const PluginInterface = require('./_PluginInterface')
const ActionHooks = require('../HookHandlers/ActionHooks')

class Action extends PluginInterface{
  constructor({PluginData,Validator, FrameworkDI, PluginDI, PluginLogger}){
    super({PluginData,Validator, FrameworkDI, PluginDI, PluginLogger})
  }

  load(){
    this.Messenger.loading()
    return ActionHooks.load.apply(this)
      .then((result) => {
        this.clearTimeout()
        this.Messenger.loaded()
        return result
      })
  }
  start(){
    this.Messenger.starting()
    return ActionHooks.start.apply(this)
      .then((result) => {
        this.clearTimeout()
        this.Messenger.started()
        return result
      })
  }
  stop(){
    this.Messenger.stopping()
    return ActionHooks.stop.apply(this)
      .then((result) => {
        this.clearTimeout()
        this.Messenger.stopped()
        return result
      })
  }
}

module.exports = Action
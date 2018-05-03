/**
 * @file Logger
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

const PluginInterface = require('./_PluginInterface')
const LoggerHooks = require('../HookHandlers/LoggerHooks')
/**
 * A Logger type plugin interface.
 * @module Logger
 */

class LoggerInterface extends PluginInterface{
  constructor({PluginData,Validator, FrameworkDI, PluginDI, PluginLogger}){
    super({PluginData,Validator, FrameworkDI, PluginDI, PluginLogger})
    this.hooks.logHandler = Validator.getLogger()
  }

  installLogger(){
    return LoggerHooks.installLogger.apply(this)
      .then((result) => {
        this.clearTimeout()
        this.Messenger.loaded()
        return result
      })
      .catch((err) => {
        this.hookPromise = null
        this.clearTimeout()
        this.ErrorAccumulator.push(err)
        throw new Error('Plugin installLogger hook failed.')
      })
  }

  load(){
    this.Messenger.loading()
    return LoggerHooks.load.apply(this)
      .then((result) => {
        this.clearTimeout()
        this.Messenger.loaded()
        return result
      })
      .catch((err) => {
        this.hookPromise = null
        this.clearTimeout()
        this.ErrorAccumulator.push(err)
        throw new Error('Plugin load hook failed.')
      })
  }
}

module.exports = LoggerInterface
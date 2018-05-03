/**
 * @file Installer
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const PluginInterface = require('./_PluginInterface')
const Promise = require('bluebird')
const InstallerHooks = require('../HookHandlers/InstallerHooks')
const {join} = require('path')
/**
 *
 * @module Installer
 */

class InstallerInterface extends PluginInterface{
  constructor({PluginData,Validator, FrameworkDI, PluginDI, PluginLogger}){
    super({PluginData,Validator, FrameworkDI, PluginDI, PluginLogger})
    // console.log(this.hooks)
    // this.hooks.installer = Validator.getInstaller()
    // this.installerHook = Validator.getInstaller()
    // this.context.join = join
  }

  setupChildInjector(){
    super.setupChildInjector()
    // this.PluginDI.service('Available', this.FrameworkDI.get('WorkDirs'))
  }

  install(){
    this.Messenger.installing()
    return InstallerHooks.install.apply(this)
      .then((result) => {
        this.clearTimeout()
        this.Messenger.installed()
        return result
      })
      .catch((err) => {
        this.hookPromise = null
        this.clearTimeout()
        this.ErrorAccumulator.push(err)
        throw new Error('Plugin install hook failed.')
      })
  }

  load(){
    this.Messenger.loading()
    return InstallerHooks.load.apply(this)
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

module.exports = InstallerInterface
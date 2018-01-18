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
  constructor({Validator, FrameworkDI, PluginDI, PluginLogger}){
    super({Validator, FrameworkDI, PluginDI, PluginLogger})
    this.installerHook = Validator.getInstaller()
    this.context.join = join
  }

  install(){
    this.Messenger.installing()
    return InstallerHooks.install.apply(this)
      .then((result) => {
        this.Messenger.installed()
        return result
      })
  }

  load(){
    this.Messenger.loading()
    return InstallerHooks.load.apply(this)
      .then((result) => {
        this.Messenger.loaded()
        return result
      })
  }
}

module.exports = InstallerInterface
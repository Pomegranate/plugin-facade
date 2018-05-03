/**
 * @file DynamicMessages
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const Messenger = require('./Messenger')
/**
 *
 * @module InstallerMessenger
 */

class InstallerMessenger extends Messenger{
  constructor({PluginLogger, Type, Version}){
    super({PluginLogger, Type, Version})
  }

  installing(deps) {
    this.installTime = process.hrtime()
    this.PluginLogger.log('Pending file installation: ', 1)
  }

  installed() {
    this.PluginLogger.log(`Took ${this._toMillis(this.installTime)} to install files.`, 2)
    this.PluginLogger.log('Installing files:', 1)
  }
}

module.exports = InstallerMessenger
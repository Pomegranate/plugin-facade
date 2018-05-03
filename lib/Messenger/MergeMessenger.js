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
 * @module MergeMessenger
 */

class MergeMessenger extends Messenger{
  constructor({PluginLogger, Type, Version}){
    super({PluginLogger, Type, Version})
  }

  injecting(deps) {
    this.stringifiedDeps = this._stringDepArray(deps)
    this.injectTime = process.hrtime()
    this.PluginLogger.log('Pending dependency merge into:', this.stringifiedDeps, 1)
  }

  injected() {
    this.PluginLogger.log(`Took ${this._toMillis(this.injectTime)} to merge dependencies.`, 2)
    this.PluginLogger.log('Merged into parameter:', this.stringifiedDeps, 1)
  }

}

module.exports = MergeMessenger
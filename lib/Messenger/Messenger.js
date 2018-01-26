/**
 * @file Messenger
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _fp = require('lodash/fp')
;
/**
 *
 * @module Messenger
 */

class Messenger {
  constructor({PluginLogger, Type}) {
    this.NS_PER_SEC = 1e9
    this.PluginLogger = PluginLogger
    this.Type = Type
  }

  _toMillis(comparator){
    let hr = process.hrtime(comparator);
    let time = ( hr[0] * this.NS_PER_SEC + hr[1] ) / 1000000
    // let time = nanos / 1000000
    return `${time.toFixed(2)}ms`
  }

  _stringDepArray(deps){
    if(_fp.isArray(deps)){
      return _fp.map((p) => {
        return p.name
      }, deps).join(', ')
    }
    return deps.name
  }

  overriding(target){
    this.PluginLogger.warn(`Overriding hooks for ${target}`, 1)
  }
  overridden(){
    this.PluginLogger.warn('Plugin Hooks are being overridden.', 1)
  }

  initializing() {
    this.initializeTime = process.hrtime()
    this.PluginLogger.log(`Initializing ${this.Type} plugin.`, 1)
  }

  initialized() {
    this.PluginLogger.log(`Took ${this._toMillis(this.initializeTime)} to initialize.`, 2)
    this.PluginLogger.log(`Initialized successfully.`, 1)
  }

  configuring() {
    this.configureTime = process.hrtime()
    this.PluginLogger.log(`Configuring Interface.`, 1)
  }

  configured() {
    this.PluginLogger.log(`Took ${this._toMillis(this.initializeTime)} to configure.`, 2)
    this.PluginLogger.log(`Configured Interface successfully.`, 1)
  }

  loading() {
    this.loadTime = process.hrtime()
    this.PluginLogger.log('Loading Started.',1)
  }

  loaded() {
    this.PluginLogger.log(`Took ${this._toMillis(this.loadTime)} to load.`, 2)
    this.PluginLogger.log('Loading Finished.',1)
  }

  injecting(deps) {
    this.stringifiedDeps = this._stringDepArray(deps)
    this.injectTime = process.hrtime()
    this.PluginLogger.log('Dependencies pending injection: ', this.stringifiedDeps, 1)
  }

  injected() {
    this.PluginLogger.log(`Took ${this._toMillis(this.injectTime)} to inject deps.`, 2)
    this.PluginLogger.log('Adding injectable parameters:',this.stringifiedDeps, 1)
  }

  starting() {
    this.startTime = process.hrtime()
    this.PluginLogger.log('Starting.',1)
  }

  started() {
    this.PluginLogger.log(`Took ${this._toMillis(this.startTime)} to start.`, 2)
    this.PluginLogger.log('Started.',1)
  }

  stopping() {
    this.stopTime = process.hrtime()
    this.PluginLogger.log('Stopping.',1)
  }

  stopped() {
    this.PluginLogger.log(`Took ${this._toMillis(this.stopTime)} to stop.`, 2)
    this.PluginLogger.log('Stopped.',1)
  }

}

module.exports = Messenger
/**
 * @file raceTimeout
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const defer = require('../defer')
const PromiseLib = require('bluebird')
const Promise = PromiseLib.getNewLibraryCopy()
Promise.config({
  cancellation: true
})
/**
 *
 * @module raceTimeout
 */

module.exports = function(hook) {

  let deferred = defer()
  this.startTimeout(deferred)

  let pluginResult = Promise.try(() => {
    let injected = this.PluginDI.inject(this.hooks[hook])
    return injected
  })

  return Promise.race([pluginResult, deferred.promise])
    .catch((err) => {
      if(pluginResult.isPending()) {
        pluginResult.cancel()
      }
      throw err
    })
}
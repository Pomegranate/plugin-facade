/**
 * @file overrideLoad
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict'
const Promise = require('bluebird')
const defer = require('../defer')
/**
 *
 * @module actionLoad
 */

module.exports = function() {
  return Promise.try(() => {
    let deferred = defer()
    let rejected = false
    this.currentTimer = setTimeout(() => {
      /**
       * TODO - Log level 3-4?
       * @author - Jim Bulkowski
       * @date - 12/13/17
       * @time - 2:43 AM
       */
      rejected = true
      deferred.reject(new Error(`Timeout exceeded (${this.timeout}ms) attempting to load ${this.configName}`))
    }, this.timeout);

    this.hooks.load.apply(this.context, [this.PluginDI.inject.bind(this.PluginDI), (err, toInject) => {

      if(err){
        err.plugin = this
        return deferred.reject(err)
      }
      return deferred.resolve({done: true})

    }])

    return deferred.promise
  })
}
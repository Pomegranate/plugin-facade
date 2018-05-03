/**
 * @file ActionHooks
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const Promise = require('bluebird')
const raceTimeout = require('./raceTimeout')
const defer = require('../defer')

/**
 *
 * @module ActionHooks
 */


module.exports = {
  load: function() {
    return raceTimeout.apply(this, ['load'])
      .then(() => {
        return {done: true}
      })
    // return Promise.try(() => {
    //   let deferred = defer()
    //   let rejected = false
    //   this.startTimeout(deferred)
    //   this.hooks.load.apply(this.context, [this.PluginDI.inject.bind(this.PluginDI), (err, toInject) => {
    //     this.clearTimeout()
    //     if(err){
    //       err.plugin = this
    //       return deferred.reject(err)
    //     }
    //     return deferred.resolve({done: true})
    //
    //   }])
    //
    //   return deferred.promise
    // })
  },
  start: function(){
    return raceTimeout.apply(this, ['start'])
      .then(() => {
        return {done: true}
      })
    // return Promise.try(() => {
    //   let deferred = defer()
    //   let rejected = false
    //   this.startTimeout(deferred)
    //   this.hooks.start.apply(this.context, [(err) => {
    //     this.clearTimeout()
    //     if(err){
    //       err.plugin = this
    //       return deferred.reject(err)
    //     }
    //     return deferred.resolve({done: true})
    //
    //   }])
    //
    //   return deferred.promise
    // })
  },
  stop: function(){
    return raceTimeout.apply(this, ['stop'])
      .then(() => {
        return {done: true}
      })
    // return Promise.try(() => {
    //   let deferred = defer()
    //   let rejected = false
    //   this.startTimeout(deferred)
    //   this.hooks.stop.apply(this.context, [(err) => {
    //     this.clearTimeout()
    //     if(err){
    //       err.plugin = this
    //       return deferred.reject(err)
    //     }
    //     return deferred.resolve({done: true})
    //
    //   }])
    //
    //   return deferred.promise
    // })
  }
}
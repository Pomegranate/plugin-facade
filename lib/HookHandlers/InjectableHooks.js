/**
 * @file InjectableHooks
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

const Promise = require('bluebird')
const _fp = require('lodash/fp')
const defer = require('../defer')
const settleCallbackOrPromise = require('./settleCallback')
const raceTimeout = require('./raceTimeout')
/**
 *
 * @module InjectableHooks
 */


module.exports = {

  injectDeps: function() {
    return Promise.try(() => {
      if(!this.dependencies) {
        return {done: true}
      }

      if(this.dependenciesAreArray()) {
        _fp.each((dep) => {
          dep.inject(this.ParentDI)
          this.dependencyNameArray.push(dep.getName())
        }, this.dependencies)
      }
      else {
        this.dependencyNameArray.push(this.dependencies.getName())
        this.dependencies = this.dependencies.inject(this.ParentDI)
      }

      return {done: true}
    })
  },
  load: function() {
    // raceTimeout.apply(this, ['load'])
    // let deferred = defer()
    // this.startTimeout(deferred)
    return raceTimeout.apply(this, ['load'])
      .then((result) => {

        this.setDependencies(result)
        let toResolve = this.type === 'none' ? {done: true} : {to: 'injectDeps'}
        return toResolve
      })


    // let pluginResult = Promise.try(() => {
    //     let injected = this.PluginDI.inject(this.hooks.load)
    //     return Promise.resolve(injected)
    //   })
    //   .then((result) => {
    //     return this.setDependencies(result)
    //     let toResolve = this.type === 'none' ? {done: true} : {to: 'injectDeps'}
    //     return toResolve
    //   })
    //
    // return Promise.race([pluginResult, deferred.promise])
    //   .catch((err) => {
    //     if(pluginResult.isPending()){
    //       pluginResult.cancel()
    //     }
    //     throw err
    //   })

  }
  ,
  start: function() {
    return raceTimeout.apply(this, ['start'])
      .then((result) => {
        return {done: true}
      })
  },
  stop: function() {
    return raceTimeout.apply(this, ['stop'])
      .then((result) => {
        return {done: true}
      })
  }
}
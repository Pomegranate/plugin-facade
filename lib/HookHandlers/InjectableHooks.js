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
          dep.inject(this.PluginDI)
          this.dependencyNameArray.push(dep.getName())
        }, this.dependencies)
      }
      else {
        this.dependencyNameArray.push(this.dependencies.getName())
        this.dependencies = this.dependencies.inject(this.PluginDI)
      }

      return {done: true}
    })
  },
  load: function() {
    let deferred = defer()
    let scb = settleCallbackOrPromise.apply(this, ['load']);
    return scb(deferred)
      .then((overallResult) => {
        this.setDependencies(overallResult)
        let toResolve = this.type === 'none' ? {done: true} : {to: 'injectDeps'}
        return toResolve
      })
  }
  ,
  start: function() {
    let deferred = defer()
    let scb = settleCallbackOrPromise.apply(this, ['start']);
    return scb(deferred)
      .then((result) => {
        return {done: true}
      })
  },
  stop: function() {
    let deferred = defer()
    let scb = settleCallbackOrPromise.apply(this, ['stop']);
    return scb(deferred)
      .then((result) => {
        return {done: true}
      })
  }
}
/**
 * @file settleCallback
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const Promise = require('bluebird')
const _fp = require('lodash/fp')
/**
 *
 * @module settleCallback
 */

const testDeferredResolved = function(deferred){
  if(deferred.promise.isFulfilled()){
    let error = new Error('Attempted to use both the hook promise API and the hook callback API.')
    return {
      resolved: true,
      error: error
    }
  }
  return {
    resolved: false,
    error: null
  }
}

const loadCb = function(deferred, lateError) {
  return (...args) => {

    let deferredResolved = testDeferredResolved(deferred)
    if(deferredResolved.resolved){
      lateError(deferredResolved.error)
      return
    }

    if(args.length === 1) {
      if(_fp.isError(args[0])) {
        console.log(`Rejecting with ${args[0]}`);
        return deferred.reject(args[0])
      }
      if(_fp.isNull(args[0])) {
        console.log(`Rejecting with ${args[0]}`);
        return deferred.resolve(true)
      }
    }
    if(args.length === 2) {
      if(_fp.isError(args[0])) {
        console.log(`Rejecting with ${args[0]}`);
        return deferred.reject(args[0])
      }
      if(args[1]) {
        return deferred.resolve(args[1])
      }
    }
  }
}

const startstopCb = function(deferred, lateError) {
  return (...args) => {
    if(deferred.promise.isFulfilled()){
      /**
       * TODO - What does this do?
       * @author - Jim Bulkowski
       * @date - 1/26/18
       * @time - 10:50 PM
       */


    }

    if(!args.length) {
      return deferred.resolve(true)
    }
    if(_fp.isError(args[0])) {
      return deferred.reject(args[0])
    }
    if(_fp.isNull(args[0])) {
      return deferred.resolve(true)
    }
  }
}


const buildCallbackArgs = function(deferred, hookFn){
  let callbackArgs = []
  if(hookFn === 'load') {
    callbackArgs.push(this.PluginDI.inject.bind(this.PluginDI))
    callbackArgs.push(loadCb(deferred, this.context.lateError))
  }
  else if(hookFn === 'start' || hookFn === 'stop'){
    callbackArgs.push(startstopCb(deferred, this.context.lateError))
  }

  return callbackArgs
}

module.exports = function(hookFn) {
  return function(deferred) {
    return Promise.try(() => {
      let callbackArgs = buildCallbackArgs.apply(this, [deferred, hookFn])

      this.startTimeout(deferred)
      let thenable = this.hooks[hookFn].apply(this.context, callbackArgs)

      return Promise.resolve(thenable)
    })
      .then((promiseResult) => {
        if(_fp.isUndefined(promiseResult)) {
          return deferred.promise
            .then((callbackResult) => {
              return callbackResult
            })
        }
        if(deferred.promise.isFulfilled()) {
          throw new Error('This hook has already been ran. This is usually due to using the callback API after returning a promise or value.')
        }

        deferred.resolve(promiseResult)
        return deferred.promise
      })
  }.bind(this)
}
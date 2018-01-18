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
const settleCallbackOrPromise_ = require('./settleCallback')

/**
 *
 * @module InjectableHooks
 */

function settleCallbackOrPromise(deferred, hookFn){
  return Promise.try(() => {
      this.startTimeout(deferred)

      let callbackArgs = [(...args) => {
        if(deferred.promise.isFulfilled()) {
          let error = new Error('This hook has already been ran. This is usually due to using the callback API after returning a promise or value.')
          this.FrameworkEvents.emit('lateError', error)
          return
        }

        if(!args.length){
          return deferred.resolve(true)
        }

        if(args.length === 1){
          if(_fp.isError(args[0])){
            console.log(`Rejecting with ${args[0]}`);
            return deferred.reject(args[0])
          }
          if(_fp.isNull(args[0])){
            console.log(`Rejecting with ${args[0]}`);
            return deferred.resolve(true)
          }
        }
        if(args.length === 2){
          if(_fp.isError(args[0])){
            console.log(`Rejecting with ${args[0]}`);
            return deferred.reject(args[0])
          }
          if(args[1]){
            return deferred.resolve(args[1])
          }
        }

      }]
      if(hookFn === 'load'){
        callbackArgs.unshift(this.PluginDI.inject.bind(this.PluginDI))
      }
      let thenable = this.hooks[hookFn].apply(this.context, callbackArgs)

      return Promise.resolve(thenable)
    })
    .then((promiseResult) => {
      if(_fp.isUndefined(promiseResult)){
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
}

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
    let resolved = false
    let scb = settleCallbackOrPromise_.apply(this, ['load']);
    return scb(deferred)
      .then((overallResult) => {
        this.setDependencies(overallResult)
        let toResolve = this.type === 'none' ? {done: true} : {to: 'injectDeps'}
        return toResolve
      })

    // return settleCallbackOrPromise.apply(this, [deferred, 'load'])
    //   .then((overallResult) => {
    //     this.setDependencies(overallResult)
    //     let toResolve = this.type === 'none' ? {done: true} : {to: 'injectDeps'}
    //     return toResolve
    //   })

    // return Promise.try(() => {
    //   this.startTimeout(deferred)
    //   let thenable = this.hooks.load.apply(this.context, [this.PluginDI.inject.bind(this.PluginDI), (...args) => {
    //     let resolvedElsewhere = testFulfilled.apply(this, [deferred,args[0]])
    //
    //     if(resolvedElsewhere){
    //       return
    //     }
    //     console.log(deferred.promise.isFulfilled(), this.ModuleName)
    //     if(args[0]){
    //       return deferred.reject(args[0])
    //     }
    //     if(args[1]){
    //       return deferred.resolve(args[1])
    //     }
    //   }])
    //   return Promise.resolve(thenable)
    // })
    //   .then((promiseResult) => {
    //     if(_fp.isUndefined(promiseResult)){
    //       return deferred.promise
    //         .then((callbackResult) => {
    //           return callbackResult
    //         })
    //     }
    //     if(deferred.promise.isFulfilled()) {
    //       throw new Error('This hook has already been ran. This is usually due to using the callback API after returning a promise or value.')
    //     }
    //
    //     deferred.resolve(promiseResult)
    //     return deferred.promise
    //   })
    //   .then((overallResult) => {
    //     this.setDependencies(overallResult)
    //     let toResolve = this.type === 'none' ? {done: true} : {to: 'injectDeps'}
    //     return toResolve
    //   })


    // return Promise.try(() => {
    //
    //     this.startTimeout(deferred)
    //     let thenable = this.hooks.load.apply(this.context, [this.PluginDI.inject.bind(this.PluginDI), (err, toInject) => {
    //       let resolvedElsewhere = testFulfilled.apply(this, [deferred,err])
    //
    //       if(resolvedElsewhere){
    //         return
    //       }
    //
    //       try {
    //         this.setDependencies(toInject)
    //         let toResolve = this.type === 'none' ? {done: true} : {to: 'injectDeps'}
    //         return deferred.resolve(toResolve)
    //       }
    //       catch (err) {
    //         err.plugin = this
    //         return deferred.reject(err)
    //       }
    //     }])
    //     return Promise.resolve(thenable)
    //   })
    //   .then((toInject) => {
    //
    //     if(_fp.isUndefined(toInject)) {
    //       return deferred.promise
    //     }
    //     if(deferred.promise.isFulfilled()) {
    //       throw new Error('This hook has already been ran. This is usually due to using the callback API after returning a promise or value.')
    //     }
    //
    //     this.setDependencies(toInject)
    //     let toResolve = this.type === 'none' ? {done: true} : {to: 'injectDeps'}
    //     deferred.resolve(toResolve)
    //     return deferred.promise
    //   })

  }
  ,
  start: function() {
    let deferred = defer()
    // return settleCallbackOrPromise.apply(this, [deferred, 'start'])
    let scb = settleCallbackOrPromise_.apply(this, ['start']);
    return scb(deferred)
      .then((result) => {
        return {done: true}
      })
    // return Promise.try(() => {
    //   this.startTimeout(deferred)
    //   let thenable = this.hooks.start.apply(this.context, [(err) => {
    //     let resolvedElsewhere = testFulfilled.apply(this, [deferred,err])
    //
    //     if(resolvedElsewhere){
    //       return
    //     }
    //     return deferred.resolve({done: true})
    //   }])
    //
    //   return Promise.resolve(thenable)
    // })
    //   .then((hookResult) => {
    //     if(_fp.isUndefined(hookResult)) {
    //       return deferred.promise
    //     }
    //     if(deferred.promise.isFulfilled()) {
    //       throw new Error('This hook has already ran. This is usually due to using the callback API after returning a promise or value.')
    //     }
    //     deferred.resolve({done: true})
    //     return deferred.promise
    //   })
  },
  stop: function() {
    let deferred = defer()
    let scb = settleCallbackOrPromise_.apply(this, ['stop']);
    return scb(deferred)
      .then((result) => {
        return {done: true}
      })
    // return Promise.try(() => {
    //   let rejected = false
    //   this.startTimeout(deferred)
    //   let thenable = this.hooks.stop.apply(this.context, [(err) => {
    //     let resolvedElsewhere = testFulfilled.apply(this, [deferred,err])
    //
    //     if(resolvedElsewhere){
    //       return
    //     }
    //     if(err) {
    //       err.plugin = this
    //       return deferred.reject(err)
    //     }
    //     return deferred.resolve({done: true})
    //
    //   }])
    //
    //   return Promise.resolve(thenable)
    // })
    //   .then((hookResult) => {
    //     if(_fp.isUndefined(hookResult)) {
    //       return deferred.promise
    //     }
    //     if(deferred.promise.isFulfilled()) {
    //       throw new Error('This hook has already ran. This is usually due to using the callback API after returning a promise or value.')
    //     }
    //     deferred.resolve({done: true})
    //     return deferred.promise
    //   })
  }
}
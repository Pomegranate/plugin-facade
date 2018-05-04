/**
 * @file LoggerHooks
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

/**
 *
 * @module LoggerHooks
 */

const _fp = require('lodash/fp')
const Promise = require('bluebird')
const raceTimeout = require('./raceTimeout')

module.exports = {
  installLogger: function() {
    return Promise.try(() => {
      if(!_fp.isFunction(this.pendingInstallation)){
        throw new Error('Logger plugin logHandler must be a function.')
      }

      this.FrameworkDI.get('LogManager').addHandler(this.pendingInstallation)

      return {to: 'done'}
    })
  }
  ,
  load: function(){
    return raceTimeout.apply(this, ['load'])
      .then((toInstall) => {
        this.pendingInstallation = toInstall
        return {to: 'installLogger'}
      })
  }
}
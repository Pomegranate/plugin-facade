/**
 * @file walkReduce
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

const Promise = require('bluebird');
const fs = require('fs-extra')
const path = require('path');
const _fp = require('lodash/fp')
const fileBaseName = require('./fileBaseName')
const walkWorkDir = require('./walkWorkDir')
const defaultOpts = _fp.defaults({hidden: false, ext: false})
const isHidden = /^\..*/

/**
 *
 * @module walkReduce
 */

function walkReduce(files, reduced, reduceFn = (file)=>{return file}){
  return Promise.reduce(files, (returnObj, file) => {
    if(file.directory){
      let o = returnObj[file.getBaseName()] = {}
      return file.walk()
        .then((files) => {
          return walkReduce(files, o, reduceFn)
        })
        .then(() => {
          return returnObj
        })

    }
    return Promise.try(() => {
      return reduceFn(file)

    })
      .then((result) => {
        returnObj[file.getBaseName()] = result
        return returnObj
      })

  }, reduced)
}

module.exports = function(searchPath){
  return function fileListDeep(options = {}, reduceFn){
    options = defaultOpts(options);
    let walkDir = walkWorkDir(searchPath)
    return walkDir(options)
      .then((files) => {
        return walkReduce(files, {}, reduceFn)
      })
  }
}
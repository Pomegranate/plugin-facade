/**
 * @file fileListNested
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const Promise = require('bluebird');
const fs = require('fs-extra')
const path = require('path');
const _fp = require('lodash/fp');
const fileBaseName = require('./fileBaseName')
const defaultOpts = _fp.defaults({hidden: false, ext: false})
const hiddenFile = /^\..*/;
/**
 *
 * @module fileListNested
 */

function buildFilePath(searchPath, reducer, options) {
  return fs.readdir(searchPath)
    .then(function(files) {

      return Promise.reduce(files, function(returnObj, file) {
        let sp = path.join(searchPath, file)

        if(!options.hidden) {
          let hidden = hiddenFile.test(file)
          if(hidden) {
            return returnObj
          }
        }

        return fs.stat(sp)
          .then(function(fileStat) {

            if(fileStat.isDirectory()) {

              let o = returnObj[file] = {}

              return buildFilePath(sp, o, options)
                .then(function() {
                  return reducer
                })
            }

            if(fileStat.isFile()) {
              if(options.ext) {
                let matchesExt = path.parse(file).ext === options.ext;
                if(!matchesExt) return returnObj
              }
              returnObj[fileBaseName(file)] = sp
            }

            return returnObj
          })
      }, reducer)
    })
}

module.exports = function(searchPath){
  return function fileListNested(options = {}){
    options = defaultOpts(options);
    return buildFilePath(searchPath, {}, options)
  }
}
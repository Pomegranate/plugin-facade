/**
 * @file walkWorkDir
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const Promise = require('bluebird');
const fs = require('fs-extra')// Promise.promisifyAll(require('fs-extra'))
const path = require('path');
const _fp = require('lodash/fp')
const fileBaseName = require('./fileBaseName')
const defaultOpts = _fp.defaults({hidden: false, ext: false})
const isHidden = /^\..*/

/**
 *
 * @module walkWorkDir
 */
function getBaseName(filePath){
  return function(uppercase = false){
    return fileBaseName(filePath, uppercase)
  }
}

function wrapBuildFilePath(filePath, options){
  return function(){
    return buildFilePath(filePath, options)
  }
}

function buildFilePath(filepath, options){
  return fs.readdir(filepath)
    .then((files) => {
      return Promise.filter(files,(file) => {
        if(options.hidden){
          return true
        }
        return !isHidden.test(file)
      })
    })
    .then((files) => {
      return Promise.map(files, (file) => {
        let p = path.join(filepath, file)
        return fs.stat(p)
          .then((stat) => {
            if(stat.isDirectory()){
              return {
                path: p,
                filename: file,
                directory: true,
                file: false,
                walk: wrapBuildFilePath(p, options),
                getBaseName: getBaseName(p)
              }
            }
            if(options.ext){
              if(path.parse(p).ext === options.ext){
                return {
                  path: p,
                  filename: file,
                  directory: false,
                  file: true,
                  walk: null,
                  getBaseName: getBaseName(p)
                }
              } else {
                return false
              }
            }

            return {
              path: p,
              filename: file,
              directory: false,
              file: true,
              walk: null,
              getBaseName: getBaseName(p)
            }
          })
      })
    })
    .then((files) => {
      return _fp.filter(Boolean,files)
    })
    .then((files) => {
      return _fp.reduce((a,b) => {
        return a.concat(b)
      }, [], files)
    })
}

module.exports = function(searchPath){
  return function walkWorkDir(options = {}){
    options = defaultOpts(options);
    return buildFilePath(searchPath, options)
  }
}
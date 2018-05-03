/**
 * @file fileListDeep
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const Promise = require('bluebird')
const fs = require('fs-extra')
const path = require('path')
const _fp = require('lodash/fp')
const fileBaseName = require('./fileBaseName')
const defaultOpts = _fp.defaults({hidden: false, ext: false})
const isHidden = /^\..*/
/**
 *
 * @module fileListDeep
 */
// function getBaseName(filePath){
//   return function(uppercase = false){
//     return fileBaseName(filePath, uppercase)
//   }
// }

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
              return buildFilePath(p, options)
            }
            if(options.ext){
              return path.parse(p).ext === options.ext ? p : false;
            }

            return p
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
  return function fileListDeep(options = {}){
    options = defaultOpts(options);
    return buildFilePath(searchPath, options)
  }
}
/**
 * @file fileList
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
const defaultOpts = _fp.defaults({hidden: false, ext: false, directories: false})
const isHidden = /^\..*/
/**
 *
 * @module fileList
 */

function getBaseName(filePath){
  return function(uppercase = false){
    return fileBaseName(filePath, uppercase)
  }
}

module.exports = function(searchPath){
  return function(options = {}){
    options = defaultOpts(options);
    return fs.readdir(searchPath)
      .then((files) => {
        if(!options.hidden){
          files = _fp.filter((file) => {
            return !isHidden.test(file)
          }, files)
        }

        if(options.ext){
          files = _fp.filter((file)=>{
            return path.parse(file).ext === options.ext
          }, files)
        }

        return Promise.filter(files, (file) => {
          return fs.stat(path.join(searchPath, file))
            .then((stat) => {
              if(options.directories) return stat.isDirectory()
              return stat.isFile()
            })
        }).then((files) => {
          return Promise.map(files, (file) => {
            let filePath = path.join(searchPath, file)
            return {
              path: filePath,
              filename: file,
              getBaseName: getBaseName(filePath)
            }
          })
        })
      })
  }
}
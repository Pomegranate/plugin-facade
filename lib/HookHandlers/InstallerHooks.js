/**
 * @file InstallerHooks
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const Promise = require('bluebird')
const defer = require('../defer')
const fs = Promise.promisifyAll(require('fs-extra'));
const path = require('path')
const raceTimeout = require('./raceTimeout')
/**
 *
 * @module ActionHooks
 */

module.exports = {
  install: function() {
    return Promise.try(() => {
      let deferred = defer()
      let rejected = false
      let workDirs = this.FrameworkDI.get('WorkDirs')
      this.startTimeout(deferred)
      this.clearTimeout()


      let installTargets = Promise.map(this.pendingInstallation, (fileObj) => {

        let expectedWorkDir = workDirs[fileObj.to].workDir
        let expectedOutput = path.join(expectedWorkDir,fileObj.dest)
        return fs.statAsync(expectedWorkDir)
          .then((stats) => {
            if(stats.isDirectory()){
              return fs.statAsync(expectedOutput)
            }
            throw new Error('Target installation work directory does not exist.')
          })
          .then((stats) => {
            if(stats.isDirectory() || stats.isFile()){
              this.PluginLogger.log(`Installation target ${fileObj.dest} for ${fileObj.to} exists, skipping.`);
              return false
            }
            return fileObj
          })
          .catch((err)=>{
            if(err.code === 'ENOENT'){
              this.PluginLogger.log(`Installing ${fileObj.to} files to work directory destination ${fileObj.dest}`);
              return fs.copyAsync(fileObj.src, path.join(expectedWorkDir,fileObj.dest))
            }
            throw err
          })
      })

      installTargets.then(() => {
        return deferred.resolve({done: true})
      })


      return deferred.promise
    })
  },
  load: function(){
    return raceTimeout.apply(this, ['installer'])
      .then((toInstall) => {
        this.pendingInstallation = toInstall
        return {to: 'install'}
      })
    // return Promise.try(() => {
    //   let deferred = defer()
    //   let rejected = false
    //   this.startTimeout(deferred)
    //   let workDirs = this.FrameworkDI.get('WorkDirs')
    //   console.log(workDirs)
    //
    //
    //
    //   this.installerHook.apply(this.context, [workDirs, (err, toInstall) => {
    //     this.pendingInstallation = toInstall
    //     this.clearTimeout()
    //     if(err){
    //       err.plugin = this
    //       return deferred.reject(err)
    //     }
    //     return deferred.resolve({to: 'install'})
    //
    //   }])
    //
    //   return deferred.promise
    // })
  }
}
/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const Promise = require('bluebird')
const fs = require('fs-extra')
const path = require('path')
/**
 *
 * @module index
 */

module.exports = function commandMode(){
  return {
    build: (args) => {
      let workDir = this.IProperty('getComputedDirectory')()
      let rawOptions = this.IProperty('options')
      let psp = this.FrameworkDI.get('Options').pluginSettingsDirectory.path
      let settingsPath = path.join(psp, `${this.IProperty('parentModule')}.js`)

      let buildData = {
        ModuleName: this.ModuleName,
        parentModule: this.IProperty('parentModule'),
        configName: this.configName,
        defaultOptions: this.IProperty('options'),
        namespace: this.namespace,
        multiple: this.multiple,
        external: this.external,
        internal: this.internal,
        system: this.system
      }

       return Promise.try(() => {
         if(workDir){
           let relative = path.relative(process.cwd(), workDir)
           return fs.pathExists(workDir)
             .then((workDirExists) => {
               if(workDirExists) {

                 console.log(`./${relative} exists, create skipped.`);
                 return buildData
               }
               return fs.ensureDir(workDir)
                 .then(() => {
                   console.log(`./${relative} created.`)
                   return buildData
                 })

             })
         }

         return buildData
       })
    }
  }
}
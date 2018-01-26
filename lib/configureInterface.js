/**
 * @file configurePlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _ = require('lodash')
const fs = require('fs')
const path = require('path')

/**
 *
 * @module configurePlugin
 */

/**
 *  Bound to instance of PluginInterface
 */
module.exports = function(){
  this.timeout = this.FrameworkDI.get('Options').timeout;
  this.prefix = this.FrameworkDI.get('PrefixSelector')(this.ModuleName)
  this.nameGenerator = this.FrameworkDI.get('NameGenerator')(this.prefix)
  this.commandMode = this.FrameworkDI.get('Options').commandMode;
  this.parentDirectory = this.FrameworkDI.get('Options').parentDirectory;
  this.applicationDirectory = this.FrameworkDI.get('Options').applicationDirectory;
  this.parentModule = generateParentName.apply(this);
  this.configName = generateConfigName.apply(this)
  this.computedOptions = computeConfig.apply(this);
  this.FrameworkLogger = this.FrameworkDI.get('FrameworkLogger')
  // this.Logger = this.FrameworkDI.get('LoggerBuilder')(this.FrameworkDI.get('Logger'), this.configName, this.FrameworkDI.get('Output'), this.FrameworkDI.get('Output').verbose);
  this.Logger = console
}


function generateParentName(){
  return this.nameGenerator(this.ModuleName)
};

function generateConfigName(){
  if(this.multiple){
    return this.metadata.name
  }
  return generateParentName.apply(this)
};

function computeConfig(pluginSettings){
  let pluginSettingsDirectory = this.FrameworkDI.get('Options').pluginSettingsDirectory
  let external = getExternalOptions.apply(this, [pluginSettingsDirectory]);
  let config;
  if(external){
    this.enabled = (!external.disabled)
    if(!this.enabled){ return false }
  }

  if(this.options) {
    // Override defaults if external options are set for this plugin.
    let clonedOptions = _.cloneDeep(this.options);

    if(external){
      // replace default configs with external config values if present.
      // Trying to use _.merge here breaks on arrays.
      config = _.mapValues(clonedOptions, function(v, k){
        //TODO: maybe put a validator on this to match type.
        if(external[k]){
          return external[k]
        }
        return v
      })
    } else {
      config = clonedOptions;
    }

    let workDir = config.workDir;
    if(workDir) {
      let absoluteWorkdir = path.join(this.applicationDirectory, workDir);
      config.workDir = absoluteWorkdir
      let stats
      try {
        stats = fs.statSync(absoluteWorkdir)
      }
      catch(err){
        this.valid = false;
        let e = new this.FrameworkErrors.PluginConstructionError(err.message, this.configName)
        this.ErrorAccumulator.push(e);
      }
      if(stats && stats.isDirectory()) {
        config.workDir = absoluteWorkdir;
      } else {
        this.valid = false;
        let e = new this.FrameworkErrors.PluginConstructionError(absoluteWorkdir + ' is not a directory.', this.configName)
        this.ErrorAccumulator.push(e);
      }
    }
  } else {
    config = {}
  }

  /*
   * If there is an external config for this plugin, but no default options the only
   * valid configuration properties are "disabled" and additionalDependencies
   */
  if(external){
    config.additionalDependencies = external.additionalDependencies
    this.enabled = (!external.disabled)
  }
  return config || false
};

function getExternalOptions(pluginSettings){
  let self = this;
  let ExternalOptions;
  if(pluginSettings.path){
    let configName = this.multiple ? this.parentModule : this.configName;
    let settingMatch = _.some(pluginSettings.files,function(file){
      return file === configName
    })


    if(settingMatch){
      let settingsThing = require(path.join(pluginSettings.path, configName))
      let loadedOptionsThing  = settingsThing[configName];
      if(_.isFunction(loadedOptionsThing)){
        loadedOptionsThing = this.PluginDI.inject(loadedOptionsThing);
      }
      if(this.multiple) {
        return loadedOptionsThing[this.configName] || false
      }
      return loadedOptionsThing
    }
  }

  return false;

};
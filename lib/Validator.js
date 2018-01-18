/**
 * @file Validation
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _fp = require('lodash/fp')
/**
 *
 * @module Validation
 */


class Validator{
  constructor(PluginData){
    this.multiplePlugin = PluginData.multiple || false
    this.Module = PluginData.module
    this.moduleName = PluginData.moduleName
    this.ErrorAccumulator = []
    this.availableTypes = ['dynamic', 'factory', 'installer', 'instance', 'merge', 'none', 'action', 'override', 'service']
    this.hookMethods = ['load', 'start', 'stop']


  }

  _validDeclaredName(metadata) {

    if(!metadata.name && !metadata.displayName) {
      this.valid = false;
      this.ErrorAccumulator.push(new Error('metadata.name or metadata.displayName missing'))
      return false
    }
    return metadata.name || metadata.displayName
  }


  _validType(type) {
    if(!type) {
      this.valid = false;
      this.ErrorAccumulator.push(new Error('metadata.type missing, must be one of the following ' + this.availableTypes.join(', ')))
      return false
    }

    if(!_fp.includes(type, this.availableTypes)) {
      this.valid = false
      this.ErrorAccumulator.push(new Error('metadata.type "' + type + '" must be one of the following ' + this.availableTypes.join(', ')))
      return false
    }
    return type
  }

  _isBindable(func){
    return func.hasOwnProperty('prototype');
  }


  _allHooksBindable(loadedHooks){
    return _fp.every(Boolean,
    _fp.map((item) => {
      let fn = loadedHooks[item]
      if( _fp.isFunction(fn) ){
        if(this._isBindable(fn)){
          return true
        }
        let errNoBound = `Plugin hook function "${item}" must be unbound. Are you using an arrow function?`
        this.ErrorAccumulator.push(new Error(errNoBound))
        return false
      }
      this.ErrorAccumulator.push(new Error(`Missing hook function: ${item}`));
      return false

    },
      this.hookMethods))
  }

  isMultiple(){
    return this.multiplePlugin
  }
  getType(){
    return this.Module.metadata.type
  }

  getModulename(){
    let name = this.moduleName
    if(!name){
      this.valid = false;
      this.ErrorAccumulator.push(new Error('Plugin is missing modulename'))
      return false
    }
    return name
  }
  /**
   * Validates a loaded plugins exported option object.
   * @param {Object} options
   * @returns {Object | Boolean}
   */
  getOptions() {
    let options = this.Module.options
    if(!_fp.isObject(options) || !_fp.keys(options).length){
      return false
    }
    return options
  }

  /**
   * Validates a loaded plugins exported metadata object.
   *
   * @param {Object} metadata
   * @returns {Object | Boolean}
   */
  getMetadata() {
    let metadata = this.Module.metadata
    if(!_fp.isObject(metadata) || !_fp.keys(metadata).length) {
      this.valid = false;
      this.ErrorAccumulator.push(new Error('Metadata missing or invalid'));
      return false
    }
    metadata.displayName = this._validDeclaredName(metadata)
    metadata.type = this._validType(metadata.type);

    if(!metadata.displayName || !metadata.type){
      this.valid = false

      return false
    }
    return metadata
  }

  /**
   * Validates a loaded plugins exported plugin object.
   *
   * @param {Object} plugin
   * @returns {Object | Boolean}
   */
  getHooks() {
    let plugin = this.Module.plugin
    let missing = [];
    if(_fp.get('Module.metadata.type', this) === 'installer'){
      return false
    }
    if(!_fp.isObject(plugin)) {
      this.valid = false;
      this.ErrorAccumulator.push(new Error('Does not contain a plugin property'));
      return false
    }

    // let vp = _fp.compose(_fp.every(Boolean),_fp.map((v) => {
    //   let isFn = _.isFunction(plugin[v]);
    //   if(!isFn) missing.push(v)
    //   return isFn
    // }))

    // console.log(this._validHooks(plugin));
    // let valid = vp(this.hookMethods)
    let allValid = this._allHooksBindable(plugin)
    if(allValid){
      return plugin
    }

    this.valid = false
    return false
  }

  getOverride(){
    let override = this.Module.override
    if(!_fp.isObject(override) || !_fp.keys(override).length) {
      this.valid = false;
      this.ErrorAccumulator.push(new Error('Does not contain an override property.'));
      return false
    }
    return override
  }

  getInstaller(){
    let installer = this.Module.installer
    if(!_fp.isFunction(installer)) {
      this.valid = false;
      this.ErrorAccumulator.push(new Error('Installer property must be a function.'));
      return false
    }
    return installer
  }

  /**
   * Validates a loaded plugins exported errors object.
   *
   * @param {Object} errors
   * @returns {Object | Boolean}
   */
  getErrors() {
    let errors = this.Module.errors
    if(_fp.isObject(errors)) {

      return _fp.pickBy((err) => {
        return (err.prototype && err.prototype.name === 'Error')
      }, errors)

    }
    return false
  }

  getCommands(){
    let commands = this.Module.commands
    if(_fp.isObject(commands)){
      return commands
    }
    return false
  }
  getValidatorErrors(){
    return this.ErrorAccumulator
  }
}

module.exports = Validator
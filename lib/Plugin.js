/**
 * @file Plugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const UUIDv4 = require('uuid').v4
const Promise = require('bluebird')
const _fp = require('lodash/fp')
const Validator = require('./Validator')
const CreateInterface = require('./CreateInterface')
const debug = require('debug')('@pomegranate/plugin-facade:plugin')

const plugins = new WeakMap()
const priv = function(thisArg) {
  if(!plugins.has(thisArg)) {
    plugins.set(thisArg, {});
  }
  return plugins.get(thisArg);
}

const validateRawModuleName = function(pluginData, ErrorAccumulator) {
  if(_fp.has('moduleName', pluginData)) {
    return pluginData.moduleName
  }
  ErrorAccumulator.push(new Error('Raw Plugin data is missing modulename.'))
}

const validateRawMetadata = function(pluginData, ErrorAccumulator) {
  if(_fp.has('module.metadata', pluginData)) {
    return pluginData.module.metadata
  }
  ErrorAccumulator.push(new Error('Raw Plugin data is missing metadata.'))
}

const getPomFrameworkVersion = function(pluginData, ErrorAccumulator){
  if(_fp.has('module.metadata.frameworkVersion', pluginData)) {
    return pluginData.module.metadata.frameworkVersion
  }
  return 5
}

class Plugin {
  constructor(pluginData) {
    this.ErrorAccumulator = []
    this.pluginData = pluginData
    this.ModuleName = validateRawModuleName(pluginData, this.ErrorAccumulator)
    this.UUID = UUIDv4()
    this.count = 0

    this.machine = {
      previous: null,
      current: 'uninitialized',
      requested: null
    }

    this.state = {
      initialize: false,
      configure: false,
      load: false,
      start: false,
      stop: false,
      error: false
    }

    this.multiple = pluginData.multiple || false
    this.external = pluginData.external
    this.internal = pluginData.internal
    this.system = pluginData.systemPlugin

    if(pluginData.requireErrors){
      this.ErrorAccumulator.concat(pluginData.requireErrors)
      return this
    }

    let p = priv(this)
    this.metadata = validateRawMetadata(pluginData, this.ErrorAccumulator)

    p.Validator = new Validator(pluginData)
  }

  _canRun(hook){

    if(this.hasErrors()){
      return false
    }
    if(hook === 'load'){
      return (this.state.initialize && this.state.configure)
    }
    if(hook === 'start'){
      return (this._canRun('load') && this.state.load)
    }
    if(hook === 'stop'){
      return (this._canRun('start') && this.state.start)
    }
  }

  _skip(hook){
    this.PluginLogger.log(`${hook} hook skipped.`, 1)
    return Promise.resolve(this)
  }

  _idle() {
    return Promise.resolve(this)
  }

  _error(){
    let p = priv(this)
    let errs = this.getErrors()
    let s = [errs.PluginErrors, errs.ValidationErrors, errs.InterfaceErrors]
    p.Interface.callMessenger('outputErrors', s)
    return this
  }

  _transition(to) {
    if(this.machine.requested !== to) {
      this.machine.previous = this.machine.current
      this.machine.requested = to;
      this.PluginLogger.log(`Transitioning from ${this.machine.current} to ${to}.`, 4)

      if(this.machine.requested === 'error'){
        return this._error()
      }

      return this._run()
        .then((result) => {
          if(result) {
            this.machine.current = to
            if(result.to) {
              return this._transition(result.to)
            }
            if(result.done) {
              return this._transition('idle')
            }
            if(result.error) {
              return this._transition('error')
            }
            return this
          }
        })

    }
    return Promise.resolve(this)
  }

  _run() {
    return Promise.try(() => {
      this.PluginLogger.log(`Attempting to run ${this.machine.requested} `, 4)
      let states = priv(this).Interface
      let sT = _fp.isFunction(states[this.machine.requested]) ? states[this.machine.requested]() : this._idle()
      return sT
    })
  }

  getCommands(){
    let p = priv(this)
    return p.Interface.commands
  }

  initialize({FrameworkDI = {}, PluginDI = {}} = {}) {
    let p = priv(this)
    return Promise.try(() => {
        if(this.hasErrors()) {
          throw new Error('Could not initialize plugin due to previous errors.')
        }
        let p = priv(this)

        this.FrameworkDI = FrameworkDI
        this.PluginDI = PluginDI
        this.FrameworkErrors = FrameworkDI.get('FrameworkErrors')
        this.prefix = this.FrameworkDI.get('PrefixSelector')(this.ModuleName)
        this.nameGenerator = this.FrameworkDI.get('NameGenerator')(this.prefix)

        let logName = this.multiple ? this.metadata.name : this.ModuleName

        let PluginLogger = this.PluginLogger = this.FrameworkDI.get('LogManager').createLogger(this.nameGenerator(logName))
        // let PluginLogger = this.PluginLogger = this.FrameworkDI.get('LoggerFactory')(this.nameGenerator(logName))
        this.PluginLogger.log('Creating Plugin Interface.', 1)

        p.Interface = CreateInterface({
          PluginData: this.pluginData,
          Validator: p.Validator,
          FrameworkDI: this.FrameworkDI,
          PluginDI: this.PluginDI,
          PluginLogger: this.PluginLogger,
          multiple: this.multiple
        })

        if(this.FrameworkDI.get('Options').commandMode){
          this.commandMethods = require('./CommandMode').apply(this)
        }

        return this
      })
      .then((result) => {
        let errs = this.getErrors()
        if(errs.hasErrors){
          let s = [errs.PluginErrors, errs.ValidationErrors, errs.InterfaceErrors]
          p.Interface.callMessenger('outputErrors', s)
        } else {
          p.Interface.callMessenger('initialized')
        }
        this.state.initialize = true
        return result
      })
      .catch(err => {
        debug(err)
        this.ErrorAccumulator.push(err)
        return this
      })
  }

  configure(availableParams) {
    let p = priv(this)

    return Promise.try(() => {
        let IFace = p.Interface
        IFace.configure(availableParams)

        /**
         * TODO - Do somethingg about this!!!!
         * Need a better way to get at interface stuff without a million proxy calls.
         * @author - Jim Bulkowski
         * @date - 12/12/17
         * @time - 2:20 AM
         */

        this.paramName = IFace.paramName
        this.configName = IFace.configName
        return this
      })
      .then((result) => {
        // this.PluginLogger.log('Configured with no errors.', 1)
        this.state.configure = true
        p.Interface.callMessenger('configured')
        return result
      })
      .catch((err) => {
        debug(err)
        this.ErrorAccumulator.push(err)
        return this
      })
  }

  getSortProperties() {
    let IFace = priv(this).Interface
    return {
      configName: IFace.configName,
      paramName: IFace.paramName || false,
      depends: IFace.depends || [],
      provides: IFace.provides || [],
      optional: IFace.optional || []
    }
  }

  validPlugin(loadedModules, availableParams) {
    this.metDepends = this.metDepends ? this.metDepends : this.checkDepends(loadedModules, availableParams)
    return this.metDepends
  }

  checkDepends(loadedModules, availableParams) {
    let IFace = priv(this).Interface

    let hasDeps = _fp.intersection(IFace.depends, loadedModules)
    let hasParams = _fp.intersection(IFace.depends, availableParams)

    this.PluginLogger.log('depends', IFace.depends, 4)
    this.PluginLogger.log('provides', IFace.provides, 4)


    let metDeps = (hasDeps.length + hasParams.length >= IFace.depends.length)
    if(!metDeps) {
      let missing = _fp.difference(IFace.depends, loadedModules);
      let other = _fp.difference(IFace.depends, availableParams);
      let message = 'Unmet outside dependencies. \n' +
        'This plugin requires the following additional plugins to function \n' +
        missing.join(', ');

      this.ErrorAccumulator.push(new this.FrameworkErrors.PluginConstructionError(message, this.ModuleName))
    }

    return metDeps
  }

  IProperty(prop) {
    let IFace = priv(this).Interface
    let p = _fp.get(prop, IFace)

    if(_fp.isFunction(p)) {
      return p.bind(IFace)
    }
    return p
  }

  getInterface() {
    return priv(this).Interface
  }

  getManager() {
    return priv(this).StateManager
  }

  hasErrors() {
    let p = priv(this)
    let valErrln = p.Validator ? p.Validator.getValidatorErrors().length : 0
    let iFaceErrln = p.Interface ? p.Interface.getErrors().length : 0
    return !!(this.ErrorAccumulator.length + valErrln + iFaceErrln)
  }

  getErrors(withStacks) {
    let p = priv(this)
    let InterfaceErrors = p.Interface ? p.Interface.getErrors(withStacks) : []

    if(withStacks) {
      return {
        hasErrors: this.hasErrors(),
        ModuleName: this.ModuleName,
        PluginErrors: this.ErrorAccumulator,
        ValidationErrors: p.Validator.getValidatorErrors(),
        InterfaceErrors
      }
    }
    return {
      hasErrors: this.hasErrors(),
      ModuleName: this.ModuleName,
      PluginErrors: _fp.map((err) => {
        return err.message
      }, this.ErrorAccumulator),
      ValidationErrors: _fp.map((err) => {
        return err.message
      }, p.Validator.getValidatorErrors()),
      InterfaceErrors
    }
  }

  setOverrideHooks(hooks){
    let IFace = priv(this).Interface
    IFace.setHooks(hooks)

  }

  runHook(hook) {
    let canRun = this._canRun(hook)
    this.PluginLogger.log(`${hook} ${canRun ? 'can': 'can not'} run.`, 4)
    if(this._canRun(hook)){
      return this._transition(hook)
        .then((result) => {
          this.state[hook] = true
          return result
        })
        .catch((err) => {
          this.ErrorAccumulator.push(err)
          return this._transition('error')
        })
    }

    return this._skip(hook)

  }

  runCommand(command, args){
    return Promise.try(() => {
      return this.commandMethods[command](args)
    })
  }

}

module.exports = Plugin
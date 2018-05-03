/**
 * @file _PluginInterface
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _fp = require('lodash/fp')
const Promise = require('bluebird')
const configureInterface = require('../configureInterface')
const Context = require('../Context')
const FileHelpers = require('../FileHelpers')
const Dependency = require('../Dependency')
const CreateMessenger = require('../Messenger')
const InjectableHooks = require('../HookHandlers/InjectableHooks')

/**
 *
 * @module PluginInterface
 */

class PluginInterface {
  constructor({PluginData,Validator, FrameworkDI, PluginDI, PluginLogger}) {
    this.FrameworkDI = FrameworkDI
    this.ParentDI = PluginDI
    this.PluginDI = PluginDI.createChild()
    this.PluginLogger = PluginLogger
    this.FrameworkEvents = FrameworkDI.get('FrameworkEvents');
    this.FrameworkErrors = FrameworkDI.get('FrameworkErrors');
    this.ErrorAccumulator = []

    // Validated Properties
    this.frameworkVersion = Validator.getFrameworkVersion()
    this.multiple = Validator.isMultiple();
    this.type = Validator.getType()
    this.ModuleName = Validator.getModulename()
    this.options = Validator.getOptions()
    this.metadata = Validator.getMetadata()
    this.hooks = Validator.getHooks()
    this.errors = Validator.getErrors()
    this.commands = Validator.getCommands()
    this.Messenger = CreateMessenger({PluginLogger: this.PluginLogger, Type: this.type, Version: this.frameworkVersion})
    this.Messenger.initializing()
    //Derived Properties
    // This should be refactored to be more functional.
    // Find Usages and use the underlying data directly, rather than stuffing it into a useless param.
    this.enabled = true

    /**
     * TODO - displayname is optional, does this need a check for undefined?
     * @author - Jim Bulkowski
     * @date - 12/13/17
     * @time - 1:20 AM
     */

    this.declaredName = this.metadata.name || this.metadata.displayName
    this.paramName = this.metadata.param || false;

    // Computed Properties
    configureInterface.apply(this)

    if(this.errors) {
      this.PluginDI.merge('Errors', this.errors)
    }

    this.dependencyNameArray = []
    this.context = Context.apply(this)
    // console.log(this.context)
    this.PluginLogger.log('Interface Constructed.', 4)
  }

  clearTimeout(){
    this.PluginLogger.warn(`Clearing timeout.`, 4)
    clearTimeout(this.hookTimeout)
  }
  startTimeout(defer){
    this.PluginLogger.log(`Timeout started, expiring in ${this.timeout}ms`,2)
    this.hookPromise = defer
    clearTimeout(this.hookTimeout)
    this.hookTimeout = setTimeout(() => {
      this.PluginLogger.error(`Timeout expired`,4)
      this.hookPromise.reject(new Error(`Timeout exceeded (${this.timeout}ms) attempting to load ${this.configName}`))
    }, this.timeout)
  }
  recycleTimeout(){
    this.PluginLogger.log(`Hook timeout manually postponed for an additional ${this.timeout}ms`,2)
    clearTimeout(this.hookTimeout)
    this.hookTimeout = setTimeout(() => {
      this.hookPromise.reject(new Error(`Timeout exceeded (${this.timeout}ms) attempting to load ${this.configName}`))
    }, this.timeout)
  }

  getErrors(withStacks) {
    if(withStacks) {
      return this.ErrorAccumulator
    }
    return _fp.map((err) => {
      return err.message
    }, this.ErrorAccumulator)
  }

  getComputedDirectory() {
    return this.computedOptions && this.computedOptions.workDir || false
  }

  //Configure the interfaces dependencies, provided and optional dependencies.
  /**
   * TODO - Why was I using the NameGenerator here? Need to account for it on the other end.
   * @author - Jim Bulkowski
   * @date - 12/23/17
   * @time - 2:04 AM
   */

  setupChildInjector(){
    this.PluginLogger.log('Creating plugin injection Context.',3)
    this.PluginDI.service('LateError', (error) => {
      this.PluginLogger.error('Encountered a late error and cannot continue.')
      this.ErrorAccumulator.push(error)
      error.message && this.PluginLogger.error(error.message)
      this.FrameworkEvents.emit('lateError', error)
    })
    this.PluginDI.service('DelayTimeout', this.recycleTimeout.bind(this))
    this.PluginDI.service('Options', this.computedOptions || {})
    this.PluginDI.service('Logger', this.PluginLogger)
    this.PluginDI.service('PluginContext', {})

    if(_fp.has('computedOptions.workDir', this)){
      this.PluginLogger.log('Has a workDir, adding file handling methods to context.', 3)
      this.PluginDI.service('PluginFiles', FileHelpers(this.computedOptions.workDir))
    }
  }

  configure(availableParams) {

    this.setupChildInjector()

    this.Messenger.configuring()
    if(_fp.isArray(this.computedOptions.additionalDependencies)) {
      if(_fp.isArray(this.metadata.depends)) {
        [].push.apply(this.metadata.depends, this.computedOptions.additionalDependencies)
      }
      else {
        this.metadata.depends = this.computedOptions.additionalDependencies
      }
    }
    this.depends = _fp.map((dep) => {
      if(_fp.includes(dep, availableParams)) {
        return dep
      }
      return this.nameGenerator(dep)
    }, this.metadata.depends)


    this.provides = _fp.map((dep) => {
      if(_fp.includes(dep, availableParams)) {
        return dep
      }
      return this.nameGenerator(dep)
    }, this.metadata.provides)


    this.optional = _fp.map((dep) => {
      if(_fp.includes(dep, availableParams)) {
        return dep
      }
      return this.nameGenerator(dep)
    }, this.metadata.optional)

    if(this.paramName && (this.paramName !== this.configName)) {
      this.provides.push(this.paramName)
    }

  }

  setDependencies(Dependencies){
    if(!Dependencies) {
      this.dependencies = false
      return
    }
    if(_fp.isArray(Dependencies)){
      this.dependencies = _fp.map((dep) => {
        return new Dependency(this.configName, dep.param, dep.load, dep.type, this.FrameworkErrors)
      }, Dependencies)

      return
    }

    this.dependencies = new Dependency(this.configName, this.paramName, Dependencies, this.type, this.FrameworkErrors)
  }

  setHooks(hooks){
    this.Messenger.overridden()
    this.hooks = hooks
  }

  callMessenger(method, output){
    if(_fp.isFunction(this.Messenger[method])) this.Messenger[method](output)
  }

  dependenciesAreArray(){
    return _fp.isArray(this.dependencies)
  }

  error(){
    return Promise.resolve({done: true})
  }

  idle(){
    return Promise.resolve({done: true})
  }

  override() {
    console.log('override', this.declaredName);
    return Promise.resolve(this)
  }

  install() {
    return Promise.resolve({done: true})
  }

  injectDeps(){
    this.Messenger.injecting(this.dependencies)
    return InjectableHooks.injectDeps.apply(this)
      .then((result) => {
        this.Messenger.injected(this.dependencies)
        return result
      })
  }

  load() {
    this.Messenger.loading()
    return InjectableHooks.load.apply(this)
      .then((result) => {
        this.clearTimeout()
        this.Messenger.loaded()
        return result
      })
      .catch((err) => {
        this.hookPromise = null
        this.clearTimeout()
        this.ErrorAccumulator.push(err)
        throw new Error('Plugin load hook failed.')
      })
  }

  start() {
    this.Messenger.starting()
    return InjectableHooks.start.apply(this)
      .then((result) => {
        this.clearTimeout()
        this.Messenger.started()
        return result
      })
      .catch((err) => {
        this.hookPromise = null
        this.clearTimeout()
        this.ErrorAccumulator.push(err)
        throw new Error('Plugin start hook failed.')
      })
  }

  stop() {
    this.Messenger.stopping()
    return InjectableHooks.stop.apply(this)
      .then((result) => {
        this.clearTimeout()
        this.Messenger.stopped()
        return result
      })
      .catch((err) => {
        this.hookPromise = null
        this.clearTimeout()
        this.ErrorAccumulator.push(err)
        throw new Error('Plugin stop hook failed.')
      })
  }

}

module.exports = PluginInterface
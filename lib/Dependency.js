/**
 * @file Dependency
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _ = require('lodash');
const availableTypes = ['factory', 'service', 'instance', 'merge', 'dynamic', 'none'];
/**
 *
 * @module Dependency
 */

class Dependency {

  constructor(parent, name, dependency, type, Errors){
    if(!name){
      throw new Error('Returned dependency missing parameter name.')
    }

    this.FrameworkErrors = Errors
    this.parent = parent;
    this.name = this.originalName = name;
    this.type = validType(type);
    this.setDependencies = dependency
  }

  getName(){
    return this.name
  }
  inject(injector){
    try {
      injector[this.type](this.name, this.setDependencies);
    }
    catch(e){
      throw new this.FrameworkErrors.PluginDependencyError(e.message, this.parent, this.name)
    }
    return this
  }
}


function validType(type){
  if( _.includes(availableTypes, type) ) return type;
  return 'service'
}

module.exports = Dependency


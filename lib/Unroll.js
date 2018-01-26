/**
 * @file Unroll
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const fs = require('fs');
const path = require('path');
const _ = require('lodash')
const _fp = require('lodash/fp');
const debug = require('debug')('@pomegranate/plugin-facade:unroll');

const Plugin = require('./Plugin')

const clonePlugin = _fp.compose(_fp.omit('module'), _fp.clone)
const findOverrideName = _fp.compose()
/**
 *
 * @module Unroll
 */

module.exports = function(pluginData){
  let pluginModule = attemptLoad(pluginData.require)
  pluginData.module = pluginModule
  return unroll(pluginData)
}


function attemptLoad(requirePath){
  try {
    debug('Trying stock require. ' + requirePath)
    return require(requirePath);
  }
  catch(e) {
    debug('Stock require failed')
  }
  try {
    debug('Trying parent require. ' + requirePath)
    var prequire = require('parent-require');
    return prequire(requirePath)
  }
  catch(e){
    debug('Parent require failed')
  }
  try{
    debug('Trying to join process.cwd() with local node modules. ' + requirePath)
    return require(path.join(process.cwd(), 'node_modules', requirePath))
  }
  catch(e){
    debug('All loading methods failed for this plugin. ' + requirePath)
    e.failedRequire = requirePath
    throw e
  }
}




function mapPluginChildren(plugin){
  return _fp.map((child) => {
    let clone = clonePlugin(plugin)
    clone.multiple = true
    clone.module = child
    return unroll(clone)
  }, plugin.module)
}

function unroll(plugin){
  if(_fp.isArray(plugin.module)){
    return mapPluginChildren(plugin)
  }
  return new Plugin(plugin)
}

// function unrollPlugin(plugin, layers){
//
//   if(_.isArray(plugin.loaded)){
//     var overrideName = _.chain(plugin.loaded).remove(function(pin){
//       return _.isString(pin)
//     }).first().value()
//     console.log(overrideName, '****************************************************************');
//     return _.map(plugin.loaded, function(mPlugin){
//
//       if(overrideName){
//         plugin.moduleName = overrideName
//       }
//
//       var multiplePlugin = _.chain(plugin).clone().omit('loaded').value();
//       multiplePlugin.loaded = mPlugin;
//       if(!multiplePlugin.loaded.metadata) {
//         multiplePlugin.loaded.metadata = {}
//       }
//       multiplePlugin.loaded.metadata.multiple = true;
//
//       //TODO: Where is this even used?
//       // multiplePlugin.loaded.metadata.declaredName = multiplePlugin.loaded.metadata.name;
//
//       return unrollPlugin(multiplePlugin, layers)
//     })
//   }
//   return RawPlugin(plugin, layers);
// }
/**
 * @file CreateInterface
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const debug = require('debug')('@pomegranate/plugin-facade:CreateInterface')
const Interfaces = {
  action: require('./Interfaces/Action'),
  dynamic: require('./Interfaces/Dynamic'),
  factory: require('./Interfaces/Factory'),
  installer: require('./Interfaces/Installer'),
  instance: require('./Interfaces/Instance'),
  logger: require('./Interfaces/Logger'),
  merge: require('./Interfaces/Merge'),
  none: require('./Interfaces/None'),
  override: require('./Interfaces/Override'),
  service: require('./Interfaces/Service'),
}

/**
 *
 * @module CreateInterface
 */

module.exports = CreateInterface

function CreateInterface({PluginData,Validator, FrameworkDI, PluginDI, PluginLogger}){
  let meta = Validator.getMetadata()
  if(!meta){
    throw new Error('Could not construct the plugin interface.')
  }
  debug(meta.type)
  let Interface = Interfaces[meta.type]
  return new Interface({PluginData,Validator, FrameworkDI, PluginDI, PluginLogger})
}


/**
 * @file CreateInterface
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const Interfaces = {
  action: require('./Interfaces/Action'),
  dynamic: require('./Interfaces/Dynamic'),
  factory: require('./Interfaces/Factory'),
  installer: require('./Interfaces/Installer'),
  instance: require('./Interfaces/Instance'),
  merge: require('./Interfaces/Merge'),
  none: require('./Interfaces/None'),
  override: require('./Interfaces/Override'),
  service: require('./Interfaces/Service')
}

/**
 *
 * @module CreateInterface
 */

module.exports = CreateInterface

function CreateInterface({Validator, FrameworkDI, PluginDI, PluginLogger}){
  let meta = Validator.getMetadata()
  if(!meta){
    throw new Error('Could not construct the plugin interface.')
  }

  let Interface = Interfaces[meta.type]
  return new Interface({Validator, FrameworkDI, PluginDI, PluginLogger})
}


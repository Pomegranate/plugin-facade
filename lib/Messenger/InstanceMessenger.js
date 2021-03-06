/**
 * @file DynamicMessages
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const Messenger = require('./Messenger')
/**
 *
 * @module InstanceMessenger
 */

class InstanceMessenger extends Messenger{
  constructor({PluginLogger, Type, Version}){
    super({PluginLogger, Type, Version})
  }
}

module.exports = InstanceMessenger
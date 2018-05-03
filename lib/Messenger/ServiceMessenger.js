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
 * @module ServiceMessenger
 */

class ServiceMessenger extends Messenger{
  constructor({PluginLogger, Type, Version}){
    super({PluginLogger, Type, Version})
  }
}

module.exports = ServiceMessenger
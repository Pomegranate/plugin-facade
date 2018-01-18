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
 * @module FactoryMessenger
 */

class FactoryMessenger extends Messenger{
  constructor({PluginLogger, Type}){
    super({PluginLogger, Type})
  }
}

module.exports = FactoryMessenger
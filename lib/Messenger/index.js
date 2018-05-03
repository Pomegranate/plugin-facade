/**
 * @file CreateMessenger
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _fp = require('lodash/fp')

const ActionMessenger = require('./ActionMessenger')
const DynamicMessenger = require('./DynamicMessenger')
const FactoryMessenger = require('./FactoryMessenger')
const InstallerMessenger = require('./InstallerMessenger')
const InstanceMessenger = require('./InstanceMessenger')
const LoggerMessenger = require('./LoggerMessenger')
const MergeMessenger = require('./MergeMessenger')
const NoneMessenger = require('./NoneMessenger')
const OverrideMessenger = require('./OverrideMessenger')
const ServiceMessenger = require('./ServiceMessenger')

/**
 *
 * @module CreateMessenger
 */

const type = {
  action: ActionMessenger,
  dynamic: DynamicMessenger,
  factory: FactoryMessenger,
  installer: InstallerMessenger,
  instance: InstanceMessenger,
  logger: LoggerMessenger,
  merge: MergeMessenger,
  none: NoneMessenger,
  override: OverrideMessenger,
  service: ServiceMessenger
}

module.exports = function({PluginLogger, Type, Version}) {
  return new type[Type]({PluginLogger, Type, Version})
}
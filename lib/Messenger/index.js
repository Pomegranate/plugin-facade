/**
 * @file CreateMessenger
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _fp = require('lodash/fp')

const ActionMessager = require('./ActionMessenger')
const DynamicMessager = require('./DynamicMessenger')
const FactoryMessager = require('./FactoryMessenger')
const InstallerMessager = require('./InstallerMessenger')
const InstanceMessager = require('./InstanceMessenger')
const MergeMessager = require('./MergeMessenger')
const NoneMessager = require('./NoneMessenger')
const OverrideMessager = require('./OverrideMessenger')
const ServiceMessager = require('./ServiceMessenger')

/**
 *
 * @module CreateMessenger
 */

const type = {
  action: ActionMessager,
  dynamic: DynamicMessager,
  factory: FactoryMessager,
  installer: InstallerMessager,
  instance: InstallerMessager,
  merge: MergeMessager,
  none: NoneMessager,
  override: OverrideMessager,
  service: ServiceMessager
}

module.exports = function({PluginLogger, Type}) {
  return new type[Type]({PluginLogger, Type})
}
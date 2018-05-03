/**
 * @file missingHooksPlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

/**
 *
 * @module missingHooksPlugin
 */

exports.options = {
  workDir: '/mockWorkDir'
}

exports.metadata = {
  frameworkVersion: 6,
  name: 'servicePlugin',
  type: 'service',
  param: 'service',
  depends: ['servicePlugin']
}


exports.errors = {}

exports.commands = {}
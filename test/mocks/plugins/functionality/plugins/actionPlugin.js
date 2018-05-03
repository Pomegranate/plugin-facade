/**
 * @file actionPlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

/**
 *
 * @module actionPlugin
 */

exports.options = {
}

exports.metadata = {
  frameworkVersion: 6,
  name: 'actionPlugin',
  type: 'action'
}

exports.plugin = {
  load: function(tap, actionTest){
    tap.test('action test - load hook', (t) => {
      t.type(actionTest, 'object', 'Can access DI objects.')
      t.done()
    })
    actionTest.count += 98
  },
  start: function(actionTest){
    actionTest.count = 200
  },
  stop: function(actionTest){
    actionTest.count = 300
  }
}

exports.errors = {}

exports.commands = {}
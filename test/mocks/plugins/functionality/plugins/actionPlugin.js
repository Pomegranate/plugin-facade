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
  name: 'actionPlugin',
  type: 'action'
}

exports.plugin = {
  load: function(inject, loaded){
    let tap = inject('tap')
    this.actionTest = inject('actionTest')
    this.actionTest.count += 98
    tap.test('action test - load hook', (t) => {
      t.type(this.actionTest, 'object', 'Can access DI objects.')
      t.done()
    })
    let count = 0
    loaded(null)
  },
  start: function(done){

    this.actionTest.count = 200
    done()
  },
  stop: function(done){
    this.actionTest.count = 300
    done()
  }
}

exports.errors = {}

exports.commands = {}
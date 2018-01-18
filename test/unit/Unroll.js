/**
 * @file test
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";

const tap = require('tap')
const _fp = require('lodash/fp')
const Plugin = require('../../index')
const getPlugin = require('../mocks/getPlugin')
const PluginCtor = require('../../lib/Plugin')


tap.test('Unroll Single Plugin', (t) => {
  let pluginData = getPlugin('common/plugins/', 'action')
  let SP = Plugin(pluginData)
  t.type(SP, PluginCtor, "Has the correct class")
  t.equal(SP.getErrors().PluginErrors.length, 0, 'Has no Plugin errors after instantiation.')
  t.equal(SP.getErrors().InterfaceErrors.length, 0, 'Has no Interface errors after instantiation.')
  t.done()
})


tap.test('Unroll Multiple plugin', (t) => {
  let multiple = getPlugin('special', 'multiple')
  let MP = Plugin(multiple)
  t.type(MP, 'Array', 'Returns an array of plugins')

  _fp.each((plugin) => {
    t.test(`UUID: ${plugin.UUID}`,(tt) => {
      tt.type(plugin, PluginCtor, "Has the correct class")
      tt.equal(plugin.getErrors().PluginErrors.length, 0, 'Has no Plugin errors after instantiation.')
      tt.equal(plugin.getErrors().InterfaceErrors.length, 0, 'Has no Interface errors after instantiation.')
      tt.done()
    })
  }, MP)

  t.done()
})
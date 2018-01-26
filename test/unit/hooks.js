/**
 * @file hooks
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

const tap = require('tap')
const _fp = require('lodash/fp')
const Plugin = require('../../index')
const getPlugin = require('../mocks/getPlugin')
const PluginCtor = require('../../lib/Plugin')
const path = require('path')
const fs = require('fs')

const util = require('@pomegranate/test-utils')
const applicationBase = path.join(__dirname, '../mocks/plugins/common')
const pluginBase = path.join(applicationBase, 'plugins')
const testPlugins = fs.readdirSync(pluginBase)

/**
 *
 * @module hooks
 */

tap.test('Correct number of mock test plugins', (t) => {
  let count = testPlugins.length
  let expected = 10
  t.equal(count, expected, `Has the correct number of mock Plugins. (${expected})`)
  t.end()
})

_fp.each((plugin) => {
  tap.test(plugin, (t) => {
    let pluginData = getPlugin('common/plugins/', plugin)
    t.equal(pluginData.moduleName, plugin.split('.js')[0], 'Got correct mock.')

    let FrameworkDI = util.mockFrameworkInjector(false, {logLevel: 0}, applicationBase)
    let PluginDI = util.mockPluginDI()
    let SP = Plugin(pluginData)
    t.type(SP, 'Plugin', 'Correct Type')

    t.test('Initializing Plugin', (t) => {
      SP.initialize({FrameworkDI, PluginDI})
        .then((p) => {
          t.type(p, PluginCtor, 'Returns a plugin instance.')
          t.end()
        })
    })

    t.test('Configuring Plugin', (t) => {
      SP.configure()
        .then((p) => {
          t.type(p, PluginCtor, 'Returns a plugin instance.')
          t.end()
        })
    })

    t.test('Load Hook.', (t) => {

      SP.runHook('load')
        .then((p) => {
          t.type(p, PluginCtor, 'Returned object from runHook is Plugin')
          t.end()
        })
    })

    t.test('Start Hook.', (t) => {

      SP.runHook('start')
        .then((p) => {
          t.type(p, PluginCtor, 'Returned object from runHook is Plugin')
          t.end()
        })
    })

    t.test('Stop Hook.', (t) => {

      SP.runHook('stop')
        .then((p) => {
          t.type(p, PluginCtor, 'Returned object from runHook is Plugin')
          t.end()
        })
    })

    t.end()
  })
}, testPlugins)
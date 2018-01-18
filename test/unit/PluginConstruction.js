/**
 * @file TypeInstantiation
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
 * @module TypeInstantiation
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

    let SP = new Plugin(pluginData)


    t.test('Instantiation', (t) => {

      t.type(SP, PluginCtor, "Has the correct class")
      t.type(SP.UUID, 'string', 'Has a UUID.')
      t.notOk(SP.buildData, 'Private property "buildData" is not exposed.')
      t.notOk(SP.Validator, 'Private property "Validator" is not exposed.')
      t.equal(SP.getErrors().PluginErrors.length, 0, 'Has no Plugin errors after instantiation.')
      t.equal(SP.getErrors().InterfaceErrors.length, 0, 'Has no Interface errors after instantiation.')
      t.end()

    })
    t.test('Plugin Initialization', (t) => {
      let FrameworkDI = util.mockFrameworkInjector(false, {}, applicationBase)
      let PluginDI = util.mockPluginDI()

      SP.initialize({FrameworkDI, PluginDI})
        .then((p) => {
          t.type(p, PluginCtor, 'Returns a plugin instance.')
          t.equal(SP.getErrors().PluginErrors.length, 0, 'Has no Plugin errors after initialization.')
          t.equal(SP.getErrors().InterfaceErrors.length, 0, 'Has no Interface errors after initialization.')
          t.ok(p.PluginDI, 'Plugin Dependency Injector is set.')
          t.ok(p.FrameworkDI, 'Framework Dependency Injector is set.')
          t.ok(p.internal, 'Created as an internal plugin.')
          t.notOk(p.external, 'Not an external plugin.')
          t.notOk(p.system, 'Not a system plugin.')
          t.equal(p.getInterface().prefix, 'pomegranate', 'Derived the correct plugin prefix.')
          t.type(p.getInterface().nameGenerator, 'function', 'Created nameGenerator function.')
          t.end()
        })
    })

    t.end()
  })
}, testPlugins)
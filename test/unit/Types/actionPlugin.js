/**
 * @file actionPlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const tap = require('tap')
const _fp = require('lodash/fp')
const Plugin = require('../../../index')
const getPlugin = require('../../mocks/getPlugin')
const PluginCtor = require('../../../lib/Plugin')

const path = require('path')
const fs = require('fs')

const util = require('@pomegranate/test-utils')
const applicationBase = path.join(__dirname, '../../mocks/plugins/functionality')
const pluginBase = path.join(applicationBase, 'plugins')
const testPlugins = fs.readdirSync(pluginBase)

/**
 *
 * @module actionPlugin
 */

tap.test('Action Plugin', (t) => {
  let pluginData = getPlugin('functionality/plugins/', 'action')
  let SP = new Plugin(pluginData)

  t.type(SP, PluginCtor, "Has the correct class")

  let FrameworkDI = util.mockFrameworkInjector(false, {}, applicationBase)
  let PluginDI = util.mockPluginDI()
  PluginDI.service('tap', tap)
  PluginDI.service('actionTest', {count: 2})

  t.test('Initialize', (t) => {
    SP.initialize({FrameworkDI, PluginDI})
      .then((p) => {
        t.equal(p.IProperty('type'), 'action', "Interface has correct type.")
        t.done()
      })

  })

  t.test('Configure', (t) => {
    SP.configure(['dynamic', 'factory','instance','merge','service'])
      .then((p) => {
        t.ok(p.configName, 'Sets correct properties')
        t.done()
      })
  })

  t.test('Load Hook', (t) => {
    SP.runHook('load')
      .then((p) => {
        t.equal(PluginDI.get('actionTest').count, 100, 'Can mutate injector objects.')
        t.done()
      })
  })

  t.test('Start Hook', (t) => {
    SP.runHook('start')
      .then((p) => {
        t.equal(PluginDI.get('actionTest').count, 200, 'Can mutate injector objects.')
        t.done()
      })
  })

  t.test('Stop Hook', (t) => {
    SP.runHook('stop')
      .then((p) => {
        t.equal(PluginDI.get('actionTest').count, 300, 'Can mutate injector objects.')
        t.done()
      })
  })

  t.done()
})
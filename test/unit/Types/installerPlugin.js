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
const applicationBase = path.join(__dirname, '../../mocks/plugins/common')
const pluginBase = path.join(applicationBase, 'plugins')
const testPlugins = fs.readdirSync(pluginBase)

/**
 *
 * @module installerPlugin
 */

tap.test('Installer Plugin', (t) => {
  let pluginData = getPlugin('common/plugins/', 'installer')
  let SP = new Plugin(pluginData)
  t.type(SP, PluginCtor, "Has the correct class")
  let FrameworkDI = util.mockFrameworkInjector(false, {logLevel: 4}, applicationBase)
  let PluginDI = util.mockPluginDI()

  t.test('Initialize', (t) => {
    SP.initialize({FrameworkDI, PluginDI})
      .then((p) => {
        t.equal(p.IProperty('type'), 'installer', "Interface has correct type.")
        t.done()
      })

  })

  t.test('Configure', (t) => {
    SP.configure(['dynamic', 'factory','instance','merge','service'])
      .then((p) => {
        t.done()
      })
  })

  t.test('Load Hook', (t) => {
    SP.runHook('load')
      .then((p) => {
        t.done()
      })
  })

  t.test('Start Hook', (t) => {
    SP.runHook('start')
      .then((p) => {
        t.done()
      })
  })

  t.test('Stop Hook', (t) => {
    SP.runHook('stop')
      .then((p) => {
        t.done()
      })
  })

  t.done()
})
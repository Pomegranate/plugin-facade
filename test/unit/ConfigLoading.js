/**
 * @file ConfigLoading
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
 * @module ConfigLoading
 */

tap.test('Service Plugin', (t) => {
  let pluginData = getPlugin('common/plugins/', 'service')
  let SP = new Plugin(pluginData)
  t.type(SP, PluginCtor, "Has the correct class")
  let FrameworkDI = util.mockFrameworkInjector(false, {logLevel: 0}, applicationBase)
  let PluginDI = util.mockPluginDI()

  t.test('Initialize', (t) => {
    SP.initialize({FrameworkDI, PluginDI})
      .then((p) => {
        t.equal(p.IProperty('type'), 'service', "Interface has correct type.")
        t.equal(SP.getErrors().PluginErrors.length, 0, 'Has no Plugin errors after initialization.')
        t.equal(SP.getErrors().InterfaceErrors.length, 0, 'Has no Interface errors after initialization.')
        t.done()
      })

  })
  t.done()
})
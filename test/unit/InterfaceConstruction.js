/**
 * @file InstanceConstruction
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
const util = require('@pomegranate/test-utils')
const applicationBase = path.join(__dirname, '../mocks/plugins/common')
/**
 *
 * @module InterfaceConstruction
 */

tap.test('Instantiates correct action plugin.', (t) => {
  let pluginData = getPlugin('common/plugins', 'dynamic')
  let FrameworkDI = util.mockFrameworkInjector(false, {}, applicationBase)
  let PluginDI = util.mockPluginDI()
  let SP = Plugin(pluginData)
  t.type(SP, 'Plugin', 'Correct Type')

  t.test('Initializing Plugin', (t) => {
    SP.initialize({FrameworkDI, PluginDI})
      .then((plugin) => {
        t.type(plugin, PluginCtor, 'Returns a plugin instance.')
        t.end()
      })
  })


  t.test('Interface Initilization.', (t) => {
    let Interface = SP.getInterface()
    t.equal(SP.ModuleName, Interface.ModuleName, "Interface has same Modulename as Plugin");
    t.equal(Interface.prefix, 'pomegranate', 'Derived the correct plugin prefix.')
    t.type(Interface.FrameworkDI, 'MagnumDI')
    t.type(Interface.PluginDI, 'MagnumDI')
    t.type(Interface.ErrorAccumulator, 'Array')
    t.type(Interface.type, 'string')
    t.type(Interface.ModuleName, 'string')
    t.type(Interface.options, 'object')
    t.type(Interface.metadata, 'object')
    t.type(Interface.hooks, 'object')
    t.type(Interface.errors, 'object')
    t.type(Interface.nameGenerator, 'function', 'Created nameGenerator function.')
    t.end()
  })

  t.test('Interface Configuration.', (t) => {
    let Interface = SP.getInterface()
    Interface.configure()
    t.end()
  })

  t.end()
})

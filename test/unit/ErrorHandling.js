/**
 * @file ErrorHandling
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
'use strict';
const tap = require('tap')
const _fp = require('lodash/fp')
const Plugin = require('../../index')
const getPlugin = require('../mocks/getPlugin')
const PluginCtor = require('../../lib/Plugin')
const path = require('path')
const fs = require('fs')

const util = require('@pomegranate/test-utils')
const applicationBase = path.join(__dirname, '../mocks/plugins/riddledWithErrors')
const pluginBase = path.join(applicationBase, 'plugins')
const testPlugins = fs.readdirSync(pluginBase)


/**
 *
 * @module ErrorHandling
 */

tap.test('Correct number of mock test plugins', (t) => {
  let count = testPlugins.length
  let expected = 10
  t.equal(count, expected, `Has the correct number of mock Plugins. (${expected})`)
  t.end()
})


tap.test('Missing some required metadata.', (t) => {
  let testPlugin = 'badMetadata'
  let FrameworkDI = util.mockFrameworkInjector(false, {}, applicationBase)
  let PluginDI = util.mockPluginDI()
  let pluginData = getPlugin('riddledWithErrors/plugins/', testPlugin)
  let SP = new Plugin(pluginData)
  let pErrs = SP.getErrors()
  t.test('Instantiates with no errors', (t) => {
    t.equal(pErrs.PluginErrors.length, 0, 'Has no Plugin errors after instantiation.')
    t.equal(pErrs.ValidationErrors.length, 0, 'Has no Validation errors after instantiation.')
    t.equal(pErrs.InterfaceErrors.length, 0, 'Has no Interface errors after instantiation.')
    t.done()
  })


  t.test('Initialization handles errors correctly.',(t) => {
    SP.initialize({FrameworkDI, PluginDI})
      .then((p) => {
        let pErrs = p.getErrors()
        t.equal(pErrs.PluginErrors.length, 1, 'Has 1 Plugin error after instantiation.')
        t.equal(pErrs.ValidationErrors.length, 1, 'Has 1 Validation error after instantiation.')
        t.equal(pErrs.InterfaceErrors.length, 0, 'Has no Interface errors after instantiation.')
        t.equal(pErrs.PluginErrors[0], 'Could not construct the plugin interface.', 'Has the correct Plugin error message.')
        t.equal(pErrs.ValidationErrors[0], 'metadata.name or metadata.displayName missing', 'Has the correct validation error message.')
        t.done()
      })
  })
  t.done()
})

tap.test('Missing all metadata.', (t) => {
  let testPlugin = 'missingMetadata'
  let FrameworkDI = util.mockFrameworkInjector(false, {}, applicationBase)
  let PluginDI = util.mockPluginDI()
  let pluginData = getPlugin('riddledWithErrors/plugins/', testPlugin)
  let SP = new Plugin(pluginData)
  let pErrs = SP.getErrors()
  t.test('Instantiates with no errors', (t) => {
    t.equal(pErrs.PluginErrors.length, 1, 'Has 1 Plugin errors after instantiation.')
    t.equal(pErrs.ValidationErrors.length, 0, 'Has no Validation errors after instantiation.')
    t.equal(pErrs.InterfaceErrors.length, 0, 'Has no Interface errors after instantiation.')
    t.done()
  })


  t.test('Initialization handles errors correctly.',(t) => {
    SP.initialize({FrameworkDI, PluginDI})
      .then((p) => {
        let pErrs = p.getErrors()
        t.equal(pErrs.PluginErrors.length, 2, 'Has 1 Plugin error after instantiation.')
        t.equal(pErrs.ValidationErrors.length, 0, 'Has 1 Validation error after instantiation.')
        t.equal(pErrs.InterfaceErrors.length, 0, 'Has no Interface errors after instantiation.')
        t.equal(pErrs.PluginErrors[0], 'Raw Plugin data is missing metadata.', 'Has the correct Plugin error message.')
        t.equal(pErrs.PluginErrors[1], 'Could not initialize plugin due to previous errors.', 'Has the correct validation error message.')
        t.done()
      })
  })
  t.done()
})

tap.test('Missing some required hooks.', (t) => {
  let testPlugin = 'badHooks'
  let FrameworkDI = util.mockFrameworkInjector(false, {}, applicationBase)
  let PluginDI = util.mockPluginDI()
  let pluginData = getPlugin('riddledWithErrors/plugins/', testPlugin)
  let SP = new Plugin(pluginData)
  let pErrs = SP.getErrors()
  t.test('Instantiates with no errors', (t) => {
    t.equal(pErrs.PluginErrors.length, 0, 'Has no Plugin errors after instantiation.')
    t.equal(pErrs.ValidationErrors.length, 0, 'Has no Validation errors after instantiation.')
    t.equal(pErrs.InterfaceErrors.length, 0, 'Has no Interface errors after instantiation.')
    t.done()
  })


  t.test('Initialization handles errors correctly.',(t) => {
    SP.initialize({FrameworkDI, PluginDI})
      .then((p) => {
        let pErrs = p.getErrors()
        t.equal(pErrs.PluginErrors.length, 0, 'Has no Plugin error after instantiation.')
        t.equal(pErrs.ValidationErrors.length, 1, 'Has 1 Validation error after instantiation.')
        t.equal(pErrs.InterfaceErrors.length, 0, 'Has no Interface errors after instantiation.')
        t.equal(pErrs.ValidationErrors[0], 'Missing hook function: load', 'Has the correct validation error message.')
        t.done()
      })
  })
  t.done()
})

tap.test('Missing all hooks.', (t) => {
  let testPlugin = 'missingHooks'
  let FrameworkDI = util.mockFrameworkInjector(false, {}, applicationBase)
  let PluginDI = util.mockPluginDI()
  let pluginData = getPlugin('riddledWithErrors/plugins/', testPlugin)
  let SP = new Plugin(pluginData)
  let pErrs = SP.getErrors()
  t.test('Instantiates with no errors', (t) => {
    t.equal(pErrs.PluginErrors.length, 0, 'Has no Plugin errors after instantiation.')
    t.equal(pErrs.ValidationErrors.length, 0, 'Has no Validation errors after instantiation.')
    t.equal(pErrs.InterfaceErrors.length, 0, 'Has no Interface errors after instantiation.')
    t.done()
  })


  t.test('Initialization handles errors correctly.',(t) => {
    SP.initialize({FrameworkDI, PluginDI})
      .then((p) => {
        let pErrs = p.getErrors()
        t.equal(pErrs.PluginErrors.length, 0, 'Has no Plugin error after instantiation.')
        t.equal(pErrs.ValidationErrors.length, 1, 'Has 1 Validation error after instantiation.')
        t.equal(pErrs.InterfaceErrors.length, 0, 'Has no Interface errors after instantiation.')
        t.equal(pErrs.ValidationErrors[0], 'Does not contain a plugin property', 'Has the correct validation error message.')
        t.done()
      })
  })
  t.done()
})

tap.test('Missing all hooks.', (t) => {
  let testPlugin = 'missingHooks'
  let FrameworkDI = util.mockFrameworkInjector(false, {}, applicationBase)
  let PluginDI = util.mockPluginDI()
  let pluginData = getPlugin('riddledWithErrors/plugins/', testPlugin)
  let SP = new Plugin(pluginData)
  let pErrs = SP.getErrors()
  t.test('Instantiates with no errors', (t) => {
    t.equal(pErrs.PluginErrors.length, 0, 'Has no Plugin errors after instantiation.')
    t.equal(pErrs.ValidationErrors.length, 0, 'Has no Validation errors after instantiation.')
    t.equal(pErrs.InterfaceErrors.length, 0, 'Has no Interface errors after instantiation.')
    t.done()
  })


  t.test('Initialization handles errors correctly.',(t) => {
    SP.initialize({FrameworkDI, PluginDI})
      .then((p) => {
        let pErrs = p.getErrors()
        t.equal(pErrs.PluginErrors.length, 0, 'Has no Plugin error after instantiation.')
        t.equal(pErrs.ValidationErrors.length, 1, 'Has 1 Validation error after instantiation.')
        t.equal(pErrs.InterfaceErrors.length, 0, 'Has no Interface errors after instantiation.')
        t.equal(pErrs.ValidationErrors[0], 'Does not contain a plugin property', 'Has the correct validation error message.')
        t.done()
      })
  })
  t.done()
})

tap.test('Inadvertent throw in hook', (t) => {
  let testPlugin = 'throwsInHook'
  let FrameworkDI = util.mockFrameworkInjector(false, {}, applicationBase)
  let PluginDI = util.mockPluginDI()
  let pluginData = getPlugin('riddledWithErrors/plugins/', testPlugin)
  let SP = new Plugin(pluginData)
  let pErrs = SP.getErrors()
  t.test('Instantiates with no errors', (t) => {
    t.notOk(SP.hasErrors(), 'No errors after instantiation.')
    t.done()
  })


  t.test('Initialization handles errors correctly.',(t) => {
    SP.initialize({FrameworkDI, PluginDI})
      .then((p) => {
        t.notOk(p.hasErrors(), 'No errors after initialization.')
        t.done()
      })
  })

  t.test('Configuring Plugin', (t) => {
    SP.configure()
      .then((p) => {
        t.notOk(p.hasErrors(), 'No errors after configuration.')
        t.end()
      })
  })

  t.test('Load Hook.', (t) => {

    SP.runHook('load')
      .then((p) => {
        let pErrs = p.getErrors()
        t.equal(pErrs.PluginErrors.length, 1, 'Has 1 Plugin error after loading.')
        t.equal(pErrs.ValidationErrors.length, 0, 'Has 0 Validation error after loading.')
        t.equal(pErrs.InterfaceErrors.length, 1, 'Has 1 Interface errors after loading.')

        t.equal(pErrs.PluginErrors[0], 'Plugin load hook failed.', 'Has the correct plugin error message')
        t.equal(pErrs.InterfaceErrors[0], 'this.missingMethod is not a function' , 'Has the correct validation error message.')
        t.end()
      })
  })

  t.done()
})

tap.test('Returned Error in hook.', (t) => {
  let testPlugin = 'returnsError'
  let FrameworkDI = util.mockFrameworkInjector(false, {}, applicationBase)
  let PluginDI = util.mockPluginDI()
  let pluginData = getPlugin('riddledWithErrors/plugins/', testPlugin)
  let SP = new Plugin(pluginData)
  let pErrs = SP.getErrors()
  t.test('Instantiates with no errors', (t) => {
    t.notOk(SP.hasErrors(), 'No errors after instantiation.')
    t.done()
  })


  t.test('Initialization handles errors correctly.',(t) => {
    SP.initialize({FrameworkDI, PluginDI})
      .then((p) => {
        t.notOk(p.hasErrors(), 'No errors after initialization.')
        t.done()
      })
  })

  t.test('Configuring Plugin', (t) => {
    SP.configure()
      .then((p) => {
        t.notOk(p.hasErrors(), 'No errors after configuration.')
        t.end()
      })
  })

  t.test('Load Hook.', (t) => {

    SP.runHook('load')
      .then((p) => {
        let pErrs = p.getErrors()
        t.equal(pErrs.PluginErrors.length, 1, 'Has 1 Plugin error after loading.')
        t.equal(pErrs.ValidationErrors.length, 0, 'Has 0 Validation error after loading.')
        t.equal(pErrs.InterfaceErrors.length, 1, 'Has 1 Interface errors after loading.')

        t.equal(pErrs.PluginErrors[0], 'Plugin load hook failed.', 'Has the correct plugin error message')
        t.equal(pErrs.InterfaceErrors[0], 'Im broken' , 'Has the correct validation error message.')
        t.end()
      })
  })

  t.done()
})

tap.test('Times out in load', (t) => {
  let testPlugin = 'timesOut'
  let FrameworkDI = util.mockFrameworkInjector(false, {timeout: 100}, applicationBase)
  let PluginDI = util.mockPluginDI()
  let pluginData = getPlugin('riddledWithErrors/plugins/', testPlugin)
  let SP = new Plugin(pluginData)
  let pErrs = SP.getErrors()
  t.test('Instantiates with no errors', (t) => {
    t.notOk(SP.hasErrors(), 'No errors after instantiation.')
    t.done()
  })


  t.test('Initialization handles errors correctly.',(t) => {
    SP.initialize({FrameworkDI, PluginDI})
      .then((p) => {
        t.notOk(p.hasErrors(), 'No errors after initialization.')
        t.done()
      })
  })

  t.test('Configuring Plugin', (t) => {
    SP.configure()
      .then((p) => {
        t.notOk(p.hasErrors(), 'No errors after configuration.')
        t.end()
      })
  })

  t.test('Load Hook.', (t) => {

    SP.runHook('load')
      .then((p) => {
        let pErrs = p.getErrors()
        t.equal(pErrs.PluginErrors.length, 1, 'Has 1 Plugin error after loading.')
        t.equal(pErrs.ValidationErrors.length, 0, 'Has 0 Validation error after loading.')
        t.equal(pErrs.InterfaceErrors.length, 1, 'Has 1 Interface errors after loading.')

        t.equal(pErrs.PluginErrors[0], 'Plugin load hook failed.', 'Has the correct plugin error message')
        t.equal(pErrs.InterfaceErrors[0], 'Timeout exceeded (2000ms) attempting to load TimesOutPlugin' , 'Has the correct timeout error message.')
        t.end()
      })
  })

  t.done()
})

tap.test('Calling Hook callback then returning promise fails.', (t) => {
  let testPlugin = 'callbackThenPromise'
  let FrameworkDI = util.mockFrameworkInjector(false, {timeout: 100}, applicationBase)
  let PluginDI = util.mockPluginDI()
  let pluginData = getPlugin('riddledWithErrors/plugins/', testPlugin)
  let SP = new Plugin(pluginData)
  let pErrs = SP.getErrors()
  t.test('Instantiates with no errors', (t) => {
    t.notOk(SP.hasErrors(), 'No errors after instantiation.')
    t.done()
  })


  t.test('Initialization with no errors.',(t) => {
    SP.initialize({FrameworkDI, PluginDI})
      .then((p) => {
        t.notOk(p.hasErrors(), 'No errors after initialization.')
        t.done()
      })
  })

  t.test('Configuring Plugin', (t) => {
    SP.configure()
      .then((p) => {
        t.notOk(p.hasErrors(), 'No errors after configuration.')
        t.end()
      })
  })

  t.test('Load Hook.', (t) => {

    SP.runHook('load')
      .then((p) => {
        let pErrs = p.getErrors()
        t.equal(pErrs.PluginErrors.length, 1, 'Has 1 Plugin error after loading.')
        t.equal(pErrs.ValidationErrors.length, 0, 'Has 0 Validation error after loading.')
        t.equal(pErrs.InterfaceErrors.length, 1, 'Has 1 Interface errors after loading.')

        t.equal(pErrs.PluginErrors[0], 'Plugin load hook failed.', 'Has the correct plugin error message')
        t.equal(pErrs.InterfaceErrors[0], 'This hook has already been ran. This is usually due to using the callback API after returning a promise or value.' , 'Has the correct interface error message.')
        t.end()
      })
  })

  t.done()
})

tap.test('Returning a promise then calling Hook callback fails. ', (t) => {
  let testPlugin = 'promiseThenCallback'
  let FrameworkDI = util.mockFrameworkInjector(false, {timeout: 100}, applicationBase)
  let PluginDI = util.mockPluginDI()
  let pluginData = getPlugin('riddledWithErrors/plugins/', testPlugin)
  let SP = new Plugin(pluginData)
  let pErrs = SP.getErrors()
  t.test('Instantiates with no errors', (t) => {
    t.notOk(SP.hasErrors(), 'No errors after instantiation.')
    t.done()
  })


  t.test('Initialization handles errors correctly.',(t) => {
    SP.initialize({FrameworkDI, PluginDI})
      .then((p) => {
        t.notOk(p.hasErrors(), 'No errors after initialization.')
        t.done()
      })
  })

  t.test('Configuring Plugin', (t) => {
    SP.configure()
      .then((p) => {
        t.notOk(p.hasErrors(), 'No errors after configuration.')
        t.end()
      })
  })

  t.test('Load Hook.', (t) => {

    SP.runHook('load')
      .then((p) => {

        let FrameworkEvents = FrameworkDI.get('FrameworkEvents')

        FrameworkEvents.on('lateError', function(err) {
          t.match(err.message, /Attempted to use both the hook promise API and the hook callback API./, 'Handles the emitted error.')
          t.done()
        })

        let pErrs = p.getErrors()
        t.equal(pErrs.PluginErrors.length, 0, 'Has 0 Plugin error after loading.')
        t.equal(pErrs.ValidationErrors.length, 0, 'Has 0 Validation error after loading.')
        t.equal(pErrs.InterfaceErrors.length, 0, 'Has 0  Interface errors after loading.')

      })
  })

  t.done()
})

tap.test('Late Errors', (t) => {
  let testPlugin = 'lateError'
  let FrameworkDI = util.mockFrameworkInjector(false, {timeout: 2000}, applicationBase)
  let PluginDI = util.mockPluginDI()
  let pluginData = getPlugin('riddledWithErrors/plugins/', testPlugin)
  let SP = new Plugin(pluginData)

  t.test('Instantiates with no errors', (t) => {
    t.notOk(SP.hasErrors(), 'NO errors after instantiation.')
    t.done()
  })


  t.test('Initialization handles errors correctly.',(t) => {
    SP.initialize({FrameworkDI, PluginDI})
      .then((p) => {
        t.notOk(p.hasErrors(), 'NO errors after initialization.')
        t.done()
      })
  })

  t.test('Configuring Plugin', (t) => {
    SP.configure()
      .then((p) => {
        t.notOk(p.hasErrors(), 'NO errors after configuration.')
        t.end()
      })
  })

  t.test('Load Hook.', (t) => {

    SP.runHook('load')
      .then((p) => {
        t.notOk(p.hasErrors(), 'No errors after load.')
        t.end()
      })

  })

  t.test('Start Hook.', (t) => {
    t.plan(2)
    let FrameworkEvents = FrameworkDI.get('FrameworkEvents')

    FrameworkEvents.on('lateError', function(err) {
      t.match(err.message, /Have an error/, 'Handles the emitted error.')
      // t.done()
    })
    SP.runHook('start')
      .then((p) => {
        t.notOk(p.hasErrors(), 'No errors after start.')
      })
  })

  t.done()
})
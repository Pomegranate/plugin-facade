/**
 * @file walkReduce
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

const _fp = require('lodash/fp')
const path = require('path')
const Promise = require('bluebird')
const tap = require('tap');
const FileLister = require('../../../lib/ContextHelpers/walkWorkDir')
const walkReducer = require(`../../../lib/ContextHelpers/walkReduce`)

/**
 *
 * @module walkReduce
 */

tap.test('Reducer', (t) => {

  let walkReduce = walkReducer('./test/mocks/ContextHelpers/RoutesMaybe')
  walkReduce({hidden: true, ext: '.js'}, (file) => {
    return require(path.join(process.cwd(),file.path))
  })
    .then((result) => {
      t.done()
    })

})

tap.test('Reducer absent', (t) => {

  let walkReduce = walkReducer('./test/mocks/ContextHelpers/RoutesMaybe')
  walkReduce()
    .then((result) => {
      t.done()
    })
})
/**
 * @file fileBaseName
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const path = require('path')
const _fp = require('lodash/fp')
/**
 *
 * @module fileBaseName
 */

module.exports = function fileBaseName(pathName, uppercase) {
  uppercase = uppercase | false;
  var fbn = path.parse(pathName).name
  return uppercase ?  _fp.upperFirst(_fp.toLower(fbn)) : fbn
}
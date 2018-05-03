/**
 * @file fileBaseName
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const tap = require('tap');

const fileName = require('../../../lib/FileHelpers/fileBaseName');
/**
 *
 * @module fileBaseName
 */



tap.test('Returns the name of a file from path', function(t){
  t.plan(3)
  t.equal(fileName('/some/path/file.js'), 'file', 'Returns the filename without its extension');
  t.equal(fileName('/some/path/file.js', true), 'File', 'Uppercases the filename');
  t.equal(fileName('/some/path/fIlENam$.js', true), 'Filenam$', 'Uppercases the filename, and lowercases everything else.');
})
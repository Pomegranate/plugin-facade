/**
 * @file installingFiles
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

/**
 *
 * @module installFiles
 */

exports.metadata = {
  frameworkVersion: 6,
  name: 'installFiles',
  type: 'installer',
  depends: ['magnum-test-a']
}

exports.installer = function() {
  return [
    {to: 'TestA', src: this.join(__dirname, '../files/installDir'), dest: './test'},
    {to: 'TestA', src: this.join(__dirname, '../files/installFiles/justOne.js'), dest: './justOne.js'}
  ]
}
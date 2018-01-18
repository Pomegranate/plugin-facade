/**
 * @file installFiles
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-loader
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

/**
 *
 * @module installFiles
 */

exports.metadata = {
  name: 'installFiles',
  type: 'installer',
  depends: ['magnum-test-a']
}

exports.installer = function(dirs, done){
  var install = []
  done && done(null, install)
}
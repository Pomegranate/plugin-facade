/**
 * @file overridePlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

/**
 *
 * @module overridePlugin
 */

exports.metadata = {
  name:'overridePlugin',
  type: 'override',
  depends: ['dynamicPlugin']
}

exports.override = {
  module: 'dynamicPlugin',
  name:'overridePlugin'
};

exports.plugin = {
  load: function(injector, loaded) {
    loaded(null, {plugin: 'overridden'})
  },
  start: function(done) {
    done(null)
  },
  stop: function(done) {
    done(null)
  }
}
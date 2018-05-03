/**
 * @file fileListDeep
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const tap = require('tap');
const FileLister = require('../../../lib/FileHelpers/fileListDeep')
/**
 *
 * @module fileListDeep
 */




tap.test('Returns non hidden files recursively.', function(t){
  t.plan(2)
  let fileListDeep = FileLister('./test/mocks/ContextHelpers/fileListDeep')
  fileListDeep()
    .then(function(files){
      t.equal(files.length, 3,  'Has 3 non hidden files');
      t.equal(files[0], 'test/mocks/ContextHelpers/fileListDeep/notHidden');
      console.log(files[0]);
    }).catch(function(err) {
      console.log(err);
    });
})

tap.test('Returns hidden files recursively with correct option set.', function(t){
  t.plan(1)
  let fileListDeep = FileLister('./test/mocks/ContextHelpers/fileListDeep')
  fileListDeep({hidden: true})
    .then(function(files){
      t.equal(files.length, 5,  'Has 3 non hidden file, one hidden dir, and one hidden file');
    });
})

tap.test('Returns non hidden files recursively with extension set.', function(t){
  t.plan(1)
  let fileListDeep = FileLister('./test/mocks/ContextHelpers/fileListDeepExt')
  fileListDeep({ext: '.js'})
    .then(function(files){
      t.equal(files.length, 3,  'Has 3 non hidden .js files');
    });
})

tap.test('Returns hidden files recursively with extension set.', function(t){
  t.plan(1)
  let fileListDeep = FileLister('./test/mocks/ContextHelpers/fileListDeepExt')
  fileListDeep({hidden: true, ext: '.js'})
    .then(function(files){
      t.equal(files.length, 5,  'Has 5 non hidden .js files');
    });
})

tap.test('Returns empty array when no matching extensions found.', function(t){
  t.plan(1)
  let fileListDeep = FileLister('./test/mocks/ContextHelpers/fileListDeepExt')
  fileListDeep({hidden: true, ext: '.py'})
    .then(function(files){
      t.equal(files.length, 0,  'Has 0 matching files.');
    });
})

tap.test('Throws with bad path', function(t){
  t.plan(1)
  let fileListDeep = FileLister('./nope/not/gonna/work')
  fileListDeep({hidden: true})
    .catch(function(err){
      t.ok(err, 'Has Error');
    })
})
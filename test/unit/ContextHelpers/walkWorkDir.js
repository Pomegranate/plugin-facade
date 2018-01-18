/**
 * @file walkWorkDir
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
/**
 *
 * @module walkWorkDir
 */

tap.test('Returns non hidden files recursively.', function(t){
  t.plan(11)
  let walkWorkDir = FileLister('./test/mocks/ContextHelpers/fileListDeep')
  walkWorkDir()
    .then(function(files){
      t.equal(files.length, 2,  'Has 3 non hidden files');
      t.ok(files[0].file)
      t.equal(files[0].path, 'test/mocks/ContextHelpers/fileListDeep/notHidden');
      t.equal(files[1].filename, 'some', 'Correct directory name - some.')
      return files[1].walk()
    })
    .then((files) => {
      t.equal(files.length, 1,  'Has 1 non hidden file in inner directory.');
      t.equal(files[0].filename, 'deep', 'Correct directory name - deep.')
      return files[0].walk()
    })
    .then((files) => {
      t.equal(files.length, 2,  'Has 2 non hidden file in inner directory.');
      t.equal(files[0].filename, 'path', 'Correct directory name - path.')
      t.equal(files[1].filename, 'somedeep.txt')
      return files[0].walk()
    })
    .then((files) => {
      t.equal(files.length, 1,  'Has 1 non hidden file in inner directory.');
      t.equal(files[0].filename, 'somedeeppath.txt', 'Correct filename')
    })
})

tap.test('Returns hidden files recursively with correct option set.', function(t){
  t.plan(1)
  let walkWorkDir = FileLister('./test/mocks/ContextHelpers/fileListDeep')
  walkWorkDir({hidden: true})
    .then(function(files){
      t.equal(files.length, 4,  'Has 1 non hidden file, one non hidden file, one hidden dir, and one non hidden dir.');
    });
})

tap.test('Returns non hidden files recursively with extension set.', function(t){
  t.plan(3)
  let walkWorkDir = FileLister('./test/mocks/ContextHelpers/fileListDeepExt')
  walkWorkDir({ext: '.js'})
    .then(function(files){
      t.equal(files.length, 2,  'Has 1 non hidden .js file, one non hidden directory.')
      files.forEach((file) => {
        if(file.file){
          t.equal(file.getBaseName(), 'notHidden', 'Returns correct file basename.')
          t.equal(file.getBaseName(true), 'Nothidden', 'Returns correctly capitalized file basename.')
        }
      })
    });
})

tap.test('Returns hidden files recursively with extension set.', function(t){
  t.plan(1)
  let walkWorkDir = FileLister('./test/mocks/ContextHelpers/fileListDeepExt')
  walkWorkDir({hidden: true, ext: '.js'})
    .then(function(files){
      t.equal(files.length, 4,  'Finds 2 .js files, 2 directories');
    });
})

tap.test('Returns only directories when no matching file extension.', function(t){
  t.plan(3)
  let walkWorkDir = FileLister('./test/mocks/ContextHelpers/fileListDeepExt')
  walkWorkDir({hidden: true, ext: '.py'})
    .then(function(files){
      t.equal(files.length, 2,  'Has 2 matching files.');
      files.forEach((file) => {
        t.ok(file.directory)
      })
    });
})

tap.test('Throws with bad path', function(t){
  t.plan(1)
  let walkWorkDir = FileLister('./nope/not/gonna/work')
  walkWorkDir({hidden: true})
    .catch(function(err){
      t.ok(err, 'Has Error');
    })
})


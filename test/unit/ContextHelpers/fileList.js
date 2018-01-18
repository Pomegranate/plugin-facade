/**
 * @file fileList
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-facade
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

/**
 * @file fileList
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-plugin-utils
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

const tap = require('tap');

const FileLister = require('../../../lib/ContextHelpers/fileList');

tap.test('Returns non hidden files.', function(t){
  t.plan(2)
  let fileList = FileLister('./test/mocks/ContextHelpers/fileList')
  fileList()
    .then(function(files){
      t.equal(files.length, 1,  'Has one non hidden file');
      t.equal(files[0].filename, 'notHidden');
    });
})

tap.test('Returns hidden files with correct option.', function(t){
  t.plan(3)

  let fileList = FileLister('./test/mocks/ContextHelpers/fileList')
  fileList({hidden: true})
    .then(function(files){
      t.equal(files.length, 2,  'Has one non hidden file, and one hidden file');
      t.equal(files[0].filename, '.hidden');
      t.equal(files[1].filename, 'notHidden');
    });
})

tap.test('Filters based on file extension', function(t){
  t.plan(3)
  let fileList = FileLister('./test/mocks/ContextHelpers/fileListExt')
  fileList()
    .then(function(files) {
      t.equal(files.length, 5, 'Has five files with default settings.')
    })

  fileList({ext: '.js'})
    .then(function(files) {
      t.equal(files.length, 3, 'Has 3 files with .js extension set')
    })

  fileList({hidden: true, ext: '.js'})
    .then(function(files) {
      t.equal(files.length, 4, 'Has 4 files with .js extension set, and hidden = true')
    })

})

tap.test('Returns Directories only when options.directories = true', function(t) {
  t.plan(1)
  let fileList = FileLister('./test/mocks/ContextHelpers/dirList')
  fileList({directories: true})
    .then(function(files) {
      t.equal(files.length, 4, 'Finds the correct number of directories')
    })

})

tap.test('Returns hidden Directories when options.directories = true and options.hidden = true', function(t) {
  t.plan(1)
  let fileList = FileLister('./test/mocks/ContextHelpers/dirList')
  fileList({hidden: true, directories: true})
    .then(function(files) {
      t.equal(files.length, 5)
    })
})

tap.test('Throws with bad path', function(t){
  t.plan(1)

  let fileList = FileLister('./nope/not/gonna/work')
  fileList()
    .catch(function(err){
      t.ok(err, 'Has Error');
    })
})
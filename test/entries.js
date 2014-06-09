var fs = require('fs');
var path = require('path');
var fpath = require('..');
var test = require('tape');
var pull = require('pull-stream');

test('can find files in a directory', function(t) {
  var expectedFiles = fs.readdirSync(__dirname);

  t.plan(2);

  pull(
    fpath.entries(__dirname),
    pull.collect(function(err, entries) {
      t.error(err);
      t.equal(entries.length, expectedFiles.length);
    })
  );
});

test('finds the full path names of the files', function(t) {
  var expectedFiles = fs.readdirSync(__dirname).map(function(name) {
    return path.join(__dirname, name);
  });

  t.plan(expectedFiles.length + 1);

  pull(
    fpath.entries(__dirname),
    pull.collect(function(err, entries) {
      t.error(err);

      entries.forEach(function(entry, index) {
        t.equal(entry, expectedFiles[index]);
      });
    })
  );
});

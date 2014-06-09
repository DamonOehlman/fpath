var fs = require('fs');
var path = require('path');
var fpath = require('..');
var test = require('tape');
var pull = require('pull-stream');

test('can filter out all results', function(t) {
  t.plan(2);

  pull(
    fpath.entries(__dirname),
    fpath.filter(),
    pull.collect(function(err, entries) {
      t.error(err);
      t.equal(entries.length, 0);
    })
  );
});

test('can filter to include only directories', function(t) {
  var dirs = fs.readdirSync(__dirname);

  dirs = dirs
    .map(function(name) {
      return path.join(__dirname, name);
    })
    .map(fs.statSync)
    .filter(function(stats) {
      return stats.isDirectory();
    });

  t.plan(2);

  pull(
    fpath.entries(__dirname),
    fpath.filter(function(name, stats) {
      return stats.isDirectory();
    }),
    pull.collect(function(err, entries) {
      t.error(err);
      t.equal(entries.length, dirs.length);
    })
  );
});

test('can filter to include only directories (short form)', function(t) {
  var dirs = fs.readdirSync(__dirname);

  dirs = dirs
    .map(function(name) {
      return path.join(__dirname, name);
    })
    .map(fs.statSync)
    .filter(function(stats) {
      return stats.isDirectory();
    });

  t.plan(2);

  pull(
    fpath.entries(__dirname),
    fpath.filter('isDirectory'),
    pull.collect(function(err, entries) {
      t.error(err);
      t.equal(entries.length, dirs.length);
    })
  );
});

test('can filter to include only files (short form)', function(t) {
  var files = fs.readdirSync(__dirname);

  files = files
    .map(function(name) {
      return path.join(__dirname, name)
    })
    .map(fs.statSync)
    .filter(function(stats) {
      return stats.isFile();
    });

  t.plan(2);

  pull(
    fpath.entries(__dirname),
    fpath.filter('isFile'),
    pull.collect(function(err, entries) {
      t.error(err);
      t.equal(entries.length, files.length);
    })
  );
});

test('filtered results a filenames only (not objects)', function(t) {
  var files = fs.readdirSync(__dirname);
  var filenames = [].concat(files).map(function(name) {
    return path.join(__dirname, name);
  });

  files = files
    .map(function(name) {
      return path.join(__dirname, name);
    })
    .map(fs.statSync)
    .filter(function(stats) {
      return stats.isFile();
    });

  t.plan(2 + files.length);

  pull(
    fpath.entries(__dirname),
    fpath.filter('isFile'),
    pull.collect(function(err, entries) {
      t.error(err);
      t.equal(entries.length, files.length);

      entries.forEach(function(entry) {
        t.ok(filenames.indexOf(entry) >= 0, 'Found entry in matching file list');
      });
    })
  );
});

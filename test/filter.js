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
    .map(path.join.bind(null, __dirname))
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
var fpath = require('..');
var pull = require('pull-stream');
var path = require('path');

pull(
  fpath.entries(path.resolve(__dirname, '..')),
  fpath.filter('isDirectory'),
  pull.collect(function(err, items) {
    // items will contain the directory names
    console.log('found directories: ', items);
  })
);

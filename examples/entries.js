var fpath = require('..');
var pull = require('pull-stream');

pull(
  fpath.entries(__dirname),
  pull.collect(function(err, entries) {
    console.log('found ' + entries.length + ' entries: ', entries);
  })
);

/**
  # fpath

  The `fpath` module is a simple module that provides some useful helpers when
  working with [pull-streams](https://github.com/dominictarr/pull-streams) and
  the file system.

**/

var fs = require('fs');
var Stats = fs.Stats;
var path = require('path');
var pull = require('pull-stream');

/**
  ## entries(targetPath, opts)

  A pull-stream source that generates provides the full path of files in the
  specified target path:

  <<< examples/entries.js

**/
exports.entries = pull.Source(function(targetPath, opts) {
  var files;
  var holding = [];

  function next(end, cb) {
    if (end) return cb(end);

    // if finding files failed, then abort with error
    if (files instanceof Error) return cb(files);

    // otherwise, if we don't yet have a files array
    // then register to wait
    if (! files) return holding.push(cb);

    // if we have no more files, then end
    if (files && files.length === 0) return cb(true);

    // otherwise, send the next file
    cb(null, path.join(targetPath, files.shift()));
  }

  fs.readdir(targetPath, function(err, discovered) {
    files = err || discovered;

    // if we have holding callbacks, trigger them now
    holding.splice(0).map(next.bind(null, false));
  });

  return next;
});

/**
  ## filter(test)

  The filter function provides a through stream that will only pass through
  those files that pass a truth test.  As it's usually handy to have more
  information on the file than just it's name, the `fs.stat` function is
  called on each file before being passed to the test function.

  The following example demonstrates how you could only pass through
  directories from an entries source stream:

  <<< examples/filter.js

  Additionally, a filter shortcut is available if you just want to call one
  of the many "is*" methods available on an
  [fs.Stats](http://nodejs.org/api/fs.html#fs_class_fs_stats) object:

  <<< examples/filter-isDirectory.js

  In the case when the filter function is called without a test function
  provided all files will be dropped from the stream:

  <<< examples/filter-empty.js
**/
exports.filter = function(test) {
  var pipeline;
  var typeTest;

  // if the test is a string and matches an is expression
  // convert into something useful
  if (typeof test == 'string' || (test instanceof String)) {
    // get the type test method
    typeTest = Stats.prototype[test];

    // if the test method is not a valid check on the stats prototype
    // reset the test to null
    if (typeof typeTest != 'function') {
      test = null;
    }
    else {
      test = function(name, stats) {
        return typeTest.call(stats);
      };
    }
  }

  // provide a default filter if none provided
  test = test || function() {
    return false;
  };

  // stat files and inject the stats into the result feed
  pipeline = pull.paraMap(function(item, callback) {
    fs.stat(item, function(err, stats) {
      callback(err, { filename: item, stats: stats })
    })
  });

  // filter out files that don't match
  pipeline = pipeline.pipe(pull.filter(function(item) {
    return test(item.filename, item.stats);
  }));

  // return the data stream back to its original form (filename only)
  pipeline = pipeline.pipe(pull.map(function(data) {
    return data.filename;
  }));

  return pipeline;
};

/**
  # fpath

  The `fpath` module is a simple module that provides some useful helpers when
  working with [pull-streams](https://github.com/dominictarr/pull-streams) and
  the file system.
**/

var fs = require('fs');
var path = require('path');
var pull = require('pull-stream');

/**
  ## entries(targetPath, opts)

  A pull-stream source that generates provides the full path of files in the
  specified target path:

  ```js
  pull(
    fpath.entries(__dirname),
    pull.collect(function(err, entries) {
      console.log('found ' + entries.length + ' entries');
    })
  );
  ```
**/
exports.entries = function(targetPath, opts) {
  return pull.Source(function() {
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
  })();
};
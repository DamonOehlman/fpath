# fpath

The `fpath` module is a simple module that provides some useful helpers when
working with [pull-streams](https://github.com/dominictarr/pull-streams) and
the file system.


[![NPM](https://nodei.co/npm/fpath.png)](https://nodei.co/npm/fpath/)

[![Build Status](https://img.shields.io/travis/DamonOehlman/fpath.svg?branch=master)](https://travis-ci.org/DamonOehlman/fpath) [![unstable](https://img.shields.io/badge/stability-unstable-yellowgreen.svg)](https://github.com/badges/stability-badges) 

## entries(targetPath, opts)

A pull-stream source that generates provides the full path of files in the
specified target path:

```js
var fpath = require('fpath');
var pull = require('pull-stream');

pull(
  fpath.entries(__dirname),
  pull.collect(function(err, entries) {
    console.log('found ' + entries.length + ' entries: ', entries);
  })
);

```

## filter(test)

The filter function provides a through stream that will only pass through
those files that pass a truth test.  As it's usually handy to have more
information on the file than just it's name, the `fs.stat` function is
called on each file before being passed to the test function.

The following example demonstrates how you could only pass through
directories from an entries source stream:

```js
var fpath = require('fpath');
var pull = require('pull-stream');
var path = require('path');

pull(
  fpath.entries(path.resolve(__dirname, '..')),
  fpath.filter(function(filename, stats) {
    return stats.isDirectory()
  }),
  pull.collect(function(err, items) {
    // items will contain the directory names
    console.log('found directories: ', items);
  })
);

```

Additionally, a filter shortcut is available if you just want to call one
of the many "is*" methods available on an
[fs.Stats](http://nodejs.org/api/fs.html#fs_class_fs_stats) object:

```js
var fpath = require('fpath');
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

```

In the case when the filter function is called without a test function
provided all files will be dropped from the stream:

```js
var fpath = require('fpath');
var pull = require('pull-stream');
var path = require('path');

pull(
  fpath.entries(path.resolve(__dirname, '..')),
  fpath.filter(),
  pull.collect(function(err, items) {
    // items will contain the directory names
    console.log('found directories: ', items);
  })
);

```

## License(s)

### MIT

Copyright (c) 2014 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# fpath

The `fpath` module is a simple module that provides some useful helpers when
working with [pull-streams](https://github.com/dominictarr/pull-streams) and
the file system.

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

## filter(test)

The filter function provides a through stream that will only pass through
those files that pass a truth test.  As it's usually handy to have more
information on the file than just it's name, the `fs.stat` function is 
called on each file before being passed to the test function.

The following example demonstrates how you could only pass through
directories from an entries source stream:

```js
pull(
  fpath.entries(__dirname),
  fpath.filter(function(filename, stats) {
    return stats.isDirectory()
  }),
  pull.collect(function(err, items) {
    // items will contain the directory names
  })
);
```

Additionally, a filter shortcut is available if you just want to call one
of the many "is*" methods available on an
[fs.Stats](http://nodejs.org/api/fs.html#fs_class_fs_stats) object:

```js
pull(
  fpath.entries(__dirname),
  fpath.filter('isDirectory'),
  pull.collect(function(err, items) {
    // items will contain directory names only
  })
);
```

In the case when the filter function is called without a test function
provided all files will be dropped from the stream:

```js
pull(
  fpath.entries(__dirname),
  fpath.filter(),
  pull.collect(function(err, items) {
    // no items
  })
);
```

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

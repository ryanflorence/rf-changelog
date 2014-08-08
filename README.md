rf-changelog
============

Creates simple changelogs from your git commits in markdown with links
when viewed from github.

```sh
  Usage: changelog [options]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -t, --title [title]      the title of the changelog (should probably be the new tag)
    -m, --message [message]  regex to match commit messages to be included in the changelog
    -o, --out [path]         file to write changelog to
    -s, --stdout             will prevent writing a file and print results to stdout
```

## installation

```sh
$ npm install rf-changelog
```

## Example

```sh
# ensure you have a semver tag in the past, and then...
$ changelog -t v2.1.0
```

Output:

The commit hash becomes a link to the commit when viewed on github.

```
v2.1.0 - Fri, 28 Mar 2014 05:54:33 GMT
--------------------------------------

[1685ade](../../1685ade) [added] some new stuff
[02aa80f](../../02aa80f) [fixed] busted things


v2.0.10 - Fri, 21 Mar 2014 02:31:10 GMT
---------------------------------------

[1685ade](../../1685ade) [removed] terrible apis
[02aa80f](../../02aa80f) [changed] default options for stuff
```

By default, it will look for commit messages with subjects that match:

- `[added] ...`
- `[changed] ...`
- `[fixed] ...`
- `[removed] ...`

But you can supply a regex with `-m [message]`, for example:

```sh
$ changelog -m '\[a\]|\[c\]|[\f\]|\[r\]'
```


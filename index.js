var fs = require('fs');
var exec = require('child_process').exec;
var commander = require('commander');
var path = require('path');
var version = require(path.resolve(__dirname, 'package')).version;

module.exports = function(argv, callback) {
  var program = new commander.Command();

  if (argv !== process.argv) {
    argv = argv.split(' ');
    argv.unshift('', '');
  }

  program.version(version);
  program.option(
    '-t, --title [title]',
    'the title of the changelog (should probably be the new tag)'
  );
  program.option(
    '-m, --message [message]',
    'regex to match commit messages to be included in the changelog',
    '\\[added\\]|\\[removed\\]|\\[changed\\]|\\[fixed\\]'
  );
  program.option(
    '-o, --out [path]',
    'file to write changelog to',
    'CHANGELOG.md'
  );
  program.option(
    '-s, --stdout',
    'will prevent writing a file and print results to stdout',
    false
  );
  program.parse(argv);

  var commitRegex = new RegExp(program.message);

  latestTag(function(tag) {
    changelog(tag, function(log) {
      log = log.map(function(subject) {
        return subject.replace(/^([a-f|0-9]+)/, '[$1](../../commit/$1)')
      });
      log = '- '+log.join('\n- ');
      if (program.stdout) {
        console.log(log);
      } else {
        writeLog(log, tag);
      }
      if (callback) callback(log);
    });
  });

  function writeLog(log) {
    var title = program.title+' - '+new Date().toUTCString();
    var dashes = title.replace(/./g, '-');
    var src = title+'\n'+dashes+'\n\n';
    src += log;
    if (fs.existsSync(program.out)) {
      src += '\n\n\n';
      src += fs.readFileSync(program.out).toString();
    }
    fs.writeFileSync(program.out, src);
  }

  function changelog(tag, next) {
    exec('git log --no-merges --oneline '+tag+'..HEAD', execHandler(function(log) {
      next(parseLog(log));
    }));
  }

  function parseLog(log) {
    return log.split('\n').filter(function(commit) {
      return commitRegex.test(commit);
    });
  }

  function latestTag(next) {
    exec('git tag', execHandler(function(tags) {
      filterTagStringToLatest(tags, next);
    }));
  }

  function filterTagStringToLatest(tagString, next) {
    return next(lastSemverTag(tagString.split('\n')));
  }

  function splitTag(tag) {
    return tag.replace(/^v/, '').split('.').map(function(n) {
      return parseInt(n);
    });
  }

  function sortTagsNumerically(a, b) {
    a = splitTag(a);
    b = splitTag(b);
    if (a[0] > b[0])
      return -1;
    else if (a[0] === b[0] && a[1] > b[1])
      return -1;
    else if (a[0] === b[0] && a[1] === b[1] && a[2] > b[2])
      return -1;
    else
      return 1;
  };

  function isSemver(tag) {
    return tag.match(/v?[0-9]+\.[0-9]+\.[0-9]+(.+)?/);
  }

  function lastSemverTag(tags) {
    var match = tags.filter(isSemver).sort(sortTagsNumerically)[0];
    if (!match) {
      console.log('no previous semver tag found, tag a commit in the past and try again');
      process.exit();
    }
    return match;
  }

  function execHandler(cb) {
    return function(err, stdout, stderr) {
      if (err) throw new Error(err);
      if (cb) cb(stdout);
    };
  }
};


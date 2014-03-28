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
    'CHANGELOG'
  );
  program.option(
    '-s, --stdout',
    'will prevent writing a file and print results to stdout',
    false
  );
  program.parse(process.argv);

  var commitRegex = new RegExp(program.message);

  latestTag(function(tag) {
    changelog(tag, function(log) {
      log = log.join('\n');
      if (program.stdout) {
        console.log(log);
      } else {
        writeLog(log, tag);
      }
      if (callback) callback(log);
    });
  });

  function writeLog(log) {
    var src = program.title+'\n'+new Date().toUTCString()+'\n\n';
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

  function lastSemverTag(tags) {
    var match = tags.reverse().reduce(function(match, tag) {
      return match ? match : tag.match(/v?[0-9]\.[0-9]\.[0-9](.+)?/);
    }, false);
    if (!match) {
      console.log('no semver tag found, exiting');
      process.exit();
    }
    return match[0];
  }

  function execHandler(cb) {
    return function(err, stdout, stderr) {
      if (err) throw new Error(err);
      if (cb) cb(stdout);
    };
  }
};


import commander from 'commander';
import { version } from '../package.json';
import path from 'path';

export const defaultCommitFilterRgx = '\\[(added|removed|changed|fixed)\\]';

export default function parseCliArgs(argv) {
  let program = new commander.Command();

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
    defaultCommitFilterRgx
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
  program.option(
    '-f, --formatter [formatter]',
    'formatter to use: basic',
    'basic'
  );
  program.parse(argv);

  program.message = new RegExp(program.message);

  return program;
}

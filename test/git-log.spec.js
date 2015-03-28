import gitLog, { parseLog } from '../src/git-log';
import { defaultCommitFilterRgx } from '../src/parse-cli-args';

let commitRegex = new RegExp(defaultCommitFilterRgx);

describe('git log', function() {
  it('parses entry', function() {
    const sha = 'a01675d';
    const message = '[fixed] some bug';
    const entry = `${sha} ${message}`;
    let entries = [entry];

    parseLog(entries, commitRegex)[0].raw.should.eql(entry);
    parseLog(entries, commitRegex)[0].sha.should.eql(sha);
    parseLog(entries, commitRegex)[0].message.should.eql(message);
  });

  it('filters messages based on supplied regex', function() {
    let rgx = /does match/;
    let entries = ['a01675f does not match', 'a01685d does match', 'a01675d does not match'];

    parseLog(entries, rgx).length.should.eql(1);
    parseLog(entries, rgx)[0].raw.should.eql(entries[1]);
  });

  it('pulls log from git', function(done) {
    gitLog('v0.0.1', commitRegex)
      .then(entries => entries.map(x => x.raw))
      // Actual commit from this repo since v0.0.1
      .should.eventually.contain('3dcf05b [fixed] bad semver regex')
      .notify(done);
  });

  it('pulls log from git up to tag', function(done) {
    gitLog('v0.0.2', commitRegex)
      .then(entries => entries.map(x => x.raw))
      // Actual commit from this repo prior to v0.0.2
      .should.not.eventually.contain('3dcf05b [fixed] bad semver regex')
      .notify(done);
  });
});

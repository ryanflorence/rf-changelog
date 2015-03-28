import latestTag, { lastSemverTag } from '../src/latest-tag';
import { version } from '../package.json';

describe('latest tag', function() {
  it('does not parse non semver tags', function() {
    let tags = ['herpa-derpa'];
    expect(() => lastSemverTag(tags)).to.throw(/No previous semver tag found/);
  });

  it('parses semver version', function() {
    let tags = ['1.2.3'];
    lastSemverTag(tags).should.eql('1.2.3');
  });

  it('parses semver version with v prefix', function() {
    let tags = ['v1.2.3'];
    lastSemverTag(tags).should.eql('v1.2.3');
  });

  it('parses tag list and returns highest value tag [patch]', function() {
    let tags = ['v1.2.3', 'v1.2.4', 'v1.2.2'];
    lastSemverTag(tags).should.eql('v1.2.4');
  });

  it('parses tag list and returns highest value tag [minor]', function() {
    let tags = ['v1.2.3', 'v1.2.4', 'v1.3.0', 'v1.3.1'];
    lastSemverTag(tags).should.eql('v1.3.1');
  });

  it('parses tag list and returns highest value tag [major]', function() {
    let tags = ['v1.2.3', 'v1.2.4', 'v2.0.0', 'v1.3.0', 'v1.3.1'];
    lastSemverTag(tags).should.eql('v2.0.0');
  });

  it('parses tag list and returns highest value tag [pre release]', function() {
    let tags = ['v1.2.3', 'v1.2.4', 'v2.0.0-beta.0', 'v1.3.0', 'v1.3.1'];
    lastSemverTag(tags).should.eql('v2.0.0-beta.0');
  });

  it('parses pre release semver tags', function() {
    let tags = ['1.2.3-beta.0'];
    lastSemverTag(tags).should.eql('1.2.3-beta.0');
  });

  it('sorts pre release semver tags', function() {
    let tags = ['v1.2.3', 'v1.2.3-beta.0'];
    lastSemverTag(tags).should.eql('v1.2.3');
  });

  it('gets the latest version from git tags (assumes the version in package.json is the latest tagged version)', function(done) {
    latestTag()
      .should.eventually.eql(`v${version}`)
      .notify(done);
  });
});

import basic from '../../src/formatters/basic';

describe('basic formatter', function() {
  it('formats log', function() {
    const log = [{
      sha: 'abc',
      message: '[fixed] a bug'
    }, {
      sha: '123',
      message: '[added] a feature'
    }];
    const title = 'v12.34.56';
    const time = new Date('2010.01.05 13:24:16');

    basic({ title, time, log }).should.eql(
`v12.34.56 - ${time.toUTCString()}
-----------------------------------------

- [abc](../../commit/abc) [fixed] a bug
- [123](../../commit/123) [added] a feature
`);
  });
});

import output from '../src/output';
import tmp from 'tmp';
import fsp from 'fs-promise';

const tmpName = () => {
  return new Promise((resolve, reject) => {
    tmp.tmpName((err, tmpPath) => {
      if (err) {
        reject(err);
      }

      resolve(tmpPath);
    })
  });
}

function restore(x) {
  if (typeof x.restore === 'function') {
    x.restore();
  }
}

describe('output', function() {
  beforeEach(function() {
    sinon.spy(console, 'log');
  });

  afterEach(function() {
    restore(console.log);
    restore(fsp.exists);
  });

  it('sends output to stdout', function(done) {
    const formattedLog = 'herpa derpa';
    output({
      stdout: true,
      formattedLog
    })
    .then(() => {
      console.log.should.have.been.calledWith(formattedLog);
      console.log.should.have.been.calledOnce;
      done();
    })
    .catch(err => done(err));
  });

  it('does touch file when outputing to stdout', function(done) {
    const formattedLog = 'herpa derpa';
    sinon.spy(fsp, 'exists');

    tmpName()
      .then(tmpPath => {
        output({
          stdout: true,
          formattedLog,
          filepath: tmpPath
        });

        fsp.exists.should.not.have.been.called;
        done();
      })
      .catch(err => done(err));
  });

  it('creates new file', function(done) {
    const formattedLog = 'herpa derpa';
    let tmpPath;
    tmpName()
      .then(path => {
        tmpPath = path;
        return fsp.exists(tmpPath);
      })
      .then(exists => {
        exists.should.be.false;

        return output({
          formattedLog,
          filepath: tmpPath
        });
      })
      .then(() => fsp.readFile(tmpPath))
      .then(actualContent => {
        actualContent.toString().should.eql(formattedLog);
        done();
      })
      .catch(err => done(err));
  });

  it('prepends to existing file', function(done) {
    const formattedLog = 'herpa derpa';
    let tmpPath;
    tmpName()
      .then(path => {
        tmpPath = path;
        return fsp.writeFile(tmpPath, 'existing content');
      })
      .then(() => {
        return output({
          formattedLog,
          filepath: tmpPath
        });
      })
      .then(() => fsp.readFile(tmpPath))
      .then(actualContent => {
        actualContent.toString().should.eql(`${formattedLog}\n\n\nexisting content`);
        done();
      })
      .catch(err => done(err));
  });

  it('does not output to stdout when outputing to file', function(done) {
    const formattedLog = 'herpa derpa';
    tmpName()
      .then(tmpPath => {
        return output({
          formattedLog,
          filepath: tmpPath
        });
      })
      .then(() => {
        console.log.should.not.have.been.called;
        done();
      })
      .catch(err => done(err));
  });
});


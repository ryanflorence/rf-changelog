import { exec } from 'child-process-promise';
import semver from 'semver';

export function parseLog(logEntries, commitFilterRgx) {
  return logEntries
    .filter(function(commit) {
      return commitFilterRgx.test(commit);
    })
    .map(raw => {
      let match = /^([a-f|0-9]+) (.*)$/.exec(raw);
      return {
        raw,
        sha: match[1],
        message: match[2],
        toString() {
          return raw;
        }
      };
    });
}

export default function gitLog(fromTag, commitFilterRgx) {
  return exec(`git log --no-merges --oneline ${fromTag}..HEAD`)
    .then(({stdout}) => parseLog(stdout.split('\n'), commitFilterRgx));
}

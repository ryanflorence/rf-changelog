import latestTag from './latest-tag';
import gitLog from './git-log';
import output from './output';

export default function(options) {
  return latestTag()
    .then(lastTag => gitLog(lastTag, options.message))
    .then(log => {
      let formattedLog = options.formatter({
        title: options.title ? options.title : '<title not provided>',
        time: new Date(),
        log
      });

      output({
        stdout: options.stdout,
        filepath: options.out,
        formattedLog
      });
    });
}

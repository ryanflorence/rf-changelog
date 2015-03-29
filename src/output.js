import fsp from 'fs-promise';

export default function output({ stdout, filepath, formattedLog }) {
  if (stdout) {
    console.log(formattedLog);
    return Promise.resolve();
  }

  return fsp.exists(filepath)
    .then(exists => exists ? fsp.readFile(filepath, { encoding: 'utf8' }) : null)
    .then(originalContent => {
      let newContent;

      if (originalContent === null) {
        newContent = formattedLog;
      } else {
        newContent = `${formattedLog}\n\n\n${originalContent}`;
      }

      return fsp.writeFile(filepath, newContent);
    });
}

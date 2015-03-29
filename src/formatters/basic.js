export default function basicFormatter({title, time, log}) {
  let titleFormatted = `${title} - ${time.toUTCString()}`;
  let dashes = titleFormatted.replace(/./g, '-');
  let formattedLog = log
    .map(({sha, message}) => `- [${sha}](../../commit/${sha}) ${message}`)
    .join('\n');

  return `${titleFormatted}
${dashes}

${formattedLog}
`;
}


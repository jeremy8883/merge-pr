const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

const optionDefinitions = [
  {
    name: 'id',
    description: 'The PR id',
  },
  {
    name: 'accessToken',
    description:
      'Your private access token, generated from https://github.com/settings/tokens',
  },
  {
    name: 'owner',
    description: 'The PR owner',
  },
  {
    name: 'repo',
    description: 'The PR repo',
  },
]

const sections = [
  {
    header: 'Merge PR',
    content:
      'Automatically polls the current repo, and will alert when the light turns green.\n' +
      'eg:' +
      '  node index.js --accessToken abc123eee --owner my-company --repo my-repo --id 123',
  },
  {
    header: 'Options',
    optionList: optionDefinitions,
  },
]

const printCmdLineOptions = () => {
  const usage = commandLineUsage(sections)
  console.log(usage)
}

const getCmdLineOptions = () => {
  return commandLineArgs(optionDefinitions)
}

module.exports = {
  printCmdLineOptions,
  getCmdLineOptions,
}

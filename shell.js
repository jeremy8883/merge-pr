const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const optionDefinitions = [
  {
    name: 'id',
    description: 'The PR id',
  },
]

const sections = [
  {
    header: 'Merge PR',
    content:
      'Automatically polls the current repo, and will alert when the light turns green.',
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

const runCmd = async (cmd) => {
  const { stdout, stderr } = await exec(cmd)
  if (stderr) {
    throw new Error(stderr)
  }
  return stdout
}

module.exports = {
  printCmdLineOptions,
  getCmdLineOptions,
  runCmd,
}

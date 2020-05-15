const util = require('util')
const exec = util.promisify(require('child_process').exec)

const runCmd = async (cmd) => {
  const { stdout, stderr } = await exec(cmd)
  if (stderr) {
    throw new Error(stderr)
  }
  return stdout
}

module.exports = {
  runCmd,
}

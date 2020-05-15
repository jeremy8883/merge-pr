const { runCmd } = require('./shell')

const getStatus = (id) => {
  return runCmd(`gh pr status ${id}`)
}

module.exports = {
  getStatus,
}

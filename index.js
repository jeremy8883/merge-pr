const { printCmdLineOptions, getCmdLineOptions } = require('./shell')
const { getStatus } = require('./github')

;(async () => {
  const { id } = getCmdLineOptions()

  if (!id) {
    printCmdLineOptions()
    return
  }

  console.log(await getStatus(id))
})()

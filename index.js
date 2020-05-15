const { printCmdLineOptions, getCmdLineOptions } = require('./shell')
const { init } = require('./github')

;(async () => {
  const { id, accessToken, owner, repo } = getCmdLineOptions()

  if (!id || !accessToken || !owner || !repo) {
    printCmdLineOptions()
    return
  }

  const github = init(accessToken, owner, repo)

  console.log(await github.getPr(id))
})()

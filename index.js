const { init } = require('./utils/github')
const { pollUntilComplete } = require('./utils/timeout')
const { printCmdLineOptions, getCmdLineOptions } = require('./cli')
const { notifySuccess, notifyError } = require('./utils/alerts')

const pollTimeout = 60 * 1000 // 60 secs

const fetchPrAndAttemptMerge = async (github, id, iterationCount) => {
  console.log(`Fetching PR #${id}`)

  const pr = await github.getPr(id)

  // console.log(pr);

  if (iterationCount === 0) {
    console.log('--------------')
    console.log(`Fetched ${pr.head.ref}, "${pr.title}"`)
    console.log(pr.html_url)
    console.log('--------------')
  }

  if (pr.merged) throw new Error('PR is already merged')

  if (!pr.mergeable) {
    throw new Error('PR is unable to be merged, possibly due to conflicts')
  }

  if (pr.mergeable_state === 'behind') {
    console.log('Branch is now behind. Updating now... (╯°□°)╯︵ ┻━┻')
    await github.updatePrBranch(id)
    return false
  }

  const status = await github.getStatus(pr.head.ref)

  if (status.state === 'failure') {
    // failure | pending | success
    const failedChecks = status.statuses
      .filter((s) => s.state !== 'success') // Show the failed and pending ci checks
      .map((s) => s.state + ' - ' + s.context + '\n' + s.target_url)
      .join('\n----\n')

    throw new Error(
      'CI checks failed! Please fix then run again.\n-------\n' +
        failedChecks +
        '\n-------'
    )
  }

  // console.log("Status: ", status);

  if (pr.mergeable_state !== 'clean') {
    console.log('PR is not yet ready')
    return false
  }

  await github.mergePr({
    pullNumber: id,
    commitMessage: pr.body,
    mergeMethod: 'squash',
  })

  return true
}

;(async () => {
  try {
    const { id, accessToken, owner, repo } = getCmdLineOptions()

    if (!id || !accessToken || !owner || !repo) {
      printCmdLineOptions()
      return
    }

    const github = init(accessToken, owner, repo)

    await pollUntilComplete(
      (count) => fetchPrAndAttemptMerge(github, id, count),
      pollTimeout
    )

    notifySuccess('PR has been merged!')
  } catch (ex) {
    notifyError(ex)
    process.exit() // Otherwise, it takes a few seconds for the script to finish
  }
})()

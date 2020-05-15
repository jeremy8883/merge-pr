const { init } = require('./utils/github')
const { pollUntilComplete } = require('./utils/timeout')
const { printCmdLineOptions, getCmdLineOptions } = require('./cli')

const pollTimeout = 60 * 1000 // 60 secs

const fetchPrAndAttemptMerge = async (github, id) => {
  console.log(`Fetching PR #${id}`)

  const pr = await github.getPr(id)

  console.log(`Fetched ${pr.head.ref}, "${pr.title}"`)
  console.log(pr.html_url)

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
      .map((s) => {
        s.state + ' - ' + s.context + '\n' + s.target_url
      })
      .join('----\n')

    throw new Error(
      'CI checks failed! Please fix then run again.\n-------\n' +
        failedChecks +
        '\n-------'
    )
  }

  if (status.state === 'pending') {
    console.log('CI is currently pending')
    return false
  }

  if (pr.mergeable_state === 'blocked') {
    console.log('PR is not yet approved')
    return false
  }

  await github.mergePr({
    pullNumber: id,
    commitMessage: pr.body,
    mergeMethod: 'squash',
  })

  return true
}

const run = async () => {
  const { id, accessToken, owner, repo } = getCmdLineOptions()

  if (!id || !accessToken || !owner || !repo) {
    printCmdLineOptions()
    return
  }

  const github = init(accessToken, owner, repo)

  await pollUntilComplete(() => fetchPrAndAttemptMerge(github, id), pollTimeout)
}

;(async () => {
  try {
    await run()
  } catch (ex) {
    console.error(ex)
  }
})()

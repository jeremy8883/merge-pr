const { Octokit } = require('@octokit/rest')

const init = (accessToken, owner, repo) => {
  const octokit = new Octokit({
    auth: accessToken,
  })

  const getPr = async (pullNumber) => {
    const { data } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    })
    return data
  }

  const getStatus = async (ref) => {
    const { data } = await octokit.repos.getCombinedStatusForRef({
      owner,
      repo,
      ref,
    })
    return data
  }

  const mergePr = async ({
    pullNumber,
    commitMessage,
    mergeMethod, // merge | squash | rebase
  }) => {
    const { data } = await octokit.pulls.merge({
      owner,
      repo,
      pull_number: pullNumber,
      commit_message: commitMessage,
      merge_method: mergeMethod,
    })

    return data
  }

  const updatePrBranch = async (pullNumber) => {
    const { data } = await octokit.pulls.updateBranch({
      owner,
      repo,
      pull_number: pullNumber,
    })
    return data
  }

  return {
    getPr,
    getStatus,
    updatePrBranch,
    mergePr,
  }
}

module.exports = {
  init,
}

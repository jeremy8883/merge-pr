const { Octokit } = require('@octokit/rest')

const init = (accessToken, owner, repo) => {
  const octokit = new Octokit({
    auth: accessToken,
  })

  const getPr = async (pullNumber) => {
    return await octokit.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    })
  }

  return {
    getPr,
  }
}

module.exports = {
  init,
}

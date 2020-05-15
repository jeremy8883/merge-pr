const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const pollUntilComplete = async (fn, ms) => {
  while (true) {
    const isComplete = await fn()
    if (isComplete) break
    console.log('Will retry in ' + ms / 1000 + ' secs...')
    await delay(ms)
  }
}

module.exports = {
  delay,
  pollUntilComplete,
}

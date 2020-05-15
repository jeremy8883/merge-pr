const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const pollUntilComplete = async (fn, ms) => {
  let count = 0
  while (true) {
    const isComplete = await fn(count++)
    if (isComplete) break
    console.log('Will retry in ' + ms / 1000 + ' secs...')
    await delay(ms)
  }
}

module.exports = {
  delay,
  pollUntilComplete,
}

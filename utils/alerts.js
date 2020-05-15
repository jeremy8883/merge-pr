const notifier = require('node-notifier')
const colors = require('colors/safe')

const notifyError = (error) => {
  console.error(colors.red.bold('Error: ') + colors.red(error.message))
  notifier.notify({
    title: 'Error',
    message: error.message,
  })
}

const notifySuccess = (message) => {
  console.log(colors.green(message))
  notifier.notify({
    title: 'Success',
    message: message,
  })
}

module.exports = {
  notifyError,
  notifySuccess,
}

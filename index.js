
const latestWrapper = (fn) => {
  let lastReject
  return (...args) => new Promise((resolve, reject) => {
    if (lastReject) {
      const error = new Error()
      error.canceled = true
      lastReject(error)
    }

    lastReject = reject
    fn(...args)
      .then(resolve)
      .catch(reject)
      .finally(() => {
        if (reject === lastReject) reject = undefined
      })
  })
}

//test
const consolePromise = latestWrapper(
  (time) => new Promise((resolve) => setTimeout(() => resolve(time), 0))
)

consolePromise('A').then(console.log).catch((error) => console.log(error.canceled))
consolePromise('2').then(console.log).catch((error) => console.log(error))
consolePromise('1').then(console.log)

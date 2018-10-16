/** 
 takes only the latest promise and rejects pending promises ()
 https://github.com/bjoerge/promise-latest
*/
const takeLatest = (fn) => {
  let latestPromise
  let pending
  let resolve
  let reject
  const fulfill = (promise) => (value) => {
    if (promise === latestPromise) {
      pending = null
      resolve(value)
    }
  }

  const fail = (promise) => (error) => {
    if (promise === latestPromise) {
      pending = null
      reject(error)
    }
  }

  return (...args) => {
    latestPromise = fn(...args)
    if (pending) {
      pending = null
      const promiseError = new Error(409)
      promiseError.isCancelled = true
      reject(promiseError)
    }
    pending = new Promise((_resolve, _reject) => {
	    resolve = _resolve
	    reject = _reject
	 })
    latestPromise.then(fulfill(latestPromise)).catch(fail(latestPromise))
    return pending
  }

  
}
const consoleTimeout = (time) => new Promise(resolve => {
	setTimeout(() => {
		return resolve(time)
	}, time)
})
const delay = takeLatest(consoleTimeout)


delay(5000).then(console.log).catch((error) => console.log(error.message, error.isCancelled))
delay(500).then(console.log).catch(() => console.log('x'))
delay(10).then(console.log)


/** 
 takes only the last promise and rejects pending promises ()
 https://github.com/bjoerge/promise-latest
*/

const promiseDebounce = (fn) => {
  let lastReject
  return (...args) => new Promise((resolve, reject) => {
    if (lastReject) {
      lastReject(new Error('debounced'))
    }
    lastReject = reject
    fn(...args).then(resolve).catch(reject)
  })
}

//test
const consolePromise = promiseDebounce(
  (time) => new Promise((resolve) => setTimeout(() => resolve(time), 0))
)

consolePromise('A').then(console.log).catch((error) => console.log(error.message))
consolePromise('B').then(console.log)

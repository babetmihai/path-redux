/** 
 takes only the latest promise and rejects pending promises ()
 https://github.com/bjoerge/promise-latest
*/

const takeLatest = (fn) => {
  let lastReject
  return (...args) => new Promise((resolve, reject) => {
    if (lastReject) {
      lastReject(new Error())
    }
    lastReject = reject
    fn(...args).then(resolve).catch(reject)
  })
}

const consoleTimeout = (time) => new Promise(resolve => {
  setTimeout(() => {
    return resolve(time)
  }, time)
})
const delay = takeLatest(consoleTimeout)


delay(5000).then(console.log).catch((error) => console.log('CANCELED'))
delay(500).then(console.log).catch(() => console.log('CANCELED'))
delay(10).then(console.log)

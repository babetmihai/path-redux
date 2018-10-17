/** 
 takes only the last promise and rejects pending promises ()
 https://github.com/bjoerge/promise-latest
*/
const debounce = (fn) => {
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
const delay = debounce((time) => new Promise(resolve => {
  setTimeout(() => {
    return resolve(time)
  }, time)
}))

delay(100).then(console.log).catch((error) => console.log(error.message))
delay(130).then(console.log)

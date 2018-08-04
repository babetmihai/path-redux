const objectOrArray = (obj, isArray) => {
  if (isArray) {
    return [
      ...Object.entries(obj).reduce((acc, [index, value]) => {
        acc[parseInt(index)] = value
        return acc
      }, [])
    ]
  } else {
    return {
      ...Object.entries(obj).reduce((acc, [key, value]) => ((value !== undefined) 
        ? ({ ...acc, [key]: value }) 
        : acc
      ), {})
    }
  }
}


const pathSelector = (state = {}, type = '') => {
  const keys = type.split('/').filter(Boolean)
  switch (true) {
    case (keys.length === 0): return state
    case (keys.length === 1): return state[keys[0]]
    default: return pathSelector(state[keys[0]], keys.slice(1).join('/'))
  }
}

const pathReducer = (state = {}, { type = '', payload }) => {
  const keys = type.split('/').filter(Boolean)
  const key = keys[0]
  switch (true) {
    case (keys.length === 0): return payload
    case (keys.length === 1): return objectOrArray({
      ...state,
      [key]: payload
    }, state instanceof Array)
    default: return objectOrArray({
      ...state,
      [key]: pathReducer(state[key], {
        payload,
        type: keys.slice(1).join('/')
      })
    }, state instanceof Array)
  }
}

// test
console.log(pathReducer(
  { home: [] }, 
  { 
    type: 'home/0', 
    payload: { test: 'test' }
  }
))

import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'

const objectOrArray = (obj , isArray) => {
	if (isArray) {
		return [...Object.entries(obj).reduce((acc, [index, value]) => {
			acc[parseInt(index)] = value
			return acc
		}, [])]
	} else {
		return omitBy({ ...state, [keys[0]]: payload }, isNil)
	}
}

const initState = (state, key) => {
	switch (true) {
	  	case (!!state): return state
	  	case (!isNaN(key)): return []
	  	default: return {} 
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


const pathReducer = (state, { type = '', payload }) => {
  const keys = type.split('/').filter(Boolean)
  const key = keys[0]
  const newState = initState(state, key)
  switch (true) {
    case (keys.length === 0): return payload
    case (keys.length === 1): return objectOrArray({ 
    	...newState, 
    	[key]: payload 
    }, newState instanceof Array)
    default: return objectOrArray({
      ...newState,
      [key]: pathReducer(newState[key], {
        payload,
        type: keys.slice(1).join('/')
      })
    }, newState instanceof Array)
  }
}

console.log(pathReducer({}, { type: 'home/0/test/1', payload: { test: 'test' }}).home[0].test)

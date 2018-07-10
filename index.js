import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'

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
  switch (true) {
    case (keys.length === 0): return payload
    case (keys.length === 1): return omitBy({ ...state, [keys[0]]: payload }, isNil)
    default: return {
      ...state,
      [keys[0]]: pathReducer(state[keys[0]], {
        payload,
        type: keys.slice(1).join('/')
      })
    }
  }
}

/**
 redux api that completely replaces reducers with object get and set functions
 store.set('parent/child', 123) will result in state = { parent: { child: 123 } }
 store.get('parent/child') will return a promise with the child value, 123
 see also store.delete, store.update and store.select
*/

import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'

export const pathSelector = (state = {}, type = '') => {
  const keys = type.split('/').filter(Boolean)
  switch (true) {
    case (keys.length === 0): return state
    case (keys.length === 1): return state[keys[0]]
    default: return pathSelector(state[keys[0]], keys.slice(1).join('/'))
  }
}

export const pathReducer = (state = {}, { type = '', payload }) => {
  const keys = type.split('/').filter(Boolean)
  switch (true) {
    case (keys.length === 0): return payload
    case (keys.length === 1): return omitBy({
      ...state,
      [keys[0]]: payload
    }, isNil)
    default: return {
      ...state,
      [keys[0]]: pathReducer(state[keys[0]], {
        payload,
        type: keys.slice(1).join('/')
      })
    }
  }
}

export const storeApi = (store) => ({
  select: (selector) => selector(store.getState()),
  get: (type, defautValue) => {
    const value = pathSelector(store.getState(), type)
    if (value === undefined) {
      return defautValue
    } else {
      return value
    }
  },
  set: (type, payload) => new Promise((resolve) => {
    store.dispatch({ type, payload })
    return resolve(payload)
  }),
  delete: (type) => new Promise((resolve) => {
    store.dispatch({ type })
    return resolve()
  }),
  update: (type, payload) => new Promise((resolve) => {
    const value = pathSelector(store.getState(), type)
    if (
      typeof value === 'object' &&
      typeof payload === 'object'
    ) {
      store.dispatch({ type, payload: { ...value, ...payload } })
    } else {
      store.dispatch({ type, payload })
    }
    return resolve(payload)
  })
})

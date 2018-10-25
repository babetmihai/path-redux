/**
 redux api that completely replaces reducers with object get and set functions
 store.set('parent/child', 123) will result in state = { parent: { child: 123 } }
 store.get('parent/child') will return a promise with the child value, 123
 see also store.delete, store.update and store.select
*/

import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'

import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'
import isObject from 'lodash/isObject'
import get from 'lodash/get'

export const pathReducer = (state = {}, action = {}) => {
  const { type = '', payload } = action
  const keys = type.split('.').filter(Boolean)
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
        type: keys.slice(1).join('.')
      })
    }
  }
}

export const storeApi = (store) => ({
  select: (selector) => selector(store.getState()),
  get: (type, defautValue) => get(store.getState(), type, defautValue),
  set: (type, payload) => new Promise((resolve, reject) => {
    try {
      store.dispatch({ type, payload })
      return resolve(payload)
    } catch (error) {
      return reject(error)
    }
  }),
  delete: (type) => new Promise((resolve, reject) => {
    try {
      store.dispatch({ type })
      return resolve()
    } catch (error) {
      return reject(error)
    }
  }),
  update: (type, payload) => new Promise((resolve, reject) => {
    try {
      const value = get(store.getState(), type)
      if (isObject(value) && isObject(payload)) {
        store.dispatch({ type, payload: { ...value, ...payload } })
      } else {
        store.dispatch({ type, payload })
      }
      return resolve(payload)
    } catch (error) {
      return reject(error)
    }
  })
})

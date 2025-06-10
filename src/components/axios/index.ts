import _axios from 'axios'
import {AxiosCacheInstance, buildMemoryStorage, setupCache} from 'axios-cache-interceptor'

import {setupCookieJar} from './plugin/cookie.js'

const createAxios = (...axiosConfig: Parameters<typeof _axios.create>) => {
  const axios = _axios.create(...axiosConfig)

  setupCache(axios, {
    interpretHeader: false,
    storage: buildMemoryStorage(),
    ttl: 1000 * 60 * 5, // 5min
  })

  setupCookieJar(axios)

  return axios
}

const defaultAxios = createAxios()

export default defaultAxios as AxiosCacheInstance
export {createAxios}

export {default as cookiePlugin} from './plugin/cookie.js'

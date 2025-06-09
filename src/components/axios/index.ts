import _axios from 'axios'
import {AxiosCacheInstance, buildMemoryStorage, setupCache} from 'axios-cache-interceptor'

const axios = _axios.create()

setupCache(axios, {
  interpretHeader: false,
  storage: buildMemoryStorage(),
  ttl: 1000 * 60 * 5, // 5min
})

export default axios as AxiosCacheInstance

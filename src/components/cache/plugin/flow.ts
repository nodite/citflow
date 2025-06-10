import os from 'node:os'

import {KeyvSqlite} from '@keyv/sqlite'
import {useAdapter} from '@nodite/cache-manager-adapter'
import cacheManager, {CacheManagerOptions} from '@type-cacheable/core'
import {createCache} from 'cache-manager'
import {Keyv} from 'keyv'
import lodash from 'lodash'

import memory from './memory.js'

cacheManager.default.setOptions(<CacheManagerOptions>{
  debug: true,
  excludeContext: false,
  ttlSeconds: 0,
})

type StoreReturn = {cache: ReturnType<typeof createCache>; keyv: Keyv; store: KeyvSqlite}

const KEY_PREFIX = 'cache:flow:store'

const initStore = async (scope: string): Promise<StoreReturn> => {
  const existStore = await memory.cache.get<StoreReturn>(`${KEY_PREFIX}:${scope}`)

  if (existStore) {
    return existStore
  }

  const store = new KeyvSqlite({
    iterationLimit: 5000,
    table: 'citflow_' + scope.replaceAll('-', '_').trim(),
    uri: `sqlite://${os.homedir()}/.citflow/cache.db`,
  })

  const keyv = new Keyv({
    namespace: scope,
    store,
    ttl: cacheManager.default.options.ttlSeconds,
    useKeyPrefix: false,
  })

  const cache = createCache({stores: [keyv]})

  const storeReturn: StoreReturn = {cache, keyv, store}

  await memory.cache.set<StoreReturn>(`cache:flow:${scope}`, storeReturn)

  return storeReturn
}

const switchClient = async (scope: string): Promise<StoreReturn> => {
  const {cache, keyv, store} = await initStore(scope)

  const adapter = useAdapter(cache as never, [keyv as never])

  cacheManager.default.setClient(adapter)
  cacheManager.default.setFallbackClient(adapter)

  return {cache, keyv, store}
}

const close = async (): Promise<void> => {
  const keys = lodash.filter(memory.store.keys, (key) => String(key).startsWith(KEY_PREFIX))

  const disconnections = lodash.map(keys, async (key: string) => {
    const {store} = (await memory.cache.get<StoreReturn>(key)) as StoreReturn
    await store.disconnect()
    await memory.cache.del(key)
  })

  await Promise.all(disconnections)
}

export default {close, initStore, switchClient}

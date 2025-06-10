import {Hook} from '@oclif/core'

import {flow as flowCache} from '../../components/cache/index.js'

const hook: Hook.Finally = async function () {
  // Close flow cache store
  await flowCache.close()

  if (global.gc) global.gc()
}

export default hook

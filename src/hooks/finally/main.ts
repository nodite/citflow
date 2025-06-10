import {Hook} from '@oclif/core'

import {flow as flowCache} from '../../components/cache/index.js'
import puppeteer from '../../utls/puppeteer.js'

const hook: Hook.Finally = async function () {
  // Close all open pages
  await puppeteer.close()

  // Close flow cache store
  await flowCache.close()

  if (global.gc) global.gc()
}

export default hook

import '@components/cache'
import '@env'

import {Hook} from '@oclif/core'
import lodash from 'lodash'

lodash.templateSettings.interpolate = /{{([\S\s]+?)}}/g

const hook: Hook.Init = async function () {}

export default hook

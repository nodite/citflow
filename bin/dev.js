#!/usr/bin/env -S npx tsx --expose-gc

import {execute} from '@oclif/core'

await execute({development: true, dir: import.meta.url})

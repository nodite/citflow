#!/usr/bin/env -S node --import tsx/esm --expose-gc

import {execute} from '@oclif/core'

await execute({development: true, dir: import.meta.url})

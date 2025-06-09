import 'dotenv/config'

import path from 'node:path'

import {packageDirectorySync} from 'pkg-dir'

const CLI_DIR = process.cwd()

const PKG_DIR = packageDirectorySync() || CLI_DIR

const PKG_SRC_DIR = path.join(PKG_DIR, 'src')

const OPENAPI_DIR = path.join(PKG_SRC_DIR, 'components', 'openapi')

export {CLI_DIR, OPENAPI_DIR, PKG_DIR, PKG_SRC_DIR}

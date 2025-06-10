import 'dotenv/config'

import path from 'node:path'

import {packageDirectorySync} from 'pkg-dir'

const CLI_DIR = process.cwd()

const PKG_DIR = packageDirectorySync() || CLI_DIR

const PKG_SRC_DIR = path.join(PKG_DIR, 'src')

const OPENAPI_DIR = path.join(PKG_SRC_DIR, 'components', 'openapi')

const CITFLOW_BASE_URL = 'https://flow.ciandt.com/'

export {CITFLOW_BASE_URL, CLI_DIR, OPENAPI_DIR, PKG_DIR, PKG_SRC_DIR}

import path from 'node:path'

import {OPENAPI_DIR} from '@env'
import fs from 'fs-extra'
import lodash from 'lodash'
import {generateApi} from 'swagger-typescript-api'

type GenerateApiConfiguration = Awaited<ReturnType<typeof generateApi>>['configuration']['config']

const gen = async () => {
  const swaggers = await fs.readdir(path.join(OPENAPI_DIR, 'swagger'))

  for (const file of swaggers) {
    const name = path.basename(file, path.extname(file))

    console.log(`Generating API for ${name}...`)

    await generateApi(
      lodash.merge(
        {
          cleanOutput: true,
          fileName: name,
          fileNames: {
            dataContracts: 'data-contracts.js',
            httpClient: '../../../axios/http-client.js',
            outOfModuleApi: 'out-of-module-api.js',
            routeTypes: 'route-types.js',
          },
          httpClientType: 'axios',
          input: path.join(OPENAPI_DIR, 'swagger', file),
          output: path.join(OPENAPI_DIR, 'flow-apis', name),
        } as GenerateApiConfiguration,
        {
          codeGenConstructs(struct: any) {
            return {
              Keyword: {
                ...struct.Keyword,
                Object: 'Record<string, any>',
              },
            }
          },
          modular: true,
          templates: path.join(OPENAPI_DIR, 'templates'),
        } as any,
      ),
    )

    console.log(`API for ${name} generated successfully.`)
  }
}

await gen()

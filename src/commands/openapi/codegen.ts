import type {ServiceName} from '@@types/openapi'

import {SERVICES} from '@@types/openapi'
import OpenAPICommand from '@abstracts/openapi'
import OpenAPIService from '@services/openapi'
import colors from 'ansi-colors'

export default class Codegen extends OpenAPICommand {
  static description = 'OpenAPI code generation'

  static examples = [
    `$ citflow openapi:codegen --service global-settings
Generating code for service: global-settings
Code generation for service global-settings completed successfully.
----------------------------------------`,
  ]

  protected openapiService = new OpenAPIService({jsonEnabled: this.jsonEnabled()})

  async run(): Promise<void> {
    const {flags} = await this.parse(Codegen)

    const services: ServiceName[] = []

    if (flags.service === 'all') {
      services.push(...SERVICES)
    } else if (SERVICES.includes(flags.service as ServiceName)) {
      services.push(flags.service as ServiceName)
    }

    for (const service of services) {
      this.log(`Generating code for service: ${colors.cyan(service)}`)
      await this.openapiService.genCode(service)
      this.log(`Code generation for service ${colors.cyan(service)} completed successfully.`)
      this.log('----------------------------------------')
    }
  }
}

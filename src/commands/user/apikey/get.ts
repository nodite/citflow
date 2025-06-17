import BaseCommand from '@abstracts/base'
import {select} from '@inquirer/prompts'
import {Flags} from '@oclif/core'
import UserService from '@services/flow/user'
import colors from 'ansi-colors'
import lodash from 'lodash'

export default class Get extends BaseCommand {
  static description = 'Get Client Secret for the authenticated user.'

  static examples = [
    `$ citflow user apikey get
Select an API key to retrieve: my-api-key (xxx)
✔ Name: my-api-key
✔ Client ID: xxx
✔ Client Secret: xxx
`,
    `$ citflow user apikey get --name my-api-key
✔ Name: my-api-key
✔ Client ID: xxx
✔ Client Secret: xxx
`,
    `$ citflow user apikey get --client-id xxx
✔ Name: my-api-key
✔ Client ID: xxx
✔ Client Secret: xxx
`,
  ]

  static flags = {
    'client-id': Flags.string({
      description: 'Client ID of the API key to retrieve.',
      relationships: [{flags: ['name'], type: 'none'}],
    }),
    name: Flags.string({
      description: 'Name of the API key to retrieve.',
      relationships: [{flags: ['client-id'], type: 'none'}],
    }),
  }

  protected userService = new UserService({jsonEnabled: this.jsonEnabled()})

  async run(): Promise<void> {
    const {flags} = await this.parse(Get)

    const apiKeys = await this.userService.listApiKeys(flags.name)

    if (!flags['client-id']) {
      if (apiKeys.length === 0) {
        throw this.error('No API keys found matching the criteria.', {exit: 1})
      }

      flags['client-id'] = await select({
        choices: apiKeys.map((key) => ({name: `${key.name} (${key.clientId})`, value: key.clientId})),
        message: 'Select an API key to retrieve:',
      })
    }

    if (!flags.name) {
      flags.name = lodash.find(apiKeys, {clientId: flags['client-id']})?.name
    }

    this.log(`${colors.green('✔')} Name: ${colors.cyan(flags.name || 'N/A')}`)
    this.log(`${colors.green('✔')} Client ID: ${colors.cyan(flags['client-id'])}`)

    const clientSecret = await this.userService.getClientSecret(flags['client-id'])

    if (!clientSecret) {
      throw this.error(`No secret found, or it was not created by citflow.`, {exit: 1})
    }

    this.log(`${colors.green('✔')} Client Secret: ${colors.cyan(clientSecret)}`)
  }
}

import BaseCommand from '@abstracts/base'
import {confirm, input, password} from '@inquirer/prompts'
import {Flags} from '@oclif/core'
import UserService from '@services/flow/user'
import colors from 'ansi-colors'
import lodash from 'lodash'

export default class Set extends BaseCommand {
  static description = 'Set an API key for the authenticated user.'

  static examples = [
    `$ citflow user apikey set
✔ Client ID: xxx
✔ Client Secret: ***
API key set successfully.
To retrieve the API key, run: \`citflow user apikey get --client-id xxx\`
`,
    '$ citflow user apikey set --client-id xxx',
    '$ citflow user apikey set --client-id xxx --client-secret yyy',
  ]

  static flags = {
    'client-id': Flags.string({
      description: 'Client ID of the API key to set.',
    }),
    'client-secret': Flags.string({
      description: 'Client Secret of the API key to set.',
    }),
  }

  protected userService = new UserService({jsonEnabled: this.jsonEnabled()})

  async run(): Promise<void> {
    const {flags} = await this.parse(Set)

    if (flags['client-id']) {
      this.log(`${colors.green('✔')} ${colors.bold('Client ID')}: ${colors.cyan(flags['client-id'])}`)
    } else {
      flags['client-id'] = await input({
        message: 'Client ID:',
        required: true,
      })
    }

    if (flags['client-secret']) {
      this.log(`${colors.green('✔')} ${colors.bold('Client Secret')}: ${colors.cyan('******')}`)
    } else {
      flags['client-secret'] = await password({
        mask: true,
        message: 'Client Secret:',
      })
    }

    const exists = await this.userService.listApiKeys(flags['client-id'])

    if (lodash.isEmpty(exists)) {
      this.error(`No related API key found online for Client ID: ${flags['client-id']}`, {exit: false})

      const force = await confirm({
        default: false,
        message: 'Do you want to force set this API key?',
      })

      if (!force) {
        throw this.error('Operation cancelled. No API key was set.', {exit: 1})
      }
    }

    await this.userService.setApiKey(flags['client-id'], flags['client-secret'])

    this.log('API key set successfully.')

    this.log(`To retrieve the API key, run: \`citflow user apikey get --client-id ${flags['client-id']}\``)
  }
}

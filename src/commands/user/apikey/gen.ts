import {APPS} from '@@types/user-api/data-constracts'
import BaseCommand from '@abstracts/base'
import {Flags} from '@oclif/core'

export default class Gen extends BaseCommand {
  static description = 'Create a new API key for the authenticated user.'

  static examples = [
    `$ citflow user apikey create
`,
  ]

  static flags = {
    apps: Flags.string({
      default: [],
      description: 'Comma-separated list of app names to access with this API key.',
      multiple: true,
      options: APPS,
      required: true,
    }),
  }

  async run(): Promise<void> {}
}

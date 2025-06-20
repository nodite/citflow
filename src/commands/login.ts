import BaseCommand from '@abstracts/base'
import {Flags} from '@oclif/core'
import LoginService from '@services/flow/login'

export default class Login extends BaseCommand {
  static description = 'Login to CI&T Flow'

  static examples = [
    `$ <%= config.bin %> login
Logging in to CI&T Flow...
A browser window has been opened at https://flow.ciandt.com/login. Please continue the login in the web browser.
Browser window has been closed, processing the login result...
✔ Email: xxx@ciandt.com
✔ Principal Tenant: CI&T Playground
✔ Active Tenant: CI&T Playground
You have successfully logged in to CI&T Flow!`,
    '$ <%= config.bin %> login --channel portal',
  ]

  static flags = {
    channel: Flags.string({
      default: 'portal',
      description: 'The channel through which the request is made, affecting the resulting URL.',
      options: ['portal'],
    }),
  }

  protected loginService = new LoginService({jsonEnabled: this.jsonEnabled()})

  async run(): Promise<void> {
    const {flags} = await this.parse(Login)

    this.loginService.setDebug(flags.debug ?? false)

    // Implement the login logic here
    this.log('Logging in to CI&T Flow...')

    switch (flags.channel) {
      case 'portal': {
        await this.loginService.authPortal()
        break
      }

      default: {
        throw new Error(`Channel '${flags.channel}' is not supported.`)
      }
    }

    this.log('You have successfully logged in to CI&T Flow!')
  }
}

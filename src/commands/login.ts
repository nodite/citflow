import BaseCommand from '@abstracts/base'
import {Flags} from '@oclif/core'
import LoginService from '@services/flow/login'

export default class Login extends BaseCommand {
  static args = {}

  static description = 'Login to CI&T Flow'

  static examples = [
    `$ citflow login --channel=portal
Logging in to CI&T Flow...
A browser window has been opened at https://flow.ciandt.com/login. Please continue the login in the web browser.
Browser window has been closed, processing the login result...
✔ Email: xxx@ciandt.com
✔ Principal Tenant: CI&T Playground
✔ Active Tenant: CI&T Playground
You have successfully logged in to CI&T Flow!`,
  ]

  static flags = {
    channel: Flags.string({
      default: 'portal',
      description: 'The channel through which the request is made, affecting the resulting URL.',
      options: ['portal'],
    }),
  }

  protected loginService = new LoginService(this)

  async run(): Promise<any> {
    const {flags} = await this.parse(Login)

    // Implement the login logic here
    this.log('Logging in to CI&T Flow...')

    this.loginService.setDebug(Boolean(flags.debug))

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

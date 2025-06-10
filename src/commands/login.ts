import BaseCommand from '@abstracts/base'
import {Flags} from '@oclif/core'
import {ArgInput} from '@oclif/core/interfaces'
import LoginService from '@services/flow/login'
import getPort from 'get-port'

export default class Login extends BaseCommand {
  static args: ArgInput<{[arg: string]: any}> = {}

  static description = 'Login to CI&T Flow'

  static flags = {
    channel: Flags.string({
      default: 'portal',
      description: 'The channel through which the request is made, affecting the resulting URL.',
      options: ['portal'],
    }),

    redirectUri: Flags.string({
      default: 'http://localhost:{{port}}/auth/callback',
      description: 'The redirect URI to which a user will be redirected after the authentication is completed.',
      hidden: true,
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
        await this.loginService.authPortal({
          port: await getPort({port: 3000}),
          redirectUri: flags.redirectUri,
        })
        break
      }

      default: {
        throw new Error(`Channel '${flags.channel}' is not supported.`)
      }
    }

    this.log('You have successfully logged in to CI&T Flow!')
  }
}

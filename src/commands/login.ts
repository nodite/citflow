import {Flags} from '@oclif/core'
import {ArgInput} from '@oclif/core/interfaces'
import {awaitUntil} from 'await-until'
import {CacheRequestConfig} from 'axios-cache-interceptor'
import getPort from 'get-port'
import lodash from 'lodash'

import BaseCommand from '../abstracts/base.js'
import {
  CreateTokenBody,
  GeneratePrincipalPolicyUrlDto,
} from '../components/openapi/flow-apis/login-service/data-contracts.js'
import LoginService from '../components/openapi/flow-apis/login-service/LoginService.js'
import {CITFLOW_BASE_URL} from '../env.js'
import express from '../utls/express.js'
import puppeteer from '../utls/puppeteer.js'

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

  protected loginService = new LoginService({baseURL: CITFLOW_BASE_URL})

  async run(): Promise<any> {
    const {flags} = await this.parse(Login)

    if (flags.channel) {
      await this.authChannel()
    }

    if (flags.debug) {
      this.log('Debug mode is enabled')
    }

    // Implement the login logic here
    this.log('Logging in to CI&T Flow...')

    // Simulate a successful login
    this.log('Login successful!')

    return true
  }

  protected async authChannel(): Promise<CacheRequestConfig> {
    const {flags} = await this.parse(Login)

    const port = await getPort({port: 3000})

    const generatePrincipalPolicyUrlDto = {
      channel: flags.channel,
      redirectUri: lodash.template(flags.redirectUri)({port}),
    } as GeneratePrincipalPolicyUrlDto

    const createTokenBody = {} as CreateTokenBody

    // express app to handle the callback
    let appIsListened = false

    const app = express.createApp()

    app.use('/auth/callback', (req, res) => {
      const {code, flow_code, flow_state} = req.query
      generatePrincipalPolicyUrlDto.code = flow_code as string
      createTokenBody.code = code as string
      createTokenBody.state = flow_state as string
      res.type('text')
      res.send('Authentication successful! You can close this window to continue.')
    })

    app.listen(port, async () => {
      this.log(`Server is running at http://localhost:${port}`)
      this.log('Please complete the login process in the opened browser window.')
      appIsListened = true
    })

    // wait until the app is listened
    await awaitUntil({predicate: () => appIsListened})

    const browser = await puppeteer.core.launch({
      args: [
        `--app=https://flow.ciandt.com/login?redirect_uri=${generatePrincipalPolicyUrlDto.redirectUri}`,
        '--window-size=600,800',
        '--enable-features=NetworkService,NetworkServiceInProcess',
        '--no-sandbox',
      ],
      headless: false,
    })

    await awaitUntil({
      async predicate() {
        return browser.pages().then((pages) => lodash.isEmpty(pages) || pages[0].isClosed())
      },
      timeout: 3600 * 1000, // 1 hour
    })

    await browser.close()

    if (lodash.isEmpty(createTokenBody)) {
      this.error('Login failed. Please try again.', {exit: 1})
    }

    throw new Error('Not implemented.')
  }
}

import {CreateTokenResult} from '@@types/flow-apis/login-service/data-constracts'
import {
  CreateTokenBody,
  GeneratePrincipalPolicyUrlDto,
} from '@components/openapi/flow-apis/login-service/data-contracts'
import LoginApi from '@components/openapi/flow-apis/login-service/LoginService'
import {FLOW_BASE_URL} from '@env'
import BaseService from '@services/base'
import express from '@utils/express'
import puppeteer from '@utils/puppeteer'
import colors from 'ansi-colors'
import {awaitUntil} from 'await-until'
import lodash from 'lodash'
import {HTTPRequest} from 'puppeteer'

export default class LoginService extends BaseService {
  /**
   * Login Api.
   */
  protected loginApi = new LoginApi({baseURL: FLOW_BASE_URL})

  /**
   * Authenticates a user via the portal channel.
   *
   * @param config - Configuration options for the authentication process.
   * @param config.port - The port on which the local server will listen for the authentication callback.
   * @param config.redirectUri - The redirect URI template to be used in the authentication flow.
   */
  public async authPortal(config: {port: number; redirectUri: string}): Promise<void> {
    const generatePrincipalPolicyUrlDto = {
      channel: 'portal',
      redirectUri: lodash.template(config.redirectUri)({port: config.port}),
    } as GeneratePrincipalPolicyUrlDto

    const createTokenBody = {} as CreateTokenBody

    // Express listener.
    let appIsListened = false

    const app = express.createApp()

    app.use('/auth/callback', async (req, res) => {
      const {code, flow_code, flow_state} = req.query

      generatePrincipalPolicyUrlDto.code = (flow_code || generatePrincipalPolicyUrlDto.code) as string
      createTokenBody.code = code as string
      createTokenBody.state = flow_state as string

      const tenantUrl = new URL('https://flow.ciandt.com/login/tenants')
      tenantUrl.searchParams.set('redirect_uri', generatePrincipalPolicyUrlDto.redirectUri)
      tenantUrl.searchParams.set('change_tenant', '1')

      res.type('text/html')
      res.send(
        [
          'You have logged into CI&T Flow!',
          `If you want to change organization/tenant, please click <a href="${tenantUrl.toString()}">here</a>.`,
          'Otherwise, you can close this window to finish authentication.',
        ].join('<br>'),
      )
    })

    app.listen(config.port, async () => {
      appIsListened = true
    })

    await awaitUntil({predicate: () => appIsListened})

    // Login flow
    const loginBrowser = await puppeteer.core.launch({
      args: [
        `--app=https://flow.ciandt.com/login?redirect_uri=${generatePrincipalPolicyUrlDto.redirectUri}`,
        '--window-size=600,800',
        '--enable-features=NetworkService,NetworkServiceInProcess',
        '--no-sandbox',
      ],
      headless: false,
    })

    const loginPage = await loginBrowser.pages().then((pages) => pages[0])

    loginPage.on('request', async (request: HTTPRequest) => {
      if (request.method().toUpperCase() !== 'POST') {
        return
      }

      const url = new URL(request.url())

      if (url.pathname === '/login-service/v1/auth/policy-url/generate-principal') {
        lodash.merge(generatePrincipalPolicyUrlDto, JSON.parse(request.postData() || '{}'))
      }

      if (url.pathname === '/login-service/v1/auth/token/create') {
        lodash.merge(createTokenBody, JSON.parse(request.postData() || '{}'))
      }
    })

    this.cmd.log(
      'A browser window has been opened at https://flow.ciandt.com/login. ' +
        'Please continue the login in the web browser.',
    )

    await awaitUntil({predicate: async () => loginPage.isClosed(), timeout: 3600 * 1000})

    if (lodash.isEmpty(createTokenBody)) {
      this.cmd.error('Login failed, may be due to network issues.')
    }

    const createTokenResult = lodash.get(
      await this.loginApi.tokenCreate(createTokenBody),
      'data',
    ) as unknown as CreateTokenResult

    const principalTenant = lodash.find(createTokenResult.tenants, {isPrincipal: true})
    const activeTenant = lodash.find(createTokenResult.tenants, {isActive: true})

    this.cmd.log(`${colors.green('✔')} User: ${generatePrincipalPolicyUrlDto.email}`)
    this.cmd.log(`${colors.green('✔')} Principal Tenant: ${principalTenant?.displayName}`)
    this.cmd.log(`${colors.green('✔')} Active Tenant: ${activeTenant?.displayName}`)

    throw new Error('Not implemented.')
  }
}

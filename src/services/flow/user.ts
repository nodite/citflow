import type {AuthType, AuthUser} from '@@types/login'
import type {UserTenantsResult} from '@@types/login-service/data-constracts'
import type {ApiKeyDto, AppName, CreateApiKeyResult} from '@@types/user-api/data-constracts'

import {CacheClient} from '@components/cache'
import LoginApi from '@components/openapi/login-service/LoginService'
import UserApi from '@components/openapi/user-api/UserApi'
import {FLOW_BASE_URL} from '@env'
import BaseService from '@services/base'
import {Cacheable, CacheUpdate} from '@type-cacheable/core'
import Logger from '@utils/logger'
import color from 'ansi-colors'
import lodash from 'lodash'
import validator from 'validator'

export default class UserService extends BaseService {
  protected loginApi = new LoginApi({baseURL: FLOW_BASE_URL})

  protected userApi = new UserApi({baseURL: FLOW_BASE_URL})

  static CACHE_KEY_APIKEY = (tenant: string, clientId: string) => {
    const logger = new Logger('CACHE_KEY_APIKEY')

    return (args: any[]) => {
      const user = lodash.find(args, (arg) => lodash.has(arg, 'auth') && lodash.has(arg, 'user')) as
        | AuthUser
        | undefined

      if (!user) throw logger.error('AuthUser is required to build the cache key.', {exit: 1})

      if (user.auth === 'email' && !validator.isEmail(user.user)) {
        throw logger.error('Invalid email address.', {exit: 1})
      }

      return `${user.auth}:${user.user}:apikey:${tenant}:${clientId}`
    }
  }

  public async createApiKey(name: string, apps: AppName[]): Promise<CreateApiKeyResult> {
    const resp = await this.userApi.createApiKey({
      appsToAccess: apps,
      name,
    })

    // api key.
    const apiKey = resp.data as unknown as CreateApiKeyResult

    await this.setApiKey(apiKey.clientId, apiKey.clientSecret)

    return apiKey
  }

  public async deleteApiKey(apiKey: ApiKeyDto): Promise<void> {
    const user = await this.getDefaultUser()
    const tenant = await this.getPrincipalTenant()
    const cacheKey = UserService.CACHE_KEY_APIKEY(tenant, apiKey.clientId)([user])

    if (!apiKey.dangling) {
      await this.userApi.deleteApiKey(apiKey.clientId)
    }

    await CacheClient.USER.del(cacheKey)
  }

  public async getClientSecret(clientId: string): Promise<string | undefined> {
    const user = await this.getDefaultUser()
    const tenant = await this.getPrincipalTenant()
    const cacheKey = UserService.CACHE_KEY_APIKEY(tenant, clientId)([user])
    return CacheClient.USER.get<string>(cacheKey)
  }

  @Cacheable({cacheKey: 'default', client: CacheClient.USER})
  public async getDefaultUser(): Promise<AuthUser> {
    throw this.logger.error(
      ['No default account set. ', 'Please run `citflow user set` to set a default account.'].join('\n'),
      {exit: 1},
    )
  }

  public async getPrincipalTenant(): Promise<string> {
    const user = await this.getDefaultUser()

    if (user.auth !== 'email') {
      throw this.logger.error('Principal tenant can only be retrieved for email authenticated users.', {exit: 1})
    }

    const userTenants = await this.loginApi.getUserTenants({email: user.user, principal: 'true'})
    const tenant = userTenants.data as unknown as UserTenantsResult

    if (lodash.isEmpty(tenant)) {
      throw this.logger.error(`No principal tenant found for user ${color.cyan(user.auth + ':' + user.user)}.`, {
        exit: 1,
      })
    }

    return Object.keys(tenant)[0]
  }

  public async getUsers(): Promise<AuthUser[]> {
    const keys = await CacheClient.LOGIN.keys('*')

    return keys.map((key) => {
      const [auth, user] = key.split(':')
      return {auth: auth as AuthType, user}
    })
  }

  public async listApiKeys(search?: string, showInactive?: boolean): Promise<ApiKeyDto[]> {
    const apiKeys: ApiKeyDto[] = []

    // Pagination
    let page = 1

    do {
      const getApiKeys = await this.userApi.getApiKeys({
        active: showInactive ? undefined : 'true',
        limit: 10,
        page,
        search,
      })

      apiKeys.push(...(getApiKeys.data.items || []))

      if (apiKeys.length >= getApiKeys.data.meta.totalItems) break

      page++
    } while (true)

    // fix dangling API keys that are not in the cache.
    const user = await this.getDefaultUser()
    const tenant = await this.getPrincipalTenant()
    const cacheKeys = await CacheClient.USER.keys(UserService.CACHE_KEY_APIKEY(tenant, '*')([user]))

    for (const key of cacheKeys) {
      const clientId = key.split(':').at(-1) as string

      if (lodash.some(apiKeys, {clientId})) continue

      const clientSecret = await this.getClientSecret(clientId)

      apiKeys.push({
        active: true,
        appsToAccess: [],
        clientId,
        createdAt: '0000-00-00T00:00:00Z',
        dangling: true,
        expiresIn: '0000-00-00T00:00:00Z',
        id: 'unknown',
        name: 'unknown',
        secretHint: clientSecret ? clientSecret.slice(0, 4) + '...' + clientSecret.slice(-4) : 'unknown',
        updatedAt: '0000-00-00T00:00:00Z',
        userId: 'unknown',
      })
    }

    return lodash.filter(apiKeys, (key) =>
      search ? lodash.includes(key.name, search) || lodash.includes(key.clientId, search) : true,
    )
  }

  public async setApiKey(clientId: string, clientSecret: string): Promise<void> {
    const user = await this.getDefaultUser()
    const tenant = await this.getPrincipalTenant()
    const cacheKey = UserService.CACHE_KEY_APIKEY(tenant, clientId)([user])
    await CacheClient.USER.set(cacheKey, clientSecret)
  }

  @CacheUpdate({cacheKey: 'default', client: CacheClient.USER})
  public async setDefaultUser(user: AuthUser): Promise<AuthUser | undefined> {
    const users = await this.getUsers()

    if (!lodash.some(users, (u) => u.auth === user.auth && u.user === user.user)) {
      const message = [
        `The account ${color.cyan(user.auth + ':' + user.user)} is not authenticated.`,
        'Please run `citflow login` to authenticate the account first.',
      ].join('\n')

      throw this.logger.error(message, {exit: 1})
    }

    return user
  }
}

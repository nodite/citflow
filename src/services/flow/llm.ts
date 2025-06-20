import type {AuthMeta} from '@@types/services/flow/llm'

import {Auths, AuthUser} from '@@types/services/flow/login'
import {CacheClient} from '@components/cache'
import AuthEngineApi from '@components/openapi/auth-engine-api/AuthEngineApi'
import {FLOW_BASE_URL} from '@env'
import BaseService from '@services/base'
import UserService from '@services/flow/user'
import {Cacheable, CacheUpdate} from '@type-cacheable/core'
import lodash from 'lodash'

export default class LlmService extends BaseService {
  protected authEngineApi = new AuthEngineApi({baseURL: FLOW_BASE_URL})

  protected userService = new UserService({jsonEnabled: this.jsonEnabled})

  @Cacheable({cacheKey: (args: any[]) => `meta:${args[0]}`, client: CacheClient.LLM})
  public async getAuthMeta(_name: string): Promise<AuthMeta> {
    throw this.logger.error('No auth meta found for the given name.', {exit: 1})
  }

  @CacheUpdate({cacheKey: (args: any[]) => `meta:${args[0]}`, client: CacheClient.LLM})
  public async setAuthMeta(name: string, meta: AuthMeta): Promise<AuthMeta> {
    const userSecrets = await Promise.all(
      lodash.map(Auths, async (auth): Promise<string | undefined> => {
        if (auth === 'llm') return undefined
        const user: AuthUser = {auth, user: name}
        const cacheKey = UserService.CACHE_KEY_CLIENT_SECRET(meta.tenant, meta.clientId)([user])
        return CacheClient.USER.get(cacheKey)
      }),
    )

    const llmUser: AuthUser = {auth: 'llm', tenant: meta.tenant, user: name}

    if (userSecrets.some(Boolean)) {
      await this.userService.clearClientSecretForUser(llmUser, meta.clientId)
    } else {
      await this.userService.setClientSecretForUser(llmUser, meta.clientId, meta.clientSecret!)

      meta.clientSecret = undefined // Clear clientSecret from the meta to avoid storing sensitive data
    }

    return meta
  }
}

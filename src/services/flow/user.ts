import type {AuthType, AuthUser} from '@@types/login'

import {CacheClient} from '@components/cache'
import BaseService from '@services/base'
import {Cacheable, CacheUpdate} from '@type-cacheable/core'
import color from 'ansi-colors'
import lodash from 'lodash'

export default class UserService extends BaseService {
  /**
   * Get the default user email.
   *
   * @returns The default user email.
   */
  @Cacheable({cacheKey: 'default', client: CacheClient.USER})
  public async getDefaultUser(): Promise<AuthUser> {
    throw this.logger.error(
      ['No default account set. ', 'Please run `citflow user set` to set a default account.'].join('\n'),
      {exit: 1},
    )
  }

  /**
   * Get the list of authenticated user emails.
   *
   * @returns The list of authenticated user emails.
   */
  public async getUsers(): Promise<AuthUser[]> {
    const keys = await CacheClient.LOGIN.keys('*')

    return keys.map((key) => {
      const [auth, user] = key.split(':')
      return {auth: auth as AuthType, user}
    })
  }

  /**
   * Set the default user email.
   *
   * @param user - The user to set as default.
   * @returns The user set as default.
   */
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

import {AxiosInstance, AxiosRequestConfig} from 'axios'
import {HttpCookieAgent, HttpsCookieAgent} from 'http-cookie-agent/http'
import lodash from 'lodash'
import {Cookie as PPCookie} from 'puppeteer'
import {Cookie, CookieJar} from 'tough-cookie'

const jar = new CookieJar()

const config: AxiosRequestConfig = {
  httpAgent: new HttpCookieAgent({cookies: {jar}}),
  httpsAgent: new HttpsCookieAgent({cookies: {jar}}),
  maxRedirects: 0,
}

const setupCookieJar = (axios: AxiosInstance): AxiosInstance => {
  axios.defaults = lodash.merge({}, axios.defaults, config) as never

  axios.interceptors.request.use(async (config) => {
    for (const sck of config.headers['set-cookie'] || []) {
      const ck = Cookie.parse(sck) as Cookie

      const curl = new URL(config.url || '')
      ck.domain = ck.domain || curl.hostname
      ck.path = ck.path || curl.pathname || '/'

      await jar.setCookie(ck, `${curl.protocol || 'https:'}//${ck.domain}${ck.path}`)
    }

    delete config.headers['set-cookie']

    config.headers.Cookie = lodash
      .filter([config.headers.Cookie, await jar.getCookieString(config.url || '')])
      .join('; ')
      .trim()

    return config
  })

  axios.interceptors.response.use(
    async (response) => {
      for (const sck of response.headers['set-cookie'] || []) {
        const ck = Cookie.parse(sck) as Cookie

        if (lodash.has(response, 'headers.location')) {
          const curl = new URL(response.headers.location)
          ck.domain = ck.domain || curl.hostname
          ck.path = ck.path || curl.pathname || '/'
        } else {
          ck.domain = ck.domain || response.request?.host
          ck.path = ck.path || response.request?.path || '/'
        }

        await jar.setCookie(ck, `https://${ck.domain}${ck.path}`)
      }

      return response
    },
    async (error) => {
      if (error.status === 302) {
        const {response} = error

        for (const sck of response.headers['set-cookie'] || []) {
          const ck = Cookie.parse(sck) as Cookie

          const curl = new URL(response.headers.location)
          ck.domain = ck.domain || curl.hostname
          ck.path = ck.path || curl.pathname || '/'

          await jar.setCookie(ck, `https://${ck.domain}${ck.path}`)
        }

        const nextConfig = lodash.merge({}, error.config, {
          headers: {Cookie: await jar.getCookieString(error.config.url || '')},
          url: response.headers.location,
        })

        const resp = await axios.request(nextConfig)

        return resp
      }

      throw error
    },
  )

  return axios
}

const toString = (cookie: Cookie | PPCookie): string => {
  const cks = []

  if (cookie instanceof Cookie) {
    cks.push(`${cookie.key}=${cookie.value}`)

    if (cookie.domain) cks.push(`Domain=${cookie.domain}`)
    if (cookie.path) cks.push(`Path=${cookie.path}`)
    if (cookie.expires) cks.push(`Expires=${cookie.expires}`)
    if (cookie.httpOnly) cks.push(`HttpOnly`)
    if (cookie.secure) cks.push(`Secure`)
    if (cookie.sameSite) cks.push(`SameSite=${cookie.sameSite}`)
    if (cookie.maxAge) cks.push(`Max-Age=${cookie.maxAge}`)
    if (cookie.extensions) cks.push(...cookie.extensions)
  } else {
    cks.push(`${cookie.name}=${cookie.value}`)

    if (cookie.domain) cks.push(`Domain=${cookie.domain}`)
    if (cookie.path) cks.push(`Path=${cookie.path}`)
    if (cookie.expires) cks.push(`Expires=${cookie.expires}`)
    if (cookie.httpOnly) cks.push(`HttpOnly`)
    if (cookie.secure) cks.push(`Secure`)
    if (cookie.sameSite) cks.push(`SameSite=${cookie.sameSite}`)
    if (cookie.size > 0) cks.push(`Size=${cookie.size}`)
    if (cookie.session) cks.push(`Session`)
    if (cookie.priority) cks.push(`Priority=${cookie.priority}`)
  }

  return cks.join('; ')
}

const toPuppeteer = (cookie: Cookie): PPCookie => {
  const cks = {} as PPCookie

  cks.domain = cookie.domain || ''
  cks.domain = cks.domain.split('.').length === 2 ? `.${cks.domain}` : cks.domain

  if (cookie.expires === 'Infinity') {
    cks.expires = -1
  } else if (cookie.expires) {
    cks.expires = cookie.expires.getTime() / 1000
  } else {
    cks.expires = -1
  }

  cks.httpOnly = cookie.httpOnly
  cks.name = cookie.key
  cks.path = cookie.path || '/'
  cks.sameSite = cookie.sameSite as PPCookie['sameSite']
  cks.secure = cookie.secure
  cks.session = Boolean(cookie.extensions?.includes('Session'))

  const size = lodash.find(cookie.extensions, (v: string) => v.startsWith('Size'))
  cks.size = Number(size?.split('=')?.[1] ?? encodeURIComponent(cookie.value).length)

  cks.value = cookie.value

  return cks
}

export default {jar, setupCookieJar, toPuppeteer, toString}
export {jar as CookieJar, setupCookieJar}

export const Auths = ['email', 'llm'] as const

export type AuthType = (typeof Auths)[number]

export type AuthUser = {
  auth: AuthType
  tenant?: string
  user: string
}

const isProd = (): boolean => {
  return !['development', 'test'].includes(process.env.NODE_ENV ?? '')
}

export default {isProd}

import BaseCommand from '@abstracts/base'

export default abstract class BaseService {
  protected cmd: BaseCommand

  protected debug = false

  constructor(cmd: BaseCommand, config?: {debug?: boolean}) {
    this.cmd = cmd
    this.debug = config?.debug ?? false
  }

  public setDebug(debug: boolean): this {
    this.debug = debug
    return this
  }
}

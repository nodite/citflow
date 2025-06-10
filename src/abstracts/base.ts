import {Command} from '@oclif/core'
import {FlagInput} from '@oclif/core/interfaces'

export default abstract class BaseCommand extends Command {
  static args = {}

  static baseFlags: FlagInput<{[flag: string]: any}> = {}
}

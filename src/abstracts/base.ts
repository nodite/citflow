import {Command} from '@oclif/core'
import {FlagInput} from '@oclif/core/interfaces'

export default abstract class BaseCommand extends Command {
  static baseFlags: FlagInput<{[flag: string]: any}> = {}
}

import {Command} from '@oclif/core'

export default abstract class BaseCommand extends Command {
  static args = {}

  static baseFlags = {}
}

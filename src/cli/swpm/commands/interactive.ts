import { CommandModule } from 'yargs'
import { translateArgs } from 'helpers/args'
import cmdr from 'translator/commander'

type Options = {
  'package'?: string
  'latest'?: boolean
  'global'?: boolean
}

const interactive: CommandModule<Record<string, unknown>, Options> = {
  command: 'interactive [args] [FLAGS]',
  aliases: ['ui'],
  describe: 'update packages interactive',

  builder: (yargs) =>
    yargs
      .positional('package', {
        type: 'string',
        desc: '<package>'
      })
      .conflicts('interactive',['add', 'clean', 'install', 'remove', 'upgrade'])
      .option('latest', {
        alias: 'L',
        type: 'boolean',
        desc: 'upgrade the latest version of the package',
        usage: '$0 interactive --latest'
      })
      .option('global', {
        alias: 'g',
        type: 'boolean',
        desc: 'update package as global',
        usage: '$0 update --global'
      }),

  handler: (yargs) => {
    if ('latest' in yargs) {
      translateArgs(yargs, cmdr, '--latest', '-L')
    }
  }
}

export default interactive

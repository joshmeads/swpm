import { CommandModule } from 'yargs'
import { exit } from 'node:process'
import chalk from 'chalk'
import { stripIndents } from 'common-tags'
import { translateArgs } from '../../../helpers/args.js'
import cmdr from '../../../translator/commander.js'
import prompts from 'prompts'

type OptionsProps = {
  'package-lock'?: boolean,
  'frozen'?: boolean
}

const install: CommandModule<Record<string, unknown>, OptionsProps> = {
  command: 'install [FLAGS]',
  aliases: ['i'],
  describe: 'install packages from package.json',

  builder: (yargs) =>
    yargs
      .conflicts('install', ['add', 'clean', 'open', 'remove', 'update', 'upgrade'])
      .option('package-lock', {
        alias: 'P',
        type: 'boolean',
        description: 'ignore lock file when installing and prevents writing',
        usage: '$0 install --package-lock',
        conflicts: ['frozen']
      } as const)
      .option('frozen', {
        alias: 'F',
        type: 'boolean',
        description: 'install from lock file (without updating it)',
        usage: '$0 install --frozen',
        conflicts: ['package-lock']
      } as const),

  handler: async (yargs) => {
    if (!cmdr?.cmd) return

    if ('package-lock' in yargs) {
      translateArgs({ yargs, cmdr, flag: '--package-lock', alias: '-P' })
    }

    if ('frozen' in yargs) {
      translateArgs({ yargs, cmdr, flag: '--frozen', alias: '-F' })
    }

    if (('FLAGS' in yargs) || ('global' in yargs)) {
      const args = ['add', ...cmdr.args.slice(1)]
      const command = chalk.blue.bold(`swpm ${args.join(' ')}`)

      console.error(stripIndents`
        ${chalk.red.bold('Error')}: to install a specific ${chalk.bold('<package>')} please use ${chalk.bold('add')} command.
      `)

      const response = await prompts({
        type: 'confirm',
        name: 'value',
        message: `Do you want to re-run it as ${command}`,
        initial: true
      })

      if (!response.value) {
        exit(1)
      }

      cmdr.args = cmdr.args.map(arg => arg === 'install' ? 'add' : arg)
    }
  }
}

export default install

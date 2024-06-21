import chalk from 'chalk'
import { stripIndent } from 'common-tags'
import { exit } from 'node:process'
import prompts from 'prompts'
import packagesList from '../packages/list.js'
import { runCommand, showCommand } from './cmds.js'

import type { PackageManagerList } from '../packages/packages.types.js'
import type { CommanderPackage } from '../translator/commander.types.js'

export const setPackageVersion = async (packageName: PackageManagerList) => {
  const getPackageVersion = packagesList.filter((pkg) => pkg.cmd === packageName) ?? []

  if (getPackageVersion.length) {
    const [config] = getPackageVersion

    if (config?.version) {
      const command = `${packageName} set command ${config.version}`
      const color = config?.color ?? chalk.reset()

      if (packageName.startsWith('yarn')) {
        console.log(stripIndent`
          This is an important step on ${chalk.hex(color).bold(packageName)} package manager
          for more information please visit ${chalk.bold.underline('https://yarnpkg.com/cli/set/version')}
        `)
        console.log('\n')
      }

      const response = await prompts({
        type: 'confirm',
        name: 'value',
        message: `Do you also want to run the ${chalk.blue.bold(command)} command?`,
        initial: true
      })

      if (!response.value) {
        exit(1)
      }

      const cmdr: CommanderPackage = {
        id: packageName,
        cmd: config.cmd,
        args: ['set', 'version', config.version],
        origin: undefined,
        config
      }

      showCommand(cmdr)
      runCommand(cmdr)
    }
  }
}

import chalk from 'chalk'
import { exit } from 'node:process'
import { getPackageJson, savePackageJson } from '../helpers/files.js'

import type { PackageConfiguration } from '../packages/packages.types.js'

type Props = {
  id: PackageConfiguration['id']
  config: Pick<PackageConfiguration, 'color'>
}

export const pinPackageManager = async ({ id, config }: Props) => {
  const packageJson = await getPackageJson()

  if (packageJson) {
    packageJson.swpm = id
    await savePackageJson(packageJson)
    console.log(`${chalk.green.bold('success')}: ${chalk.hex(config.color).bold(id)} was pinned on ${chalk.bold('package.json')} file.`)
    exit(0)
  }
}

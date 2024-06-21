import bun from './managers/bun.js'
import npm from './managers/npm.js'
import pnpm from './managers/pnpm.js'
import yarnBerry from './managers/yarn@berry.js'
import yarnClassic from './managers/yarn@classic.js'

import type { CommanderPackage } from '../translator/commander.types.js'
import type { PackageManagerList } from './packages.types.js'

export const packageManagerList = [
  npm,
  yarnClassic,
  yarnBerry,
  pnpm,
  bun
]

export const availablePackages = () => {
  return packageManagerList.map((pkg) => pkg.id)
}

export const packageConfigExists = (id: PackageManagerList) => {
  return availablePackages().includes(id)
}

export const getPackageConfiguration = async (cmdr: Pick<CommanderPackage, 'id'>, ext: 'js' | 'ts' = 'js') => {
  try {
    const config = await import(`./managers/${cmdr.id}.${ext}`)
    return config?.default
  } catch {
    return {}
  }
}

export default packageManagerList

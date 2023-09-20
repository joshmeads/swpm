import { runCommand, showCommand } from './cmds.js'
import packagesList from '../packages/list.js'
import { PackageManagerList } from '../packages/packages.types.js'
import { CommanderPackage } from '../translator/commander.types.js'

export const setPackageVersion = async (packageName: PackageManagerList) => {
  const getPackageVersion = packagesList.filter((pkg) => pkg.cmd === packageName) ?? []

  if (getPackageVersion.length) {
    const [config] = getPackageVersion

    if (config.version) {
      const cmdr: CommanderPackage = {
        cmd: packageName,
        args: ['set', 'version', config.version],
        origin: undefined,
        config
      }

      showCommand(cmdr)
      await runCommand(cmdr)
    }
  }
}

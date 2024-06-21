import { argv } from 'node:process'
import { cleanFlag, translateArgs } from '../helpers/args.js'
import { translateCommand } from '../helpers/cmds.js'
import { detectVoltaPin, getCurrentPackageManager } from '../helpers/get.js'
import { setPackageVersion } from '../helpers/set.js'
import { getPackageConfiguration } from '../packages/list.js'
import cmdr from '../translator/commander.js'
import { options as swpmOptions } from './swpm/cli.js'
import { options as swpxOptions } from './swpx/cli.js'

import type { InferredOptionTypes, MiddlewareFunction } from 'yargs'
import type { PackageManagerList, PackageManagersCmd } from '../packages/packages.types.js'

type Props = InferredOptionTypes<typeof swpmOptions> | InferredOptionTypes<typeof swpxOptions>
const middleware: MiddlewareFunction<Props> = async (yargs) => {
  cmdr.args = argv.slice(2)

  if ('debug' in yargs) {
    cleanFlag({ yargs, cmdr, flag: '--debug' })
    cleanFlag({ yargs, cmdr, flag: '-d' })
  }

  if ('use' in yargs) {
    cleanFlag({ yargs, cmdr, flag: '--use' })
    cleanFlag({ yargs, cmdr, flag: '-u' })
    cmdr.id = yargs.use?.startsWith('yarn') ? 'yarn@berry' : yargs.use
    cmdr.cmd = yargs.use?.split('@')?.[0] as PackageManagersCmd
    await setPackageVersion(yargs.use!)
  }

  if ('pin' in yargs && yargs?.pin) {
    cmdr.id = yargs.pin as PackageManagerList
  }

  if ('test' in yargs) {
    cleanFlag({ yargs, cmdr, flag: '--test' })
    cleanFlag({ yargs, cmdr, flag: '-t' })
    cmdr.id = yargs.test
    cmdr.cmd = yargs.test?.split('@')?.[0] as PackageManagersCmd
  }

  if ('mute' in yargs) {
    cleanFlag({ yargs, cmdr, flag: '--mute' })
    cleanFlag({ yargs, cmdr, flag: '-m' })
  }

  if (!cmdr?.cmd || yargs?.info) {
    const { origin, id, version } = await getCurrentPackageManager() ?? {}
    cmdr.origin = origin
    cmdr.version = version
    cmdr.id = id
    cmdr.cmd = id?.split('@')?.[0] as PackageManagersCmd
  }

  if (cmdr?.cmd) {
    cmdr.volta = await detectVoltaPin(cmdr) ?? false
    cmdr.config = await getPackageConfiguration(cmdr)

    if ('global' in yargs) {
      await translateArgs({ yargs, cmdr, flag: '--global', alias: '-g' })
    }

    if (yargs._.length) {
      translateCommand({ yargs, cmdr })
    }
  }
}

export default middleware

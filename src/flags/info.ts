import chalk from 'chalk';
import { stripIndents } from 'common-tags';
import { exit } from 'node:process';

import { getCommandResult } from '../helpers/cmds.js';
import { commandVerification, get } from '../helpers/get.js';
import { getOriginIcon } from '../helpers/icons.js';
import { getSwpmInfo } from '../helpers/info.js';

import type { CommanderPackage } from '../translator/commander.types.js';

type Info = {
  _: CommanderPackage['cmd'],
  using: CommanderPackage['cmd'],
  error: string | null,
  ready: boolean,
  origin: CommanderPackage['origin'],
  volta: boolean,
  versions: Partial<{
    [key in NonNullable<CommanderPackage['cmd']> | "swpm" | "node"]: string
  }>
}

export const showNoPackageDetected = () => {
  console.error(stripIndents`
  ${chalk.red.bold('Error')}: no Package Manager or Environment Variable was found.

  Please review if the current path has a ${chalk.bold('package.json')} or a ${chalk.bold('lock')} file.
  Highly recommend pin a Package Manager with ${chalk.blue.bold('swpm --pin <npm|yarn[@berry]|pnpm|bun>')} command.
`)
  exit(1)
}

export const getPackageInformation = async ({ cmd, origin, config, volta }: CommanderPackage): Promise<Info> => {
  const nodeVersion = getCommandResult({ command: 'node --version', volta })
  const { version: swpmVersion } = await getSwpmInfo()
  const url = config?.url ?? ''
  const isInstalled = !!cmd && await commandVerification(cmd)
  const packageVersion = isInstalled ? getCommandResult({ command: `${cmd} --version`, volta }) : 'not found'

  const errorNoCmdFound = !cmd && 'No Package Manager or Environment Variable was found.'
  const errorCmdNotInstalled = !isInstalled && config?.cmd && url && `Command not installed. Visit ${url} for more information.`

  const output = {
    _: cmd,
    using: cmd,
    version: packageVersion,
    error: errorNoCmdFound || errorCmdNotInstalled || null,
    ready: !!cmd && isInstalled,
    origin,
    volta: !!volta,
    versions: {
      swpm: swpmVersion,
      node: nodeVersion?.replace(/v/, ''),
      ...(config?.cmd && { [config.cmd]: packageVersion }),
    }
  }
  return output
}

export const renderInfoMessage = async (info: Info, { config }: CommanderPackage) => {
  const color = config?.color ?? chalk.reset()
  const url = config?.url ?? ''

  const { _: cmd, origin, volta, versions } = info

  let message = ''
  if (cmd) {
    message += `${chalk.bold('using')}: \t${chalk.hex(color).bold(cmd)} \n`
  } else {
    message += stripIndents`
      No Package Manager or Environment Variable was found.

      Please review if the current path has a ${chalk.bold('package.json')} or a ${chalk.bold('lock')} file.
      Highly recommend pin a Package Manager with ${chalk.blue.bold('swpm --pin <npm|yarn[@berry]|pnpm|bun>')} command.
    `
    message += '\n'
  }

  if (origin) {
    message += `${chalk.bold('origin')}: ${getOriginIcon(origin)} ${origin} \n`
  }

  if (volta) {
    message += `${chalk.bold('volta')}: \t${chalk.yellow('⚡')} detected \n`
  }

  message += `
    ${chalk.bold('Versions:')}
    ${chalk.hex('#368fb9').bold('s')}${chalk.hex('#4e4e4e').bold('w')}${chalk.hex('#f8ae01').bold('p')}${chalk.hex('#e32e37').bold('m')}: \t${versions.swpm}
    ${chalk.hex('#689e65').bold('Node')}: \t${versions.node?.replace(/v/, '')}
  `

  const isInstalled = !!cmd && await commandVerification(cmd)
  const packageVersion = isInstalled ? getCommandResult({ command: `${cmd} --version`, volta }) : 'not found'
  if (config?.cmd) {
    message += `${chalk.hex(color).bold(cmd)}: \t${packageVersion}`
  }
  if (!isInstalled && config?.cmd) {
    message += `

    Install ${chalk.hex(color).bold(cmd)}.`
    if (url) {
      message += `Visit ${chalk.blue.bold(url)} for more information`
    }
  }

  console.log(stripIndents`${message}`)
}

export const showPackageInformation = async (cmdr: CommanderPackage) => {
  const output = await getPackageInformation(cmdr)
  await renderInfoMessage(output, cmdr)
  exit(0)
}

export const showPackageInformationJson = async (cmdr: CommanderPackage) => {
  const output = await getPackageInformation(cmdr)
  process.stdout.write(JSON.stringify(output))
  exit(0)
}


  export const showPackageInformationSelect = async (cmdr: CommanderPackage, pick: string) => {
    const info = await getPackageInformation(cmdr)
    const output = get(info, pick)
    if (output) {
      if (typeof output === 'string') {
        process.stdout.write(output)
      } else {
        process.stdout.write(JSON.stringify(output, null, 2))
      }
      exit (0)
    }
    console.log(stripIndents`Invalid value - ${pick} doesn't match any available value`)
    await renderInfoMessage(info, cmdr)
    exit(1)
  }


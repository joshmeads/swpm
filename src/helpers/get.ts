import chalk from 'chalk'
import commandExists from 'command-exists'
import { stripIndents } from 'common-tags'
import { env, exit } from 'node:process'
import semver from 'semver'
import { getPackageJson, lockFileExists } from '../helpers/files.js'
import packagesList, { packageConfigExists } from '../packages/list.js'

import type { PackageManagerList, PackageManagersCmd } from '../packages/packages.types.js'
import type { CommanderPackage, PackageJson } from '../translator/commander.types.js'

const propertyExists = (packageJson: PackageJson, property: string) => {
  return (property in packageJson)
}

const getPackageManager = (packageJson: PackageJson, property: 'packageManager') => {
  const [cmd = '', version = '']: string[] = packageJson?.[property]?.split('@') ?? ['', '']
  let id = cmd

  if (version) {
    const compatiblePackage = packagesList.filter((pkg) => {
      return (
        pkg.semver &&
        pkg.id.startsWith(cmd) &&
        semver.satisfies(version, pkg.semver)
      )
    }) ?? []

    if (compatiblePackage && compatiblePackage.length > 0) {
      const pkg = compatiblePackage.at(0)
      if (pkg && cmd in pkg) {
        id = pkg.id
      }
    }
  }

  return [id, version]
}

const getPropertyValue = (packageJson: PackageJson, property: 'swpm' | 'packageManager') => {
  if (!packageJson || !propertyExists(packageJson, property)) {
    return []
  }

  const foundProp = packageJson?.[property]
  const [propCmd, _version] = typeof foundProp === 'string' ? foundProp?.split('@') ?? '' : []
  let version = _version
  let prop = correctId(propCmd as PackageManagerList, version ?? '')
  if (property === 'packageManager') {
    const [id, ver] = getPackageManager(packageJson, property)
    prop = correctId(id as PackageManagerList, ver ?? '')
    version = ver ?? ''
  }
  if (prop && packageConfigExists(prop as PackageManagerList)) {
    return [prop, version]
  }

  return []
}

const searchForLockFiles = async () => {
  for (const pkg of packagesList) {
    const exists = (
      await Promise.all(pkg.lockFiles.map(lockFileExists))
    ).every(Boolean)

    if (exists) {
      return [pkg.id, pkg.semver]
    }
  }
}

const searchForEnv = (name: 'SWPM') => {
  if (!(name in env)) {
    return
  }

  const value = env[name]
  if (value && packageConfigExists(value as PackageManagerList)) {
    return value
  }

  console.error(stripIndents`
    ${chalk.red.bold('Error')}: the value (${chalk.bold(value)}) in SWPM environment variable is not valid.
    Fix it using one of this values ${chalk.blue.bold('<npm|yarn[@berry|@classic]|pnpm|bun>')}.
  `)
  exit(1)
}

function correctId (id: PackageManagerList, version: string): PackageManagerList {
  if (!id.startsWith('yarn')) {
    return id
  }
  if (id.includes('@')) return id

  const majorVersionRegex = parseInt(version?.match(/\d+/m)?.[0] ?? '')
  const majorVersion = Number.isNaN(majorVersionRegex) ? undefined : majorVersionRegex
  if (majorVersion && majorVersion >= 2) {
    return 'yarn@berry'
  }
  return 'yarn@classic'
}

export const getCurrentPackageManager = async (): Promise<{origin: CommanderPackage['origin'], id: PackageManagerList, version: CommanderPackage['version']} | undefined> => {
  const packageJson = await getPackageJson()

  if (packageJson) {
    const [pinned, version] = getPropertyValue(packageJson, 'swpm') as [PackageManagerList, string]
    if (pinned && packageConfigExists(pinned)) {
      return { origin: 'pinned', id: correctId(pinned, version), version }
    }

    // https://nodejs.org/api/corepack.html
    const [packageManager, _version] = await getPropertyValue(packageJson, 'packageManager') as [PackageManagerList, string]
    if (packageManager && packageConfigExists(packageManager)) {
      return { origin: 'packageManager', id: correctId(packageManager, _version), version: _version }
    }
  }

  const [lockId, lockVersion] = await searchForLockFiles() as [PackageManagerList, string]
  if (lockId && packageConfigExists(lockId)) {
    return { origin: 'lock', id: correctId(lockId, lockVersion), version: lockVersion }
  }

  const envSwpm = searchForEnv('SWPM') as PackageManagerList
  if (envSwpm && packageConfigExists(envSwpm)) {
    return { origin: 'environment', id: envSwpm, version: '' }
  }
}

// https://volta.sh/
export const detectVoltaPin = async (cmdr: CommanderPackage) => {
  if (!cmdr?.cmd) return

  const isVoltaInstalled = await commandVerification('volta')
  if (!isVoltaInstalled) return

  const packageJson = await getPackageJson()
  if (!packageJson) return

  const prop = 'volta'
  if (!propertyExists(packageJson, prop)) return
  if (packageJson[prop] === undefined) return

  return (cmdr.cmd in packageJson[prop])
}

export const commandVerification = async (cmd: PackageManagersCmd) => {
  try {
    await commandExists(cmd)
    return true
  } catch (error) {
    return false
  }
}

export const get = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  path: string
): unknown | undefined => {
  // eslint-disable-next-line no-useless-escape
  const segments = path.split(/[\.\[\]]/g)
  let current = value
  for (const key of segments) {
    if (current === null) return undefined
    if (current === undefined) return undefined
    const dequoted = key.replace(/['"]/g, '')
    if (dequoted.trim() === '') continue
    current = current[dequoted]
  }
  if (current === undefined) return undefined
  return current
}

type PackageManagers = 'pnpm' | 'npm' | 'yarn@classic' | 'yarn@berry' | 'bun'
type PackageManagersCmds = 'pnpm' | 'npm' | 'yarn' | 'bun'
type ExecuteManagers = 'pnpm dlx' | 'npx' | 'yarn dlx' | 'bunx'
type VersionManagers = 'volta'
export type PackageManagerList = PackageManagers| ExecuteManagers | VersionManagers
export type PackageManagersCmd = PackageManagersCmds| ExecuteManagers | VersionManagers

type ColorValueHex = `#${string}`

export type CommandsConfiguration = {
  [key: string]: string | [string, number] | string[] | { [key: string]: string | string[] }
}

export type ArgsConfiguration = {
  [key: string]: string | number | [string, number] | { [key: string]: string }
}

export type PackageConfiguration = {
  id: PackageManagerList
  cmd: PackageManagersCmd
  exc: ExecuteManagers
  color: ColorValueHex
  url: string
  semver: string
  version?: string
  lockFiles: string[]
  modulesPath: string[]
  modulesFile: string[]
  logFile: string
  install: string
  cmds: CommandsConfiguration
  args: ArgsConfiguration
}

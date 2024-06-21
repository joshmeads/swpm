import type { PackageJson as BasePackageJson } from 'type-fest'
import type { PackageConfiguration, PackageManagerList, PackageManagersCmd } from '../packages/packages.types.js'

export type CommanderPackage = {
    id?: PackageManagerList
    cmd?: PackageManagersCmd
    version?: string;
    args: string[]
    origin?: 'pinned' | 'packageManager' | 'environment' | 'lock'
    config?: PackageConfiguration
    volta?: boolean
}

export type PackageJson = BasePackageJson & {
    volta?: {
        [key: string]: string
    }
}

import type { CommanderPackage } from './commander.types.js'

const commanderInitValues: CommanderPackage = {
  id: undefined,
  cmd: undefined,
  args: [],
  origin: undefined,
  version: undefined,
  config: undefined,
  volta: false
}

declare global {
  // eslint-disable-next-line no-var
  var commander: CommanderPackage
}

export const getCommander = (): CommanderPackage => {
  if (!globalThis?.commander) {
    globalThis.commander = commanderInitValues
  }

  return globalThis.commander
}

export default getCommander()

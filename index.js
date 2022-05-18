#!/usr/bin/env node

import yargv from './src/yargs.js'

import { pinPackageManager } from './src/options/pin.js'
import { runCommand } from './src/helpers/cmd.js'
import { getPackageInformation } from './src/options/info.js'
import { testCommand } from './src/options/test.js'

if (yargv.debug) {
  console.log(yargv)
}

if (yargv?.pin) {
  await pinPackageManager(yargv.pkg)
}

if (yargv?.test) {
  await testCommand(yargv.pkg)
}

if (yargv?.info) {
  await getPackageInformation(yargv.pkg)
}

if (yargv?.pkg?.cmd) {
  await runCommand(yargv.pkg)
}

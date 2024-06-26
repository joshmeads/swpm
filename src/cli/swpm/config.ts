import path from 'node:path';
import { argv } from 'node:process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import middleware from '../middleware.js';
import { commands, options } from './cli.js';

const config = await yargs(hideBin(argv))
  .scriptName(path.basename(argv[1] ?? 'swpm', path.extname(argv[1] ?? 'swpm')))
  .command(commands)
  .options(options)
  .middleware(middleware)
  .usage('$0 [<command>] [args] [FLAGS]')
  .help()
  .version(false)
  .epilog(`dein Software © ${new Date().getFullYear()}`)
  .argv

export default config

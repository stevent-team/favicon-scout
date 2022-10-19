#!/usr/bin/env node
import { program } from 'commander'

import { version } from '../package.json'
import { parseIntArgument } from './util'
import { startServerCommand, getFaviconCommand } from './commands'

program
  .name('favicon-scout')
  .description('🧭 Scout for favicons')
  .version(version)

program.command('serve', { isDefault: true })
  .description('Start a favicon scout web server')
  .option('-p, --port <port>', 'port to use for http server', parseIntArgument, 3000)
  .option('-h, --host <url>', 'host to use for http server', 'localhost')
  .option('-o, --origins <urls...>', 'urls or regexes allowed by CORS', '*')
  .action(startServerCommand)

program.command('get')
  .description('Fetch the favicon from a specified url')
  .argument('<host>', 'host to fetch the favicon for')
  .option('-s, --size <size>', 'rectangular pixel size of favicon', parseIntArgument, 3000)
  .option('-o, --out <out>', 'path to save favicon to if not using stdout', undefined)
  .option('-t, --type <type>', 'image type to save favicon (overrides file extension if provided)', 'webp')
  .action(getFaviconCommand)

program.parse()

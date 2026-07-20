#!/usr/bin/env bun

import { program } from './cli'
import { showSplash } from './core/branding'

if (process.argv.slice(2).length === 0) {
  showSplash()
  process.exit(0)
}

program.parse()

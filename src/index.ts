#!/usr/bin/env node

import { program } from 'commander'
import { fileSourceRegistry } from './FileSource'
import FileSystemSource from './file_sources/FileSystemSource'

fileSourceRegistry.set('file://', FileSystemSource)

program
    .name('mkmeme')
    .version('0.0.1')
    .command('create', { isDefault: true })
    .argument('<format>', 'Meme format name')
    .argument('<text...>', 'Text for the meme')
    .option('-o, --output <file>', 'Output file')
    .parse()
#!/usr/bin/env node

import { program } from 'commander'
import { fileSourceRegistry } from './FileSource'
import { resolveFormatSource } from './FormatSource'
import FileSystemSource from './file_sources/FileSystemSource'
import WebFileSource from './file_sources/WebFileSource'
import fs from 'fs'
import path from 'path'
import os from 'os'

interface MkMemeConfig {
    formats: string[]
}

function isMkMemeConfig(obj: unknown): obj is MkMemeConfig {
    if (typeof obj !== 'object' || obj === null) {
        return false
    }
    
    const objDict = obj as { [k: string]: unknown }
    
    return Array.isArray(objDict.formats) &&
        objDict.formats.every((format: unknown) => typeof format === 'string')
}

fileSourceRegistry.set('file://', FileSystemSource)
fileSourceRegistry.set('http://', WebFileSource)
fileSourceRegistry.set('https://', WebFileSource)

// Load central configuration
async function loadConfig(): Promise<MkMemeConfig | null> {
    const configPath = path.join(os.homedir(), '.mkmeme.json')
    
    try {
        const configData = await fs.promises.readFile(configPath, 'utf-8')
        const configObj = JSON.parse(configData)
        
        if (!isMkMemeConfig(configObj)) {
            console.error('Invalid configuration format in .mkmeme.json')
            return null
        }
        
        return configObj
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            // Create default configuration file
            const defaultConfig: MkMemeConfig = {
                formats: []
            }
            
            try {
                await fs.promises.writeFile(configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8')
                return defaultConfig
            } catch (writeError) {
                console.error(`Error creating configuration file: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`)
                return null
            }
        } else {
            console.error(`Error loading configuration: ${error instanceof Error ? error.message : 'Unknown error'}`)
            return null
        }
    }
}

// Save configuration to file
async function saveConfig(config: MkMemeConfig): Promise<boolean> {
    const configPath = path.join(os.homedir(), '.mkmeme.json')
    
    try {
        await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8')
        return true
    } catch (error) {
        console.error(`Error saving configuration: ${error instanceof Error ? error.message : 'Unknown error'}`)
        return false
    }
}

// Command handlers
async function handleListFormats() {
    const config = await loadConfig()
    if (!config) {
        process.exit(1)
    }
    
    if (config.formats.length === 0) {
        console.log('No format sources configured.')
    } else {
        console.log('Configured format sources:')
        config.formats.forEach((format, index) => {
            console.log(`${index + 1}. ${format}`)
        })
    }
}

async function handleAddFormat(url: string) {
    const config = await loadConfig()
    if (!config) {
        process.exit(1)
    }
    
    if (config.formats.includes(url)) {
        console.log(`Format source '${url}' is already configured.`)
        return
    }
    
    config.formats.push(url)
    
    if (await saveConfig(config)) {
        console.log(`Added format source: ${url}`)
    } else {
        process.exit(1)
    }
}

async function handleRemoveFormat(url: string) {
    const config = await loadConfig()
    if (!config) {
        process.exit(1)
    }
    
    const index = config.formats.indexOf(url)
    if (index === -1) {
        console.log(`Format source '${url}' is not configured.`)
        return
    }
    
    config.formats.splice(index, 1)
    
    if (await saveConfig(config)) {
        console.log(`Removed format source: ${url}`)
    } else {
        process.exit(1)
    }
}

async function handleListAvailableFormats() {
    const config = await loadConfig()
    if (!config) {
        process.exit(1)
    }
    
    if (config.formats.length === 0) {
        console.log('No format sources configured. Use "mkmeme format-sources add <url>" to add format sources.')
        return
    }
    
    console.log('Available formats:')
    
    for (const sourceUrl of config.formats) {
        try {
            const formatSource = resolveFormatSource(sourceUrl)
            const formats = await formatSource.formats
            
            console.log(`\nFrom ${sourceUrl}:`)
            if (formats.length === 0) {
                console.log('  No formats available')
            } else {
                formats.forEach(format => {
                    console.log(`  ${format}`)
                })
            }
        } catch (error) {
            console.error(`  Error loading formats from ${sourceUrl}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }
}

// Initialize application
async function main() {
    // Load configuration
    const config = await loadConfig()
    
    program
        .name('mkmeme')
        .version('0.0.1')
    
    // Create subcommand
    program
        .command('create', { isDefault: true })
        .argument('<format>', 'Meme format name')
        .argument('<text...>', 'Text for the meme')
        .option('-o, --output <file>', 'Output file')
    
    // Format sources subcommand group
    const formatSourcesCmd = program
        .command('format-sources')
        .description('Manage format sources')
    
    formatSourcesCmd
        .command('list')
        .description('List all configured format sources')
        .action(handleListFormats)
    
    formatSourcesCmd
        .command('add')
        .description('Add a new format source URL')
        .argument('<url>', 'Format source URL (file://, http://, or https://)')
        .action(handleAddFormat)
    
    formatSourcesCmd
        .command('remove')
        .description('Remove a format source URL')
        .argument('<url>', 'Format source URL to remove')
        .action(handleRemoveFormat)
    
    // Formats subcommand group
    const formatsCmd = program
        .command('formats')
        .description('Manage available formats')
    
    formatsCmd
        .command('list')
        .description('List all available formats from configured sources')
        .action(handleListAvailableFormats)
    
    program.parse()
}

main().catch(console.error)
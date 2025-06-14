import FileSource from '../FileSource'
import FormatSource from '../FormatSource'
import Format, { FormatConfig, isFormatConfig } from '../Format'

interface ManifestConfig {
    formats: string[]
}

function isManifestConfig(obj: unknown): obj is ManifestConfig {
    if (typeof obj !== 'object' || obj === null) {
        return false
    }
    
    const objDict = obj as { [k: string]: unknown }
    
    return Array.isArray(objDict.formats) &&
        objDict.formats.every((format: unknown) => typeof format === 'string')
}

export default class ManifestFormatSource implements FormatSource {
    private _formats: Promise<string[]>

    constructor(private fileSource: FileSource) {
        this._formats = this.loadManifest()
    }

    get formats(): Promise<string[]> {
        return this._formats
    }

    private async loadManifest(): Promise<string[]> {
        try {
            const manifestBuffer = await this.fileSource.read('mkmeme-manifest.json')
            const manifestText = new TextDecoder().decode(manifestBuffer)
            const manifestData = JSON.parse(manifestText)
            
            if (!isManifestConfig(manifestData)) {manifestData
                throw new Error('Invalid manifest format: missing or invalid formats array')
            }
            
            return manifestData.formats
        } catch (error) {
            throw new Error(`Failed to load manifest: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    async getFormat(formatName: string): Promise<Format> {
        try {
            const formatBuffer = await this.fileSource.read(`${formatName}.json`)
            const formatText = new TextDecoder().decode(formatBuffer)
            const formatData = JSON.parse(formatText)
            
            if (!isFormatConfig(formatData)) {
                throw new Error(`Invalid format configuration for ${formatName}`)
            }
            
            return Format.fromConfig(formatData)
        } catch (error) {
            throw new Error(`Failed to load format '${formatName}': ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }
}

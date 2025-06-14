import Format from './Format'
import { resolveFileSource } from './FileSource'
import ManifestFormatSource from './format_sources/ManifestFormatSource'

export default interface FormatSource {
    readonly formats: Promise<string[]>
    getFormat(format: string): Promise<Format>
}

export function resolveFormatSource(pathOrUrl: string): ManifestFormatSource {
    const fileSource = resolveFileSource(pathOrUrl)
    return new ManifestFormatSource(fileSource)
}
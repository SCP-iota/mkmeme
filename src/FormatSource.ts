import Format from './Format'

export default interface FormatSource {
    readonly formats: string[]
    getFormat(format: string): Format
}
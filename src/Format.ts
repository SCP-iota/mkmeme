import TextFormatting from './TextFormatting'

export interface FormatConfig {
    id: string
    name: string
    imageURL: string
    textFields: TextFormatting[]
}

export function isFormatConfig(obj: unknown): obj is FormatConfig {
    if(typeof obj !== 'object' || obj === null)
        return false

    const objDict = obj as {[k: string]: unknown}

    return typeof objDict.id === 'string' &&
        typeof objDict.name === 'string' &&
        typeof objDict.imageURL === 'string' &&
        Array.isArray(objDict.textFields) &&
        objDict.textFields.every((field: any) => field instanceof TextFormatting);
}

export default class Format {
    constructor(public id: string, public name: string, public imageURL: string, public textFields: TextFormatting[]) { }

    static fromConfig(config: FormatConfig): Format {
        return new Format(config.id, config.name, config.imageURL, config.textFields)
    }
}
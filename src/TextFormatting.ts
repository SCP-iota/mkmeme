import Rect, { isRectConfig, RectConfig } from './math/Rect'

export enum Alignment {
    START = 'start',
    CENTER = 'center',
    END = 'end'
}

export function isAlignment(value: any): value is Alignment {
    return Object.values(Alignment).includes(value)
}

export interface TextFormattingConfig {
    minBox: RectConfig
    maxBox: RectConfig
    alignment: Alignment
    bold: boolean
    italic: boolean
}

export function isTextFormattingConfig(value: any): value is TextFormattingConfig {
    return typeof value === 'object' &&
        isRectConfig(value.minBox) &&
        isRectConfig(value.maxBox) &&
        isAlignment(value.alignment) &&
        typeof value.bold === 'boolean' &&
        typeof value.italic === 'boolean'
}

export default class TextFormatting {
    constructor(public minBox: Rect, public maxBox: Rect, public alignment: Alignment, public bold: boolean, public italic: boolean) { }

    static fromConfig(config: TextFormattingConfig) {
        return new TextFormatting(
            Rect.fromConfig(config.minBox),
            Rect.fromConfig(config.maxBox),
            config.alignment,
            config.bold,
            config.italic
        )
    }
}
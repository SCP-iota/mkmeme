import Rect from './math/Rect'

export enum Alignment {
    START = 'start',
    CENTER = 'center',
    END = 'end'
}

export default class TextFormatting {
    constructor(public minBox: Rect, public maxBox: Rect, public alignment: Alignment, public bold: boolean, public italic: boolean) {
        
    }
}
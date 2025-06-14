import Vector2 from './Vector2'

export type RectConfig = [number, number, number, number]

export function isRectConfig(value: any): value is RectConfig {
    return Array.isArray(value) &&
        value.length === 4 &&
        value.every(v => typeof v === 'number')
}

export default class Rect {
    constructor(public topLeft: Vector2, public size: Vector2) {}

    static fromConfig(config: RectConfig) {
        return new Rect(new Vector2(config[0], config[1]), new Vector2(config[2], config[3]))
    }

    get topRight(): Vector2 {
        return new Vector2(this.topLeft.x + this.size.x, this.topLeft.y)
    }

    get bottomLeft(): Vector2 {
        return new Vector2(this.topLeft.x, this.topLeft.y + this.size.y)
    }

    get bottomRight(): Vector2 {
        return this.topLeft.add(this.size)
    }

    get top(): number {
        return this.topLeft.y
    }

    get bottom(): number {
        return this.topLeft.y + this.size.y
    }

    get left(): number {
        return this.topLeft.x
    }

    get right(): number {
        return this.topLeft.x + this.size.x
    }
}
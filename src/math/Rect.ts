import Vector2 from './Vector2'

export default class Rect {
    constructor(public topLeft: Vector2, public size: Vector2) {
        
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
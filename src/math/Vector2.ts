export default class Vector2 {
    constructor(public x: number, public y: number) {
        
    }

    add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y)
    }

    sub(other: Vector2) {
        return new Vector2(this.x - other.x, this.y - other.y)
    }

    mul(scalar: number) {
        return new Vector2(this.x * scalar, this.y * scalar)
    }

    div(scalar: number) {
        return new Vector2(this.x / scalar, this.y / scalar)
    }

    mulBy(other: Vector2) {
        return new Vector2(this.x * other.x, this.y * other.y)
    }

    divBy(other: Vector2) {
        return new Vector2(this.x / other.x, this.y / other.y)
    }
}
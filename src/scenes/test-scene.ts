import { MyCharacter } from "../core/my-character"

export class TestScene extends Phaser.Scene {
    constructor() {
        super('TestScene')
    }

    preload(): void {
        this.load.spritesheet('knight', 'assets/adventurer-sheet.png', {
            frameWidth: 50,
            frameHeight: 37
        })
    }

    create(): void {
        const center = { x: this.scale.width / 2, y: this.scale.height - 80 }
        const char = new MyCharacter(this, center.x, center.y)
        this.add.existing(char)

        const rect = this.add.rectangle(this.scale.width / 2 + 100, this.scale.height - 20, this.scale.width / 2, 25, 0xFFFFFFF).setOrigin(0);
        this.physics.add.existing(rect, true)
        this.physics.add.collider(char, rect)
    }
}
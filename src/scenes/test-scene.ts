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

        this.load.image('tiles', 'assets/Tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/plataforma.json')
    }

    create(): void {
        const center = { x: this.scale.width / 2, y: this.scale.height - 80 }
        const char = new MyCharacter(this, center.x, center.y)
        this.add.existing(char)

        const map = this.make.tilemap({ key: 'map' });

        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        const tiles = map.addTilesetImage('Platforms', 'tiles');

        // You can load a layer from the map using the layer name from Tiled, or by using the layer
        // index (0 in this case).
        const layer = map.createLayer(0, tiles, 0, 0);
        layer.setCollisionFromCollisionGroup(true)

        this.physics.add.collider(char,layer)

    }
}
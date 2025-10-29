import { MyCharacter } from "../core/my-character"

type TiledImg = {

    alpha: number,
    image: string,
    name: string,
    properties: any,
    visible: boolean,
    x: number,
    y: number
}
export class TestScene extends Phaser.Scene {
    map: Phaser.Tilemaps.Tilemap
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
        this.load.image('clouds','assets/BG1.png')


    }

    create(): void {
        this.map = this.make.tilemap({ key: 'map' });

        // this.map.images.forEach((i: TiledImg) => {
        //     this.load.image(i.name, i.image)
        // })
        const tiles = this.map.addTilesetImage('platforms', 'tiles');
        const layer = this.map.createLayer(0, tiles, 0, 0).setDepth(-1);
        //
        const objLayer = this.map.getObjectLayer('objects')

        const pos = objLayer.objects.find(o => o.name == 'start_point')
        const char = new MyCharacter(this, pos.x, pos.y)
        this.add.existing(char)


        layer.setCollisionFromCollisionGroup(true)

        this.physics.add.collider(char, layer)

        this.cameras.main.startFollow(char)
        this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height)
        this.cameras.main.setZoom(1.7, 1.7)


        this.map.images.forEach((i: TiledImg) => {
            this.add.image(i.x, i.y, i.name).setOrigin(0).setDepth(-2)
        })



    }
}
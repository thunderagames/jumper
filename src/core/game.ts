import Phaser from "phaser"
import { TestScene } from "../scenes/test-scene"

export class MyGame extends Phaser.Game {
    constructor() {
        super({
            scale: {
                width: 640,
                height: 440,
                //expandParent: true,
                mode: Phaser.Scale.ScaleModes.FIT
            },
            dom: {
                createContainer: true,
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: {
                        x: 0,
                        y: 500
                    },
                    debug: false
                }
            },
            pixelArt: true,
            fps: {
                limit: 24
            },
            scene: [TestScene]
        })
    }
}


export type CharStatus = {
    movingToLeft: boolean,
    movingToRight: boolean,
    jumping: boolean,
    dashing: boolean,
    attacking: boolean,
    running: boolean
}

const charConfig = {
    charScale: 2,

}

export class MyCharacter extends Phaser.Physics.Arcade.Sprite {
    private _charStatus: CharStatus = {
        attacking: false,
        running: false,
        dashing: false,
        jumping: false,
        movingToLeft: false,
        movingToRight: false
    }

    private set charStatus(value: CharStatus) {
        this.setData('status', value)
    }

    private get charStatus(): CharStatus {
        if (!this.data?.get('status')) {
            this.setData('status', this._charStatus)
        }

        return this.data.get('status');
    }
    horizontal_speed: number = 100;
    animations_lapses = {
        'idle': 1200,
        'crunch': 1000,
        'run': 1100,
        'jump': 500,
        'dash': 1000,
        'attack': 250
    }

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'knight')
        this.scene.physics.add.existing(this)
        this.setCollideWorldBounds(true)
        this.setScale(1)
        this.setBodySize(15, 37)


        this.scene.events.on('create', () => {

            this.generateAnims(this.scene)
            this.setMoveInputs()
        })

    }

    setMoveInputs(): void {
        //key for right
        this.scene.input.keyboard.addKey('d')
            .on('down', () => {
                this.charStatus.movingToRight = true
            }).on('up', () => {
                this.charStatus.movingToRight = false
            })

        //key for left
        this.scene.input.keyboard.addKey('a')
            .on('down', () => {
                this.charStatus.movingToLeft = true
            }).on('up', () => {
                this.charStatus.movingToLeft = false
            })

        //key for jump
        this.scene.input.keyboard.addKey('space')
            .on('down', () => {
                if (!this.charStatus.jumping && this.body.velocity.y == 0)
                    this.charStatus.jumping = true
            })

        //key for attack
        this.scene.input.keyboard.addKey('k')
            .on('down', () => {
                if (!this.charStatus.attacking && this.body.velocity.y == 0)
                    this.charStatus.attacking = true
            })

        //key for run
        this.scene.input.keyboard.addKey('shift')
            .on('down', () => {
                this.horizontal_speed = 130;
                this.animations_lapses.run = 800
                this.scene.anims.remove('run')
                this.generateAnims(this.scene)
            }).on('up', () => {
                this.horizontal_speed = 100;
                this.animations_lapses.run = 1100
                this.scene.anims.remove('run')
                this.generateAnims(this.scene)
            })

        let tmout = null
        let jumping = false
        this.scene.events.on('update', () => {

            if (this.charStatus.attacking && this.body.velocity.y == 0) {
                this.play('attack', true)
                this.setVelocityX(0)

                if (!tmout)
                    tmout = setTimeout(() => {
                        if (this.charStatus.attacking) {
                            this.charStatus.attacking = false;
                            tmout = null
                        }
                    }, this.animations_lapses.attack);
                return
            }

            if (this.charStatus.movingToRight) {
                if (this.body.velocity.y == 0 && !this.charStatus.attacking) {
                    this.play('run', true)
                    this.setFlipX(false)
                }
                this.setVelocityX(this.horizontal_speed)
            }
            else if (this.charStatus.movingToLeft) {
                this.setFlipX(true)
                if (this.body.velocity.y == 0 && !this.charStatus.attacking) {
                    this.play('run', true)

                }
                this.setVelocityX(this.horizontal_speed * -1)
            }



            if (this.charStatus.jumping && !jumping) {
                jumping = true
                this.setVelocityY((200 + (this.horizontal_speed * 0.5)) * -1)
                this.play('jump', true)
                setTimeout(() => { this.charStatus.jumping = false; jumping = false; }, this.animations_lapses.jump)

            } else if (this.charIsIdle()) {
                this.play('idle', true)
                this.setVelocityX(0)
            }

        })
    }

    charIsIdle(): boolean {
        return !this.charStatus.movingToRight &&
            !this.charStatus.movingToLeft &&
            this.body.velocity.y == 0 &&
            !this.charStatus.attacking
    }

    generateAnims(scene: Phaser.Scene): void {
        let anims = {
            'idle': { frames: [0, 1, 2, 3], lapse: this.animations_lapses.idle },
            'crunch': { frames: [4, 5, 6, 7], lapse: this.animations_lapses.crunch },
            'run': { frames: [8, 9, 10, 11, 12, 13], lapse: this.animations_lapses.run },
            'jump': { frames: [16, 17, 18, 19, 20, 21, 22, 23], lapse: this.animations_lapses.jump },
            'dash': { frames: [24, 25, 26, 27, 28], lapse: this.animations_lapses.dash },
            'attack': { frames: [/*39, 40, 41, 42,*/ 43, 44, 45, 46, 47, 48], lapse: this.animations_lapses.attack },
        }

        for (const key in anims) {
            const frames = anims[key];
            if (!scene.anims.exists(key))
                scene.anims.create({
                    key: key,
                    duration: frames.lapse,
                    repeat: 0,
                    frames: this.anims.generateFrameNames('knight', { frames: frames.frames })
                })

        }
    }

}
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class PlayerPrefab extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x ?? 33.46849927902156, y ?? 20.681273293494687);

        scene.physics.add.existing(this, false);
        this.body.allowGravity = false;
        this.body.setSize(24, 12, false);
        this.body.setOffset(0, 40);

        this.setDepth(1);

        // skin
        const skin = scene.add.sprite(
            14.53150085424582,
            27.318725443132376,
            "player",
            0
        );
        skin.scaleX = 1.5;
        skin.scaleY = 1.5;
        this.add(skin);

        // hair
        const hair = scene.add.sprite(
            14.53150085424582,
            27.318725443132376,
            "PlayerHair02",
            0
        );
        hair.scaleX = 1.5;
        hair.scaleY = 1.5;
        this.add(hair);

        // outfit
        const outfit = scene.add.sprite(
            14.53150085424582,
            27.318725443132376,
            "PlayerOutfit01",
            0
        );
        outfit.scaleX = 1.5;
        outfit.scaleY = 1.5;
        this.add(outfit);

        this.skin = skin;
        this.hair = hair;
        this.outfit = outfit;

        /* START-USER-CTR-CODE */
        // Write your code here.

        const cam = scene.cameras.main;
        cam.startFollow(this, true, 0.1, 0.1);
        cam.setZoom(1.2);
        cam.fadeIn(1000);

        this.player = this;

        scene.events.on("update", this.prefabUpdateCycle, this);
        scene.events.on("create", this.prefabCreateCycle, this);
        /* END-USER-CTR-CODE */
    }

    /** @type {Phaser.GameObjects.Sprite} */
    skin;
    /** @type {Phaser.GameObjects.Sprite} */
    hair;
    /** @type {Phaser.GameObjects.Sprite} */
    outfit;

    /* START-USER-CODE */

    // Write your code here.

    /** @type {Phaser.Physics.Arcade.Container} */
    player;

    lastDirection = "down";

    isMouseMove = false;
    mouseMovePosition;
    mouseMoveStep;

    prefabCreateCycle() {
        this.settingUpAnimations();

        this.scene.input.on(
            "pointerdown",
            function (pointer) {
                const worldPoint = this.scene.cameras.main.getWorldPoint(
                    pointer.x,
                    pointer.y
                );

                this.isMouseMove = true;

                this.mouseMovePosition = {
                    x: parseInt(worldPoint.x),
                    y: parseInt(worldPoint.y),
                };

                this.mouseMoveStep = {
                    x: parseInt((this.mouseMovePosition.x - this.player.x) / 2),
                    y: parseInt((this.mouseMovePosition.y - this.player.y) / 2),
                };

                let line = new Phaser.Geom.Line(
                    this.player.x,
                    this.player.y,
                    this.mouseMovePosition.x,
                    this.mouseMovePosition.y
                );
                let angle = Phaser.Math.Angle.Between(
                    this.player.x,
                    this.player.y,
                    this.mouseMovePosition.x,
                    this.mouseMovePosition.y
                );

                let graphics = this.scene.add.graphics({
                    lineStyle: {
                        width: 4,
                        color: 0xff0000, // Red color
                        alpha: 1, // Fully opaque
                    },
                });

                graphics.strokeLineShape(line);

                let direction = this.determineDirectionFromAngle(angle);

                console.log(direction);

                this.scene.tweens.add({
                    targets: this.player,
                    x: this.mouseMovePosition.x,
                    y: this.mouseMovePosition.y,
                    duration: 1000,
                    repeat: 0,
                    onStart: () => {
                        this.playAnimations(direction);
                    },
                    onComplete: () => {
                        this.playAnimations("IdleDown");
                    },
                });
            },
            this
        );
    }

    prefabUpdateCycle() {
        if (this.isMouseMove) return;

        this.playerMovement();
        // this.playerMouseMovement();

        if (this.isMouseMove) {
            // this.player.body.velocity.x = 50;
            // this.player.body.velocity.y = 50;
        }
    }

    playerMovement() {
        let input = this.scene.input;

        const upKey = input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        const downKey = input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        const leftKey = input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        const rightKey = input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.D
        );

        if (rightKey.isDown) {
            this.lastDirection = "right";
            this.moveInDirection("right");
        } else if (leftKey.isDown) {
            this.lastDirection = "left";
            this.moveInDirection("left");
        } else if (upKey.isDown) {
            this.lastDirection = "up";
            this.moveInDirection("up");
        } else if (downKey.isDown) {
            this.lastDirection = "down";
            this.moveInDirection("down");
        } else {
            this.moveInDirection(
                `idle${this.capitalizeFirstLetter(this.lastDirection)}`
            );
        }
    }

    playerMouseMovement() {
        if (this.isMouseMove) {
            // let moveSpeed = 50;

            // let distance = Phaser.Math.Distance.Between(this.player.body.x, this.player.body.y, this.mouseMovePosition.x, this.mouseMovePosition.y);

            let distance = 5;
            let speed = 3;

            if (
                this.mouseMovePosition.x - parseInt(this.player.body.x) >= 0 &&
                this.mouseMovePosition.x - parseInt(this.player.body.x) <=
                    distance &&
                this.mouseMovePosition.y - parseInt(this.player.body.y) >= 0 &&
                this.mouseMovePosition.y - parseInt(this.player.body.y) <=
                    distance
            ) {
                this.isMouseMove = false;
                this.playAnimations("IdleDown");
            }

            console.log(
                this.mouseMovePosition.x,
                this.player.body.x,
                this.mouseMoveStep.x
            );
            console.log(
                this.mouseMovePosition.y,
                this.player.body.y,
                this.mouseMoveStep.y
            );
            // console.log(this.mouseMoveStep);

            if (this.mouseMovePosition.x - parseInt(this.player.body.x) > 0) {
                this.player.body.x += speed;
                this.playAnimations("Right");
            } else {
                this.player.body.x -= speed;
                this.playAnimations("Left");
            }

            if (this.mouseMovePosition.y - parseInt(this.player.body.y) > 0) {
                this.player.body.y += speed;
                this.playAnimations("Down");
            } else {
                this.player.body.y -= speed;
                this.playAnimations("Up");
            }

            // this.player.setPosition(this.mouseMovePosition.x,this.mouseMovePosition.y)

            // this.scene.physics.moveTo(this.player, this.mouseMovePosition.x,this.mouseMovePosition.y, 90);

            // this.isMouseMove = false;

            // this.player.body.velocity.x = moveSpeed;
            // this.player.body.velocity.y = moveSpeed;
        }
    }

    moveInDirection(direction) {
        this.moveSpeed = 150;

        try {
            switch (direction) {
                case "right":
                    this.player.body.velocity.x = this.moveSpeed;
                    this.player.body.velocity.y = 0;
                    this.playAnimations("Right");
                    break;
                case "left":
                    this.player.body.velocity.x = -this.moveSpeed;
                    this.player.body.velocity.y = 0;
                    this.playAnimations("Left");
                    break;
                case "up":
                    this.player.body.velocity.y = -this.moveSpeed;
                    this.player.body.velocity.x = 0;
                    this.playAnimations("Up");
                    break;
                case "down":
                    this.player.body.velocity.y = this.moveSpeed;
                    this.player.body.velocity.x = 0;
                    this.playAnimations("Down");
                    break;
                case "idleRight":
                    this.player.body.velocity.x = 0;
                    this.player.body.velocity.y = 0;
                    this.playAnimations("IdleRight");
                    break;
                case "idleLeft":
                    this.player.body.velocity.x = 0;
                    this.player.body.velocity.y = 0;
                    this.playAnimations("IdleLeft");
                    break;
                case "idleUp":
                    this.player.body.velocity.x = 0;
                    this.player.body.velocity.y = 0;
                    this.playAnimations("IdleUp");
                    break;
                case "idleDown":
                    this.player.body.velocity.x = 0;
                    this.player.body.velocity.y = 0;
                    this.playAnimations("IdleDown");
                    break;
            }
        } catch (error) {
            console.warn(`Animation error in moveDirection: ${error}`);
        }
    }

    playAnimations(direction) {
        try {
            this.hair.play(`hair${direction}`, true);
            this.skin.play(`body${direction}`, true);
            this.outfit.play(`outfit${direction}`, true);
        } catch (error) {
            console.warn(
                `Failed to play animations for direction ${direction}: ${error}`
            );
        }
    }

    settingUpAnimations() {
        if (!this.scene) return;
        if (!this.scene.anims) return;

        let movementAnimKeys = {
            right: { start: 13, end: 17 },
            left: { start: 19, end: 23 },
            up: { start: 7, end: 9 },
            down: { start: 1, end: 5 },
            idleRight: { start: 12, end: 12 },
            idleLeft: { start: 18, end: 18 },
            idleUp: { start: 6, end: 6 },
            idleDown: { start: 0, end: 0 },
        };

        [
            "right",
            "left",
            "up",
            "down",
            "idleRight",
            "idleLeft",
            "idleUp",
            "idleDown",
        ].forEach((i) => {
            if (
                !this.scene.anims.exists(`body${this.capitalizeFirstLetter(i)}`)
            ) {
                this.scene.anims.create({
                    key: `body${this.capitalizeFirstLetter(i)}`,
                    frames: this.scene.anims.generateFrameNumbers("player", {
                        start: movementAnimKeys[i].start,
                        end: movementAnimKeys[i].end,
                    }),
                    frameRate: 10,
                    repeat: -1,
                });
            }
        });

        let anims = [
            { key: "hair", assetKey: "PlayerHair01" },
            { key: "outfit", assetKey: "PlayerOutfit01" },
        ];

        anims.forEach((anim) => {
            [
                "right",
                "left",
                "up",
                "down",
                "idleRight",
                "idleLeft",
                "idleUp",
                "idleDown",
            ].forEach((i) => {
                const animKey = `${anim.key}${this.capitalizeFirstLetter(i)}`;
                if (!this.scene.anims.exists(animKey)) {
                    this.scene.anims.create({
                        key: animKey,
                        frames: this.scene.anims.generateFrameNumbers(
                            anim.assetKey,
                            {
                                start: movementAnimKeys[i].start,
                                end: movementAnimKeys[i].end,
                            }
                        ),
                        frameRate: 10,
                        repeat: -1,
                    });
                }
            });
        });
    }

    capitalizeFirstLetter(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    determineDirectionFromAngle(angle) {
        // Convert angle to degrees and normalize to 0-360
        let degrees = Phaser.Math.RadToDeg(angle);
        degrees = (degrees + 360) % 360;

        // Determine direction based on angle
        let direction;
        if (degrees >= 315 || degrees < 45) {
            direction = "Right";
        } else if (degrees >= 45 && degrees < 135) {
            direction = "Down";
        } else if (degrees >= 135 && degrees < 225) {
            direction = "Left";
        } else {
            direction = "Up";
        }

        return direction;
    }
    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here


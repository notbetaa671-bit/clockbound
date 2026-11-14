import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create() {
    this.createTexture("player", 28, 38, (graphics) => {
      graphics.fillStyle(0xf4c95d, 1);
      graphics.fillRect(4, 4, 20, 30);
      graphics.fillStyle(0x17213e, 1);
      graphics.fillRect(8, 8, 12, 9);
      graphics.fillStyle(0xf26f5b, 1);
      graphics.fillRect(4, 27, 8, 7);
      graphics.fillRect(16, 27, 8, 7);
      graphics.fillStyle(0xfff4c1, 1);
      graphics.fillRect(11, 10, 2, 2);
      graphics.fillRect(16, 10, 2, 2);
    });

    this.createTexture("enemy", 30, 30, (graphics) => {
      graphics.fillStyle(0xd45163, 1);
      graphics.fillRect(3, 8, 24, 18);
      graphics.fillStyle(0x581d48, 1);
      graphics.fillRect(8, 3, 5, 8);
      graphics.fillRect(17, 3, 5, 8);
      graphics.fillStyle(0xfff4c1, 1);
      graphics.fillRect(9, 14, 4, 4);
      graphics.fillRect(17, 14, 4, 4);
      graphics.fillStyle(0x17213e, 1);
      graphics.fillRect(10, 15, 2, 2);
      graphics.fillRect(18, 15, 2, 2);
    });

    this.createTexture("shard", 20, 26, (graphics) => {
      graphics.fillStyle(0x8fe3cf, 1);
      graphics.beginPath();
      graphics.moveTo(10, 1);
      graphics.lineTo(19, 10);
      graphics.lineTo(10, 25);
      graphics.lineTo(1, 10);
      graphics.closePath();
      graphics.fillPath();
      graphics.fillStyle(0xd9fff1, 1);
      graphics.fillTriangle(10, 3, 16, 10, 10, 18);
    });

    this.createTexture("door", 42, 68, (graphics) => {
      graphics.fillStyle(0x3f2e68, 1);
      graphics.fillRect(3, 3, 36, 62);
      graphics.lineStyle(3, 0xf4c95d, 1);
      graphics.strokeRect(6, 6, 30, 56);
      graphics.fillStyle(0x8fe3cf, 1);
      graphics.fillCircle(21, 25, 8);
      graphics.fillStyle(0x17213e, 1);
      graphics.fillRect(20, 17, 2, 17);
      graphics.fillRect(20, 25, 9, 2);
      graphics.fillStyle(0xf4c95d, 1);
      graphics.fillCircle(30, 38, 3);
    });

    this.createTexture("platform", 8, 8, (graphics) => {
      graphics.fillStyle(0x29385f, 1);
      graphics.fillRect(0, 0, 8, 8);
      graphics.fillStyle(0x536d9f, 1);
      graphics.fillRect(0, 0, 8, 2);
      graphics.fillStyle(0x1d2949, 1);
      graphics.fillRect(0, 6, 8, 2);
    });

    this.createTexture("hazard", 24, 24, (graphics) => {
      graphics.fillStyle(0xe35d6a, 1);
      graphics.fillTriangle(12, 1, 23, 22, 1, 22);
      graphics.fillStyle(0x581d48, 1);
      graphics.fillRect(10, 9, 4, 8);
      graphics.fillRect(10, 19, 4, 2);
    });

    this.scene.start("PlayScene");
  }

  createTexture(key, width, height, draw) {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    draw(graphics);
    graphics.generateTexture(key, width, height);
    graphics.destroy();
  }
}

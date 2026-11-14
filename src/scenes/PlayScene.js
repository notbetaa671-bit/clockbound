import Phaser from "phaser";

const VIEWPORT = { width: 960, height: 540 };
const WORLD = { width: 2700, height: 540 };
const COLORS = {
  ink: 0x10182d,
  brass: 0xf4c95d,
  mint: 0x8fe3cf,
  text: "#fff4c1",
  muted: "#a9b7d9",
};

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super("PlayScene");
  }

  create() {
    this.levelComplete = false;
    this.collectedShards = 0;
    this.totalShards = 8;
    this.deaths = 0;
    this.lastGroundedAt = -Infinity;
    this.jumpPressedAt = -Infinity;
    this.spawnPoint = { x: 130, y: 390 };

    this.createBackdrop();
    this.createLevelGeometry();
    this.createPlayer();
    this.createPickups();
    this.createEnemies();
    this.createGoal();
    this.createInput();
    this.createHud();
    this.createInstructions();

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.overlap(this.player, this.shards, this.collectShard, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, undefined, this);
    this.physics.add.overlap(this.player, this.hazards, this.hitHazard, undefined, this);
    this.physics.add.overlap(this.player, this.goal, this.reachGoal, undefined, this);

    this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(220, 100);
  }

  update(time) {
    if (this.levelComplete) {
      return;
    }

    this.updatePlayer(time);
    this.updateEnemies(time);
    this.updatePickups(time);
    this.updateHud();

    if (this.player.y > VIEWPORT.height + 100) {
      this.respawnPlayer();
    }
  }

  createBackdrop() {
    const background = this.add.graphics().setDepth(-20);
    background.fillStyle(COLORS.ink, 1);
    background.fillRect(0, 0, WORLD.width, WORLD.height);
    background.fillStyle(0x141e39, 1);
    background.fillRect(0, 310, WORLD.width, 230);
    background.fillStyle(0x1d2b4d, 1);
    background.fillRect(0, 440, WORLD.width, 100);

    for (let x = 80; x < WORLD.width; x += 260) {
      const y = 170 + ((x / 260) % 2) * 22;
      background.fillStyle(0x1b2a4b, 1);
      background.fillCircle(x, y, 78);
      background.lineStyle(4, 0x263d66, 1);
      background.strokeCircle(x, y, 78);
      background.lineStyle(2, 0x3c5784, 0.8);
      background.lineBetween(x - 52, y, x + 52, y);
      background.lineBetween(x, y - 52, x, y + 52);
    }

    for (let x = 0; x < WORLD.width; x += 48) {
      background.fillStyle(x % 96 === 0 ? 0x2a416e : 0x24395f, 0.55);
      background.fillRect(x, 488, 32, 3);
    }

    const title = this.add
      .text(44, 36, "CLOCKBOUND", {
        fontFamily: "monospace",
        fontSize: "28px",
        fontStyle: "bold",
        color: COLORS.text,
        letterSpacing: 4,
      })
      .setScrollFactor(0)
      .setDepth(10);
    title.setShadow(3, 3, "#0b1021", 0, true, true);
  }

  createLevelGeometry() {
    this.platforms = this.physics.add.staticGroup();
    const platforms = [
      [180, 500, 360, 40],
      [650, 500, 360, 40],
      [1110, 500, 350, 40],
      [1580, 500, 360, 40],
      [2070, 500, 340, 40],
      [2520, 500, 360, 40],
      [430, 390, 150, 22],
      [760, 330, 150, 22],
      [1040, 395, 130, 22],
      [1330, 330, 170, 22],
      [1740, 385, 150, 22],
      [2190, 330, 170, 22],
      [2390, 405, 120, 22],
    ];

    platforms.forEach(([x, y, width, height]) => {
      const platform = this.platforms.create(x, y, "platform");
      platform.setDisplaySize(width, height);
      platform.refreshBody();
    });

    this.hazards = this.physics.add.staticGroup();
    [575, 1015, 1455, 1945, 2415].forEach((x) => {
      const hazard = this.hazards.create(x, 487, "hazard");
      hazard.setDepth(2);
    });

    this.add
      .text(72, 448, "TALLER DEL AMANECER  //  NIVEL 01", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: COLORS.muted,
        backgroundColor: "#10182dcc",
        padding: { x: 8, y: 6 },
      })
      .setDepth(4);
  }

  createPlayer() {
    this.player = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y, "player");
    // El nivel tiene huecos entre plataformas; dejar libre el límite inferior
    // permite detectar la caída y devolver a Mara al punto de aparición.
    this.player.setCollideWorldBounds(false);
    this.player.setBounce(0, 0);
    this.player.setDragX(1400);
    this.player.body.setSize(20, 34).setOffset(4, 4);
    this.player.setDepth(5);
  }

  createPickups() {
    this.shards = this.physics.add.staticGroup();
    const positions = [
      [300, 440],
      [500, 350],
      [820, 290],
      [1120, 350],
      [1380, 290],
      [1800, 345],
      [2240, 290],
      [2450, 365],
    ];

    positions.forEach(([x, y]) => {
      const shard = this.shards.create(x, y, "shard");
      shard.setDepth(4);
      shard.setData("baseY", y);
      shard.setData("phase", x * 0.03);
    });
  }

  createEnemies() {
    this.enemies = this.physics.add.group();
    [
      [720, 460, 650, 910],
      [1240, 460, 1130, 1400],
      [1680, 460, 1600, 1880],
      [2140, 460, 2080, 2360],
    ].forEach(([x, y, minX, maxX]) => {
      const enemy = this.enemies.create(x, y, "enemy");
      enemy.setDepth(4);
      enemy.setImmovable(true);
      enemy.body.setAllowGravity(false);
      enemy.setDataEnabled();
      enemy.setData("minX", minX);
      enemy.setData("maxX", maxX);
      enemy.setData("direction", 1);
      enemy.setData("speed", 52);
    });
  }

  createGoal() {
    this.goal = this.physics.add.staticImage(2615, 424, "door");
    this.goal.setDepth(4);
    this.goal.setData("locked", true);
    this.goalLabel = this.add
      .text(2565, 360, "SALIDA", {
        fontFamily: "monospace",
        fontSize: "13px",
        color: COLORS.brass,
        backgroundColor: "#10182dcc",
        padding: { x: 5, y: 3 },
      })
      .setDepth(4);
  }

  createInput() {
    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      restart: Phaser.Input.Keyboard.KeyCodes.R,
    });
  }

  createHud() {
    this.hud = this.add
      .text(VIEWPORT.width - 34, 38, "", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: COLORS.text,
        align: "right",
        backgroundColor: "#10182dcc",
        padding: { x: 10, y: 8 },
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(10);
  }

  createInstructions() {
    this.add
      .text(VIEWPORT.width - 34, VIEWPORT.height - 30, "A/D o ←/→ MOVER   ·   ESPACIO/W/↑ SALTAR   ·   R REINICIAR", {
        fontFamily: "monospace",
        fontSize: "12px",
        color: COLORS.muted,
        backgroundColor: "#10182dcc",
        padding: { x: 8, y: 5 },
      })
      .setOrigin(1, 1)
      .setScrollFactor(0)
      .setDepth(10);
  }

  updatePlayer(time) {
    const body = this.player.body;
    const left = this.keys.left.isDown || this.keys.a.isDown;
    const right = this.keys.right.isDown || this.keys.d.isDown;
    const jumpDown = this.keys.jump.isDown || this.keys.up.isDown || this.keys.w.isDown;
    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.keys.jump)
      || Phaser.Input.Keyboard.JustDown(this.keys.up)
      || Phaser.Input.Keyboard.JustDown(this.keys.w);

    if (body.blocked.down || body.touching.down) {
      this.lastGroundedAt = time;
    }
    if (jumpPressed) {
      this.jumpPressedAt = time;
    }

    const direction = (right ? 1 : 0) - (left ? 1 : 0);
    const targetSpeed = direction * 250;
    body.setVelocityX(Phaser.Math.Linear(body.velocity.x, targetSpeed, 0.24));

    if (direction !== 0) {
      this.player.setFlipX(direction < 0);
    }

    this.player.x = Phaser.Math.Clamp(this.player.x, 14, WORLD.width - 14);

    const canJump = time - this.lastGroundedAt <= 110;
    const bufferedJump = time - this.jumpPressedAt <= 130;
    if (canJump && bufferedJump) {
      body.setVelocityY(-490);
      this.lastGroundedAt = -Infinity;
      this.jumpPressedAt = -Infinity;
    }

    if (!jumpDown && body.velocity.y < -180) {
      body.setVelocityY(body.velocity.y * 0.86);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.restart)) {
      this.scene.restart();
    }
  }

  updateEnemies() {
    this.enemies.children.iterate((enemy) => {
      const { minX, maxX, speed } = enemy.data.values;
      let direction = enemy.data.get("direction");

      if (enemy.x <= minX) {
        direction = 1;
      } else if (enemy.x >= maxX) {
        direction = -1;
      }

      enemy.setData("direction", direction);
      enemy.body.setVelocityX(direction * speed);
      enemy.setFlipX(direction < 0);
    });
  }

  updatePickups(time) {
    this.shards.children.iterate((shard) => {
      if (!shard.active) {
        return;
      }
      const baseY = shard.getData("baseY");
      const phase = shard.getData("phase");
      shard.y = baseY + Math.sin(time * 0.004 + phase) * 5;
      shard.angle += 1.2;
    });
  }

  updateHud() {
    this.hud.setText([
      "CRONITA",
      `${this.collectedShards} / ${this.totalShards}`,
      "",
      `CAÍDAS  ${this.deaths}`,
    ]);
  }

  collectShard(_player, shard) {
    if (!shard.active) {
      return;
    }
    shard.disableBody(true, true);
    this.collectedShards += 1;
    this.tweens.add({
      targets: this.hud,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 90,
      yoyo: true,
    });
  }

  hitEnemy() {
    this.respawnPlayer();
  }

  hitHazard() {
    this.respawnPlayer();
  }

  respawnPlayer() {
    this.deaths += 1;
    this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y);
    this.player.body.setVelocity(0, 0);
    this.cameras.main.flash(120, 242, 111, 91);
  }

  reachGoal() {
    if (this.levelComplete) {
      return;
    }
    if (this.collectedShards < this.totalShards) {
      this.goalLabel.setText("FALTAN FRAGMENTOS").setColor("#f26f5b");
      this.tweens.add({ targets: this.goalLabel, alpha: 0.35, yoyo: true, repeat: 2, duration: 100 });
      return;
    }

    this.levelComplete = true;
    this.physics.pause();
    this.player.setTint(COLORS.mint);
    this.showCompletionPanel();
  }

  showCompletionPanel() {
    const panel = this.add
      .rectangle(VIEWPORT.width / 2, VIEWPORT.height / 2, 560, 260, COLORS.ink, 0.96)
      .setScrollFactor(0)
      .setDepth(20)
      .setStrokeStyle(3, COLORS.brass, 1);

    this.add
      .text(VIEWPORT.width / 2, VIEWPORT.height / 2 - 76, "NIVEL REPARADO", {
        fontFamily: "monospace",
        fontSize: "29px",
        fontStyle: "bold",
        color: COLORS.brass,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(21);

    this.add
      .text(
        VIEWPORT.width / 2,
        VIEWPORT.height / 2 - 18,
        "El primer engranaje vuelve a girar.\nLa Torre del Cero te espera.",
        {
          fontFamily: "monospace",
          fontSize: "17px",
          lineSpacing: 8,
          align: "center",
          color: COLORS.text,
        },
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(21);

    this.add
      .text(VIEWPORT.width / 2, VIEWPORT.height / 2 + 74, "PULSA R PARA VOLVER A JUGAR", {
        fontFamily: "monospace",
        fontSize: "13px",
        color: COLORS.mint,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(21);

    this.input.keyboard.once("keydown-R", () => this.scene.restart());
    panel.setData("completion", true);
  }
}

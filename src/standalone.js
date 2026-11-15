(function startClockbound() {
  if (!window.Phaser) {
    document.querySelector("#game-container").innerHTML =
      '<p style="padding:32px;font-family:monospace;color:#fff4c1;background:#10182d">No se pudo cargar Phaser. Comprueba tu conexión a Internet y vuelve a abrir este archivo.</p>';
    return;
  }

  const VIEWPORT = { width: 960, height: 540 };
  const WORLD = { width: 2700, height: 540 };
  const COLORS = {
    ink: 0x10182d,
    brass: 0xf4c95d,
    mint: 0x8fe3cf,
    text: "#fff4c1",
    muted: "#a9b7d9",
  };

  class ClockboundScene extends Phaser.Scene {
    constructor() {
      super("ClockboundScene");
    }

    create() {
      this.levelComplete = false;
      this.collectedShards = 0;
      this.totalShards = 8;
      this.deaths = 0;
      this.lastGroundedAt = -Infinity;
      this.jumpPressedAt = -Infinity;
      this.spawnPoint = { x: 130, y: 390 };

      this.createTextures();
      this.createBackdrop();
      this.createLevelGeometry();
      this.createPlayer();
      this.createPickups();
      this.createEnemies();
      this.createGoal();
      this.createInput();
      this.createHud();

      this.physics.add.collider(this.player, this.platforms);
      this.physics.add.collider(this.enemies, this.platforms);
      this.physics.add.overlap(this.player, this.shards, this.collectShard, undefined, this);
      this.physics.add.overlap(this.player, this.enemies, this.hitDanger, undefined, this);
      this.physics.add.overlap(this.player, this.hazards, this.hitDanger, undefined, this);
      this.physics.add.overlap(this.player, this.goal, this.reachGoal, undefined, this);

      this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
      this.cameras.main.setDeadzone(220, 100);
    }

    update(time) {
      if (this.levelComplete) return;

      this.updatePlayer(time);
      this.updateEnemies();
      this.updatePickups(time);
      this.updateHud();

      if (this.player.y > VIEWPORT.height + 100) this.respawnPlayer();
    }

    createTextures() {
      this.createTexture("player", 28, 38, (g) => {
        g.fillStyle(0xf4c95d, 1);
        g.fillRect(4, 4, 20, 30);
        g.fillStyle(0x17213e, 1);
        g.fillRect(8, 8, 12, 9);
        g.fillStyle(0xf26f5b, 1);
        g.fillRect(4, 27, 8, 7);
        g.fillRect(16, 27, 8, 7);
        g.fillStyle(0xfff4c1, 1);
        g.fillRect(11, 10, 2, 2);
        g.fillRect(16, 10, 2, 2);
      });

      this.createTexture("enemy", 30, 30, (g) => {
        g.fillStyle(0xd45163, 1);
        g.fillRect(3, 8, 24, 18);
        g.fillStyle(0x581d48, 1);
        g.fillRect(8, 3, 5, 8);
        g.fillRect(17, 3, 5, 8);
        g.fillStyle(0xfff4c1, 1);
        g.fillRect(9, 14, 4, 4);
        g.fillRect(17, 14, 4, 4);
        g.fillStyle(0x17213e, 1);
        g.fillRect(10, 15, 2, 2);
        g.fillRect(18, 15, 2, 2);
      });

      this.createTexture("shard", 20, 26, (g) => {
        g.fillStyle(0x8fe3cf, 1);
        g.beginPath();
        g.moveTo(10, 1);
        g.lineTo(19, 10);
        g.lineTo(10, 25);
        g.lineTo(1, 10);
        g.closePath();
        g.fillPath();
        g.fillStyle(0xd9fff1, 1);
        g.fillTriangle(10, 3, 16, 10, 10, 18);
      });

      this.createTexture("door", 42, 68, (g) => {
        g.fillStyle(0x3f2e68, 1);
        g.fillRect(3, 3, 36, 62);
        g.lineStyle(3, 0xf4c95d, 1);
        g.strokeRect(6, 6, 30, 56);
        g.fillStyle(0x8fe3cf, 1);
        g.fillCircle(21, 25, 8);
        g.fillStyle(0x17213e, 1);
        g.fillRect(20, 17, 2, 17);
        g.fillRect(20, 25, 9, 2);
        g.fillStyle(0xf4c95d, 1);
        g.fillCircle(30, 38, 3);
      });

      this.createTexture("platform", 8, 8, (g) => {
        g.fillStyle(0x29385f, 1);
        g.fillRect(0, 0, 8, 8);
        g.fillStyle(0x536d9f, 1);
        g.fillRect(0, 0, 8, 2);
        g.fillStyle(0x1d2949, 1);
        g.fillRect(0, 6, 8, 2);
      });

      this.createTexture("hazard", 24, 24, (g) => {
        g.fillStyle(0xe35d6a, 1);
        g.fillTriangle(12, 1, 23, 22, 1, 22);
        g.fillStyle(0x581d48, 1);
        g.fillRect(10, 9, 4, 8);
        g.fillRect(10, 19, 4, 2);
      });
    }

    createTexture(key, width, height, draw) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      draw(g);
      g.generateTexture(key, width, height);
      g.destroy();
    }

    createBackdrop() {
      const bg = this.add.graphics().setDepth(-20);
      bg.fillStyle(COLORS.ink, 1);
      bg.fillRect(0, 0, WORLD.width, WORLD.height);
      bg.fillStyle(0x141e39, 1);
      bg.fillRect(0, 310, WORLD.width, 230);
      bg.fillStyle(0x1d2b4d, 1);
      bg.fillRect(0, 440, WORLD.width, 100);

      for (let x = 80; x < WORLD.width; x += 260) {
        const y = 170 + ((x / 260) % 2) * 22;
        bg.fillStyle(0x1b2a4b, 1);
        bg.fillCircle(x, y, 78);
        bg.lineStyle(4, 0x263d66, 1);
        bg.strokeCircle(x, y, 78);
        bg.lineStyle(2, 0x3c5784, 0.8);
        bg.lineBetween(x - 52, y, x + 52, y);
        bg.lineBetween(x, y - 52, x, y + 52);
      }

      for (let x = 0; x < WORLD.width; x += 48) {
        bg.fillStyle(x % 96 === 0 ? 0x2a416e : 0x24395f, 0.55);
        bg.fillRect(x, 488, 32, 3);
      }

      this.add.text(44, 36, "CLOCKBOUND", {
        fontFamily: "monospace",
        fontSize: "28px",
        fontStyle: "bold",
        color: COLORS.text,
        letterSpacing: 4,
      }).setScrollFactor(0).setDepth(10);
    }

    createLevelGeometry() {
      this.platforms = this.physics.add.staticGroup();
      [
        [180, 500, 360, 40], [650, 500, 360, 40], [1110, 500, 350, 40],
        [1580, 500, 360, 40], [2070, 500, 340, 40], [2520, 500, 360, 40],
        [430, 390, 150, 22], [760, 330, 150, 22], [1040, 395, 130, 22],
        [1330, 330, 170, 22], [1740, 385, 150, 22], [2190, 330, 170, 22],
        [2390, 405, 120, 22],
      ].forEach(([x, y, width, height]) => {
        const platform = this.platforms.create(x, y, "platform");
        platform.setDisplaySize(width, height);
        platform.refreshBody();
      });

      this.hazards = this.physics.add.staticGroup();
      [575, 1015, 1455, 1945, 2415].forEach((x) => {
        this.hazards.create(x, 487, "hazard").setDepth(2);
      });

      this.add.text(72, 448, "TALLER DEL AMANECER  //  NIVEL 01", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: COLORS.muted,
        backgroundColor: "#10182dcc",
        padding: { x: 8, y: 6 },
      }).setDepth(4);
    }

    createPlayer() {
      this.player = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y, "player");
      this.player.setCollideWorldBounds(false);
      this.player.setDragX(1400);
      this.player.body.setSize(20, 34).setOffset(4, 4);
      this.player.setDepth(5);
    }

    createPickups() {
      this.shards = this.physics.add.staticGroup();
      [[300, 440], [500, 350], [820, 290], [1120, 350], [1380, 290], [1800, 345], [2240, 290], [2450, 365]].forEach(([x, y]) => {
        const shard = this.shards.create(x, y, "shard");
        shard.setDepth(4);
        shard.setData("baseY", y);
        shard.setData("phase", x * 0.03);
      });
    }

    createEnemies() {
      this.enemies = this.physics.add.group();
      [[720, 460, 650, 910], [1240, 460, 1130, 1400], [1680, 460, 1600, 1880], [2140, 460, 2080, 2360]].forEach(([x, y, minX, maxX]) => {
        const enemy = this.enemies.create(x, y, "enemy");
        enemy.setDepth(4);
        enemy.setImmovable(true);
        enemy.body.setAllowGravity(false);
        enemy.setData("minX", minX);
        enemy.setData("maxX", maxX);
        enemy.setData("direction", 1);
        enemy.setData("speed", 52);
      });
    }

    createGoal() {
      this.goal = this.physics.add.staticImage(2615, 424, "door").setDepth(4);
      this.goalLabel = this.add.text(2565, 360, "SALIDA", {
        fontFamily: "monospace",
        fontSize: "13px",
        color: COLORS.brass,
        backgroundColor: "#10182dcc",
        padding: { x: 5, y: 3 },
      }).setDepth(4);
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
      this.hud = this.add.text(VIEWPORT.width - 34, 38, "", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: COLORS.text,
        align: "right",
        backgroundColor: "#10182dcc",
        padding: { x: 10, y: 8 },
      }).setOrigin(1, 0).setScrollFactor(0).setDepth(10);

      this.add.text(VIEWPORT.width - 34, VIEWPORT.height - 30, "A/D o ←/→ MOVER   ·   ESPACIO/W/↑ SALTAR   ·   R REINICIAR", {
        fontFamily: "monospace",
        fontSize: "12px",
        color: COLORS.muted,
        backgroundColor: "#10182dcc",
        padding: { x: 8, y: 5 },
      }).setOrigin(1, 1).setScrollFactor(0).setDepth(10);
    }

    updatePlayer(time) {
      const body = this.player.body;
      const left = this.keys.left.isDown || this.keys.a.isDown;
      const right = this.keys.right.isDown || this.keys.d.isDown;
      const jumpDown = this.keys.jump.isDown || this.keys.up.isDown || this.keys.w.isDown;
      const jumpPressed = Phaser.Input.Keyboard.JustDown(this.keys.jump)
        || Phaser.Input.Keyboard.JustDown(this.keys.up)
        || Phaser.Input.Keyboard.JustDown(this.keys.w);

      if (body.blocked.down || body.touching.down) this.lastGroundedAt = time;
      if (jumpPressed) this.jumpPressedAt = time;

      const direction = (right ? 1 : 0) - (left ? 1 : 0);
      body.setVelocityX(Phaser.Math.Linear(body.velocity.x, direction * 250, 0.24));
      if (direction !== 0) this.player.setFlipX(direction < 0);
      this.player.x = Phaser.Math.Clamp(this.player.x, 14, WORLD.width - 14);

      if (time - this.lastGroundedAt <= 110 && time - this.jumpPressedAt <= 130) {
        body.setVelocityY(-490);
        this.lastGroundedAt = -Infinity;
        this.jumpPressedAt = -Infinity;
      }
      if (!jumpDown && body.velocity.y < -180) body.setVelocityY(body.velocity.y * 0.86);
      if (Phaser.Input.Keyboard.JustDown(this.keys.restart)) this.scene.restart();
    }

    updateEnemies() {
      this.enemies.children.iterate((enemy) => {
        let direction = enemy.getData("direction");
        if (enemy.x <= enemy.getData("minX")) direction = 1;
        if (enemy.x >= enemy.getData("maxX")) direction = -1;
        enemy.setData("direction", direction);
        enemy.body.setVelocityX(direction * enemy.getData("speed"));
        enemy.setFlipX(direction < 0);
      });
    }

    updatePickups(time) {
      this.shards.children.iterate((shard) => {
        if (!shard.active) return;
        shard.y = shard.getData("baseY") + Math.sin(time * 0.004 + shard.getData("phase")) * 5;
        shard.angle += 1.2;
      });
    }

    updateHud() {
      this.hud.setText(["CRONITA", `${this.collectedShards} / ${this.totalShards}`, "", `CAÍDAS  ${this.deaths}`]);
    }

    collectShard(_player, shard) {
      if (!shard.active) return;
      shard.disableBody(true, true);
      this.collectedShards += 1;
    }

    hitDanger() {
      this.respawnPlayer();
    }

    respawnPlayer() {
      this.deaths += 1;
      this.player.setPosition(this.spawnPoint.x, this.spawnPoint.y);
      this.player.body.setVelocity(0, 0);
      this.cameras.main.flash(120, 242, 111, 91);
    }

    reachGoal() {
      if (this.levelComplete) return;
      if (this.collectedShards < this.totalShards) {
        this.goalLabel.setText("FALTAN FRAGMENTOS").setColor("#f26f5b");
        return;
      }

      this.levelComplete = true;
      this.physics.pause();
      this.player.setTint(COLORS.mint);
      this.add.rectangle(VIEWPORT.width / 2, VIEWPORT.height / 2, 560, 260, COLORS.ink, 0.96)
        .setScrollFactor(0).setDepth(20).setStrokeStyle(3, COLORS.brass, 1);
      this.add.text(VIEWPORT.width / 2, VIEWPORT.height / 2 - 76, "NIVEL REPARADO", {
        fontFamily: "monospace", fontSize: "29px", fontStyle: "bold", color: COLORS.brass,
      }).setOrigin(0.5).setScrollFactor(0).setDepth(21);
      this.add.text(VIEWPORT.width / 2, VIEWPORT.height / 2 - 18, "El primer engranaje vuelve a girar.\nLa Torre del Cero te espera.", {
        fontFamily: "monospace", fontSize: "17px", lineSpacing: 8, align: "center", color: COLORS.text,
      }).setOrigin(0.5).setScrollFactor(0).setDepth(21);
      this.add.text(VIEWPORT.width / 2, VIEWPORT.height / 2 + 74, "PULSA R PARA VOLVER A JUGAR", {
        fontFamily: "monospace", fontSize: "13px", color: COLORS.mint,
      }).setOrigin(0.5).setScrollFactor(0).setDepth(21);
      this.input.keyboard.once("keydown-R", () => this.scene.restart());
    }
  }

  new Phaser.Game({
    type: Phaser.AUTO,
    parent: "game-container",
    width: VIEWPORT.width,
    height: VIEWPORT.height,
    backgroundColor: "#10182d",
    pixelArt: true,
    antialias: false,
    render: { roundPixels: true },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: VIEWPORT.width,
      height: VIEWPORT.height,
    },
    physics: {
      default: "arcade",
      arcade: { gravity: { y: 1100 }, debug: false },
    },
    scene: [ClockboundScene],
  });
})();

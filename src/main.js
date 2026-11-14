import Phaser from "phaser";
import "./styles.css";
import BootScene from "./scenes/BootScene.js";
import PlayScene from "./scenes/PlayScene.js";

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: 960,
  height: 540,
  backgroundColor: "#10182d",
  pixelArt: true,
  antialias: false,
  render: {
    roundPixels: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 960,
    height: 540,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1100 },
      debug: false,
    },
  },
  scene: [BootScene, PlayScene],
};

new Phaser.Game(config);

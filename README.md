# CLOCKBOUND

Vertical slice de un plataformas 2D para un jugador, construido con Phaser 3.90.0 y Vite.

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.

## Jugar sin Terminal

Para jugar sin instalar nada ni abrir Terminal, haz doble clic en `index.html`. El juego carga Phaser desde Internet, así que necesitas conexión la primera vez que lo abras.

Si macOS lo abre como texto o no carga el juego, haz clic derecho sobre `index.html`, selecciona **Abrir con** y elige Opera, Chrome o Safari.

## Ejecutar en local para desarrollo

Desde la raíz del proyecto:

```bash
npm install
npm run dev
```

Abre la URL que indique Vite, normalmente `http://localhost:5173`. Este modo es para desarrollar; no es necesario para jugar la versión autónoma.

Controles del primer nivel:

- `A/D` o flechas izquierda/derecha: moverse.
- `Espacio`, `W` o flecha arriba: saltar.
- `R`: reiniciar.

Reúne las 8 cronitas, evita pinchos y autómatas, y llega a la puerta del extremo derecho. La salida se desbloquea al recoger todos los fragmentos.

## Estructura

```text
src/
  main.js                  Configuración de Phaser y entrada de la app
  styles.css               Marco responsive del canvas
  scenes/
    BootScene.js           Texturas procedurales y arranque
    PlayScene.js           Primer nivel, jugador, física, cámara y HUD
docs/
  GAME_DESIGN.md           Documento de diseño completo
```

## Comprobar una build de producción

```bash
npm run build
npm run preview
```

La carpeta `dist/` contiene la versión estática lista para publicar.

## Publicar la versión web

### Vercel

1. Importa el repositorio en Vercel.
2. Usa `npm run build` como comando de build.
3. Usa `dist` como directorio de salida.
4. No se necesitan variables de entorno para esta demo.

También se puede desplegar con la CLI de Vercel después de instalarla y autenticarla:

```bash
vercel
```

### Netlify

1. Conecta el repositorio.
2. Build command: `npm run build`.
3. Publish directory: `dist`.

### GitHub Pages

Genera `dist/` con `npm run build` y publícala mediante una acción de GitHub Pages. Si se publica bajo una subruta, configura `base` en `vite.config.js` con el nombre del repositorio antes de compilar.

## Próximos pasos recomendados

1. Separar los datos de cada nivel en archivos JSON o módulos `LevelData`.
2. Añadir `PauseScene`, checkpoints y guardado con `localStorage`.
3. Sustituir las texturas procedurales por spritesheets y añadir audio.
4. Crear la habilidad de impulso temporal antes de producir el resto del Mundo 1.

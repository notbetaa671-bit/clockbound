# CLOCKBOUND — Documento de diseño

## 1. Visión

**CLOCKBOUND** es un plataformas 2D para un jugador sobre precisión, ritmo y memoria espacial. La protagonista, **Mara**, es una aprendiz de relojería que despierta dentro de una ciudad atrapada en el mismo minuto. El Gran Reloj se ha partido y sus fragmentos de cronita están repartidos por cuatro mundos mecánicos.

La promesa jugable es sencilla: cada pantalla combina plataformas legibles con una pequeña decisión temporal. El jugador aprende el patrón, se arriesga por los coleccionables y usa sus habilidades para atravesar la maquinaria antes de que el tiempo vuelva a desfasarse.

## 2. Pilares de diseño

1. **Movimiento preciso:** aceleración controlable, salto con altura variable, tolerancia de coyote time y buffer de salto.
2. **Ritmo mecánico:** plataformas, enemigos y peligros se mueven como un mecanismo reconocible.
3. **Exploración con recompensa:** los fragmentos de cronita desbloquean mejoras y completan la reconstrucción del reloj.
4. **Lectura visual inmediata:** cada elemento interactivo usa una silueta, color y sonido propios.
5. **Reintento amable:** muertes rápidas, puntos de reaparición cercanos y reinicio instantáneo.

## 3. Historia y personajes

### Premisa

En la ciudad de **Aguja**, todos los habitantes viven un mismo amanecer. El Gran Reloj que mantiene el flujo del tiempo ha sido infectado por una entidad conocida como **El Desfasador**, una sombra que se alimenta de los minutos que nadie recuerda. Mara entra en el mecanismo para recuperar ocho fragmentos por mundo y alcanzar el núcleo.

### Protagonista

**Mara:** aprendiz de relojera, curiosa, tenaz y algo impaciente. Su herramienta es el **Péndulo**, una llave-reloj que canaliza la cronita.

### Antagonistas

- **El Desfasador:** antiguo maestro relojero que quiso detener la pérdida de su propio tiempo.
- **Autómatas de mantenimiento:** criaturas mecánicas que siguen órdenes antiguas y patrullan las rutas.

## 4. Controles

| Acción | Teclado | Diseño de respuesta |
| --- | --- | --- |
| Mover | A/D o flechas izquierda/derecha | Aceleración corta y frenado rápido |
| Saltar | Espacio, W o flecha arriba | Altura variable al mantener el botón |
| Reiniciar | R | Reinicio inmediato del nivel |
| Pausa futura | Escape | Reservada para la primera versión completa |

La base incluye **coyote time** de 110 ms y **jump buffer** de 130 ms para que el control se sienta preciso sin ser rígido.

## 5. Habilidades y progresión

### Habilidades de Mara

1. **Salto de precisión:** disponible desde el inicio.
2. **Impulso de péndulo:** dash horizontal en el aire, desbloqueado en Mundo 1.
3. **Ancla temporal:** congela una plataforma o enemigo durante unos segundos, desbloqueada en Mundo 2.
4. **Rebobinado breve:** devuelve a Mara a su posición de hace 1,5 segundos, desbloqueado en Mundo 3.
5. **Salto de aguja:** doble salto de alta precisión para el tramo final.

### Progresión

Cada mundo entrega una pieza del Péndulo. Las cronitas pueden gastarse entre niveles en tres mejoras opcionales: ventana de dash, capacidad de rebobinado y tolerancia de daño. La campaña principal puede completarse sin comprar todas las mejoras; el 100 % exige rutas alternativas.

## 6. Mundos y niveles

La campaña propuesta tiene cuatro mundos, con cuatro niveles y un jefe por mundo: 16 niveles principales más 4 encuentros de jefe.

### Mundo 1 — Taller del Amanecer

Metal cobrizo, vapor y luz naranja. Enseña movimiento, salto, coleccionables y peligros estáticos.

- **01. Primer Engranaje:** tutorial jugable; fragmentos, pinchos y autómatas básicos.
- **02. Línea de Montaje:** plataformas móviles y cintas transportadoras.
- **03. El Salto del Péndulo:** introduce el impulso aéreo.
- **04. Cámara de Presión:** mezcla de peligros y rutas opcionales.
- **Jefe: El Desfasador — Forma de Latón:** patrón de golpes telegráficos; el jugador usa los engranajes del escenario para devolverle sus proyectiles.

### Mundo 2 — Jardines de la Hora Azul

Invernaderos nocturnos, raíces cristalinas y campanas. El foco es congelar elementos y distinguir qué partes del escenario están activas.

- **05. Rocío Invertido:** superficies que desaparecen por pulsos.
- **06. Invernadero 13:** semillas enemigas y plataformas orgánicas.
- **07. Campanario Sumergido:** agua temporal y saltos con impulso.
- **08. Jardín de Segundos:** rutas que solo existen durante una ventana de tiempo.
- **Jefe: La Polilla de la Hora Azul:** alterna velocidad normal y ralentización.

### Mundo 3 — Trincheras de la Medianoche

Fábricas de tinta y corredores casi oscuros. Introduce el rebobinado y riesgos con información incompleta.

- **09. Calderas Negras:** vapor, válvulas y cambios de presión.
- **10. La Vía sin Luz:** guía por sonidos y siluetas.
- **11. Agujas Cruzadas:** grandes péndulos que cortan el espacio.
- **12. Archivo de Minutos Perdidos:** rutas múltiples y secretos de historia.
- **Jefe: El Archivista:** copia la última acción del jugador y obliga a romper el patrón.

### Mundo 4 — Torre del Cero

Una torre vertical que mezcla todos los materiales y mecánicas. El color dominante es blanco cálido contra un cielo vacío.

- **13. Escalera de las Doce:** ascenso vertical con checkpoints.
- **14. La Hora sin Nombre:** combina congelación y rebobinado.
- **15. Aguja Central:** gauntlet de precisión sin suelo continuo.
- **16. Corazón del Reloj:** última ruta hacia el núcleo.
- **Jefe final: El Desfasador — Forma Cero:** duelo en una esfera de reloj; el jefe modifica el ritmo del escenario y Mara restaura cada número.

## 7. Enemigos

| Enemigo | Comportamiento | Contrajuego |
| --- | --- | --- |
| Autómata de mantenimiento | Patrulla entre dos límites | Saltar, esquivar o usar una plataforma superior |
| Aguja errante | Cruza una línea con ritmo constante | Leer el ciclo y pasar durante el hueco |
| Polilla de arena | Persigue lentamente a Mara | Congelarla o moverse por una ruta vertical |
| Eco del minuto | Repite el último movimiento de la protagonista | Cambiar el patrón con una pausa o rebobinado |
| Custodio cero | Mini-jefe con tres fases | Ataques telegráficos y ventanas de daño |

## 8. Coleccionables

- **Fragmentos de cronita:** 8 por nivel; completan la pieza principal y habilitan la salida.
- **Minutos perdidos:** 3 secretos por nivel; desbloquean entradas del archivo narrativo.
- **Sellos de relojero:** uno por mundo; recompensan terminar un nivel sin morir.
- **Relojes de bolsillo:** extras cosméticos que cambian el rastro del dash.

El primer nivel funcional implementado en esta base ya incluye 8 fragmentos de cronita, enemigos patrulla, pinchos, salida cerrada hasta completar la colección y contador de caídas.

## 9. UI y flujo

### HUD en partida

- Esquina superior izquierda: marca CLOCKBOUND y mundo actual.
- Esquina superior derecha: cronita reunida y caídas.
- Parte inferior: controles contextuales.
- Elementos del mundo: rótulo del nivel, salida y señales de peligro.

### Flujo de pantalla

1. Menú principal con «Jugar», «Archivo» y «Opciones».
2. Mapa de Aguja con mundos desbloqueados.
3. Nivel con pausa, reinicio y checkpoints.
4. Pantalla de resultado: cronita, secretos, tiempo y muertes.
5. Archivo narrativo y mejoras.

La demo implementada comienza directamente en el primer nivel para facilitar pruebas de movimiento.

## 10. Dirección artística y audio

### Arte

- Pixel art de baja resolución con siluetas limpias y animaciones de 4–8 cuadros.
- Paleta base: azul tinta, latón, coral de peligro y menta de cronita.
- Fondos con capas de engranajes, ventanas, vapor y líneas de construcción.
- Cada mundo cambia temperatura de color, material y densidad de partículas.

La base funcional dibuja texturas simples desde Phaser para evitar un bloqueo por assets. En producción se reemplazarán por spritesheets y tilesets con la misma paleta.

### Audio

- Música: cajas de música, percusión metálica y bajo pulsante sincronizado con el BPM del mundo.
- SFX prioritarios: salto, aterrizaje, cronita, daño, checkpoint, puerta y jefe.
- La música debe reducir capas cuando el jugador está cerca de una muerte o de un secreto.

## 11. Alcance técnico

- Phaser 3.90.0 con Arcade Physics.
- Vite como servidor de desarrollo y bundler.
- JavaScript modular ES2022.
- Primera fase sin backend, guardado local previsto con `localStorage`.
- Resolución lógica 960×540 con escalado `FIT` y cámara horizontal.
- Próximos módulos: `LevelData`, `SaveSystem`, `AudioManager`, `PauseScene`, `MapScene` y sistema de checkpoints.

## 12. Hoja de ruta

1. **Vertical slice actual:** movimiento, salto, cámara, colisiones, enemigos, coleccionables, salida y primer nivel.
2. **Fundaciones:** escenas de menú, pausa, audio, checkpoints y datos de niveles separados del código.
3. **Mundo 1:** 4 niveles, boss y habilidad de dash.
4. **Mundos 2–4:** habilidades temporales, jefes y narrativa.
5. **Pulido:** arte final, accesibilidad, controles táctiles opcionales, logros y rendimiento.

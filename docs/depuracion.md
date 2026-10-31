# Depuración y rendimiento: Parte A (buscador-js)

## 1. Error real encontrado durante el desarrollo

### 1.1 Síntoma

Al abrir la aplicación no respondía ningún botón: no salían resultados al buscar ni se podía agregar libros. La consola del navegador mostraba:

```
Uncaught SyntaxError: The requested module './render.js' does not provide an export named 'actualizarFila'
```

![Error en la consola](capturas/error-consola.png)

### 1.2 Cómo se localizó

1. **Consola:** el mensaje indica que `render.js` no exporta `actualizarFila`, aunque `main.js` la importa y la función sí está escrita en mi código.
2. **Pestaña Sources:** al abrir `render.js` tal como lo recibió el navegador, la primera línea era `import { buscarLibros } from "./api.js"`. Eso es código de `main.js`, no de `render.js`. El archivo se estaba importando a sí mismo y no exportaba nada.
3. **Pestaña Network:** `render.js` pesaba 3,9 kB, casi lo mismo que `main.js` (3,7 kB). Una vez corregido pesa 9,4 kB.

![render.js en Sources con el código equivocado](capturas/sources-render.png)

### 1.3 Causa y corrección

Causa: al pegar el código de `main.js` se sobrescribió `render.js` (pegado en la pestaña equivocada). Corrección: se restauró `render.js` con su propio código y se verificó desde la terminal con `findstr` que solo `main.js` empieza con `import { buscarLibros }` y solo `render.js` empieza con `// render.js`.

Este error se produce cuando el navegador enlaza los módulos ES, antes de ejecutar una sola línea de JavaScript, por eso no se puede pausar con un punto de interrupción. Se localizó con la consola y con Sources.

### 1.4 Verificación de la corrección con un punto de interrupción

Para comprobar que la función que el navegador no encontraba ya funciona, se puso un punto de interrupción en `actualizarFila` (`js/render.js`, línea `const fila = buscarFila(libro.id);`). Al pulsar "Cambiar estado" en un libro de la lista, la ejecución se pausó y en **Scope → Local** se observó:

- `libro.id`: [...]
- `libro.estado`: [...]

Con "paso a paso" (F10) se vio cómo `crearInsignia` reemplaza solo la insignia de esa fila, sin reconstruir la tabla.

![Punto de interrupción en actualizarFila](capturas/breakpoint-actualizarfila.png)

## 2. Análisis del panel de red

Condiciones: Chrome DevTools, pestaña Network, **Disable cache** activado, servidor local (Live Server), misma ventana en todas las mediciones. La búsqueda de prueba fue `tolkien`.

### 2.1 Antes de optimizar (Bootstrap completo)

| | Sin búsqueda | Con búsqueda |
|---|---|---|
| Peticiones | 12 | 18 |
| Transferido | 353 kB | 436 kB |
| Recursos | 351 kB | 449 kB |

![Red antes, sin búsqueda](capturas/red-antes.png)
![Red antes, con búsqueda](capturas/red-antes-busqueda.png)

Lo que más pesa: `estilos.css` (237 kB) y `bootstrap.bundle.min.js` (80,8 kB). Con la búsqueda se suman `search.json` (6,4 kB) y las portadas (entre 13 y 23 kB cada una). Solo se descargan 4 portadas de 12 porque las imágenes usan `loading="lazy"` y el navegador carga únicamente las que se ven en pantalla.

## 3. Optimización aplicada: importar solo los parciales de Bootstrap necesarios

`scss/main.scss` importaba `bootstrap/scss/bootstrap`, que incluye todos los componentes. Se reemplazó por la importación individual de los parciales que la app usa: configuración, base, grilla, tablas, formularios, botones, navbar, tarjetas, insignias, alertas, modal, spinners, helpers y utilidades. Se dejaron fuera, entre otros, acordeón, carrusel, dropdown, offcanvas, paginación, popover, toast, tooltip, list-group y progress.

### 3.1 Medición después de optimizar

| | Sin búsqueda | Con búsqueda |
|---|---|---|
| Peticiones | 12 | 17 |
| Transferido | 293 kB | 376 kB |
| Recursos | 291 kB | 388 kB |

![Red después, sin búsqueda](capturas/red-despues.png)
![Red después, con búsqueda](capturas/red-despues-busqueda.png)

### 3.2 Comparación

| Medición | Antes | Después | Diferencia |
|---|---|---|---|
| `estilos.css` | 236.208 bytes | 176.048 bytes | -60.160 bytes (-25,5 %) |
| Transferido sin búsqueda | 353 kB | 293 kB | -60 kB (-17,0 %) |
| Transferido con búsqueda | 436 kB | 376 kB | -60 kB (-13,8 %) |

Después de compilar se revisó que la interfaz se viera igual: navbar, tarjetas, resumen, tabla, modal, alertas, formulario con sus mensajes y spinner.

## 4. Observaciones

- **Tiempos:** DOMContentLoaded y Load fueron mayores en la medición posterior (292 ms y 373 ms frente a 138 ms y 205 ms). Son tiempos de un servidor local y varían de una recarga a otra según lo que esté haciendo el equipo, por eso la mejora que se reporta es la del peso en bytes, que es reproducible.
- **WebSocket `ws`:** es la conexión de recarga automática de Live Server. Cuenta en las peticiones y queda "Pending", por lo que el valor `Finish` no sirve para comparar. Aparece igual antes y después.
- **Petición de menos con búsqueda (18 a 17):** corresponde a una fila `data:image/svg+xml` servida desde memoria, no a una descarga, y no se atribuye a la optimización.
- **Posibles mejoras futuras:** importar solo los plugins de JavaScript de Bootstrap que se usan (modal y collapse) en vez del bundle completo, y reducir el peso de las portadas pidiendo el tamaño `-S` de Open Library.
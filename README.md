# Estantería Común

Tarea 2 de **SOFT-12 Programación Web Avanzada** (Universidad CENFOTEC, III cuatrimestre 2026).
Autora: Andreina Leal.

Estantería Común es un club de lectura que necesita dos herramientas. Se resolvieron con tecnologías distintas para poder comparar cómo se resuelve el mismo problema (agregar un libro a la lista, cambiar su estado y quitarlo):

| Parte | Carpeta | Tecnologías | Qué hace |
|---|---|---|---|
| A | `buscador-js/` | JavaScript sin framework, Bootstrap y Sass | Busca libros en la API pública de Open Library, arma una lista de lecturas y permite proponer un libro con un formulario validado |
| B | `tablero-react/` | React (Vite), Bootstrap y Sass | Tablero del club con filtros por estado y miembro, resumen por estado y formulario controlado |

## Estructura del repositorio

```
tarea-2/
├── README.md
├── .gitignore
├── docs/
│   ├── depuracion.md        Depuración, análisis de red y optimización medida (Parte A)
│   └── capturas/
├── buscador-js/             Parte A
│   ├── index.html
│   ├── package.json
│   ├── scss/                Parciales de Sass (_variables, _funciones, _mixins, _componentes)
│   ├── css/                 CSS generado por Sass
│   └── js/                  Módulos ES: api, render, lista y formulario
└── tablero-react/           Parte B (proyecto de Vite)
    └── src/
        ├── components/      Un componente por carpeta
        ├── data/libros.js   Datos iniciales de miembros y libros
        └── styles/          Estilos de Sass
```

## Requisitos

- Node.js y npm instalados.
- Git.

Las dependencias (`node_modules`) no se incluyen en el repositorio. Se instalan con `npm install` en cada parte.

## Parte A: buscador de libros

### Instalar dependencias

```
cd buscador-js
npm install
```

### Compilar Sass

```
npm run build:css
```

Genera `css/estilos.css` a partir de `scss/main.scss`. Durante el desarrollo, `npm run watch:css` recompila al guardar.

### Ejecutar

Los módulos ES no funcionan abriendo el archivo con doble clic, así que hace falta un servidor local. Con la extensión **Live Server** de VS Code: clic derecho sobre `index.html` y **Open with Live Server** (queda en `http://127.0.0.1:5500/`). La búsqueda necesita conexión a internet.

## Parte B: tablero de lecturas

### Instalar dependencias

```
cd tablero-react
npm install
```

### Ejecutar

```
npm run dev
```

Abrir `http://localhost:5173/`. Aquí no hay que compilar Sass a mano: Vite compila `src/styles/main.scss`, que se importa desde `src/main.jsx`. Los datos salen de `src/data/libros.js` y no se consume ninguna API.

## Del DOM manual a React

Para comparar las dos partes se sigue una misma interacción: **cambiar el estado de un libro** (Pendiente, Leyendo, Leído).

### Parte A: yo mantengo la interfaz sincronizada con los datos

Los datos y la pantalla son dos cosas separadas, y el código tiene que conectarlas a mano:

1. Un clic en "Cambiar estado" lo atiende **una sola escucha** puesta en el contenedor de la lista (`buscador-js/js/main.js`). Con `closest("button[data-accion]")` se identifica el botón y se leen `data-accion` y `data-id`.
2. `siguienteEstado(id)` (`buscador-js/js/lista.js`) cambia el estado dentro del arreglo en memoria.
3. `actualizarFila(libro)` (`buscador-js/js/render.js`) busca la fila en el DOM con `buscarFila`, reemplaza su insignia con `crearInsignia` y reinicia la animación agregando y quitando una clase CSS.
4. `actualizarResumen(lista.contarPorEstado())` (`render.js` y `lista.js`) vuelve a escribir los tres contadores del panel.

Todo esto es trabajo manual: hay que **encontrar** el nodo, **decidir qué parte cambiar** y **acordarse de llamar** a cada función de actualización en cada camino (agregar, cambiar estado y quitar). Si falta una llamada, la pantalla queda desactualizada.

### Parte B: describo la interfaz a partir del estado

1. El botón de `tablero-react/src/components/LibroItem/LibroItem.jsx` llama a `onCambiarEstado(libro.id)`.
2. `cambiarEstado` (`tablero-react/src/App.jsx`) solo hace `setLibros` con un arreglo **nuevo** creado con `map` y spread.
3. React vuelve a ejecutar los componentes y la pantalla queda sincronizada.

### Qué deja de ser necesario y por qué

- **Buscar nodos y leer `data-*`** (`querySelector`, `closest`, delegación): el evento se declara en el propio elemento con `onClick` y la función llega por props.
- **`buscarFila`, `actualizarFila`, `crearFila` y `crearInsignia`**: la interfaz se describe con JSX como una función del estado, y React calcula qué cambió.
- **`actualizarResumen` y `actualizarMensajeVacio`**: el resumen (`conteo`) y la lista filtrada (`librosVisibles`) se **derivan** en `App.jsx` en cada render, y `ListaLibros.jsx` decide con un `if` si muestra el mensaje de "ningún libro coincide".

La razón de fondo es que en React hay **una sola fuente de verdad**, el estado, y la pantalla es consecuencia de ella. A cambio, hay que respetar la inmutabilidad (no mutar el estado con `push` o `splice`), porque React detecta los cambios comparando referencias, y la Parte B necesita un paso de compilación. La Parte A es más explícita y no depende de nada, pero crece en código de sincronización. Además, las transiciones CSS se implementaron solo en la Parte A, que es donde la consigna las pide.

## Documentación de depuración y rendimiento

El análisis del error real, del panel de red y de la optimización medida (Bootstrap completo frente a solo los parciales necesarios) está en [`docs/depuracion.md`](docs/depuracion.md).

## Entrega

El commit entregado lleva la etiqueta `tarea-2`.

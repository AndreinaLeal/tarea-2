// render.js: crea y actualiza elementos del DOM (nunca innerHTML con datos de la API)

const contenedorResultados = document.querySelector("#resultados");
const estados = {
  carga: document.querySelector("#estado-carga"),
  error: document.querySelector("#estado-error"),
  vacio: document.querySelector("#estado-vacio"),
};

// Imagen alternativa (SVG incrustado) para libros sin portada
const PORTADA_ALTERNATIVA =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400">' +
      '<rect width="100%" height="100%" fill="#dfe6e3"/>' +
      '<text x="50%" y="50%" text-anchor="middle" fill="#2f5d50" font-size="22" font-family="sans-serif">Sin portada</text>' +
      "</svg>"
  );

// Muestra un solo estado a la vez: "carga" | "error" | "vacio" | "resultados"
export function mostrarEstado(nombre) {
  Object.entries(estados).forEach(([clave, elemento]) => {
    elemento.hidden = clave !== nombre;
  });
  if (nombre !== "resultados") {
    contenedorResultados.replaceChildren();
  }
}

export function mostrarError(mensaje) {
  estados.error.textContent = mensaje;
  mostrarEstado("error");
}

// Crea UN botón (lo usan las tarjetas y la lista)
function crearBoton(texto, accion, id, clases) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = `btn btn-sm ${clases}`;
  boton.textContent = texto;
  boton.dataset.accion = accion; // los lee la delegación de eventos
  boton.dataset.id = id;
  return boton;
}

// Crea UNA imagen de portada (con alternativa si no hay o si falla la carga)
function crearPortada(libro, clases) {
  const portada = document.createElement("img");
  portada.className = clases;
  portada.src = libro.portada ?? PORTADA_ALTERNATIVA;
  portada.alt = libro.portada ? `Portada de ${libro.titulo}` : "Libro sin portada";
  portada.loading = "lazy";
  portada.addEventListener(
    "error",
    () => { portada.src = PORTADA_ALTERNATIVA; },
    { once: true } // evita un bucle si la alternativa también fallara
  );
  return portada;
}

// Crea UNA tarjeta a partir de un libro
export function crearTarjeta(libro) {
  const columna = document.createElement("div");
  columna.className = "col";

  const tarjeta = document.createElement("article");
  tarjeta.className = "card h-100 shadow-sm libro-card";
  tarjeta.dataset.id = libro.id;

  const portada = crearPortada(libro, "card-img-top libro-card__portada");

  const cuerpo = document.createElement("div");
  cuerpo.className = "card-body";

  const titulo = document.createElement("h3");
  titulo.className = "card-title h6 libro-card__titulo";
  titulo.textContent = libro.titulo;

  const autores = document.createElement("p");
  autores.className = "card-text mb-1";
  autores.textContent = libro.autores.length ? libro.autores.join(", ") : "Autor desconocido";

  const anio = document.createElement("p");
  anio.className = "card-text small text-body-secondary mb-0";
  anio.textContent = libro.anio ? `Primera publicación: ${libro.anio}` : "Año desconocido";

  cuerpo.append(titulo, autores, anio);

  const pie = document.createElement("div");
  pie.className = "card-footer d-flex gap-2";
  pie.append(
    crearBoton("Ver detalle", "detalle", libro.id, "btn-outline-primary"),
    crearBoton("Agregar", "agregar", libro.id, "btn-primary")
  );

  tarjeta.append(portada, cuerpo, pie);
  columna.append(tarjeta);
  return columna;
}

export function mostrarResultados(libros) {
  mostrarEstado("resultados");
  contenedorResultados.replaceChildren(...libros.map(crearTarjeta));
}

// ---------- Lista de lecturas ----------

const cuerpoLista = document.querySelector("#lista-lecturas");
const mensajeListaVacia = document.querySelector("#lista-vacia");
const avisoLista = document.querySelector("#aviso-lista");

const CLASE_ESTADO = {
  Pendiente: "text-bg-secondary",
  Leyendo: "text-bg-warning",
  Leído: "text-bg-success",
};

function buscarFila(id) {
  return [...cuerpoLista.children].find((fila) => fila.dataset.id === id);
}

function actualizarMensajeVacio() {
  mensajeListaVacia.hidden = cuerpoLista.children.length > 0;
}

function crearInsignia(estado) {
  const insignia = document.createElement("span");
  insignia.className = `badge ${CLASE_ESTADO[estado]}`;
  insignia.textContent = estado;
  return insignia;
}

function crearFila(libro) {
  const fila = document.createElement("tr");
  fila.className = "fila-lectura";
  fila.dataset.id = libro.id;

  const celdaTitulo = document.createElement("td");
  celdaTitulo.textContent = libro.titulo;

  const celdaAutores = document.createElement("td");
  celdaAutores.textContent = libro.autores.length ? libro.autores.join(", ") : "Autor desconocido";

  const celdaEstado = document.createElement("td");
  celdaEstado.className = "celda-estado";
  celdaEstado.append(crearInsignia(libro.estado));

  const celdaAcciones = document.createElement("td");
  celdaAcciones.className = "text-end";
  const grupo = document.createElement("div");
  grupo.className = "d-flex gap-2 justify-content-end flex-wrap";
  grupo.append(
    crearBoton("Cambiar estado", "estado", libro.id, "btn-outline-primary"),
    crearBoton("Quitar", "quitar", libro.id, "btn-outline-danger")
  );
  celdaAcciones.append(grupo);

  fila.append(celdaTitulo, celdaAutores, celdaEstado, celdaAcciones);
  return fila;
}

// Agregar: la fila nace invisible y la clase se quita para que CSS anime la entrada
export function agregarFila(libro) {
  const fila = crearFila(libro);
  fila.classList.add("fila-lectura--entrando");
  cuerpoLista.append(fila);
  void fila.offsetWidth; // fuerza un reflow para que la transición arranque
  fila.classList.remove("fila-lectura--entrando");
  actualizarMensajeVacio();
}

// Cambiar estado: solo se reemplaza la insignia de ESA fila (actualización precisa)
export function actualizarFila(libro) {
  const fila = buscarFila(libro.id);
  if (!fila) return;
  fila.querySelector(".celda-estado").replaceChildren(crearInsignia(libro.estado));
  fila.classList.remove("fila-lectura--cambio");
  void fila.offsetWidth; // reinicia la animación si se pulsa varias veces seguidas
  fila.classList.add("fila-lectura--cambio");
  fila.addEventListener(
    "animationend",
    () => fila.classList.remove("fila-lectura--cambio"),
    { once: true }
  );
}

// Quitar: se anima la salida y la fila se retira del DOM al terminar la transición
export function quitarFila(id) {
  const fila = buscarFila(id);
  if (!fila || fila.classList.contains("fila-lectura--saliendo")) return;
  fila.classList.add("fila-lectura--saliendo");
  fila.addEventListener(
    "transitionend",
    () => {
      fila.remove();
      actualizarMensajeVacio();
    },
    { once: true }
  );
}

let temporizadorAviso;
export function mostrarAviso(mensaje) {
  avisoLista.textContent = mensaje;
  avisoLista.hidden = false;
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => { avisoLista.hidden = true; }, 3500);
}

// ---------- Modal de detalle ----------

const elementoModal = document.querySelector("#modal-detalle");
const tituloModal = document.querySelector("#modal-titulo");
const cuerpoModal = document.querySelector("#modal-cuerpo");
const botonModalAgregar = document.querySelector("#modal-agregar");

export function mostrarDetalle(libro) {
  tituloModal.textContent = libro.titulo;

  const fila = document.createElement("div");
  fila.className = "row g-3";

  const columnaImagen = document.createElement("div");
  columnaImagen.className = "col-12 col-sm-5";
  columnaImagen.append(crearPortada(libro, "img-fluid rounded"));

  const columnaTexto = document.createElement("div");
  columnaTexto.className = "col-12 col-sm-7";

  const autores = document.createElement("p");
  autores.className = "mb-2";
  autores.textContent = libro.autores.length ? libro.autores.join(", ") : "Autor desconocido";

  const anio = document.createElement("p");
  anio.className = "text-body-secondary mb-0";
  anio.textContent = libro.anio ? `Primera publicación: ${libro.anio}` : "Año de publicación desconocido";

  columnaTexto.append(autores, anio);
  fila.append(columnaImagen, columnaTexto);
  cuerpoModal.replaceChildren(fila);

  botonModalAgregar.dataset.id = libro.id;
  window.bootstrap.Modal.getOrCreateInstance(elementoModal).show();
}

export function cerrarDetalle() {
  window.bootstrap.Modal.getOrCreateInstance(elementoModal).hide();
}

// ---------- Resumen de lecturas ----------

const numerosResumen = document.querySelectorAll("#resumen-lecturas [data-estado]");

// Actualiza solo los tres números, sin reconstruir el panel
export function actualizarResumen(conteo) {
  numerosResumen.forEach((elemento) => {
    elemento.textContent = conteo[elemento.dataset.estado];
  });
}
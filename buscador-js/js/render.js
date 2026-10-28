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

// Muestra un solo estado a la vez: "carga" | "error" | "vacio" | "resultados" | "inicial"
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

// Función reutilizable que crea UN botón
function crearBoton(texto, accion, id, clases) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = `btn btn-sm ${clases}`;
  boton.textContent = texto;
  boton.dataset.accion = accion; // los usará la delegación de eventos (Paso 6)
  boton.dataset.id = id;
  return boton;
}

// Función reutilizable que crea UNA tarjeta a partir de un libro
export function crearTarjeta(libro) {
  const columna = document.createElement("div");
  columna.className = "col";

  const tarjeta = document.createElement("article");
  tarjeta.className = "card h-100 shadow-sm libro-card";

  const portada = document.createElement("img");
  portada.className = "card-img-top libro-card__portada";
  portada.src = libro.portada ?? PORTADA_ALTERNATIVA;
  portada.alt = libro.portada ? `Portada de ${libro.titulo}` : "Libro sin portada";
  portada.loading = "lazy";
  portada.addEventListener(
    "error",
    () => { portada.src = PORTADA_ALTERNATIVA; },
    { once: true } // evita un bucle si la alternativa también fallara
  );

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
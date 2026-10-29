// api.js: acceso a la API pública de Open Library (sin tocar el DOM)

const URL_BUSQUEDA = "https://openlibrary.org/search.json";
const URL_PORTADAS = "https://covers.openlibrary.org/b/id";

// Convierte un documento de la API en el objeto que usa nuestra app
function normalizarLibro(doc) {
  return {
    id: doc.key, // ej. "/works/OL45883W", identificador estable
    titulo: doc.title ?? "Sin título",
    autores: doc.author_name ?? [],
    anio: doc.first_publish_year ?? null,
    portada: doc.cover_i ? `${URL_PORTADAS}/${doc.cover_i}-M.jpg` : null,
  };
}

export async function buscarLibros(texto, limite = 12) {
  const parametros = new URLSearchParams({ q: texto, limit: limite });
  let respuesta;

  try {
    respuesta = await fetch(`${URL_BUSQUEDA}?${parametros}`);
  } catch (error) {
    // fetch solo rechaza la promesa ante fallos de red
    throw new Error("No se pudo conectar con Open Library. Revisa tu conexión a internet.");
  }

  // fetch NO rechaza ante 404 o 500: hay que revisar response.ok
  if (!respuesta.ok) {
    throw new Error(`Open Library respondió con un error (código ${respuesta.status}).`);
  }

  const datos = await respuesta.json();
  return datos.docs.map(normalizarLibro);
}
const URL_PROPUESTAS = "https://jsonplaceholder.typicode.com/posts";

// Envía la propuesta al servicio de pruebas (simula el registro)
export async function enviarPropuesta(propuesta) {
  let respuesta;

  try {
    respuesta = await fetch(URL_PROPUESTAS, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        title: propuesta.titulo,
        body: propuesta.motivo,
        userId: 1,
        ...propuesta,
      }),
    });
  } catch (error) {
    throw new Error("No se pudo conectar con el servicio de registro. Revisa tu conexión a internet.");
  }

  if (!respuesta.ok) {
    throw new Error(`El servicio rechazó la propuesta (código ${respuesta.status}).`);
  }

  return respuesta.json(); // el servicio devuelve lo enviado más un id simulado
}
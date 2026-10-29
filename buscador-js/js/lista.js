// lista.js: estado de la lista de lecturas en memoria (sin tocar el DOM)

export const ESTADOS = ["Pendiente", "Leyendo", "Leído"];

let lecturas = [];

export function existe(id) {
  return lecturas.some((libro) => libro.id === id);
}

// Devuelve el libro agregado, o null si ya estaba en la lista
export function agregar(libro) {
  if (existe(libro.id)) return null;
  const nuevo = { ...libro, estado: ESTADOS[0] };
  lecturas.push(nuevo);
  return nuevo;
}

// Pasa al siguiente estado (Pendiente → Leyendo → Leído → Pendiente)
export function siguienteEstado(id) {
  const libro = lecturas.find((l) => l.id === id);
  if (!libro) return null;
  libro.estado = ESTADOS[(ESTADOS.indexOf(libro.estado) + 1) % ESTADOS.length];
  return libro;
}

export function quitar(id) {
  lecturas = lecturas.filter((libro) => libro.id !== id);
}
// Cuenta cuántos libros hay en cada estado: { Pendiente: 0, Leyendo: 0, Leído: 0 }
export function contarPorEstado() {
  return ESTADOS.reduce((conteo, estado) => {
    conteo[estado] = lecturas.filter((libro) => libro.estado === estado).length;
    return conteo;
  }, {});
}
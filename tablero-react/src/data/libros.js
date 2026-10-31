// libros.js: datos iniciales del club (en esta parte no se consume ninguna API)

export const ESTADOS = ["Pendiente", "Leyendo", "Leído"];

export const GENEROS = [
  "Novela",
  "Cuento",
  "Poesía",
  "Ensayo",
  "Ciencia ficción",
  "Fantasía",
  "Historia",
  "Biografía",
  "Otro",
];

export const MIEMBROS = [
  { id: "m1", nombre: "Marcela Vargas" },
  { id: "m2", nombre: "Diego Rojas" },
  { id: "m3", nombre: "Sofía Jiménez" },
  { id: "m4", nombre: "Esteban Mora" },
];

export const LIBROS_INICIALES = [
  {
    id: "l1",
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    anio: 1967,
    paginas: 471,
    genero: "Novela",
    estado: "Leído",
    miembroId: "m1",
  },
  {
    id: "l2",
    titulo: "Mamita Yunai",
    autor: "Carlos Luis Fallas",
    anio: 1941,
    paginas: 280,
    genero: "Novela",
    estado: "Leyendo",
    miembroId: "m2",
  },
  {
    id: "l3",
    titulo: "Única mirando al mar",
    autor: "Fernando Contreras Castro",
    anio: 1993,
    paginas: 160,
    genero: "Novela",
    estado: "Pendiente",
    miembroId: "m3",
  },
  {
    id: "l4",
    titulo: "La casa de los espíritus",
    autor: "Isabel Allende",
    anio: 1982,
    paginas: 433,
    genero: "Novela",
    estado: "Pendiente",
    miembroId: "m1",
  },
  {
    id: "l5",
    titulo: "Rayuela",
    autor: "Julio Cortázar",
    anio: 1963,
    paginas: 600,
    genero: "Novela",
    estado: "Leyendo",
    miembroId: "m4",
  },
  {
    id: "l6",
    titulo: "Diario de una multitud",
    autor: "Carmen Naranjo",
    anio: 1974,
    paginas: 190,
    genero: "Novela",
    estado: "Leído",
    miembroId: "m3",
  },
];
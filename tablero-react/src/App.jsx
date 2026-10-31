import { LIBROS_INICIALES } from "./data/libros.js";

export default function App() {
  return (
    <main className="container py-4">
      <h1 className="h3">Tablero de lecturas del club</h1>
      <p>{LIBROS_INICIALES.length} libros cargados.</p>
      <button type="button" className="btn btn-primary">Prueba de Bootstrap</button>
    </main>
  );
}
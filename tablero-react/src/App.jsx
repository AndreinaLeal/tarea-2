import { useState } from "react";
import { ESTADOS, MIEMBROS, LIBROS_INICIALES } from "./data/libros.js";
import Panel from "./components/Panel/Panel.jsx";
import Resumen from "./components/Resumen/Resumen.jsx";
import Filtros from "./components/Filtros/Filtros.jsx";
import ListaLibros from "./components/ListaLibros/ListaLibros.jsx";
import FormularioLibro from "./components/FormularioLibro/FormularioLibro.jsx";

export default function App() {
  // Estado elevado: lo comparten Filtros, Resumen, ListaLibros y FormularioLibro
  const [libros, setLibros] = useState(LIBROS_INICIALES);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroMiembro, setFiltroMiembro] = useState("todos");

  // Valores derivados: se calculan en cada render, NO se guardan en un estado aparte
  const librosDelMiembro = libros.filter(
    (libro) => filtroMiembro === "todos" || libro.miembroId === filtroMiembro
  );
  const conteo = ESTADOS.reduce(
    (acumulado, estado) => ({
      ...acumulado,
      [estado]: librosDelMiembro.filter((libro) => libro.estado === estado).length,
    }),
    {}
  );
  const librosVisibles = librosDelMiembro.filter(
    (libro) => filtroEstado === "todos" || libro.estado === filtroEstado
  );

  // Actualizaciones inmutables: map, filter y spread, nunca push, splice ni asignación directa
  function cambiarEstado(id) {
    setLibros((actuales) =>
      actuales.map((libro) =>
        libro.id === id
          ? { ...libro, estado: ESTADOS[(ESTADOS.indexOf(libro.estado) + 1) % ESTADOS.length] }
          : libro
      )
    );
  }

  function quitarLibro(id) {
    setLibros((actuales) => actuales.filter((libro) => libro.id !== id));
  }

  function agregarLibro(datos) {
    setLibros((actuales) => [...actuales, { ...datos, id: crypto.randomUUID() }]);
    limpiarFiltros(); // así el libro nuevo se ve en la lista
  }

  function limpiarFiltros() {
    setFiltroEstado("todos");
    setFiltroMiembro("todos");
  }

  return (
    <div className="bg-body-tertiary min-vh-100">
      <header className="bg-primary text-white py-3 mb-4">
        <div className="container">
          <h1 className="h3 mb-0">Tablero de lecturas del club</h1>
          <p className="mb-0 small">Estantería Común</p>
        </div>
      </header>

      <main className="container pb-4">
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <Panel titulo="Resumen y filtros">
              <Resumen
                conteo={conteo}
                estadoActivo={filtroEstado}
                onSeleccionarEstado={setFiltroEstado}
              />
              <Filtros
                miembros={MIEMBROS}
                filtroEstado={filtroEstado}
                filtroMiembro={filtroMiembro}
                onCambiarEstado={setFiltroEstado}
                onCambiarMiembro={setFiltroMiembro}
                onLimpiar={limpiarFiltros}
              />
            </Panel>

            <Panel titulo={`Libros del club (${librosVisibles.length})`}>
              <ListaLibros
                libros={librosVisibles}
                miembros={MIEMBROS}
                onCambiarEstado={cambiarEstado}
                onQuitar={quitarLibro}
              />
            </Panel>
          </div>

          <div className="col-12 col-lg-4">
            <Panel titulo="Agregar un libro">
              <FormularioLibro miembros={MIEMBROS} onAgregar={agregarLibro} />
            </Panel>
          </div>
        </div>
      </main>
    </div>
  );
}
import LibroItem from "../LibroItem/LibroItem.jsx";

// ListaLibros: dibuja la lista, o un mensaje si ningún libro coincide con los filtros
export default function ListaLibros({ libros, miembros, onCambiarEstado, onQuitar }) {
  if (libros.length === 0) {
    return (
      <div className="alert alert-info mb-0" role="status">
        Ningún libro coincide con los filtros seleccionados.
      </div>
    );
  }

  return (
    <ul className="list-group">
      {libros.map((libro) => (
        <LibroItem
          key={libro.id}
          libro={libro}
          nombreMiembro={
            miembros.find((miembro) => miembro.id === libro.miembroId)?.nombre ?? "Miembro desconocido"
          }
          onCambiarEstado={onCambiarEstado}
          onQuitar={onQuitar}
        />
      ))}
    </ul>
  );
}
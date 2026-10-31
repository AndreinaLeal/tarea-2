const CLASE_ESTADO = { Pendiente: "pendiente", Leyendo: "leyendo", Leído: "leido" };
const CLASE_INSIGNIA = {
  Pendiente: "text-bg-secondary",
  Leyendo: "text-bg-warning",
  Leído: "text-bg-success",
};

// LibroItem: un libro de la lista, con sus dos acciones
export default function LibroItem({ libro, nombreMiembro, onCambiarEstado, onQuitar }) {
  return (
    <li
      className={`list-group-item libro-item libro-item--${CLASE_ESTADO[libro.estado]} d-flex flex-column flex-md-row gap-2 justify-content-between align-items-md-center`}
    >
      <div>
        <h3 className="h6 mb-1">{libro.titulo}</h3>
        <p className="mb-1 small text-body-secondary">
          {libro.autor} · {libro.anio} · {libro.paginas} págs. · {libro.genero}
        </p>
        <p className="mb-0 small">
          Propuesto por <strong>{nombreMiembro}</strong>
        </p>
      </div>

      <div className="d-flex align-items-center gap-2 flex-wrap">
        <span className={`badge ${CLASE_INSIGNIA[libro.estado]}`}>{libro.estado}</span>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => onCambiarEstado(libro.id)}
        >
          Cambiar estado
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => onQuitar(libro.id)}
        >
          Quitar
        </button>
      </div>
    </li>
  );
}
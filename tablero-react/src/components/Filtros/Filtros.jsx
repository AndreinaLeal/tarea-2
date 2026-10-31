import { ESTADOS } from "../../data/libros.js";

// Filtros: dos selects controlados por el estado que vive en App
export default function Filtros({
  miembros,
  filtroEstado,
  filtroMiembro,
  onCambiarEstado,
  onCambiarMiembro,
  onLimpiar,
}) {
  return (
    <div className="row g-3 align-items-end">
      <div className="col-12 col-sm-5">
        <label htmlFor="filtro-estado" className="form-label">Estado</label>
        <select
          id="filtro-estado"
          className="form-select"
          value={filtroEstado}
          onChange={(evento) => onCambiarEstado(evento.target.value)}
        >
          <option value="todos">Todos</option>
          {ESTADOS.map((estado) => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
      </div>

      <div className="col-12 col-sm-5">
        <label htmlFor="filtro-miembro" className="form-label">Miembro que propuso</label>
        <select
          id="filtro-miembro"
          className="form-select"
          value={filtroMiembro}
          onChange={(evento) => onCambiarMiembro(evento.target.value)}
        >
          <option value="todos">Todos</option>
          {miembros.map((miembro) => (
            <option key={miembro.id} value={miembro.id}>{miembro.nombre}</option>
          ))}
        </select>
      </div>

      <div className="col-12 col-sm-2">
        <button type="button" className="btn btn-outline-secondary w-100" onClick={onLimpiar}>
          Limpiar
        </button>
      </div>
    </div>
  );
}
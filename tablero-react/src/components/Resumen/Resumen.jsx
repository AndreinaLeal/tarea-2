import { ESTADOS } from "../../data/libros.js";

const CLASE = { Pendiente: "pendiente", Leyendo: "leyendo", Leído: "leido" };
const ETIQUETA = { Pendiente: "Pendientes", Leyendo: "Leyendo", Leído: "Leídos" };

// Resumen: cantidad de libros por estado. No guarda nada: todo llega por props.
export default function Resumen({ conteo, estadoActivo, onSeleccionarEstado }) {
  return (
    <div className="resumen mb-3" role="group" aria-label="Resumen de lecturas por estado">
      {ESTADOS.map((estado) => {
        const activo = estadoActivo === estado;
        return (
          <button
            key={estado}
            type="button"
            className={`resumen__item resumen__item--${CLASE[estado]}${activo ? " is-activo" : ""}`}
            aria-pressed={activo}
            onClick={() => onSeleccionarEstado(activo ? "todos" : estado)}
          >
            <span className="resumen__numero">{conteo[estado]}</span>
            <span className="resumen__etiqueta">{ETIQUETA[estado]}</span>
          </button>
        );
      })}
    </div>
  );
}
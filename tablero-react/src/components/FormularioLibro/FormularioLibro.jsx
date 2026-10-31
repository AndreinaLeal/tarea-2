import { useState } from "react";
import { GENEROS } from "../../data/libros.js";
import Campo from "../Campo/Campo.jsx";

const VALORES_VACIOS = {
  titulo: "",
  autor: "",
  anio: "",
  paginas: "",
  genero: "",
  miembroId: "",
};

// Devuelve un objeto { campo: "mensaje" } solo con los campos inválidos
function validar(valores) {
  const errores = {};
  const anioActual = new Date().getFullYear();

  if (valores.titulo.trim().length < 2) {
    errores.titulo = "Escribe el título (mínimo 2 caracteres).";
  }

  if (valores.autor.trim().length < 2) {
    errores.autor = "Escribe el nombre del autor (mínimo 2 caracteres).";
  } else if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ .'-]+$/.test(valores.autor.trim())) {
    errores.autor = "Usa solo letras, espacios, puntos, apóstrofes y guiones.";
  }

  if (valores.anio === "") {
    errores.anio = "Indica el año de publicación.";
  } else if (!Number.isInteger(Number(valores.anio)) || Number(valores.anio) < 1000) {
    errores.anio = "Escribe un año válido (número entero desde 1000).";
  } else if (Number(valores.anio) > anioActual) {
    errores.anio = `El año no puede ser futuro (máximo ${anioActual}).`;
  }

  if (valores.paginas === "") {
    errores.paginas = "Indica la cantidad de páginas.";
  } else if (
    !Number.isInteger(Number(valores.paginas)) ||
    Number(valores.paginas) < 1 ||
    Number(valores.paginas) > 5000
  ) {
    errores.paginas = "Escribe un número entero de páginas entre 1 y 5000.";
  }

  if (!valores.genero) {
    errores.genero = "Selecciona un género.";
  }

  if (!valores.miembroId) {
    errores.miembroId = "Selecciona quién propone el libro.";
  }

  return errores;
}

// FormularioLibro: formulario controlado. Cada campo lee su valor del estado.
export default function FormularioLibro({ miembros, onAgregar }) {
  const [valores, setValores] = useState(VALORES_VACIOS);
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState(false);

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    const nuevosValores = { ...valores, [name]: value };
    setValores(nuevosValores);
    setExito(false);
    // Si el campo ya tenía error, se revalida mientras la persona escribe
    if (errores[name]) {
      setErrores({ ...errores, [name]: validar(nuevosValores)[name] });
    }
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    const nuevosErrores = validar(valores);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    onAgregar({
      titulo: valores.titulo.trim(),
      autor: valores.autor.trim(),
      anio: Number(valores.anio),
      paginas: Number(valores.paginas),
      genero: valores.genero,
      miembroId: valores.miembroId,
      estado: "Pendiente",
    });
    setValores(VALORES_VACIOS);
    setExito(true);
  }

  // Props comunes de cada control (valor, evento y accesibilidad)
  function propsDe(nombre) {
    return {
      id: nombre,
      name: nombre,
      value: valores[nombre],
      onChange: manejarCambio,
      "aria-invalid": errores[nombre] ? "true" : "false",
      "aria-describedby": errores[nombre] ? `${nombre}-error` : undefined,
    };
  }

  function clase(nombre, base = "form-control") {
    return errores[nombre] ? `${base} is-invalid` : base;
  }

  return (
    <form onSubmit={manejarEnvio} noValidate>
      {exito && (
        <div className="alert alert-success" role="status">
          Libro agregado a la lista como Pendiente.
        </div>
      )}

      <Campo id="titulo" etiqueta="Título" error={errores.titulo}>
        <input type="text" className={clase("titulo")} {...propsDe("titulo")} />
      </Campo>

      <Campo id="autor" etiqueta="Autor" error={errores.autor}>
        <input type="text" className={clase("autor")} {...propsDe("autor")} />
      </Campo>

      <div className="row">
        <div className="col-6">
          <Campo id="anio" etiqueta="Año" error={errores.anio}>
            <input type="number" inputMode="numeric" className={clase("anio")} {...propsDe("anio")} />
          </Campo>
        </div>
        <div className="col-6">
          <Campo id="paginas" etiqueta="Páginas" error={errores.paginas}>
            <input type="number" inputMode="numeric" className={clase("paginas")} {...propsDe("paginas")} />
          </Campo>
        </div>
      </div>

      <Campo id="genero" etiqueta="Género" error={errores.genero}>
        <select className={clase("genero", "form-select")} {...propsDe("genero")}>
          <option value="">Selecciona un género</option>
          {GENEROS.map((genero) => (
            <option key={genero} value={genero}>{genero}</option>
          ))}
        </select>
      </Campo>

      <Campo id="miembroId" etiqueta="Propone" error={errores.miembroId}>
        <select className={clase("miembroId", "form-select")} {...propsDe("miembroId")}>
          <option value="">Selecciona un miembro</option>
          {miembros.map((miembro) => (
            <option key={miembro.id} value={miembro.id}>{miembro.nombre}</option>
          ))}
        </select>
      </Campo>

      <button type="submit" className="btn btn-primary w-100">Agregar libro</button>
    </form>
  );
}
import { buscarLibros } from "./api.js";
import { mostrarEstado, mostrarError, mostrarResultados } from "./render.js";

const formulario = document.querySelector("#form-busqueda");
const campo = document.querySelector("#campo-busqueda");
const errorBusqueda = document.querySelector("#error-busqueda");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  // Validación del campo con la API de validación de restricciones
  if (!campo.checkValidity()) {
    campo.classList.add("is-invalid");
    errorBusqueda.textContent = "Escribe al menos 2 caracteres para buscar.";
    return;
  }
  campo.classList.remove("is-invalid");

  mostrarEstado("carga");
  try {
    const libros = await buscarLibros(campo.value.trim());
    if (libros.length === 0) {
      mostrarEstado("vacio");
    } else {
      mostrarResultados(libros);
    }
  } catch (error) {
    mostrarError(error.message);
  }
});
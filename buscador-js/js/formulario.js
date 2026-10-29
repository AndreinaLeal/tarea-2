// formulario.js: validación, autores dinámicos y envío del formulario de propuesta

import { enviarPropuesta } from "./api.js";

const MIN_AUTORES = 1;
const MAX_AUTORES = 5;

const formulario = document.querySelector("#form-propuesta");
const contenedorAutores = document.querySelector("#autores");
const plantillaAutor = document.querySelector("#plantilla-autor");
const botonAgregarAutor = document.querySelector("#agregar-autor");
const botonEnviar = document.querySelector("#boton-enviar");
const alerta = document.querySelector("#alerta-formulario");

const OBLIGATORIO = {
  titulo: "Escribe el título del libro.",
  autor: "Escribe el nombre del autor o quita este campo.",
  anio: "Indica el año de publicación.",
  paginas: "Indica la cantidad de páginas.",
  genero: "Selecciona un género.",
  correo: "Escribe tu correo para que el club pueda contactarte.",
  fecha: "Elige la fecha propuesta para la sesión.",
  motivo: "Cuéntanos por qué propones este libro.",
};

// Fecha de hoy en formato AAAA-MM-DD usando la hora LOCAL
// (toISOString usa UTC y en Costa Rica daría "mañana" en la noche)
function hoyLocal() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// ---------- Mensajes personalizados ----------
function mensajePara(campo) {
  const v = campo.validity;
  if (v.customError) return campo.validationMessage; // reglas propias de JavaScript
  if (v.valueMissing) return OBLIGATORIO[campo.name] ?? "Este campo es obligatorio.";
  if (v.typeMismatch) return "Escribe un correo válido, por ejemplo nombre@dominio.com.";
  if (v.badInput) return "Escribe un valor válido.";
  if (v.tooShort) return `Escribe al menos ${campo.minLength} caracteres (llevas ${campo.value.length}).`;
  if (v.tooLong) return `No puede superar los ${campo.maxLength} caracteres.`;
  if (v.patternMismatch) return "Usa solo letras, espacios, puntos, apóstrofes y guiones.";
  if (v.rangeUnderflow) return `El valor mínimo es ${campo.min}.`;
  if (v.rangeOverflow) return `El valor máximo es ${campo.max}.`;
  if (v.stepMismatch) return "Escribe un número entero.";
  return campo.validationMessage;
}

function mostrarMensaje(campo, texto) {
  const feedback = campo.parentElement.querySelector(".invalid-feedback");
  feedback.textContent = texto;
  campo.classList.toggle("is-invalid", texto !== "");
}

// ---------- Validación de UN campo (sirve igual para originales y agregados) ----------
function validarCampo(campo) {
  campo.setCustomValidity(""); // siempre se limpia la regla anterior

  if (campo.value !== "" && campo.value.trim() === "") {
    campo.setCustomValidity("No puede contener solo espacios.");
  }
  if (campo.name === "anio" && campo.value !== "" && Number(campo.value) > new Date().getFullYear()) {
    campo.setCustomValidity(`El año de publicación no puede ser futuro (máximo ${new Date().getFullYear()}).`);
  }
  if (campo.name === "fecha" && campo.value !== "" && campo.value < hoyLocal()) {
    campo.setCustomValidity("La fecha de la sesión no puede ser anterior a hoy.");
  }

  const valido = campo.checkValidity();
  mostrarMensaje(campo, valido ? "" : mensajePara(campo));
  return valido;
}

// ---------- Autores dinámicos (mínimo 1, máximo 5) ----------
function actualizarControlesAutores() {
  const filas = [...contenedorAutores.children];
  botonAgregarAutor.disabled = filas.length >= MAX_AUTORES;
  filas.forEach((fila, indice) => {
    fila.querySelector("input").setAttribute("aria-label", `Autor ${indice + 1}`);
    fila.querySelector('[data-accion="quitar-autor"]').disabled = filas.length <= MIN_AUTORES;
  });
}

function agregarCampoAutor() {
  if (contenedorAutores.children.length >= MAX_AUTORES) return;
  contenedorAutores.append(plantillaAutor.content.cloneNode(true));
  actualizarControlesAutores();
}

function quitarCampoAutor(fila) {
  if (contenedorAutores.children.length <= MIN_AUTORES) return;
  fila.remove();
  actualizarControlesAutores();
}

function reiniciarAutores() {
  contenedorAutores.replaceChildren();
  agregarCampoAutor();
}

// ---------- Alerta de éxito o error ----------
function mostrarAlerta(tipo, mensaje) {
  alerta.className = `alert alert-${tipo}`;
  alerta.textContent = mensaje;
  alerta.hidden = false;
}

// ---------- Envío ----------
function leerPropuesta() {
  const datos = new FormData(formulario);
  return {
    titulo: datos.get("titulo").trim(),
    autores: datos.getAll("autor").map((autor) => autor.trim()),
    anio: Number(datos.get("anio")),
    paginas: Number(datos.get("paginas")),
    genero: datos.get("genero"),
    correo: datos.get("correo").trim(),
    fecha: datos.get("fecha"),
    motivo: datos.get("motivo").trim(),
  };
}

async function manejarEnvio(evento) {
  evento.preventDefault(); // sin recargar la página

  const campos = [...formulario.querySelectorAll("input, select, textarea")];
  const resultados = campos.map(validarCampo); // valida TODOS, no se detiene en el primero
  if (resultados.includes(false)) {
    campos.find((campo) => campo.classList.contains("is-invalid")).focus();
    mostrarAlerta("danger", "Revisa los campos marcados antes de enviar.");
    return;
  }

  botonEnviar.disabled = true;
  botonEnviar.textContent = "Enviando...";
  try {
    const respuesta = await enviarPropuesta(leerPropuesta());
    mostrarAlerta("success", `¡Propuesta registrada! Número de referencia: ${respuesta.id}.`);
    formulario.reset();
    reiniciarAutores();
    formulario.querySelectorAll(".is-invalid").forEach((campo) => mostrarMensaje(campo, ""));
  } catch (error) {
    mostrarAlerta("danger", error.message);
  } finally {
    botonEnviar.disabled = false;
    botonEnviar.textContent = "Enviar propuesta";
  }
}

// ---------- Inicio ----------
export function iniciarFormulario() {
  // Límites que dependen de la fecha actual
  formulario.querySelector("#anio").max = new Date().getFullYear();
  formulario.querySelector("#fecha").min = hoyLocal();

  agregarCampoAutor();
  botonAgregarAutor.addEventListener("click", agregarCampoAutor);

  // Delegación: UNA escucha para todos los botones "Quitar" de autores
  contenedorAutores.addEventListener("click", (evento) => {
    const boton = evento.target.closest('[data-accion="quitar-autor"]');
    if (boton) quitarCampoAutor(boton.closest(".autor-fila"));
  });

  // Delegación de validación: al salir de un campo se valida;
  // si ya tenía error, se revalida mientras el usuario escribe
  const esCampo = (elemento) => elemento.matches("input, select, textarea");
  formulario.addEventListener("focusout", (evento) => {
    if (esCampo(evento.target)) validarCampo(evento.target);
  });
  ["input", "change"].forEach((tipo) => {
    formulario.addEventListener(tipo, (evento) => {
      if (esCampo(evento.target) && evento.target.classList.contains("is-invalid")) {
        validarCampo(evento.target);
      }
    });
  });

  formulario.addEventListener("submit", manejarEnvio);
}
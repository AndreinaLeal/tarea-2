import { buscarLibros } from "./api.js";
import * as lista from "./lista.js";
import { iniciarFormulario } from "./formulario.js";
import {
  mostrarEstado, mostrarError, mostrarResultados,
  mostrarDetalle, cerrarDetalle,
  agregarFila, actualizarFila, quitarFila, mostrarAviso,
  actualizarResumen,
} from "./render.js";

const formulario = document.querySelector("#form-busqueda");
const campo = document.querySelector("#campo-busqueda");
const errorBusqueda = document.querySelector("#error-busqueda");
const contenedorResultados = document.querySelector("#resultados");
const cuerpoLista = document.querySelector("#lista-lecturas");
const botonModalAgregar = document.querySelector("#modal-agregar");

let ultimosResultados = [];

// ---------- Búsqueda ----------
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  if (!campo.checkValidity()) {
    campo.classList.add("is-invalid");
    errorBusqueda.textContent = "Escribe al menos 2 caracteres para buscar.";
    return;
  }
  campo.classList.remove("is-invalid");

  mostrarEstado("carga");
  try {
    ultimosResultados = await buscarLibros(campo.value.trim());
    if (ultimosResultados.length === 0) {
      mostrarEstado("vacio");
    } else {
      mostrarResultados(ultimosResultados);
    }
  } catch (error) {
    mostrarError(error.message);
  }
});

// ---------- Acciones ----------
function agregarALista(id) {
  const libro = ultimosResultados.find((l) => l.id === id);
  if (!libro) return;
  const nuevo = lista.agregar(libro);
  if (!nuevo) {
    mostrarAviso(`"${libro.titulo}" ya está en tu lista de lecturas.`);
    return;
  }
  agregarFila(nuevo);
  actualizarResumen(lista.contarPorEstado());
}

function abrirDetalle(id) {
  const libro = ultimosResultados.find((l) => l.id === id);
  if (libro) mostrarDetalle(libro);
}

// ---------- Delegación: UNA sola escucha en el contenedor de resultados ----------
contenedorResultados.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion]");

  if (boton && evento.currentTarget.contains(boton)) {
    // El clic en un botón NO debe abrir además el detalle de la tarjeta
    evento.stopPropagation();
    const { accion, id } = boton.dataset;
    if (accion === "agregar") agregarALista(id);
    if (accion === "detalle") abrirDetalle(id);
    return;
  }

  // Clic en cualquier otra parte de la tarjeta: abre el detalle
  const tarjeta = evento.target.closest(".libro-card");
  if (tarjeta) abrirDetalle(tarjeta.dataset.id);
});

// ---------- Delegación: UNA sola escucha en la lista de lecturas ----------
cuerpoLista.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton || !evento.currentTarget.contains(boton)) return;

  const { accion, id } = boton.dataset;
  if (accion === "estado") {
    const libro = lista.siguienteEstado(id);
    if (libro) actualizarFila(libro);
  } else if (accion === "quitar") {
    lista.quitar(id);
    quitarFila(id);
  }
  actualizarResumen(lista.contarPorEstado());
});

// ---------- Botón del modal ----------
botonModalAgregar.addEventListener("click", (evento) => {
  agregarALista(evento.currentTarget.dataset.id);
  cerrarDetalle();
});

// ---------- Formulario de propuesta ----------
iniciarFormulario();
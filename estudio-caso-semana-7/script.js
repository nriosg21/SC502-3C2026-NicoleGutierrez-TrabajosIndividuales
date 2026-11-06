
// ESTUDIO DE CASO - SEMANA 7
// Sistema de registro de estudiantes

// Lista inicial de estudiantes
const estudiantes = [
    { nombre: "María", apellidos: "Mora Pérez", nota: 90 },
    { nombre: "Pedro", apellidos: "Sibaja López", nota: 60 },
    { nombre: "Marco", apellidos: "Rojas Castro", nota: 78 }
];

// Obtener elementos del DOM
const formulario = document.getElementById("formEstudiante");
const nombreInput = document.getElementById("nombre");
const apellidosInput = document.getElementById("apellidos");
const notaInput = document.getElementById("nota");

const tabla = document.getElementById("tablaEstudiantes");
const mensajeError = document.getElementById("mensajeError");
const mensajeExito = document.getElementById("mensajeExito");

const mejorEstudiante = document.getElementById("mejorEstudiante");
const promedioNotas = document.getElementById("promedioNotas");
const notaMinima = document.getElementById("notaMinima");

const totalEstudiantes = document.getElementById("totalEstudiantes");
const promedioIndicador = document.getElementById("promedioIndicador");
const maximaIndicador = document.getElementById("maximaIndicador");

// Mostrar mensajes en el DOM
function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.hidden = false;
    mensajeExito.hidden = true;
}

function mostrarExito(mensaje) {
    mensajeExito.textContent = mensaje;
    mensajeExito.hidden = false;
    mensajeError.hidden = true;
}

// Crear y actualizar la tabla
function actualizarTabla() {
    tabla.innerHTML = "";

    estudiantes.forEach(estudiante => {
        const fila = document.createElement("tr");

        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = estudiante.nombre;

        const celdaApellidos = document.createElement("td");
        celdaApellidos.textContent = estudiante.apellidos;

        const celdaNota = document.createElement("td");
        celdaNota.textContent = estudiante.nota;

        // Aplicar estilos condicionales con clases CSS
        if (estudiante.nota >= 80) {
            celdaNota.classList.add("nota-alta");
        } else if (estudiante.nota < 65) {
            celdaNota.classList.add("nota-baja");
        }

        fila.appendChild(celdaNombre);
        fila.appendChild(celdaApellidos);
        fila.appendChild(celdaNota);

        tabla.appendChild(fila);
    });
}

// Calcular y mostrar el resumen
function actualizarResumen() {
    let suma = 0;
    let mayor = estudiantes[0];
    let menor = estudiantes[0];

    estudiantes.forEach(estudiante => {
        suma += estudiante.nota;

        if (estudiante.nota > mayor.nota) {
            mayor = estudiante;
        }

        if (estudiante.nota < menor.nota) {
            menor = estudiante;
        }
    });

    const promedio = suma / estudiantes.length;

    mejorEstudiante.textContent =
        `${mayor.nombre} ${mayor.apellidos} — ${mayor.nota}`;

    promedioNotas.textContent = promedio.toFixed(2);
    notaMinima.textContent = menor.nota;

    // Actualizar indicadores superiores
    totalEstudiantes.textContent = estudiantes.length;
    promedioIndicador.textContent = promedio.toFixed(2);
    maximaIndicador.textContent = mayor.nota;
}

// Validar y agregar estudiantes
function agregarEstudiante(evento) {
    evento.preventDefault();

    const nombre = nombreInput.value.trim();
    const apellidos = apellidosInput.value.trim();
    const notaTexto = notaInput.value.trim();

    // Validación de campos obligatorios
    if (nombre === "" || apellidos === "" || notaTexto === "") {
        mostrarError("Todos los campos son obligatorios.");
        return;
    }

    const nota = Number(notaTexto);

    // Validación del rango numérico
    if (!Number.isFinite(nota) || nota < 0 || nota > 100) {
        mostrarError("La nota debe ser un número entre 0 y 100.");
        return;
    }

    // Crear estudiante
    const nuevoEstudiante = {
        nombre: nombre,
        apellidos: apellidos,
        nota: nota
    };

    // Agregar al arreglo
    estudiantes.push(nuevoEstudiante);

    // Actualizar el DOM sin recargar
    actualizarTabla();
    actualizarResumen();

    // Limpiar campos
    formulario.reset();

    mostrarExito("Estudiante agregado correctamente.");

    nombreInput.focus();
}

// Evento del formulario
formulario.addEventListener("submit", agregarEstudiante);

// Cargar los tres estudiantes iniciales
actualizarTabla();
actualizarResumen();


// PRÁCTICA PROGRAMADA #3
// Frontend del API de estudiantes

const API = "/api/estudiantes";

const formulario = document.getElementById("formulario");
const nombreInput = document.getElementById("nombre");
const carreraInput = document.getElementById("carrera");
const notaInput = document.getElementById("nota");

const tabla = document.getElementById("tabla");
const mensaje = document.getElementById("mensaje");
const buscar = document.getElementById("buscar");

const guardar = document.getElementById("guardar");
const cancelar = document.getElementById("cancelar");
const actualizar = document.getElementById("actualizar");

let estudiantes = [];
let idEditando = null;

// Mostrar mensajes al usuario
function mostrarMensaje(texto, error = false) {
    mensaje.textContent = texto;
    mensaje.className = error ? "error" : "success";
}

// Solicitudes a la API
async function solicitar(url, opciones = {}) {
    const respuesta = await fetch(url, opciones);
    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.error || "Error en la solicitud");
    }

    return datos;
}

// GET: Consultar estudiantes
async function cargarEstudiantes() {
    try {
        estudiantes = await solicitar(API);

        mostrarTabla();
        actualizarEstadisticas();

    } catch (error) {
        mostrarMensaje(
            "No se pudo consultar la API: " + error.message,
            true
        );

        tabla.innerHTML =
            '<tr><td colspan="6" class="empty">Error de conexión</td></tr>';
    }
}

// Crear celdas de forma segura
function crearCelda(texto) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    return celda;
}

// Mostrar registros en la tabla
function mostrarTabla() {
    tabla.innerHTML = "";

    const texto = buscar.value.toLowerCase().trim();

    const filtrados = estudiantes.filter(e =>
        e.nombre.toLowerCase().includes(texto) ||
        e.carrera.toLowerCase().includes(texto)
    );

    if (filtrados.length === 0) {
        const fila = document.createElement("tr");
        const celda = crearCelda("No hay estudiantes para mostrar.");

        celda.colSpan = 6;
        celda.className = "empty";

        fila.appendChild(celda);
        tabla.appendChild(fila);
        return;
    }

    filtrados.forEach(estudiante => {
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(estudiante.id));
        fila.appendChild(crearCelda(estudiante.nombre));
        fila.appendChild(crearCelda(estudiante.carrera));
        fila.appendChild(crearCelda(estudiante.nota));

        const estado = document.createElement("td");

        const aprobado = estudiante.nota >= 70;

        estado.textContent = aprobado ? "Aprobado" : "Reprobado";
        estado.className = aprobado ? "approved" : "failed";

        fila.appendChild(estado);

        const acciones = document.createElement("td");
        const contenedor = document.createElement("div");

        contenedor.className = "actions";

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.className = "edit";

        btnEditar.addEventListener("click", () => {
            editarEstudiante(estudiante.id);
        });

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "delete";

        btnEliminar.addEventListener("click", () => {
            eliminarEstudiante(estudiante.id);
        });

        contenedor.append(btnEditar, btnEliminar);
        acciones.appendChild(contenedor);

        fila.appendChild(acciones);
        tabla.appendChild(fila);
    });
}

// Calcular estadísticas
function actualizarEstadisticas() {
    const total = estudiantes.length;

    const aprobados = estudiantes.filter(
        e => e.nota >= 70
    ).length;

    const suma = estudiantes.reduce(
        (acumulado, e) => acumulado + e.nota,
        0
    );

    const promedio = total > 0 ? suma / total : 0;

    document.getElementById("total").textContent = total;
    document.getElementById("aprobados").textContent = aprobados;
    document.getElementById("promedio").textContent =
        promedio.toFixed(2);
}

// POST y PUT: Registrar o modificar
async function guardarEstudiante(evento) {
    evento.preventDefault();

    const nombre = nombreInput.value.trim();
    const carrera = carreraInput.value;
    const notaTexto = notaInput.value.trim();
    const nota = Number(notaTexto);

    if (!nombre || !carrera || notaTexto === "") {
        mostrarMensaje("Todos los campos son obligatorios.", true);
        return;
    }

    if (!Number.isFinite(nota) || nota < 0 || nota > 100) {
        mostrarMensaje("La nota debe estar entre 0 y 100.", true);
        return;
    }

    const datos = { nombre, carrera, nota };

    const editando = idEditando !== null;

    const url = editando ? `${API}/${idEditando}` : API;
    const metodo = editando ? "PUT" : "POST";

    guardar.disabled = true;

    try {
        await solicitar(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        limpiarFormulario();

        await cargarEstudiantes();

        mostrarMensaje(
            editando
                ? "Estudiante actualizado correctamente."
                : "Estudiante registrado correctamente."
        );

    } catch (error) {
        mostrarMensaje(error.message, true);
    } finally {
        guardar.disabled = false;
    }
}

// Preparar formulario para editar
function editarEstudiante(id) {
    const estudiante = estudiantes.find(e => e.id === id);

    if (!estudiante) return;

    idEditando = id;

    nombreInput.value = estudiante.nombre;
    carreraInput.value = estudiante.carrera;
    notaInput.value = estudiante.nota;

    document.getElementById("tituloForm").textContent =
        "Editar estudiante";

    guardar.textContent = "Guardar cambios";
    cancelar.hidden = false;

    formulario.scrollIntoView({ behavior: "smooth" });
    nombreInput.focus();
}

// DELETE: Eliminar estudiante
async function eliminarEstudiante(id) {
    const estudiante = estudiantes.find(e => e.id === id);

    if (!estudiante) return;

    const confirmado = confirm(
        `¿Deseás eliminar a ${estudiante.nombre}?`
    );

    if (!confirmado) return;

    try {
        await solicitar(`${API}/${id}`, {
            method: "DELETE"
        });

        if (idEditando === id) {
            limpiarFormulario();
        }

        await cargarEstudiantes();

        mostrarMensaje("Estudiante eliminado correctamente.");

    } catch (error) {
        mostrarMensaje(error.message, true);
    }
}

// Limpiar formulario
function limpiarFormulario() {
    formulario.reset();
    idEditando = null;

    document.getElementById("tituloForm").textContent =
        "Registrar estudiante";

    guardar.textContent = "Guardar estudiante";
    cancelar.hidden = true;
}

// Eventos
formulario.addEventListener("submit", guardarEstudiante);

cancelar.addEventListener("click", () => {
    limpiarFormulario();
    mostrarMensaje("");
});

actualizar.addEventListener("click", cargarEstudiantes);

buscar.addEventListener("input", mostrarTabla);

// Iniciar aplicación
cargarEstudiantes();

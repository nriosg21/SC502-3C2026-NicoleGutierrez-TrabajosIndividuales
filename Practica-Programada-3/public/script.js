
 // PRÁCTICA PROGRAMADA #3
 // CampusFlow - Frontend del API de estudiantes

 const API = new URL("/api/estudiantes", window.location.origin).href;

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

 // Mostrar mensajes
 function mostrarMensaje(texto, error = false) {
     mensaje.textContent = texto;
     mensaje.className = error ? "error" : "success";
 }

 // Comunicación con la API
 async function solicitar(url, opciones = {}) {
     let respuesta;

     try {
         respuesta = await fetch(url, {
             ...opciones,
             headers: {
                 "Accept": "application/json",
                 ...(opciones.headers || {})
             }
         });
     } catch (error) {
         throw new Error(
             "No se pudo conectar con la API. " +
             "Verificá que el servidor esté encendido. " +
             "Detalle: " + error.message
         );
     }

     const contenido = await respuesta.text();
     let datos = null;

     if (contenido.trim()) {
         try {
             datos = JSON.parse(contenido);
         } catch {
             throw new Error(
                 "El servidor no devolvió JSON válido. " +
                 "Revisá la dirección de la API."
             );
         }
     }

     if (!respuesta.ok) {
         const detalle =
             datos && typeof datos === "object"
                 ? datos.error || datos.message
                 : null;

         throw new Error(
             detalle ||
             `Error HTTP ${respuesta.status}: ${respuesta.statusText}`
         );
     }

     return datos;
 }

 // GET - Consultar estudiantes
 async function cargarEstudiantes() {
     try {
         const datos = await solicitar(API);

         if (Array.isArray(datos)) {
             estudiantes = datos;
         } else if (datos && Array.isArray(datos.estudiantes)) {
             estudiantes = datos.estudiantes;
         } else {
             throw new Error(
                 "La API no devolvió una lista de estudiantes."
             );
         }

         mostrarTabla();
         actualizarEstadisticas();

         return true;

     } catch (error) {
         console.error("Error al consultar estudiantes:", error);

         estudiantes = [];

         mostrarMensaje(
             "No se pudo consultar la API: " + error.message,
             true
         );

         tabla.innerHTML =
             '<tr><td colspan="6" class="empty">' +
             'Error de conexión con la API' +
             '</td></tr>';

         actualizarEstadisticas();
         return false;
     }
 }

 // Crear celdas seguras
 function crearCelda(texto) {
     const celda = document.createElement("td");
     celda.textContent = texto ?? "";
     return celda;
 }

 // Mostrar estudiantes
 function mostrarTabla() {
     tabla.innerHTML = "";

     const texto = buscar.value.toLowerCase().trim();

     const filtrados = estudiantes.filter(e => {
         const nombre = String(e.nombre ?? "").toLowerCase();
         const carrera = String(e.carrera ?? "").toLowerCase();

         return nombre.includes(texto) || carrera.includes(texto);
     });

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
         const aprobado = Number(estudiante.nota) >= 70;

         estado.textContent = aprobado ? "Aprobado" : "Reprobado";
         estado.className = aprobado ? "approved" : "failed";

         fila.appendChild(estado);

         const acciones = document.createElement("td");
         const contenedor = document.createElement("div");

         contenedor.className = "actions";

         const btnEditar = document.createElement("button");
         btnEditar.type = "button";
         btnEditar.textContent = "Editar";
         btnEditar.className = "edit";

         btnEditar.addEventListener("click", () => {
             editarEstudiante(estudiante.id);
         });

         const btnEliminar = document.createElement("button");
         btnEliminar.type = "button";
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

 // Estadísticas
 function actualizarEstadisticas() {
     const total = estudiantes.length;

     const aprobados = estudiantes.filter(
         e => Number(e.nota) >= 70
     ).length;

     const suma = estudiantes.reduce(
         (acumulado, e) => acumulado + Number(e.nota || 0),
         0
     );

     const promedio = total > 0 ? suma / total : 0;

     const totalElemento = document.getElementById("total");
     const aprobadosElemento = document.getElementById("aprobados");
     const promedioElemento = document.getElementById("promedio");

     if (totalElemento) totalElemento.textContent = total;
     if (aprobadosElemento) aprobadosElemento.textContent = aprobados;

     if (promedioElemento) {
         promedioElemento.textContent = promedio.toFixed(2);
     }
 }

 // POST y PUT - Guardar estudiantes
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
     const url = editando
         ? `${API}/${encodeURIComponent(idEditando)}`
         : API;

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

         const cargado = await cargarEstudiantes();

         if (cargado) {
             mostrarMensaje(
                 editando
                     ? "Estudiante actualizado correctamente."
                     : "Estudiante registrado correctamente."
             );
         } else {
             mostrarMensaje(
                 "Se guardó la solicitud, pero no se pudo " +
                 "actualizar la lista. Verificá los registros.",
                 true
             );
         }

     } catch (error) {
         console.error("Error al guardar:", error);
         mostrarMensaje(error.message, true);

     } finally {
         guardar.disabled = false;
     }
 }

 // Editar estudiante
 function editarEstudiante(id) {
     const estudiante = estudiantes.find(
         e => String(e.id) === String(id)
     );

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

 // DELETE - Eliminar estudiante
 async function eliminarEstudiante(id) {
     const estudiante = estudiantes.find(
         e => String(e.id) === String(id)
     );

     if (!estudiante) return;

     const confirmado = confirm(
         `¿Deseás eliminar a ${estudiante.nombre}?`
     );

     if (!confirmado) return;

     try {
         await solicitar(
             `${API}/${encodeURIComponent(id)}`,
             { method: "DELETE" }
         );

         if (String(idEditando) === String(id)) {
             limpiarFormulario();
         }

         const cargado = await cargarEstudiantes();

         if (cargado) {
             mostrarMensaje("Estudiante eliminado correctamente.");
         }

     } catch (error) {
         console.error("Error al eliminar:", error);
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
 console.log("CampusFlow iniciado");
 console.log("API configurada:", API);

 cargarEstudiantes();

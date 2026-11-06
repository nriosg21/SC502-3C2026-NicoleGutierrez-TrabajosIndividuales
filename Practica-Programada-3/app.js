
const express = require("express");
const fs = require("node:fs/promises");
const path = require("node:path");

const app = express();
const PUERTO = 3000;

// Archivo donde se guardan los estudiantes
const ARCHIVO = path.join(__dirname, "estudiantes.json");

// Permitir recibir datos en formato JSON
app.use(express.json());

// Permitir que Express muestre el frontend
app.use(express.static(path.join(__dirname, "public")));

// ============================================
// FUNCIONES PARA LEER Y GUARDAR ESTUDIANTES
// ============================================

// Leer estudiantes desde estudiantes.json
async function leerEstudiantes() {
    try {
        const contenido = await fs.readFile(ARCHIVO, "utf8");
        return JSON.parse(contenido);

    } catch (error) {
        // Crear el archivo si todavía no existe
        if (error.code === "ENOENT") {
            await fs.writeFile(ARCHIVO, "[]", "utf8");
            return [];
        }

        throw error;
    }
}

// Guardar estudiantes en estudiantes.json
async function guardarEstudiantes(datos) {
    await fs.writeFile(
        ARCHIVO,
        JSON.stringify(datos, null, 2),
        "utf8"
    );
}

// Validar los datos de un estudiante
function validarEstudiante(nombre, carrera, nota) {
    return (
        typeof nombre === "string" &&
        nombre.trim() !== "" &&
        typeof carrera === "string" &&
        carrera.trim() !== "" &&
        typeof nota === "number" &&
        Number.isFinite(nota) &&
        nota >= 0 &&
        nota <= 100
    );
}

// ============================================
// GET - CONSULTAR TODOS LOS ESTUDIANTES
// ============================================

app.get("/api/estudiantes", async (req, res, next) => {
    try {
        const estudiantes = await leerEstudiantes();

        res.json(estudiantes);

    } catch (error) {
        next(error);
    }
});

// ============================================
// GET - CONSULTAR UN ESTUDIANTE POR ID
// ============================================

app.get("/api/estudiantes/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const estudiantes = await leerEstudiantes();

        const estudiante = estudiantes.find(
            e => e.id === id
        );

        if (!estudiante) {
            return res.status(404).json({
                error: "Estudiante no encontrado"
            });
        }

        res.json(estudiante);

    } catch (error) {
        next(error);
    }
});

// ============================================
// POST - REGISTRAR UN NUEVO ESTUDIANTE
// ============================================

app.post("/api/estudiantes", async (req, res, next) => {
    try {
        const { nombre, carrera, nota } = req.body;

        // Validar los campos
        if (!validarEstudiante(nombre, carrera, nota)) {
            return res.status(400).json({
                error: "Debe ingresar nombre, carrera y una nota entre 0 y 100"
            });
        }

        // Consultar estudiantes existentes
        const estudiantes = await leerEstudiantes();

        // Generar un ID único
        const nuevoId = estudiantes.length > 0
            ? Math.max(...estudiantes.map(e => e.id)) + 1
            : 1;

        // Crear el estudiante
        const nuevo = {
            id: nuevoId,
            nombre: nombre.trim(),
            carrera: carrera.trim(),
            nota: nota
        };

        // Agregarlo al arreglo
        estudiantes.push(nuevo);

        // Guardar en el archivo JSON
        await guardarEstudiantes(estudiantes);

        // Responder con el estudiante creado
        res.status(201).json(nuevo);

    } catch (error) {
        next(error);
    }
});

// ============================================
// PUT - ACTUALIZAR UN ESTUDIANTE
// ============================================

app.put("/api/estudiantes/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const { nombre, carrera, nota } = req.body;

        // Consultar estudiantes
        const estudiantes = await leerEstudiantes();

        // Buscar la posición del estudiante
        const indice = estudiantes.findIndex(
            e => e.id === id
        );

        // Verificar que exista
        if (indice === -1) {
            return res.status(404).json({
                error: "Estudiante no encontrado"
            });
        }

        // Validar los datos nuevos
        if (!validarEstudiante(nombre, carrera, nota)) {
            return res.status(400).json({
                error: "Debe ingresar nombre, carrera y una nota válida entre 0 y 100"
            });
        }

        // Actualizar el estudiante
        estudiantes[indice] = {
            id: id,
            nombre: nombre.trim(),
            carrera: carrera.trim(),
            nota: nota
        };

        // Guardar los cambios
        await guardarEstudiantes(estudiantes);

        // Responder con el estudiante actualizado
        res.json(estudiantes[indice]);

    } catch (error) {
        next(error);
    }
});

// ============================================
// DELETE - ELIMINAR UN ESTUDIANTE
// ============================================

app.delete("/api/estudiantes/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        // Consultar estudiantes
        const estudiantes = await leerEstudiantes();

        // Excluir el estudiante que se desea eliminar
        const resultado = estudiantes.filter(
            e => e.id !== id
        );

        // Verificar que el estudiante exista
        if (resultado.length === estudiantes.length) {
            return res.status(404).json({
                error: "Estudiante no encontrado"
            });
        }

        // Guardar la lista actualizada
        await guardarEstudiantes(resultado);

        // Confirmar eliminación
        res.json({
            mensaje: "Estudiante eliminado correctamente"
        });

    } catch (error) {
        next(error);
    }
});

// ============================================
// MANEJO DE ERRORES DEL SERVIDOR
// ============================================

app.use((error, req, res, next) => {
    console.error("Error del servidor:", error);

    res.status(500).json({
        error: "Error interno del servidor"
    });
});

// ============================================
// INICIAR EL SERVIDOR
// ============================================

app.listen(PUERTO, () => {
    console.log(
        `Servidor activo en http://localhost:${PUERTO}`
    );
});

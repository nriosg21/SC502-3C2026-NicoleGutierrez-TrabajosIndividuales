console.log("===== SISTEMA DE ESTUDIANTES =====");


const estudiante = {
  nombre: "Carlos",
  edad: 21,
  carrera: "Ingeniería en Sistemas",
  notas: [80, 90, 75],
  activo: true
};

let nombre = String(estudiante.nombre);
let edad = Number(estudiante.edad);
let esEstudiante = Boolean(estudiante.activo);


function calcularPromedio(notas) {
  let suma = 0;

  for (let i = 0; i < notas.length; i++) {
    suma += notas[i];
  }

  return suma / notas.length;
}


function determinarEstado(promedio) {
  if (promedio >= 70) {
    return "Aprobado";
  } else {
    return "Reprobado";
  }
}

// Calcular resultados
let promedio = calcularPromedio(estudiante.notas);
let estado = determinarEstado(promedio);

// Operador ternario
let condicion = edad >= 18
  ? "Mayor de edad"
  : "Menor de edad";

// Mostrar información
console.log("Nombre:", nombre);
console.log("Edad:", edad);
console.log("Carrera:", estudiante.carrera);
console.log("Notas:", estudiante.notas.join(", "));
console.log("Promedio:", promedio.toFixed(2));
console.log("Estado:", estado);
console.log("Condición:", condicion);

// Menú con switch
let opcion = 1;

switch (opcion) {
  case 1:
    console.log("Opción seleccionada: Ver estudiante");
    break;

  case 2:
    console.log("Opción seleccionada: Ver notas");
    break;

  case 3:
    console.log("Opción seleccionada: Salir");
    break;

  default:
    console.log("Opción no válida");
    break;
}

// Ciclo do...while
let contador = 1;

do {
  console.log("Registro número:", contador);
  contador++;
} while (contador <= 3);

// Verificar si el estudiante está activo
console.log("Estudiante activo:", esEstudiante);

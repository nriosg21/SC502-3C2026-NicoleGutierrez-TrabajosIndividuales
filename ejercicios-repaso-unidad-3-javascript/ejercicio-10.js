
let estudiante = {
  nombre: "Carlos",
  edad: 21,
  carrera: "Ingeniería en Sistemas",
  nota: 85
};


console.log("Nombre:", estudiante.nombre);
console.log("Edad:", estudiante.edad);
console.log("Carrera:", estudiante.carrera);


let mayorEdad = estudiante.edad >= 18
  ? "Mayor de edad"
  : "Menor de edad";

console.log(mayorEdad);


if (estudiante.nota >= 70) {
  console.log("Aprobado");
} else {
  console.log("Reprobado");
}


estudiante.nota = 95;


estudiante.semestre = 4;


console.log(estudiante);

function calcularPromedio(nota1, nota2, nota3) {
  return (nota1 + nota2 + nota3) / 3;
}

// Función para determinar el estado
function determinarEstado(promedio) {
  if (promedio >= 70) {
    return "Aprobado";
  } else {
    return "Reprobado";
  }
}


let promedio = calcularPromedio(80, 90, 70);


let estado = determinarEstado(promedio);

// Mostrar resultados
console.log("Promedio:", promedio);
console.log("Estado:", estado);

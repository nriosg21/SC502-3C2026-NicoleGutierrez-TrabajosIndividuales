let nota = 85;

if (nota > 100 || nota < 0) {
  console.log("Nota inválida");
} else if (nota >= 90) {
  console.log("Excelente");
} else if (nota >= 70) {
  console.log("Aprobado");
} else if (nota >= 60) {
  console.log("Recuperación");
} else {
  console.log("Reprobado");
}

let precio = 154.67892;

// Mostrar con dos decimales
console.log("Precio con dos decimales:", precio.toFixed(2));

// Convertir a String
let precioTexto = precio.toString();
console.log("Precio como texto:", precioTexto);

// Comprobar si es un número
console.log("¿Precio no es un número?:", isNaN(precio));

// Comprobar texto
let texto = "Hola";
console.log("¿Hola no es un número?:", isNaN(texto));

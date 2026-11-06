let nombreCompleto = "Juan Carlos Perez";

// Longitud del texto
console.log("Longitud:", nombreCompleto.length);

// Primer carácter
console.log("Primer carácter:", nombreCompleto.charAt(0));

// Comprobar si termina en z
console.log("Termina en z:", nombreCompleto.endsWith("z"));

// Reemplazar Juan por Pedro
let nuevoNombre = nombreCompleto.replace("Juan", "Pedro");
console.log("Nombre modificado:", nuevoNombre);

// Convertir a mayúsculas
console.log("Mayúsculas:", nuevoNombre.toUpperCase());

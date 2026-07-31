// Solicitar datos al usuario
const nombre = prompt("¿Cuál es tu nombre?");
const apellido = prompt("¿Cual es tu apellido?");
const anioNacimiento = prompt("¿En qué año naciste?");

// Procesamiento
let numAnioNacimiento = parseInt(anioNacimiento);

// Calculo de edad actual
let anioActual = 2026;
let edad = anioActual - numAnioNacimiento;

// Transformación de texto: concatenar variables con strings
const mensaje = "Hola " + nombre + ", tu edad debria ser " + edad + " años.";

// Mostrar resultado
alert(mensaje);
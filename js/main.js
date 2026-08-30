// Simulador de control de ingreso a un evento

let anioActual = 2026;

// Función 1: entrada de datos 
function solicitarDatos(){
    const nombre = prompt("¿Cuál es tu nombre?");
    const anioNacimiento = prompt("¿En qué año naciste?");
    return { nombre, anioNacimiento };
}

// Función 2: procesamiento 
function calcularEdad(anioNacimiento){
    const numAnioNacimiento = parseInt(anioNacimiento);
    return anioActual - numAnioNacimiento;
}

// Función 3: salida, función flecha 
const mostrarResultado = (nombre, edad) => {
    if(edad >= 18){
        alert("Hola " + nombre + ", tenés " + edad + " años. ¡Podés ingresar!");
    } else if(edad === 17){
        alert("Hola " + nombre + ", tenés " + edad + " años. Podés ingresar solo con un adulto responsable.");
    } else {
        alert("Hola " + nombre + ", tenés " + edad + " años. No podés ingresar.");
    }
};

// Simulador principal: bucle con condicional, usando las funciones de arriba
let continuar = "si";

while(continuar === "si"){

    // Llamada a la función de entrada
    const datos = solicitarDatos();

    // Llamada a la función de procesamiento
    const edad = calcularEdad(datos.anioNacimiento);

    // Llamada a la función de salida
    mostrarResultado(datos.nombre, edad);

    continuar = prompt("¿Hay otra persona para verificar? (si/no)").toLowerCase();
}

console.log("Control de ingreso finalizado.");
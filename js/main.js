// Simulador de control de ingreso a un evento

let continuar = "si";
const anioActual = 2026;

while(continuar === "si"){

    // Solicitar datos de la persona
    const nombre = prompt("¿Cuál es tu nombre?");
    const anioNacimiento = prompt("¿En qué año naciste?");

    // Procesamiento: conversión de tipo
    const numAnioNacimiento = parseInt(anioNacimiento);
    const edad = anioActual - numAnioNacimiento;

    // Condicional dentro del bucle
    if(edad >= 18){
        alert("Hola " + nombre + ", tenés " + edad + " años. ¡Podés ingresar!");
    } else if(edad === 17){
        alert("Hola " + nombre + ", tenés " + edad + " años. Podés ingresar solo con un adulto responsable.");
    } else {
        alert("Hola " + nombre + ", tenés " + edad + " años. No podés ingresar.");
    }

    // Preguntar si se repite el proceso con otra persona
    continuar = prompt("¿Hay otra persona para verificar? (si/no)").toLowerCase();
}

console.log("Control de ingreso finalizado.");
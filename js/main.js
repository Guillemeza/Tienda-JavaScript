// Simulador de gestión de stock - Verdulería

// Array con nombre semántico, inicializado con al menos 5 elementos
let stockVerduleria = ["Tomate", "Papa", "Cebolla", "Zanahoria", "Lechuga"];

// Función 1: entrada de datos (con parámetro implícito vía prompt, y con return)
function solicitarProducto(){
    const nombreProducto = prompt("¿Qué producto querés agregar al stock?");
    return nombreProducto;
}

// Función 2: procesamiento - agrega el producto al array (con parámetros)
function agregarProducto(lista, producto){
    lista.push(producto);
    return lista.length;
}

// Función 3: salida, función flecha simple
const mostrarMensaje = (mensaje) => {
    console.log(mensaje);
};

// Función 4: recorrido del array con for...of (Reporte Iterativo)
function mostrarStock(lista){
    console.log("--- Stock actual de la verdulería ---");
    for(const producto of lista){
        console.log("Producto: " + producto);
    }
}

// Simulador principal: bucle con condicional
let continuar = "si";

while(continuar === "si"){

    // Llamada a función de entrada
    const nuevoProducto = solicitarProducto();

    // Llamada a función de procesamiento (Manipulación dinámica: push)
    const totalProductos = agregarProducto(stockVerduleria, nuevoProducto);

    // Condicional dentro del bucle
    if(totalProductos > 10){
        alert("Atención: el stock superó los 10 productos distintos.");
    } else {
        alert(nuevoProducto + " fue agregado. Total de productos: " + totalProductos);
    }

    continuar = prompt("¿Querés agregar otro producto? (si/no)").toLowerCase();
}

// Agregar un producto al principio con unshift
stockVerduleria.unshift("Oferta del día: Ajo");

// Eliminar el último producto agregado y guardarlo en una variable
const eliminado = stockVerduleria.pop();
mostrarMensaje("Se ha eliminado el elemento: " + eliminado);

// Búsqueda y validación
const productoBuscado = prompt("Ingresá un producto para buscar en el stock:");
if(stockVerduleria.includes(productoBuscado)){
    const posicion = stockVerduleria.indexOf(productoBuscado);
    mostrarMensaje(productoBuscado + " se encuentra en la posición " + posicion);
} else {
    mostrarMensaje(productoBuscado + " no está en stock.");
}

// Actualización por índice con splice
const indiceActualizar = 0;
stockVerduleria.splice(indiceActualizar, 1, "Producto actualizado");
mostrarMensaje("Se actualizó el producto en la posición " + indiceActualizar);

// Reporte iterativo final
mostrarStock(stockVerduleria);

console.log("Gestión de stock finalizada.");
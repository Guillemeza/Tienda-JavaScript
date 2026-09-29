// Simulador de gestión de stock - Verdulería

// ---- 1. Creación de la Clase ----
class Producto {
    // Constructor con 4 parámetros para inicializar propiedades
    constructor(nombre, precio, categoria, stock) {
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;
    }
 
    // ---- 2. Añadir Comportamiento ----
    // Método que resta del stock (operación lógica)
    vender(cantidad) {
        if (cantidad > this.stock) {
            console.log(`No hay suficiente stock de ${this.nombre}. Stock actual: ${this.stock}`);
        } else {
            this.stock -= cantidad;
            console.log(`Se vendieron ${cantidad} unidades de ${this.nombre}. Stock restante: ${this.stock}`);
        }
    }
 
    // Método que modifica el precio aplicando un descuento
    aplicarDescuento(porcentaje) {
        const precioAnterior = this.precio;
        this.precio = this.precio - (this.precio * porcentaje / 100);
        console.log(`${this.nombre}: precio actualizado de $${precioAnterior} a $${this.precio.toFixed(2)}`);
    }
}
 
// Array con nombre semántico, inicializado con al menos 5 elementos (ahora objetos Producto)
let stockVerduleria = [
    new Producto("Tomate", 500, "Verdura", 50),
    new Producto("Papa", 300, "Verdura", 100),
    new Producto("Cebolla", 400, "Verdura", 30),
    new Producto("Zanahoria", 350, "Verdura", 40),
    new Producto("Lechuga", 250, "Verdura", 20)
];
 
// Función 1: entrada de datos (con parámetro implícito vía prompt, y con return)
function solicitarProducto() {
    const nombreProducto = prompt("¿Qué producto querés agregar al stock?");
    return nombreProducto;
}
 
// Función 2: procesamiento - agrega el producto al array (con parámetros)
function agregarProducto(lista, producto) {
    lista.push(producto);
    return lista.length;
}
 
// Función 3: salida, función flecha simple
const mostrarMensaje = (mensaje) => {
    console.log(mensaje);
};
 
// Función 4: recorrido del array con for...of (Reporte Iterativo)
function mostrarStock(lista) {
    console.log("--- Stock actual de la verduleria ---");
    for (const producto of lista) {
        console.log(`Producto: ${producto.nombre} | Precio: $${producto.precio} | Categoria: ${producto.categoria} | Stock: ${producto.stock}`);
    }
}
 
// ---- 3. Instanciación ----
// Al menos tres objetos diferentes usando "new", guardados en constantes
const tomate = stockVerduleria[0];
const papa = stockVerduleria[1];
const cebolla = stockVerduleria[2];
 
// ---- 4. Verificación ----
// Ejecución de métodos y console.log de los resultados
mostrarMensaje("=== Estado inicial del stock ===");
mostrarStock(stockVerduleria);
 
tomate.vender(10);
papa.aplicarDescuento(15);
cebolla.vender(5);
cebolla.aplicarDescuento(10);
 
mostrarMensaje("=== Estado del stock luego de operar con los productos ===");
mostrarStock(stockVerduleria);
 
// ---- 5. Contexto ----
// El simulador principal sigue con la misma lógica y herramientas (bucle, condicional, prompt/alert)
let continuar = "si";
 
while (continuar === "si") {
    // Llamada a función de entrada
    const nombreNuevoProducto = solicitarProducto();
 
    // Se crea un nuevo objeto Producto con la clase definida arriba
    const nuevoProducto = new Producto(nombreNuevoProducto, 0, "Sin categorizar", 0);
 
    // Llamada a función de procesamiento (manipulación dinámica: push)
    const totalProductos = agregarProducto(stockVerduleria, nuevoProducto);
 
    // Condicional dentro del bucle
    if (totalProductos > 10) {
        alert("Atención: el stock superó los 10 productos distintos.");
    } else {
        alert(nuevoProducto.nombre + " fue agregado. Total de productos: " + totalProductos);
    }
 
    continuar = prompt("¿Querés agregar otro producto? (si/no)").toLowerCase();
}
 
// Agregar un producto al principio con unshift
stockVerduleria.unshift(new Producto("Ajo", 200, "Oferta del día", 15));
 
// Eliminar el último producto agregado y guardarlo en una variable
const eliminado = stockVerduleria.pop();
mostrarMensaje("Se ha eliminado el elemento: " + eliminado.nombre);
 
// Búsqueda y validación
const nombreBuscado = prompt("Ingresá un producto para buscar en el stock:");
const posicion = stockVerduleria.findIndex(p => p.nombre === nombreBuscado);
 
if (posicion !== -1) {
    mostrarMensaje(nombreBuscado + " se encuentra en la posición " + posicion);
} else {
    mostrarMensaje(nombreBuscado + " no está en stock.");
}
 
// Actualización por índice con splice
const indiceActualizar = 0;
stockVerduleria.splice(indiceActualizar, 1, new Producto("Producto actualizado", 100, "General", 10));
mostrarMensaje("Se actualizó el producto en la posición " + indiceActualizar);
 
// Estado final
mostrarMensaje("=== Estado final del stock ===");
mostrarStock(stockVerduleria);

// ---- Método de búsqueda 1: find ----
// Busca un producto puntual según lo que ingrese el usuario
const nombreABuscar = prompt("FIND: Ingresá el nombre exacto de un producto para buscarlo en el stock:");
const productoEncontrado = stockVerduleria.find(
    p => p.nombre.toLowerCase() === (nombreABuscar || "").toLowerCase()
);
 
if (productoEncontrado) {
    mostrarMensaje("Producto encontrado con find():");
    console.log(productoEncontrado);
} else {
    mostrarMensaje(`No se encontró ningún producto llamado "${nombreABuscar}".`);
}
 
// ---- Método de búsqueda 2: filter ----
// Filtra los productos que tienen stock disponible (stock > 0)
const productosDisponibles = stockVerduleria.filter(p => p.stock > 0);
mostrarMensaje("Productos con stock disponible (filter):");
console.log(productosDisponibles);
 
// ---- Método de transformación 1: map ----
// Genera un resumen en texto de cada producto (transforma cada objeto en un string)
const resumenProductos = stockVerduleria.map(
    p => `${p.nombre} | $${p.precio} | Stock: ${p.stock}`
);
mostrarMensaje("Resumen de productos (map):");
resumenProductos.forEach(linea => console.log(linea));
 
// ---- Método de transformación 2: reduce ----
// Calcula el total invertido en stock (precio * stock de cada producto, sumado)
const totalInvertidoEnStock = stockVerduleria.reduce(
    (acumulado, p) => acumulado + (p.precio * p.stock),
    0
);
mostrarMensaje("Total invertido en stock (reduce): $" + totalInvertidoEnStock.toFixed(2));
// Verdulería FERNICO - Simulador de stock
// Interacción 100% DOM (sin prompt/alert/console.log)

const CLAVE_STORAGE = "stockVerduleriaFernico";
 
// ---- 1. Clase Producto ----
class Producto {
    static contador = 1; // para asignar un id único a cada producto
 
    constructor(nombre, precio, categoria, stock) {
        this.id = Producto.contador++;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;
    }
 
    // Resta unidades del stock. Devuelve true/false según si pudo vender.
    vender(cantidad) {
        return cantidad > this.stock
            ? false
            : (this.stock -= cantidad, true);
    }
 
    // Aplica un descuento sobre el precio actual
    aplicarDescuento(porcentaje) {
        this.precio = this.precio - (this.precio * porcentaje / 100);
    }
}
 
// ---- 2. Persistencia con localStorage ----
 
// Guarda el array completo (usa JSON.stringify para serializar objetos)
function guardarStock(lista) {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(lista));
}
 
// Recupera el array guardado y reconstruye instancias de Producto
// (JSON.parse devuelve objetos planos, no instancias de la clase)
function cargarStock() {
    const datosGuardados = localStorage.getItem(CLAVE_STORAGE);
 
    if (!datosGuardados) return null;
 
    const productosPlanos = JSON.parse(datosGuardados);
 
    // Destructuring: extraemos cada propiedad del objeto plano
    return productosPlanos.map(({ id, nombre, precio, categoria, stock }) => {
        const producto = new Producto(nombre, precio, categoria, stock);
        producto.id = id; // conservamos el id original guardado
        return producto;
    });
}
 
// Borra todo el stock, tanto del array como del localStorage
function vaciarStock() {
    localStorage.removeItem(CLAVE_STORAGE);
    stockVerduleria = [];
    renderizarListaActual();
}
 
// ---- 3. Array de objetos (se recupera de localStorage si existe) ----
let stockVerduleria = cargarStock() ?? [
    new Producto("Tomate", 500, "Verdura", 50),
    new Producto("Papa", 300, "Verdura", 100),
    new Producto("Cebolla", 400, "Verdura", 30),
    new Producto("Zanahoria", 350, "Verdura", 40),
    new Producto("Lechuga", 250, "Verdura", 20)
];
 
// Si recuperamos productos guardados, el contador de ids debe continuar
// desde el id más alto que ya exista, para no repetir ids
if (stockVerduleria.length > 0) {
    const idMasAlto = Math.max(...stockVerduleria.map(({ id }) => id));
    Producto.contador = idMasAlto + 1;
}
 
// Si el storage no tenía nada guardado todavía, lo inicializamos ahora
localStorage.getItem(CLAVE_STORAGE) ?? guardarStock(stockVerduleria);
 
// ---- 4. Selección de elementos del DOM ----
const contenedorItems = document.getElementById("contenedor-items");
const totalInvertidoSpan = document.getElementById("total-invertido");
const mensajeForm = document.getElementById("mensaje-form");
 
const inputNombre = document.getElementById("input-nombre");
const inputPrecio = document.getElementById("input-precio");
const inputCategoria = document.getElementById("input-categoria");
const inputStock = document.getElementById("input-stock");
const btnAgregar = document.getElementById("btn-agregar");
const btnVaciar = document.getElementById("btn-vaciar");
 
const inputBusqueda = document.getElementById("input-busqueda");
 
// ---- 5. Renderizado dinámico ----
function renderizarProductos(lista) {
    contenedorItems.innerHTML = lista.length === 0
        ? `<p class="vacio">No se encontraron productos.</p>`
        : "";
 
    lista.forEach((producto) => {
        const { nombre, precio, categoria, stock, id } = producto; // destructuring
 
        const card = document.createElement("div");
        card.classList.add("producto-card");
        card.innerHTML = `
            <h3>${nombre}</h3>
            <p class="precio">$${precio.toFixed(2)}</p>
            <p class="categoria">${categoria}</p>
            <p class="stock ${stock === 0 ? "sin-stock" : ""}">Stock: ${stock}</p>
            <div class="producto-actions">
                <button class="btn-accion btn-vender" data-id="${id}">Vender 1</button>
                <button class="btn-accion btn-descuento" data-id="${id}">-10%</button>
                <button class="btn-accion btn-eliminar" data-id="${id}">🗑️</button>
            </div>
        `;
        contenedorItems.appendChild(card);
    });
 
    actualizarTotal(lista);
    activarBotonesDeAccion();
}
 
// Calcula y muestra el total invertido en stock (reduce + destructuring)
function actualizarTotal(lista) {
    const total = lista.reduce((acumulado, { precio, stock }) => acumulado + (precio * stock), 0);
    totalInvertidoSpan.textContent = "$" + total.toFixed(2);
}
 
// Conecta los botones de cada tarjeta con sus acciones (se llama después de cada render)
function activarBotonesDeAccion() {
    document.querySelectorAll(".btn-vender").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = Number(e.target.dataset.id);
            const producto = stockVerduleria.find((p) => p.id === id);
            if (!producto) return;
 
            const exito = producto.vender(1);
 
            mensajeForm.textContent = exito
                ? `✅ Se vendió 1 unidad de "${producto.nombre}".`
                : `⚠️ No hay stock suficiente de "${producto.nombre}".`;
            mensajeForm.classList.toggle("error", !exito);
 
            guardarStock(stockVerduleria);
            renderizarListaActual();
        });
    });
 
    document.querySelectorAll(".btn-descuento").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = Number(e.target.dataset.id);
            const producto = stockVerduleria.find((p) => p.id === id);
            if (!producto) return;
 
            producto.aplicarDescuento(10);
 
            guardarStock(stockVerduleria);
            renderizarListaActual();
        });
    });
 
    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = Number(e.target.dataset.id);
            const indice = stockVerduleria.findIndex((p) => p.id === id);
            if (indice === -1) return;
 
            stockVerduleria.splice(indice, 1);
 
            guardarStock(stockVerduleria);
            renderizarListaActual();
        });
    });
}
 
// Vuelve a renderizar respetando si hay un filtro de búsqueda activo
function renderizarListaActual() {
    const texto = inputBusqueda.value.toLowerCase().trim();
 
    const listaAMostrar = texto === ""
        ? stockVerduleria
        : stockVerduleria.filter(({ nombre }) => nombre.toLowerCase().includes(texto));
 
    renderizarProductos(listaAMostrar);
}
 
// ---- 6. Gestión de eventos ----
 
// Evento de click: agregar un nuevo producto al array y al storage
btnAgregar.addEventListener("click", () => {
    const nombre = inputNombre.value.trim();
    const precio = parseFloat(inputPrecio.value);
    const categoria = inputCategoria.value.trim() || "General";
    const stock = parseInt(inputStock.value);
 
    const datosInvalidos = !nombre || isNaN(precio) || precio < 0 || isNaN(stock) || stock < 0;
 
    if (datosInvalidos) {
        mensajeForm.textContent = "⚠️ Completá nombre, precio y stock con valores válidos.";
        mensajeForm.classList.add("error");
        return;
    }
 
    const nuevoProducto = new Producto(nombre, precio, categoria, stock);
    stockVerduleria.push(nuevoProducto);
 
    mensajeForm.textContent = `✅ "${nombre}" fue agregado al stock.`;
    mensajeForm.classList.remove("error");
 
    // Limpiar inputs
    inputNombre.value = "";
    inputPrecio.value = "";
    inputCategoria.value = "";
    inputStock.value = "";
 
    guardarStock(stockVerduleria);
    renderizarListaActual();
});
 
// Evento de click: vaciar todo el stock (array + localStorage)
btnVaciar.addEventListener("click", () => {
    vaciarStock();
    mensajeForm.textContent = "🧹 Se vació todo el stock.";
    mensajeForm.classList.remove("error");
});
 
// Evento de teclado: barra de búsqueda que filtra en vivo
inputBusqueda.addEventListener("keyup", () => {
    renderizarListaActual();
});
 
// ---- 7. Render inicial al cargar la página ----
renderizarProductos(stockVerduleria);
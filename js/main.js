// Verdulería FERNICO - Simulador de stock
// Interacción 100% DOM (sin prompt/alert/console.log)

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
 
    // Resta unidades del stock
    vender(cantidad) {
        if (cantidad > this.stock) {
            return false;
        }
        this.stock -= cantidad;
        return true;
    }
 
    // Aplica un descuento sobre el precio actual
    aplicarDescuento(porcentaje) {
        this.precio = this.precio - (this.precio * porcentaje / 100);
    }
}
 
// ---- 2. Array de objetos (base de datos simulada) ----
let stockVerduleria = [
    new Producto("Tomate", 500, "Verdura", 50),
    new Producto("Papa", 300, "Verdura", 100),
    new Producto("Cebolla", 400, "Verdura", 30),
    new Producto("Zanahoria", 350, "Verdura", 40),
    new Producto("Lechuga", 250, "Verdura", 20)
];
 
// ---- 3. Selección de elementos del DOM ----
const contenedorItems = document.getElementById("contenedor-items");
const totalInvertidoSpan = document.getElementById("total-invertido");
const mensajeForm = document.getElementById("mensaje-form");
 
const inputNombre = document.getElementById("input-nombre");
const inputPrecio = document.getElementById("input-precio");
const inputCategoria = document.getElementById("input-categoria");
const inputStock = document.getElementById("input-stock");
const btnAgregar = document.getElementById("btn-agregar");
 
const inputBusqueda = document.getElementById("input-busqueda");
 
// ---- 4. Renderizado dinámico ----
function renderizarProductos(lista) {
    contenedorItems.innerHTML = "";
 
    if (lista.length === 0) {
        contenedorItems.innerHTML = `<p class="vacio">No se encontraron productos.</p>`;
        actualizarTotal(lista);
        return;
    }
 
    lista.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add("producto-card");
        card.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.precio.toFixed(2)}</p>
            <p class="categoria">${producto.categoria}</p>
            <p class="stock ${producto.stock === 0 ? "sin-stock" : ""}">Stock: ${producto.stock}</p>
            <div class="producto-actions">
                <button class="btn-accion btn-vender" data-id="${producto.id}">Vender 1</button>
                <button class="btn-accion btn-descuento" data-id="${producto.id}">-10%</button>
                <button class="btn-accion btn-eliminar" data-id="${producto.id}">🗑️</button>
            </div>
        `;
        contenedorItems.appendChild(card);
    });
 
    actualizarTotal(lista);
    activarBotonesDeAccion();
}
 
// Calcula y muestra el total invertido en stock (reduce)
function actualizarTotal(lista) {
    const total = lista.reduce((acumulado, p) => acumulado + (p.precio * p.stock), 0);
    totalInvertidoSpan.textContent = "$" + total.toFixed(2);
}
 
// Conecta los botones de cada tarjeta con sus acciones (se llama después de cada render)
function activarBotonesDeAccion() {
    document.querySelectorAll(".btn-vender").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = Number(e.target.dataset.id);
            const producto = stockVerduleria.find((p) => p.id === id);
            if (producto) {
                producto.vender(1);
                renderizarListaActual();
            }
        });
    });
 
    document.querySelectorAll(".btn-descuento").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = Number(e.target.dataset.id);
            const producto = stockVerduleria.find((p) => p.id === id);
            if (producto) {
                producto.aplicarDescuento(10);
                renderizarListaActual();
            }
        });
    });
 
    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = Number(e.target.dataset.id);
            const indice = stockVerduleria.findIndex((p) => p.id === id);
            if (indice !== -1) {
                stockVerduleria.splice(indice, 1);
                renderizarListaActual();
            }
        });
    });
}
 
// Vuelve a renderizar respetando si hay un filtro de búsqueda activo
function renderizarListaActual() {
    const texto = inputBusqueda.value.toLowerCase().trim();
    if (texto === "") {
        renderizarProductos(stockVerduleria);
    } else {
        const filtrados = stockVerduleria.filter((p) => p.nombre.toLowerCase().includes(texto));
        renderizarProductos(filtrados);
    }
}
 
// ---- 5. Gestión de eventos ----
 
// Evento de click: agregar un nuevo producto al array
btnAgregar.addEventListener("click", () => {
    const nombre = inputNombre.value.trim();
    const precio = parseFloat(inputPrecio.value);
    const categoria = inputCategoria.value.trim() || "General";
    const stock = parseInt(inputStock.value);
 
    if (!nombre || isNaN(precio) || precio < 0 || isNaN(stock) || stock < 0) {
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
 
    renderizarListaActual();
});
 
// Evento de teclado: barra de búsqueda que filtra en vivo
inputBusqueda.addEventListener("keyup", () => {
    renderizarListaActual();
});
 
// ---- 6. Render inicial al cargar la página ----
renderizarProductos(stockVerduleria);
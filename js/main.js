// Verdulería FERNICO - Simulador de stock
// Interacción 100% DOM (sin prompt/alert/console.log)


const CLAVE_STORAGE = "stockVerduleriaFernico";
const RUTA_DATOS = "./data.json";
 
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
 
// ---- 2. Selección de elementos del DOM ----
const contenedorItems = document.getElementById("contenedor-items");
const totalInvertidoSpan = document.getElementById("total-invertido");
const mensajeForm = document.getElementById("mensaje-form");
const notificacion = document.getElementById("notificacion");
 
const inputNombre = document.getElementById("input-nombre");
const inputPrecio = document.getElementById("input-precio");
const inputCategoria = document.getElementById("input-categoria");
const inputStock = document.getElementById("input-stock");
const btnAgregar = document.getElementById("btn-agregar");
const btnVaciar = document.getElementById("btn-vaciar");
 
const inputBusqueda = document.getElementById("input-busqueda");
 
// El array arranca vacío; se completa en iniciarApp() (localStorage y/o fetch)
let stockVerduleria = [];
 
// ---- 3. Librería externa (Toastify) para notificar al usuario ----
function mostrarToast(mensaje, tipo = "info") {
    const colores = {
        success: "#2d6a4f",
        error: "#d62828",
        info: "#1b4332",
    };
 
    Toastify({
        text: mensaje,
        duration: 4000,
        gravity: "top",
        position: "right",
        style: { background: colores[tipo] ?? colores.info },
    }).showToast();
}
 
// ---- 4. Persistencia con localStorage (con manejo de errores) ----
 
function guardarStock(lista) {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(lista));
}
 
// Recupera el array guardado y reconstruye instancias de Producto.
// try-catch-finally porque JSON.parse puede fallar si los datos están corruptos.
function cargarStock() {
    let resultado = null;
 
    try {
        const datosGuardados = localStorage.getItem(CLAVE_STORAGE);
 
        if (!datosGuardados) {
            return null;
        }
 
        const productosPlanos = JSON.parse(datosGuardados);
 
        resultado = productosPlanos.map(({ id, nombre, precio, categoria, stock }) => {
            const producto = new Producto(nombre, precio, categoria, stock);
            producto.id = id;
            return producto;
        });
    } catch (error) {
        mostrarToast("⚠️ Los datos guardados estaban dañados. Se reinició el stock.", "error");
        localStorage.removeItem(CLAVE_STORAGE);
        resultado = null;
    } finally {
        resultado ??= [];
    }
 
    return resultado.length > 0 ? resultado : null;
}
 
function vaciarStock() {
    localStorage.removeItem(CLAVE_STORAGE);
    stockVerduleria = [];
    renderizarListaActual();
    mostrarToast("Se vació todo el stock.", "info");
}
 
// ---- 5. Consumo de API / JSON local (fetch + async/await + try/catch/finally) ----
// Pequeña espera artificial: sin esto, al servir data.json localmente
// el fetch resuelve casi instantáneo y el "Cargando productos..." no llega a verse.
function esperar(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
 
async function obtenerProductosDesdeAPI() {
    const inicio = performance.now();
 
    try {
        const respuesta = await fetch(RUTA_DATOS);
 
        if (!respuesta.ok) {
            throw new Error(`Respuesta no exitosa del servidor (${respuesta.status})`);
        }
 
        const datos = await respuesta.json();
        mostrarToast("✅ Productos cargados con éxito", "success");
        return datos;
    } catch (error) {
        mostrarToast("❌ No se pudieron cargar los productos. Se usará un stock de respaldo.", "error");
        return null;
    } finally {
        const transcurrido = performance.now() - inicio;
        const esperaMinima = 1000; // ms
 
        if (transcurrido < esperaMinima) {
            await esperar(esperaMinima - transcurrido);
        }
 
        contenedorItems.classList.remove("cargando");
    }
}
 
// ---- 6. Renderizado dinámico ----
function renderizarProductos(lista) {
    contenedorItems.innerHTML = lista.length === 0
        ? `<p class="vacio">No se encontraron productos.</p>`
        : "";
 
    lista.forEach((producto) => {
        const { nombre, precio, categoria, stock, id } = producto;
 
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
 
function actualizarTotal(lista) {
    const total = lista.reduce((acumulado, { precio, stock }) => acumulado + (precio * stock), 0);
    totalInvertidoSpan.textContent = "$" + total.toFixed(2);
}
 
function activarBotonesDeAccion() {
    document.querySelectorAll(".btn-vender").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = Number(e.target.dataset.id);
            const producto = stockVerduleria.find((p) => p.id === id);
            if (!producto) return;
 
            const exito = producto.vender(1);
 
            mostrarToast(
                exito
                    ? `Se vendió 1 unidad de "${producto.nombre}".`
                    : `No hay stock suficiente de "${producto.nombre}".`,
                exito ? "success" : "error"
            );
 
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
            mostrarToast(`Se aplicó un 10% de descuento a "${producto.nombre}".`, "success");
 
            guardarStock(stockVerduleria);
            renderizarListaActual();
        });
    });
 
    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = Number(e.target.dataset.id);
            const indice = stockVerduleria.findIndex((p) => p.id === id);
            if (indice === -1) return;
 
            const nombreEliminado = stockVerduleria[indice].nombre;
            stockVerduleria.splice(indice, 1);
            mostrarToast(`Se eliminó "${nombreEliminado}" del stock.`, "info");
 
            guardarStock(stockVerduleria);
            renderizarListaActual();
        });
    });
}
 
function renderizarListaActual() {
    const texto = inputBusqueda.value.toLowerCase().trim();
 
    const listaAMostrar = texto === ""
        ? stockVerduleria
        : stockVerduleria.filter(({ nombre }) => nombre.toLowerCase().includes(texto));
 
    renderizarProductos(listaAMostrar);
}
 
// ---- 7. Notificación asincrónica complementaria (setTimeout) ----
function mostrarCupon(mensaje) {
    notificacion.textContent = mensaje;
    notificacion.classList.add("mostrar");
 
    setTimeout(() => {
        notificacion.classList.remove("mostrar");
    }, 6000);
}
 
// ---- 8. Gestión de eventos ----
 
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
 
    mensajeForm.textContent = "";
    mensajeForm.classList.remove("error");
    mostrarToast(`"${nombre}" fue agregado al stock.`, "success");
 
    inputNombre.value = "";
    inputPrecio.value = "";
    inputCategoria.value = "";
    inputStock.value = "";
 
    guardarStock(stockVerduleria);
    renderizarListaActual();
});
 
btnVaciar.addEventListener("click", () => {
    vaciarStock();
});
 
inputBusqueda.addEventListener("keyup", () => {
    renderizarListaActual();
});
 
// ---- 9. Inicialización de la app (async/await) ----
async function iniciarApp() {
    contenedorItems.classList.add("cargando");
    contenedorItems.innerHTML = `<p class="cargando-texto">⏳ Cargando productos...</p>`;
 
    // Prioridad 1: datos ya guardados por el usuario en localStorage
    const datosGuardados = cargarStock();
 
    if (datosGuardados) {
        stockVerduleria = datosGuardados;
        contenedorItems.classList.remove("cargando");
    } else {
        // Prioridad 2: primera visita -> traer el stock inicial desde data.json
        const datosAPI = await obtenerProductosDesdeAPI();
 
        stockVerduleria = datosAPI
            ? datosAPI.map(({ nombre, precio, categoria, stock }) => new Producto(nombre, precio, categoria, stock))
            : [
                // Respaldo por si falla también el fetch
                new Producto("Tomate", 500, "Verdura", 50),
                new Producto("Papa", 300, "Verdura", 100),
                new Producto("Cebolla", 400, "Verdura", 30)
            ];
 
        guardarStock(stockVerduleria);
    }
 
    const idMasAlto = stockVerduleria.length > 0
        ? Math.max(...stockVerduleria.map(({ id }) => id))
        : 0;
    Producto.contador = idMasAlto + 1;
 
    renderizarProductos(stockVerduleria);
 
    // Cupón de descuento, unos segundos después de haber entrado
    setTimeout(() => {
        mostrarCupon("🎟️ ¡Cupón del día! 15% OFF en tu próxima compra en Verdulería FERNICO.");
    }, 4000);
}
 
iniciarApp();
// Cada producto que vende el super es creado con esta clase
class Producto {
    sku;            // Identificador único del producto
    nombre;         // Su nombre
    categoria;      // Categoría a la que pertenece este producto
    precio;         // Su precio
    stock;          // Cantidad disponible en stock

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        // Si no me definen stock, pongo 10 por default
        if (stock) {
            this.stock = stock;
        } else {
            this.stock = 10;
        }
    }

}


// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];


// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    productos;      // Lista de productos agregados
    categorias;     // Lista de las diferentes categorías de los productos en el carrito
    precioTotal;    // Lo que voy a pagar al finalizar mi compra

    // Al crear un carrito, empieza vació
    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }


    // función que agrega @{cantidad} de productos con @{sku} al carrito

    async agregarProducto(sku, cantidad) {
        console.log(`Agregando ${cantidad} ${sku}`);

        let producto1;
        try {
            producto1 = await
                findProductBySku(sku);
        } catch (error) {
            console.error(`este prodcucto No existe `);//arroja un mensaje de error al no encontrar un sku coincidente 
            return;
        }

        // Busco el producto en la "base de datos"
        const producto = await findProductBySku(sku);

        console.log("Producto encontrado", producto);

        const productoExistente = this.productos.find(p => p.sku === sku);
        if (productoExistente) {
            console.log(`El producto ${sku} ya está en el carrito.`);
            productoExistente.cantidad += cantidad;
            this.precioTotal += (producto.precio * cantidad);
            return;
        }
        if (this.categorias.includes(producto.categoria)) {
            this.categorias.pop(producto.categoria)
        }
        // Creo un producto nuevo
        const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
        this.productos.push(nuevoProducto);
        this.precioTotal = this.precioTotal + (producto.precio * cantidad);
        this.categorias.push(producto.categoria);
    }


    // Función que elimina @{cantidad} del producto con @{sku} del carrito
    // Función para eliminar un producto del array por su SKU

    async eliminarProducto(sku, cantidad) {
        return new Promise((resolve, reject) => {
            console.log(`Eliminando ${cantidad} ${sku}`);

            const productoExistente = this.productos.find(p => p.sku === sku);
            if (!productoExistente) {
                console.log(`El producto ${sku} no está en el carrito.`);
                reject(`El producto ${sku} no está en el carrito.`);
                return;
            }

            if (productoExistente.cantidad <= cantidad) {
                // Eliminar el producto por completo
                const index = this.productos.indexOf(productoExistente);
                this.productos.splice(index, 1);
                this.precioTotal -= productoExistente.cantidad * productoExistente.precio;
            } else {
                // Reducir la cantidad del producto en el carrito
                console.log(`Se reduce la cantidad del producto ${sku} en el carrito.`);
                productoExistente.cantidad -= cantidad;
                
                // CUIDADO: este productoExistente es un ProductoEnCarrito y por lo tanto NO tiene la propiedad precio
                // esto hace que this.precioTotal 'se rompa'
                this.precioTotal -= (cantidad * productoExistente.precio);
            }
           

            resolve();
        });
    }

}

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito

    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(`Product ${sku} not found`);
            }
        }, 1500);
    });

}

const carrito = new Carrito();
carrito.agregarProducto('WE328NJ', 2);
carrito.agregarProducto('WE328NJ', 2);
carrito.agregarProducto('OL883YE', 5);
carrito.agregarProducto('KS944RUR', 9)
carrito.agregarProducto('KT965RUM', 9)
console.log(carrito);
carrito.eliminarProducto('OL883YE',5)
	.then(() => {
		console.log('Producto eliminado del carrito.');
		// vemos el carrito en este punto.
		console.log(JSON.parse(JSON.stringify(carrito)));
	})
	.catch(error => {
		console.error('Error al eliminar el producto:', error);
	});
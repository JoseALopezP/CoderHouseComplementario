//funcion constructora listado de productos
function Producto(codigo, marca, tipo, peso, precio){
    this.codigo = codigo;
    this.marca = marca;
    this.tipo = tipo;
    this.peso = peso;
    this.precio = precio;
    this.describir = () => (console.log(this.codigo + " - " + this.marca +" "+ this.tipo +" ("+ this.peso +"gr) ---> $"+ this.precio));
    this.cambiarPrecio = (nuevoPrecio) => (this.precio = nuevoPrecio);
}
//funcion constructora carrito
function cartProducto(codigo, cantidad){
    this.codigo = codigo;
    this.cantidad = cantidad;
}

//Declaracion del array de productos
let productos = [];
//Declaracion del array del carrito y total
let carritoProductos = [];
let cartTotal = 0;

//Seteo inicial de productos (nada si ya hay productos, los basicos si aun no se ha agregado ninguno)
function obtenerProductosLocalStorage() {
    let productosAlmacenados = localStorage.getItem("productosLocal");
    if (productosAlmacenados != null) {
        productos = JSON.parse(productosAlmacenados);
    } else{
        let newProducto = new Producto(1, "La Paulina", "Queso Cremoso tradicional", 100, 86.3);
        productos.push(newProducto);
        newProducto = new Producto(2, "La Paulina", "Queso Reggianito", 100, 212.7);
        productos.push(newProducto);
        newProducto = new Producto(3, "La Paulina", "Queso Crema", 100, 78.1);
        productos.push(newProducto);
        newProducto = new Producto(4, "Paladini", "Mortadela", 100, 82.8);
        productos.push(newProducto);
        newProducto = new Producto(5, "Paladini", "Jamon Cocido", 100, 126.1);
        productos.push(newProducto);
        newProducto = new Producto(6, "Paladini", "Bondiola", 100, 213.2);
        productos.push(newProducto);
        newProducto = new Producto(7, "Paladini", "Salame Milan", 100, 156.7);
        productos.push(newProducto);
        newProducto = new Producto(8, "Paladini", "Queso Cremoso", 100, 97.5);
        productos.push(newProducto);
        newProducto = new Producto(9, "Paladini", "Queso Reggianito", 100, 191.9);
        productos.push(newProducto);
        newProducto = new Producto(10, "Paladini", "Queso Danbo", 100, 108.7);
        productos.push(newProducto);
        localStorage.setItem("productosLocal", JSON.stringify(productos));
    }
}
//Seteo carrito con session storage data
function obtenerCarritoSessionStorage(){
    let carritoActual = sessionStorage.getItem('carritoProductosSession');
    let carritoTotalActual = sessionStorage.getItem('carritoTotalSession');
    if(carritoActual != null){
        carritoProductos = JSON.parse(carritoActual);
        cartTotal = parseFloat(JSON.parse(carritoTotalActual));
    }
}

//funcion constructora para array con opciones de desarrollador
function developerListOption(codigoD, descripcion){
    this.codigoD = codigoD;
    this.descripcion = descripcion;
    this.describir = () => (console.log(this.codigoD + ") " + this.descripcion));
}

let productList = document.getElementById("productList");
let listedCartBody = document.getElementById("listedCartBody");
let cartFooter = document.getElementById("cartFooter");

//Limpiar productos listados en HTML
function cleanListedProducts(){
    let productBlocks = document.querySelectorAll('.productBlock');
    for(const product of productBlocks){
        product.remove();
    }
}
//Listando productos en HTML diferenciando estilos por marca
function listingProducts(){
    for(const product of productos){
        let htmlCode = `
            <div class="productBlockImg">
                <img src="media/img/${product.tipo}.jpg" alt="${product.tipo}">
            </div>
            <div class="productBlockDescription">
                <h3>${product.marca}</h3>
                <h4>${product.tipo}</h4>
                <p>Precio (${product.peso}gr): $${product.precio}</p>
            </div>
        `
        let productBlock = document.createElement("div");
        if(product.marca == "La Paulina"){
            productBlock.className = "productBlock LaPaulina";
            productBlock.innerHTML = htmlCode;
            productList.append(productBlock);
        } else if(product.marca == "Paladini"){
            productBlock.className = "productBlock Paladini";
            productBlock.innerHTML = htmlCode;
            productList.append(productBlock);
        } else{
            productBlock.className = "productBlock";
            productBlock.innerHTML = htmlCode;
            productList.append(productBlock);
        }
        
    }
    
}
//Actualizar productos en HTML
function updateProducts(){
    cleanListedProducts();
    listingProducts();
}

//Limpiar productos en Carrito
function cleanListedCartProducts(){
    let productCartBlocks = document.querySelectorAll('.productCartBlock');
    for(const product of productCartBlocks){
        product.remove();
    }
    let totalCartBlock = document.querySelectorAll('.productCartTotalBlock');
    for(const product of totalCartBlock){
        product.remove();
    }
}
//Formar carrito
function listingCartProducts(){
    if(carritoProductos != null){
        for(const product of carritoProductos){
            htmlCode=`
                <p class="cartItemDescription">${productos[product.codigo].marca} ${productos[product.codigo].tipo}</p>
                <p class="cartItemPrice">$${productos[product.codigo].precio}(${productos[product.codigo].peso}gr)</p>
                <p class="cartItemQuantity">${product.cantidad}</p>
                <p class="cartItemTotal">$${product.cantidad*(productos[product.codigo].precio)/productos[product.codigo].peso}</p>
            `
            let productBlock = document.createElement("div");
            productBlock.className = "productCartBlock";
            productBlock.innerHTML = htmlCode;
            listedCartBody.append(productBlock);
        }
        let totalCartBlock = document.createElement("div")
        totalCartBlock.className = "productCartTotalBlock";
        totalCartBlock.innerHTML = `
            <h4>TOTAL:</h4>
            <p>$${cartTotal}</p>
        `;
        cartFooter.append(totalCartBlock);
    }
}
//Actualizar carrito HTML
function updateCartProducts(){
    cleanListedCartProducts();
    listingCartProducts();
}


//Formulario para listar nuevos productos
let formularioProductos = document.getElementById("formularioProductos");
let inputMarca = document.getElementById("marcaProducto");
let inputTipo = document.getElementById("tipoProducto");
let inputUnidad = document.getElementById("unidadProducto");
let inputPrecio = document.getElementById("precioProducto");
formularioProductos.onsubmit = (event) => addProducto(event);

//codigo,tipo,marca,peso,precio
function addProducto(event){
    event.preventDefault();
    let codigoF = productos.length + 1;
    let tipoF = inputTipo.value;
    let marcaF = inputMarca.value;
    let pesoF = parseInt(inputUnidad.value);
    let precioF = parseFloat(inputPrecio.value);

    newProducto = new Producto(codigoF, marcaF, tipoF, pesoF, precioF);
    productos.push(newProducto);
    formularioProductos.reset();
    localStorage.setItem("productosLocal", JSON.stringify(productos))
    updateProducts();
    updateListingOptions()
};

//Formulario para agregar productos al carrito
let formularioAgregarCarro = document.getElementById('addCartForm');
let inputOpcionAgregarCarro = document.getElementById('addCartOptions');
let inputCantidadAgregarCarro = document.getElementById('addCartWeight');

formularioAgregarCarro.onsubmit = (event) => addToCart(event);

function addToCart(event){
    event.preventDefault();
    let codigoC = parseInt(inputOpcionAgregarCarro.value)-1;
    let cantidadC = inputCantidadAgregarCarro.value;
    let newCartProducto = new cartProducto(codigoC, cantidadC);
    carritoProductos.push(newCartProducto);
    sessionStorage.setItem("carritoProductosSession", JSON.stringify(carritoProductos));
    let subtotal = parseFloat(cantidadC * (productos[codigoC].precio / productos[codigoC].peso));
    cartTotal += subtotal;
    console.log(productos[codigoC].precio);
    console.log(productos[codigoC].peso);
    console.log(cartTotal);
    console.log(subtotal);

    sessionStorage.setItem("carritoTotalSession", cartTotal);
    updateCartProducts();
    formularioProductos.reset();
}

let btnDesarrollador = document.getElementById("btnDesarrollador");
btnDesarrollador.onclick = () => {
    developerUser();
};

let btnCliente = document.getElementById("btnCliente");
btnCliente.onclick = () => {
    carrito();
};

//Eliminar Listado de opciones para funciones
function deleteListedOptions(){
    let productCartBlocks = document.querySelectorAll('.lOption');
    for(const product of productCartBlocks){
        product.remove();
    }
}

//Listar productos para opciones
function listingOptions(){
    listingiteration(deleteOptions);
    listingiteration(changePriceOptions);
    listingiteration(addCartOptions);
}
//Iteracions para listar productos
function listingiteration(place){
    for(const product of productos){
        let option = document.createElement("option");
        option.className = "lOption"
        option.value = `${product.codigo}`;
        option.innerHTML= `
            <option value="${product.codigo}">${product.marca} ${product.tipo}</option>
        `;
        place.append(option);
    }
}
//Listado de opciones para funciones


//Actualizar el listado de opciones
function updateListingOptions(){
    deleteListedOptions();
    listingOptions();
}

function main(){
    obtenerProductosLocalStorage();
    obtenerCarritoSessionStorage()
    updateProducts();
    updateCartProducts()
    updateListingOptions();
}

main();
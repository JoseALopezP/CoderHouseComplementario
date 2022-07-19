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
let cartTotal;

//Seteo inicial de productos (nada si ya hay productos, los basicos si aun no se ha agregado ninguno)
function obtenerProductosLocalStorage() {
    let productosAlmacenados = localStorage.getItem("productosLocal");
    if (productosAlmacenados != '') {
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
    let carritoActual = sessionStorage.getItem('carritoProductoSession');
    if(carritoActual != ''){
        carritoProductos = JSON.parse(carritoActual);
    }
}

//funcion constructora para array con opciones de desarrollador
function developerListOption(codigoD, descripcion){
    this.codigoD = codigoD;
    this.descripcion = descripcion;
    this.describir = () => (console.log(this.codigoD + ") " + this.descripcion));
}

//declaracion del array de opciones
const developerList=[];

//agregando opciones
let newOption = new developerListOption("A", "Cambiar precio a un producto");
developerList.push(newOption);
newOption = new developerListOption("B", "Listar productos de mayor a menor precio");
developerList.push(newOption);
newOption = new developerListOption("C", "Listar productos de menor a mayor precio");
developerList.push(newOption);


//simulador interactivo
function carrito(){
    let carrito = 0;
    let x;
    let c;
    list(productos);
    x = option();
    checkOption(x);
    while(x != "S"){
        c = cantidad();
        carrito += (parseFloat(productos[x-1].precio) / parseFloat(productos[x-1].peso)) * parseFloat(c);
        console.clear();
        list(productos);
        console.log("Su subtotal es de: $", carrito);
        x = option();
        checkOption(x);
    }
    console.log('Su total es de: $', carrito);
}

function cantidad(){
    let c = prompt("¿Cuánto desea? (en gramos)");
    return c;
}

function option(){
    let x;
    x = prompt('¿Qué desea agregar al carrito? (1 al ' + productos.length + ', S para salir)');
    return x;
}

function checkOption(x){
    while(x != "S" && (parseInt(x) > productos.length || parseInt(x) < 1)){
        alert('Valor incorrecto');
        x = option();
    }
    return x;
}

function optionDeveloper(){
    let id;
    list(developerList);
    id = prompt('¿Qué desea realizar? (A al ' + developerList[developerList.length-1].codigoD + ', S para salir)');
    console.clear();
    return id;
}

function developerUser(){
    let x;
    let id;
    id = optionDeveloper();
    while(id != "S"){
        if(id === "A"){
            list(productos);
            x = prompt("Seleccione el producto al que desea cambiar el precio");
            let p = prompt("Cual sera el nuevo precio?")
            productos[x-1].cambiarPrecio(parseFloat(p));
            cleanListedProducts()
            listingProducts()
        }else if(id === "B"){
            productos.sort((a, b) => {
                return b.precio - a.precio;
            });
            cleanListedProducts()
            listingProducts()
        }else if(id === "C"){
            productos.sort((a, b) => {
                return a.precio - b.precio;
            });
            cleanListedProducts()
            listingProducts()
        }
        id = optionDeveloper();
    }
}


let productList = document.getElementById("productList");
let listedCartBody = document.getElementById("listedCartBody");
let cartFooter = document.getElementById("cartfooter");

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
        if(product.marca == "La Paulina"){
            let productBlock = document.createElement("div");
            productBlock.className = "productBlock LaPaulina";
            productBlock.innerHTML = htmlCode;
            productList.append(productBlock);
        } else if(product.marca == "Paladini"){
            let productBlock = document.createElement("div");
            productBlock.className = "productBlock Paladini";
            productBlock.innerHTML = htmlCode;
            productList.append(productBlock);
        } else{
            let productBlock = document.createElement("div");
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
    let totalCart = document.querySelectorAll('.cartTotal');
    totalCart.remove();
}
//Formar carrito
function listingCartProducts(){
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
        productList.append(productBlock);
    }
    let totalCart = document.createElement("div")
    totalCartBlock.className = "productCartTotalBlock";
    totalCartBlock.innerHTML = `
        <h4>TOTAL:</h4>
        <p>$${cartTotal}</p>
    `;
    productList.append(totalCartBlock);
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
    
};

//Formulario para agregar productos al carrito
let formularioAgregarCarro = document.getElementById('addCartForm');
let inputOpcionAgregarCarro = document.getElementById('addCartOptions');
let inputCantidadAgregarCarro = document.getElementById('addCartWeight');

formularioAgregarCarro.onsubmit = (event) => addToCart(event);

function addToCart(event){
    event.preventDefault();
    let codigoC = parseInt(inputOpcionAgregarCarro.value)-1;
    let cantidadC = parseInt(inputCantidadAgregarCarro.value);
    newCartProducto = new cartProducto(codigoC, cantidadC);
    carritoProductos.push(newCartProducto);
    sessionStorage.setItem("carritoProductosLocal", JSON.stringify(carritoProductos));
    updateCarrito();

}

let btnDesarrollador = document.getElementById("btnDesarrollador");
btnDesarrollador.onclick = () => {
    developerUser();
};

let btnCliente = document.getElementById("btnCliente");
btnCliente.onclick = () => {
    carrito();
};

//Listado de opciones para funciones
function listingOptions(){
    for(const product of productos){
        let option = document.createElement("option");
        option.value = `${product.codigo}`;
        option.innerHTML= `
            <option value="${product.codigo}">${product.marca} ${product.tipo}</option>
        `;
        deleteOptions.append(option);
    }
    for(const product of productos){
        let option = document.createElement("option");
        option.value = `${product.codigo}`;
        option.innerHTML= `
            <option value="${product.codigo}">${product.marca} ${product.tipo}</option>
        `;
        changePriceOptions.append(option);
    }
    for(const product of productos){
        let option = document.createElement("option");
        option.value = `${product.codigo}`;
        option.innerHTML= `
            <option value="${product.codigo}">${product.marca} ${product.tipo}</option>
        `;
        addCartOptions.append(option);
    }
    
}

function main(){
    obtenerProductosLocalStorage();
    listingProducts();
    listingOptions();
}

main();
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
function CartProducto(codigo, cantidad){
    this.codigo = codigo;
    this.cantidad = cantidad;
}

//Declaracion del array de productos
let productos = [];
//Declaracion del array del carrito y total
let carritoProductos = [];
let cartTotal = 0;

//Pedido de productos a API
const pedidoProductosAPI = async () =>{
    let res = await fetch("https://62e85fc093938a545be52125.mockapi.io/productos");
    let data = await res.json();
    console.log(res);
    console.log(data);
    data.forEach((productAPI) => {
        let newProducto = new Producto(productAPI.codigo, productAPI.marca, productAPI.tipo, productAPI.peso, productAPI.precio);
        productos.push(newProducto);
    });
    localStorage.setItem("productosLocal", JSON.stringify(productos));
    updateProducts();
  }

//Seteo inicial de productos (nada si ya hay productos, los basicos si aun no se ha agregado ninguno)
function obtenerProductosLocalStorage() {
    let productosAlmacenados = localStorage.getItem("productosLocal");
    if (productosAlmacenados != null) {
        productos = JSON.parse(productosAlmacenados);
    } else{
        pedidoProductosAPI();
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
function addIndividualItemListing(classNameDiv, htmlCode){
    let productBlock = document.createElement("div");
    productBlock.className = `${classNameDiv}`;
    productBlock.innerHTML = htmlCode;
    productList.append(productBlock);
}
function listingProducts(){
    for(const product of productos){
        let {tipo, marca, peso, precio} = product; //Desestructuracion
        let htmlCode = `
            <div class="productBlockImg">
                <img src="media/img/${tipo}.jpg" alt="${tipo}">
            </div>
            <div class="productBlockDescription">
                <h3>${marca}</h3>
                <h4>${tipo}</h4>
                <p>Precio (${peso}gr): $${precio}</p>
            </div>
        `;
        marca == "La Paulina" && addIndividualItemListing("productBlock LaPaulina", htmlCode); //
        marca == "Paladini" && addIndividualItemListing("productBlock Paladini", htmlCode);
        (marca != "Paladini" && marca != "La Paulina") && addIndividualItemListing("productBlock", htmlCode);
    }
}
//Actualizar productos en HTML
function updateProducts(){
    cleanListedProducts();
    listingProducts();
}

//Encontrar Posicion carrito
function findPositionC(codeF){
    let i=0;
    while(i < carritoProductos.length){
        if(parseInt(productos[i].codigo) == codeF){
            return(false);
        }
        i++;
    }
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
            let {marca, tipo, precio, peso} = productos[findPosition(product.codigo)]; //Desestructuracion
            htmlCode=`
                <p class="cartItemDescription">${marca} ${tipo}</p>
                <p class="cartItemPrice">$${precio}(${peso}gr)</p>
                <p class="cartItemQuantity">${product.cantidad}</p>
                <p class="cartItemTotal">$${(product.cantidad * (precio / peso)).toFixed(2)}</p>
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
    updateCartTotal();
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

    let newProducto = new Producto(codigoF, marcaF, tipoF, pesoF, precioF);
    productos.push(newProducto);
    formularioProductos.reset();
    localStorage.setItem("productosLocal", JSON.stringify(productos));
    updateProducts();
    updateListingOptions()
};


//Funcion para encontrar posicion del producto en array
function findPosition(codeFunc){
    let codeF = codeFunc;
    let i=0;
    while(i < productos.length){
        if(parseInt(productos[i].codigo) == codeF){
            break;
        }
        i++;
    }
    return(i)
}

//Formulario para agregar productos al carrito
let formularioAgregarCarro = document.getElementById('addCartForm');
let inputOpcionAgregarCarro = document.getElementById('addCartOptions');
let inputCantidadAgregarCarro = document.getElementById('addCartWeight');

formularioAgregarCarro.onsubmit = (event) => addToCart(event);

function addToCart(event){
    event.preventDefault();
    let codigoC = inputOpcionAgregarCarro.value;
    let codigoP = findPosition(inputOpcionAgregarCarro.value);
    console.log(codigoC);
    let cantidadC = inputCantidadAgregarCarro.value;
    let newCartProducto = new CartProducto(codigoC, cantidadC);
    carritoProductos.push(newCartProducto);
    sessionStorage.setItem("carritoProductosSession", JSON.stringify(carritoProductos));
    let subtotal = parseFloat(cantidadC * (productos[codigoP].precio / productos[codigoP].peso));
    cartTotal += parseFloat(subtotal.toFixed(2));

    sessionStorage.setItem("carritoTotalSession", cartTotal);
    updateCartProducts();
    formularioProductos.reset();
    Swal.fire({
        position: 'top-end',
        icon: 'Agregado',
        title: `Se agregaron ${cantidadC}gr de ${productos[codigoC].marca} ${productos[codigoC].tipo} al carrito`,
        showConfirmButton: false,
        timer: 1500
      })
}

//formulario para cambiar precio
let formularioCambiarPrecio = document.getElementById('changePriceForm');
let inputOpcionCambiarPrecio = document.getElementById('changePriceOptions');
let inputCambiarPrecio = document.getElementById('changePriceNewPrice');

formularioCambiarPrecio.onsubmit = (event) => changePrice(event);

function changePrice(event){
    event.preventDefault();
    Swal.fire({
        title: '¿Estás seguro de que quieres cambiar el precio?',
        text: "Actualizará también el precio de los productos agregados a carritos",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si ¡Cámbialo!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        let codigoC = findPosition(inputOpcionCambiarPrecio.value);
        let precioC = inputCambiarPrecio.value;
        if (result.isConfirmed) {
        Swal.fire(
            'Cambiado!',
            `El precio ha sido cambiado de ${productos[codigoC].precio} a ${precioC}`,
            'Exitoso'
        );
        productos[codigoC].precio = precioC;

        localStorage.setItem("productosLocal", JSON.stringify(productos));
        updateProducts();
        updateCartProducts();
        formularioCambiarPrecio.reset();
        }
      })
    
}

function updateCartTotal(){
    let arrTotal = [];
    for(const product of carritoProductos){
        let code = findPosition(product.codigo);
        let itemTotal = product.cantidad * (productos[code].precio / productos[code].peso);
        arrTotal.push(parseFloat(itemTotal));
    }
    cartTotal = (arrTotal.reduce((acc, n) => acc + n , 0)).toFixed(2);
    sessionStorage.setItem("carritoTotalSession", cartTotal);
}

//Limpiar productos del carrito
let btnLimpiarCarrito = document.getElementById('BtnLimpiarC');
btnLimpiarCarrito.onclick = () => limpiarCarrito();

function limpiarCarrito(){
    Swal.fire({
        title: '¿Seguro que quiere limpiar el carrito?',
        text: "¡No podrás volver atrás!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si ¡Límpialo!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Limpio!',
            'Se limpió el carrito',
            'Exitoso'
        );
        sessionStorage.clear();
        carritoProductos.splice(0, carritoProductos.length);
        updateCartProducts();
        }
      })
}

//Limpiar cambios en productos
let btnValoresDefecto = document.getElementById('BtnDefaultValues');
btnValoresDefecto.onclick = () => valoresDefecto();

function valoresDefecto(){
    Swal.fire({
        title: '¿Seguro que quiere volver a los valores por defecto?',
        text: "¡No podrás volver atrás!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si ¡Volver atrás!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            '¡Cargado!',
            'Se cargaron los valores por defecto',
            'Exitoso'
        );
        localStorage.clear();
        productos.splice(0, productos.length);
        window.location.reload(true);
        }
      })
}

//Formulario para eliminar productos listados
let formularioEliminar = document.getElementById('deleteForm');
let inputOpcionEliminar = document.getElementById('deleteOptions');

formularioEliminar.onsubmit = (event) => deleteProduct(event);

function deleteProduct(event){
    event.preventDefault();
    Swal.fire({
        title: '¿Estás seguro de que quieres eliminar el producto?',
        text: "También se eliminará de los carritos donde haya sido agregado",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si ¡Elimínalo!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        codigoD = findPosition(inputOpcionEliminar.value);
        if (result.isConfirmed) {
          Swal.fire(
            '¡Eliminado!',
            `El producto ${productos[codigoD].marca} ${productos[codigoD].tipo} ya no está en la lista`,
            'success'
        )
        productos.splice(codigoD, 1);
        localStorage.setItem("productosLocal", JSON.stringify(productos));
        deletedCartProduct(inputOpcionEliminar.value);
        updateProducts();
        updateListingOptions();
        updateCartProducts();
        formularioCambiarPrecio.reset();
        }
      })
    
}

function deletedCartProduct(code){
    let i = 0;
    while(i < carritoProductos.length){
        if(code == carritoProductos[i].codigo){
            carritoProductos.splice(i,1);
            i = -1;
        }
        i++;
    }
}

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

//Actualizar el listado de opciones
function updateListingOptions(){
    deleteListedOptions();
    listingOptions();
}

function main(){
    obtenerProductosLocalStorage();
    obtenerCarritoSessionStorage();
    updateProducts();
    updateCartProducts();
    updateListingOptions();
    console.log(3);
}

main();
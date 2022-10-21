// // variables

const templatePago = document.getElementById('template-pago').content;
const items1 = document.getElementById('items1');
const totales = document.getElementById('totales');
const procesarPago = document.getElementById('procesar-compra');
const cliente = document.getElementById('cliente');
const correo = document.getElementById('correo');
const direccion = document.getElementById('direccion');
const fragment = document.createDocumentFragment();

// eventos
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarPago();
    }
});

items1.addEventListener('click', e => {
    btnAccion(e);
});


procesarPago.addEventListener('click', e => {
    terminarCompra(e);
});
// fin eventos

// funciones
// pintar el main de pagos con lo mismo del carrito del index
const pintarPago = () => {
    items1.innerHTML = '';
    Object.values(carrito).forEach(producto => {
        templatePago.querySelectorAll('th')[0].textContent = producto.id;
        templatePago.querySelectorAll('th')[1].textContent = producto.nombre;
        templatePago.querySelectorAll('span')[0].textContent = producto.precio;
        templatePago.querySelectorAll('th')[3].textContent = producto.cantidad;
        templatePago.querySelectorAll('span')[1].textContent = producto.cantidad * producto.precio;
        //botones
        templatePago.querySelector('.btn-info').dataset.id = producto.id;
        templatePago.querySelector('.btn-danger').dataset.id = producto.id;
        templatePago.querySelector('.eliminar-producto').dataset.id = producto.id;
        const clone = templatePago.cloneNode(true);
        fragment.appendChild(clone);
    });
    items1.appendChild(fragment);
    pintarTotales();
    localStorage.setItem('carrito', JSON.stringify(carrito));
};



// botones accion para eliminar, sumar o restar productos en pagos

const btnAccion = e => {
    // accion de aumentar
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
            carrito[e.target.dataset.id] = {...producto }
        pintarPago();
    }
    // accion sacar y eliminar producto
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
            if (producto.cantidad === 0) {
                delete carrito[e.target.dataset.id]
            }
        pintarPago();
    }
    // eleminar producto
    if (e.target.classList.contains('eliminar-producto')) {
        delete carrito[e.target.dataset.id];
        pintarPago();
    }
    e.stopPropagation();
};


// calcular totales

const pintarTotales = e => {
    let prodLocalStorage;
    let total = 0,
        subtotal = 0,
        iva = 0;
    prodLocalStorage = Object.values(carrito);
    for (let index = 0; index < prodLocalStorage.length; index++) {
        let element = Number(prodLocalStorage[index].precio * prodLocalStorage[index].cantidad);
        total = total + element;

    }
    iva = parseFloat(total * 0.21).toFixed(2);
    subtotal = parseFloat(total - iva).toFixed(2);

    document.getElementById('subtotal').innerHTML = subtotal;
    document.getElementById('iva').innerHTML = iva;
    document.getElementById('total').innerHTML = total.toFixed(2);
};

// CONFIGURAMOS EL BOTON CONFIRMAR COMPRA

const terminarCompra = e => {
    e.preventDefault();
    if (Object.values(carrito).length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Su carrito esta vacio seleccione algun Producto!',
            timer: "3500",
            width: 600,
            padding: '3em',
            showConfirmButton: false
        }).then(function() {
            window.location = "index.html";
        });
    } else if (cliente.value === "" || correo.value === "" || direccion.value === "") {

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Complete los campos requeridos',
            timer: "3500",
            width: 600,
            padding: '3em',
            showConfirmButton: false
        });


    } else {
        setTimeout(() => {
            Swal.fire({
                icon: 'info',
                title: 'Estamos procesando su pedido',
                width: 600,
                padding: '3em',
                color: '#716add',
                background: "linear-gradient(black, rgb(38, 37, 37))",
                showConfirmButton: false
            });
            setTimeout(() => {
                Swal.fire({
                    icon: 'success',
                    text: 'Muchas gracias !!  Su pedido fue realizado con exito, en las proximas 48 se realizara la entrega.',
                    timer: "6000",
                    width: 600,
                    padding: '3em',
                    color: '#716add',
                    background: "linear-gradient(black, rgb(38, 37, 37))",
                    showConfirmButton: false
                }).then(function() {
                    carrito = {};
                    window.location = "index.html";
                    localStorage.setItem('carrito', JSON.stringify(carrito))
                });

            }, 2000);
        }, 1000);
    }
};
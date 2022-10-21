// variables

const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const procesarCompraBoton = document.getElementById('procesar-compra');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
let carrito = {};


// eventos
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito();
    }
});

cards.addEventListener('click', e => {
    addCarrito(e);
});

items.addEventListener('click', e => {
    console.log(items);
    btnAccion(e);
});
procesarCompraBoton.addEventListener('click', e => {
    procesarCompra(e);
});



// fetch
const fetchData = async() => {
    try {
        const res = await fetch('datos.json');
        const data = await res.json();
        pintarCards(data);
    } catch (error) {
        console.log(error);
    }
    // console.log(data)
};


// funciones
// pintar las cards en el index
const pintarCards = data => {
    data.forEach(item => {
        templateCard.querySelector('img').setAttribute("src", item.thumbnailUrl)
        templateCard.querySelector('h5').textContent = item.nombre;
        templateCard.querySelectorAll('span')[0].textContent = item.precio;
        templateCard.querySelectorAll('span')[1].textContent = item.peso;
        templateCard.querySelector('button').dataset.id = item.id;
        // templateCard.querySelectorAll('span').textContent = item.peso
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    })
    cards.appendChild(fragment);
};



const addCarrito = e => {
    // console.log(e.target.classList.contains('btn-dark'));
    // console.log(e.target.classList.contains('btn-dark'));
    if (e.target.classList.contains('btn-dark')) {

        setCarrito(e.target.parentElement);

    }
    e.stopPropagation();
};



// 
const setCarrito = objeto => {
    // console.log(objeto);
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        nombre: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('span').textContent,
        cantidad: 1,
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1

    }
    carrito[producto.id] = {...producto }
    pintarCarrito();
};
// fin pintar card en index




// pinta el carrito index
const pintarCarrito = () => {
    console.log(carrito);
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id;
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre;
        templateCarrito.querySelectorAll('span')[0].textContent = producto.precio;
        templateCarrito.querySelectorAll('td')[2].textContent = producto.cantidad;
        templateCarrito.querySelectorAll('span')[1].textContent = producto.cantidad * producto.precio;

        //botones
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
        templateCarrito.querySelector('.borrar-producto').dataset.id = producto.id;
        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.appendChild(fragment);
    pintarFooter();
    localStorage.setItem('carrito', JSON.stringify(carrito));
};

// pintar carrito footer
const pintarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
    <th scope="row" colspan="5">Carrito vacío !</th>
    `
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0);
    // console.log(nCantidad);
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0);

    templateFooter.querySelectorAll('span')[0].textContent = nCantidad;
    templateFooter.querySelectorAll('span')[1].textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);


    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {};
        pintarCarrito();
    });


};
// botenes de aumento , resta y eliminar producto
const btnAccion = e => {
    // accion de aumentar
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
            carrito[e.target.dataset.id] = {...producto }
        pintarCarrito();
    }
    // accion sacar y eliminar producto
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
            if (producto.cantidad === 0) {
                delete carrito[e.target.dataset.id]
            }
        pintarCarrito();
    }
    // eleminar producto
    if (e.target.classList.contains('borrar-producto')) {
        delete carrito[e.target.dataset.id];
        pintarCarrito();
    }
    e.stopPropagation();
};



// boton de carrito para proceder al pago 
const procesarCompra = (e) => {
    if (Object.values(carrito).length === 0) {
        // mostrar mensaje que no hay productos
        console.log('No hay productos en el carrito');
    } else {
        location.href = "compra.html";
    }
};
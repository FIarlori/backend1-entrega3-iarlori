const socket = io();

function initialize() {
    const productForm = document.getElementById('productForm');
    const productsList = document.getElementById('productsList');

    if (!productForm || !productsList) {
        console.error('No se encontraron los elementos necesarios en el DOM');
        return;
    }

    socket.on('updateProducts', (products) => {
        productsList.innerHTML = '';
        
        products.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <strong>${product.title}</strong> - $${product.price}
                    <br>${product.description}
                    <br>Stock: ${product.stock} | Categoría: ${product.category}
                    ${product.thumbnails ? `<br><img src="${product.thumbnails}" width="50">` : ''}
                </div>
                <button onclick="deleteProduct(${product.id})">Eliminar</button>
            `;
            productsList.appendChild(li);
        });
    });

    socket.on('error', (message) => {
        alert(`Error: ${message}`);
    });

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(productForm);
        const product = Object.fromEntries(formData);
        
        product.price = parseFloat(product.price);
        product.stock = parseInt(product.stock);
        
        if (!product.thumbnails) {
            product.thumbnails = [];
        } else {
            product.thumbnails = [product.thumbnails];
        }
        
        socket.emit('addProduct', product);
        productForm.reset();
    });
}

function deleteProduct(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        socket.emit('deleteProduct', id);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}
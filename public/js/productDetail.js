async function checkCartStatus(productId, cartId, button) {
    try {
        const response = await fetch(`/api/carts/${cartId}`);
        if (!response.ok) throw new Error('Error al obtener el carrito');
        const cart = await response.json();
        const existingProduct = cart.products.find(p => p.product._id.toString() === productId);
        const productResponse = await fetch(`/api/products/${productId}`);
        const product = await productResponse.json();
        const isDisabled = existingProduct ? existingProduct.quantity >= product.stock : product.stock === 0;
        button.disabled = isDisabled;
    } catch (error) {
        console.error('Error al verificar el carrito:', error);
    }
}

function addToCart(productId, cartId, event) {
    const button = event.target;
    if (!cartId) {
        console.error('cartId no está definido:', cartId);
        alert('Error: No se encontró un carrito asociado.');
        return;
    }
    if (button.disabled) return;
    button.disabled = true;
    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            alert('Producto añadido al carrito');
        }
        checkCartStatus(productId, cartId, button);
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
        checkCartStatus(productId, cartId, button);
    })
    .finally(() => {
        button.disabled = false;
    });
}

const existingHandler = document._clickHandler;
if (existingHandler) {
    document.removeEventListener('click', existingHandler);
}
document._clickHandler = (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.getAttribute('onclick')?.startsWith('addToCart')) {
        e.stopImmediatePropagation();
        e.preventDefault();
        const match = e.target.getAttribute('onclick').match(/addToCart\('([^']+)'\, '([^']+)'\, event\)/);
        if (match) {
            const productId = match[1];
            const cartId = match[2];
            checkCartStatus(productId, cartId, e.target);
            addToCart(productId, cartId, e);
        }
    }
};
document.addEventListener('click', document._clickHandler, { capture: true });

(function() {
    const button = document.querySelector('button[onclick^="addToCart"]');
    if (button) {
        const match = button.getAttribute('onclick').match(/addToCart\('([^']+)'\, '([^']+)'\, event\)/);
        if (match) {
            const productId = match[1];
            const cartId = match[2];
            checkCartStatus(productId, cartId, button);
        }
    }
})();
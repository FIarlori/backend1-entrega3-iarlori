function removeFromCart(cartId, productId) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
        fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
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
                alert('Producto eliminado del carrito');
                location.reload();
            }
        })
        .catch(error => {
            console.error('Error al eliminar producto:', error);
            alert(`Error: ${error.message}`);
        });
    }
}

function clearCart(cartId) {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        fetch(`/api/carts/${cartId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
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
                alert('Carrito vaciado exitosamente');
                location.reload();
            }
        })
        .catch(error => {
            console.error('Error al vaciar carrito:', error);
            alert(`Error: ${error.message}`);
        });
    }
}
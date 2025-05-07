document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const cartTableBody = document.querySelector('.cart-table tbody');
    const emptyCartMessage = document.querySelector('.empty-cart');
    const cartTableContainer = document.querySelector('.cart-table-container');
    const totalPriceElement = document.querySelector('.total-price span');
    const checkoutButton = document.querySelector('.btn-primary');
    const continueShoppingButton = document.querySelector('.btn-secondary');

    // Load cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to update the cart display
    function updateCartDisplay() {
        if (cartItems.length === 0) {
            cartTableContainer.style.display = 'none';
            emptyCartMessage.style.display = 'block';
            return;
        }

        cartTableContainer.style.display = 'block';
        emptyCartMessage.style.display = 'none';

        // Clear table rows
        cartTableBody.innerHTML = '';

        let totalPrice = 0;

        // Add cart items to table
        cartItems.forEach(function(item, index) {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="product-name">${item.name}</td>
                <td><img src="${item.image}" alt="${item.name}"></td>
                <td class="ingredients">${item.ingredients}</td>
                <td>
                    <div class="amount-controls">
                        <button class="amount-btn decrease" data-index="${index}">-</button>
                        <input type="number" class="amount-input" value="${item.quantity}" min="1" data-index="${index}">
                        <button class="amount-btn increase" data-index="${index}">+</button>
                    </div>
                </td>
                <td class="price">$${itemTotal.toFixed(2)}</td>
                <td>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </td>
            `;

            cartTableBody.appendChild(row);
        });

        // Update total price
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }

    // Event delegation for amount controls and remove button
    cartTableBody.addEventListener('click', function(e) {
        const index = e.target.dataset.index;
        if (!index) return;

        if (e.target.classList.contains('decrease')) {
            if (cartItems[index].quantity > 1) {
                cartItems[index].quantity--;
                updateCartDisplay();
                saveCartToLocalStorage();
            }
        } else if (e.target.classList.contains('increase')) {
            cartItems[index].quantity++;
            updateCartDisplay();
            saveCartToLocalStorage();
        } else if (e.target.classList.contains('remove-btn')) {
            cartItems.splice(index, 1);
            updateCartDisplay();
            saveCartToLocalStorage();
            showNotification('item removed from cart!');
        }
    });

    // Handle quantity input changes
    cartTableBody.addEventListener('change', function(e) {
        if (e.target.classList.contains('amount-input')) {
            const index = e.target.dataset.index;
            const newQuantity = parseInt(e.target.value);
            
            if (newQuantity > 0) {
                cartItems[index].quantity = newQuantity;
                updateCartDisplay();
                saveCartToLocalStorage();
            } else {
                e.target.value = cartItems[index].quantity;
            }
        }
    });

    // Function to save cart to localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    // Function to show notifications
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(function() {
            notification.remove();
        }, 3000);
    }

    // Handle checkout button click
    // checkoutButton.addEventListener('click', function() {
    //     if (cartItems.length > 0) {
    //         showNotification('Proceeding to checkout...');
    //     }
    // });

    // Handle continue shopping button click
    // continueShoppingButton.addEventListener('click', function() {
    //     window.location.href = 'menu.html';
    // });

    // Initial cart display
    updateCartDisplay();
});
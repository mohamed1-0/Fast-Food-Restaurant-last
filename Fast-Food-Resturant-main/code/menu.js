document.addEventListener('DOMContentLoaded', function() {
    // Function to add item to favorites
    function addToFavorites(itemId) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.includes(itemId)) {
            favorites.push(itemId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            showNotification('item added to favorites!');
        }
    }

    // Function to remove item from favorites
    function removeFromFavorites(itemId) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(function(id) {
            return id !== itemId;
        });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showNotification('removed from favorites!');
    }

    // Function to add item to cart
    function addToCart(itemId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const menuItem = document.querySelector(`.menu-item .add-to-cart-btn[data-id="${itemId}"]`).closest('.menu-item');
        const name = menuItem.querySelector('.item-details h3').textContent;
        const image = menuItem.querySelector('.item-image img').src;
        const price = parseFloat(menuItem.querySelector('.item-price').textContent.replace('$', ''));
        const ingredients = menuItem.querySelector('.item-ingredients').textContent;

        const existingItem = cart.find(function(item) {
            return item.id === itemId;
        });
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: itemId,
                name: name,
                image: image,
                price: price,
                ingredients: ingredients,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Function to show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(function() {
            notification.remove();
        }, 3000);
    }

    // Initialize heart icons based on favorites
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.forEach(function(itemId) {
        const favoriteBtn = document.querySelector(`.favorite-btn[data-id="${itemId}"]`);
        if (favoriteBtn) {
            const heartIcon = favoriteBtn.querySelector('i');
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas');
        }
    });

    // Favorite button functionality
    const favoriteButtons = document.querySelectorAll('.favorite-btn');

    favoriteButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const itemId = button.getAttribute('data-id');
            const heartIcon = button.querySelector('i');

            if (heartIcon.classList.contains('far')) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                addToFavorites(itemId);
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                removeFromFavorites(itemId);
            }
        });
    });

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const itemId = button.getAttribute('data-id');
            addToCart(itemId);
            showNotification('item added to cart!');
        });
    });
});
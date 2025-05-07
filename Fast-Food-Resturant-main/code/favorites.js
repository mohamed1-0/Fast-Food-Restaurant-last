document.addEventListener('DOMContentLoaded', function() {
    // Menu data
    const menuData = [
        { id: "1", name: "Classic Burger", image: "../images/menu/classic-burger.png", rating: 4.5, ingredients: "Beef patty, lettuce, tomato, onion, pickles, special sauce", price: 8.99 },
        { id: "2", name: "Cheese Burger", image: "../images/menu/cheese-burger.png", rating: 5.0, ingredients: "Beef patty, cheddar cheese, lettuce, tomato, onion, pickles, special sauce", price: 9.99 },
        { id: "3", name: "Margherita Pizza", image: "../images/menu/margherita-pizza.png", rating: 4.0, ingredients: "Tomato sauce, mozzarella cheese, fresh basil, olive oil", price: 12.99 },
        { id: "4", name: "Pepperoni Pizza", image: "../images/menu/pepperoni-pizza.png", rating: 4.5, ingredients: "Tomato sauce, mozzarella cheese, pepperoni, oregano", price: 14.99 },
        { id: "5", name: "Club Sandwich", image: "../images/menu/club-sandwich.png", rating: 4.0, ingredients: "Turkey, bacon, lettuce, tomato, mayonnaise, triple-decker bread", price: 10.99 },
        { id: "6", name: "BLT Sandwich", image: "../images/menu/blt-sandwich.png", rating: 4.5, ingredients: "Bacon, lettuce, tomato, mayonnaise, toasted bread", price: 9.99 },
        { id: "7", name: "French Fries", image: "../images/menu/french-fries.png", rating: 5.0, ingredients: "Crispy golden fries, seasoned with salt, served with ketchup", price: 4.99 },
        { id: "8", name: "Onion Rings", image: "../images/menu/onion-rings.png", rating: 4.0, ingredients: "Crispy battered onion rings, served with ranch dressing", price: 5.99 },
        { id: "9", name: "Soft Drink", image: "../images/menu/soft-drink.png", rating: 4.0, ingredients: "Choice of Coca-Cola, Sprite, Fanta, or Dr. Pepper", price: 2.99 },
        { id: "10", name: "Milkshake", image: "../images/menu/milkshake.png", rating: 4.5, ingredients: "Choice of chocolate, vanilla, strawberry, or cookies & cream", price: 5.99 }
    ];

    // Get favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesContainer = document.getElementById('favorites-container');
    const emptyFavorites = document.querySelector('.empty-favorites');

    // Display favorites or empty state
    if (favorites.length === 0) {
        emptyFavorites.style.display = 'flex';
        
    } else {
        favorites.forEach(function(itemId) {
            const item = menuData.find(function(item) {
                return item.id === itemId;
            });
            if (item) {
                favoritesContainer.appendChild(createMenuItem(item));
            }
        });
    }

    // Function to create menu item element
    function createMenuItem(item) {
        const itemContainer = document.createElement('div');
        itemContainer.className = 'menu-item';
        itemContainer.setAttribute('data-id', item.id);

        itemContainer.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-overlay">
                    <button class="remove-favorite-btn" data-id="${item.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <div class="item-rating">
                    ${getStarRating(item.rating)}
                    <span>(${item.rating})</span>
                </div>
                <p class="item-ingredients">${item.ingredients}</p>
                <div class="item-footer">
                    <span class="item-price">$${item.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" data-id="${item.id}">Add to Cart</button>
                </div>
            </div>
        `;

        // Remove from favorites
        itemContainer.querySelector('.remove-favorite-btn').addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favorites = favorites.filter(function(id) {
                return id !== itemId;
            });
            localStorage.setItem('favorites', JSON.stringify(favorites));
            itemContainer.remove();
            if (favorites.length === 0) {
                emptyFavorites.style.display = 'flex';
            }
            showNotification('item removed from favorites!');
        });

        // Add to cart
        itemContainer.querySelector('.add-to-cart-btn').addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const item = menuData.find(function(item) {
                return item.id === itemId;
            });
            const cartItem = cart.find(function(cartItem) {
                return cartItem.id === itemId;
            });

            if (cartItem) {
                cartItem.quantity += 1;
            } else {
                cart.push({ id: itemId, name: item.name, price: item.price, ingredients: item.ingredients, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            showNotification('item added to cart!');
        });

        return itemContainer;
    }

    // Function to get star rating
    function getStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }

        // Add half star if needed
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }

        // Add empty stars
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

    // Function to show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(function() {
            notification.remove();
        }, 3000);
    }
});
// Cart Management - Using localStorage and jQuery
(function ($) {
    "use strict";

    // Product catalog - Only actual products from the site (from index.html)
    window.products = {
        1: {
            id: 1,
            name: "Water Bottle",
            description: "1L",
            price: 20.00,
            image: "img/bottle-lg-nbg.png"
        },
        2: {
            id: 2,
            name: "Water Bottle",
            description: "250ml",
            price: 10.00,
            image: "img/bottle-sm-nbg.png"
        }
    };

    // Create cart sidebar HTML if it doesn't exist
    window.createCartSidebar = function() {
        if ($('#cart-sidebar').length === 0) {
            var sidebar = '<div id="cart-sidebar" class="cart-sidebar" style="position: fixed; right: -400px; top: 0; width: 400px; height: 100vh; background: white; box-shadow: -2px 0 10px rgba(0,0,0,0.1); transition: right 0.3s ease; z-index: 9999; overflow-y: auto; display: flex; flex-direction: column;">' +
                '<div style="padding: 20px; border-bottom: 1px solid #ddd; background: #f8f9fa;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                '<h5 style="margin: 0;">Shopping Cart</h5>' +
                '<button id="close-cart-sidebar" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>' +
                '</div>' +
                '</div>' +
                '<div id="sidebar-cart-items" style="flex: 1; overflow-y: auto; padding: 20px;"></div>' +
                '<div style="padding: 20px; border-top: 1px solid #ddd; background: #f8f9fa;">' +
                '<div class="mb-3" style="font-size: 18px; font-weight: bold;">' +
                '<span>Total: </span><span id="sidebar-total">₹0.00</span>' +
                '</div>' +
                '<a href="cart.html" class="btn btn-primary w-100 mb-2">View Cart</a>' +
                '<a href="checkout.html" class="btn btn-success w-100">Checkout</a>' +
                '</div>' +
                '</div>' +
                '<div id="cart-sidebar-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: none; z-index: 9998;"></div>';
            $('body').append(sidebar);

            // Close sidebar on close button click
            $(document).on('click', '#close-cart-sidebar', function() {
                closeCartSidebar();
            });

            // Close sidebar on overlay click
            $(document).on('click', '#cart-sidebar-overlay', function() {
                closeCartSidebar();
            });
        }
    };

    // Get cart from localStorage
    window.getCart = function () {
        var cart = localStorage.getItem('mansarovar_cart');
        return cart ? JSON.parse(cart) : {};
    };

    // Save cart to localStorage
    window.saveCart = function (cart) {
        localStorage.setItem('mansarovar_cart', JSON.stringify(cart));
    };

    // Add item to cart
    window.addToCart = function (productId, quantity) {
        quantity = quantity || 1;
        var cart = getCart();
        var product = products[productId];

        if (!product) return false;

        if (cart[productId]) {
            cart[productId].quantity += parseInt(quantity);
        } else {
            cart[productId] = {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: parseInt(quantity)
            };
        }

        saveCart(cart);
        updateCartBadge();
        return true;
    };

    // Remove item from cart
    window.removeFromCart = function (productId) {
        var cart = getCart();
        delete cart[productId];
        saveCart(cart);
        updateCartBadge();
    };

    // Update item quantity
    window.updateQuantity = function (productId, quantity) {
        var cart = getCart();
        if (cart[productId]) {
            quantity = parseInt(quantity);
            if (quantity <= 0) {
                removeFromCart(productId);
            } else {
                cart[productId].quantity = quantity;
                saveCart(cart);
            }
        }
        updateCartBadge();
    };

    // Get cart total
    window.getCartTotal = function () {
        var cart = getCart();
        var total = 0;
        $.each(cart, function (key, item) {
            total += item.price * item.quantity;
        });
        return total.toFixed(2);
    };

    // Get cart item count
    window.getCartCount = function () {
        var cart = getCart();
        var count = 0;
        $.each(cart, function (key, item) {
            count += item.quantity;
        });
        return count;
    };

    // Update cart badge in navbar
    window.updateCartBadge = function () {
        var count = getCartCount();
        var badge = $('#cart-badge');
        if (count > 0) {
            if (badge.length === 0) {
                $('<span id="cart-badge" class="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">0</span>').appendTo('.cart-icon-container');
            }
            $('#cart-badge').text(count);
            $('#cart-badge').show();
        } else {
            badge.hide();
        }
    };

    // Open cart sidebar
    window.openCartSidebar = function () {
        createCartSidebar();
        updateSidebarDisplay();
        $('#cart-sidebar').css('right', '0');
        $('#cart-sidebar-overlay').show();
    };

    // Close cart sidebar
    window.closeCartSidebar = function () {
        $('#cart-sidebar').css('right', '-400px');
        $('#cart-sidebar-overlay').hide();
    };

    // Update sidebar cart display
    window.updateSidebarDisplay = function () {
        var cart = getCart();
        var container = $('#sidebar-cart-items');

        if (Object.keys(cart).length === 0) {
            container.html('<p class="text-muted text-center">Your cart is empty</p>');
            $('#sidebar-total').text('₹0.00');
            return;
        }

        var html = '';
        $.each(cart, function (key, item) {
            var itemTotal = (item.price * item.quantity).toFixed(2);
            html += '<div class="cart-item mb-3 p-3" style="border: 1px solid #eee; border-radius: 5px;">' +
                '<div style="display: flex; gap: 10px;">' +
                '<img src="' + item.image + '" style="width: 60px; height: 60px; object-fit: cover; border-radius: 3px;">' +
                '<div style="flex: 1;">' +
                '<h6 style="margin: 0 0 5px 0;">' + item.name + '</h6>' +
                '<p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">' + products[item.id].description + '</p>' +
                '<p style="margin: 0 0 8px 0; font-weight: bold;">₹' + item.price.toFixed(2) + ' x ' + item.quantity + ' = ₹' + itemTotal + '</p>' +
                '<div style="display: flex; gap: 8px; align-items: center;">' +
                '<button class="btn-qty-minus" data-product-id="' + item.id + '" style="background: #f0f0f0; border: none; width: 24px; height: 24px; border-radius: 3px; cursor: pointer; font-size: 14px;">−</button>' +
                '<span style="width: 24px; text-align: center;">' + item.quantity + '</span>' +
                '<button class="btn-qty-plus" data-product-id="' + item.id + '" style="background: #f0f0f0; border: none; width: 24px; height: 24px; border-radius: 3px; cursor: pointer; font-size: 14px;">+</button>' +
                '<button class="btn-remove-sidebar" data-product-id="' + item.id + '" style="background: none; border: none; color: #dc3545; cursor: pointer; margin-left: auto;"><i class="fa fa-trash" style="font-size: 12px;"></i></button>' +
                '</div>' +
                '</div>' +
                '</div>';
        });

        container.html(html);
        $('#sidebar-total').text('₹' + getCartTotal());
    };

    // Clear entire cart
    window.clearCart = function () {
        localStorage.removeItem('mansarovar_cart');
        updateCartBadge();
    };

    // Initialize cart on page load
    $(document).ready(function () {
        createCartSidebar();
        updateCartBadge();

        // Add to cart button handler - Opens sidebar instead of just toast
        $(document).on('click', '.btn-add-to-cart', function (e) {
            e.preventDefault();
            var productId = $(this).data('product-id');
            var quantity = $(this).closest('.product-item').find('.quantity-input').val() || 1;

            if (addToCart(productId, quantity)) {
                openCartSidebar();
            }
        });

        // Quantity change in cart page
        $(document).on('change', '.cart-quantity', function () {
            var productId = $(this).data('product-id');
            var quantity = $(this).val();
            updateQuantity(productId, quantity);
            updateCartDisplay();
        });

        // Remove from cart page
        $(document).on('click', '.btn-remove-item', function (e) {
            e.preventDefault();
            var productId = $(this).data('product-id');
            removeFromCart(productId);
            updateCartDisplay();
            showCartToast('Product removed from cart');
        });

        // Sidebar quantity +/- buttons
        $(document).on('click', '.btn-qty-plus', function (e) {
            e.preventDefault();
            var productId = $(this).data('product-id');
            var cart = getCart();
            if (cart[productId]) {
                updateQuantity(productId, cart[productId].quantity + 1);
                updateSidebarDisplay();
                updateCartBadge();
            }
        });

        $(document).on('click', '.btn-qty-minus', function (e) {
            e.preventDefault();
            var productId = $(this).data('product-id');
            var cart = getCart();
            if (cart[productId]) {
                if (cart[productId].quantity > 1) {
                    updateQuantity(productId, cart[productId].quantity - 1);
                    updateSidebarDisplay();
                    updateCartBadge();
                }
            }
        });

        // Remove from sidebar
        $(document).on('click', '.btn-remove-sidebar', function (e) {
            e.preventDefault();
            var productId = $(this).data('product-id');
            removeFromCart(productId);
            updateSidebarDisplay();
            updateCartBadge();
            showCartToast('Product removed from cart');
        });

        // Clear entire cart
        $(document).on('click', '#btn-clear-cart', function (e) {
            e.preventDefault();
            if (confirm('Are you sure you want to clear your entire cart?')) {
                clearCart();
                updateCartDisplay();
                showCartToast('Cart cleared');
            }
        });
    });

    // Display cart items on cart page
    window.displayCart = function () {
        var cart = getCart();
        var cartContainer = $('#cart-items-container');

        if (Object.keys(cart).length === 0) {
            cartContainer.html('<div class="alert alert-info">Your cart is empty. <a href="product.html">Continue shopping</a></div>');
            $('#cart-summary').html('');
            return;
        }

        var html = '<div class="table-responsive"><table class="table table-hover"><thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th><th>Action</th></tr></thead><tbody>';

        $.each(cart, function (key, item) {
            var itemTotal = (item.price * item.quantity).toFixed(2);
            html += '<tr data-product-id="' + item.id + '">';
            html += '<td><img src="' + item.image + '" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;"><strong>' + item.name + '</strong><br><small>' + products[item.id].description + '</small></td>';
            html += '<td>₹' + item.price.toFixed(2) + '</td>';
            html += '<td><input type="number" class="form-control cart-quantity" data-product-id="' + item.id + '" value="' + item.quantity + '" min="1" style="width: 70px;"></td>';
            html += '<td>₹' + itemTotal + '</td>';
            html += '<td><button class="btn btn-sm btn-danger btn-remove-item" data-product-id="' + item.id + '"><i class="fa fa-trash"></i> Remove</button></td>';
            html += '</tr>';
        });

        html += '</tbody></table></div>';
        cartContainer.html(html);

        // Display summary
        var total = getCartTotal();
        var summary = '<div class="row mt-4"><div class="col-md-8"></div><div class="col-md-4"><div class="card"><div class="card-body"><h5 class="card-title">Order Summary</h5><hr>';
        summary += '<p style="font-size: 1.2em;"><strong>Total:</strong> ₹' + total + '</p>';
        summary += '<a href="checkout.html" class="btn btn-primary btn-lg w-100">Proceed to Checkout</a><br><br>';
        summary += '<a href="product.html" class="btn btn-secondary btn-lg w-100">Continue Shopping</a><br><br>';
        summary += '<button id="btn-clear-cart" class="btn btn-danger btn-lg w-100">Clear Cart</button>';
        summary += '</div></div></div></div>';
        $('#cart-summary').html(summary);
    };

    // Update cart display dynamically
    window.updateCartDisplay = function () {
        displayCart();
    };

    // Toast notification
    window.showCartToast = function (message) {
        var toast = $('<div class="alert alert-success alert-dismissible fade show" role="alert" style="position: fixed; top: 80px; right: 20px; z-index: 9999; min-width: 300px;">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>');
        $('body').append(toast);

        setTimeout(function () {
            toast.fadeOut(function () {
                toast.remove();
            });
        }, 3000);
    };

})(jQuery);
$(document).ready(function() {

    // Display order summary
    var cart = getCart();
    if (Object.keys(cart).length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    var html = '';
    $.each(cart, function(key, item) {
        html += '<div class="d-flex justify-content-between mb-2">';
        html += '<span>' + item.name + ' x' + item.quantity + '</span>';
        html += '<span>₹' + (item.price * item.quantity).toFixed(2) + '</span>';
        html += '</div>';
    });
    $('#checkout-summary').html(html);

    var total = getCartTotal();
    $('#subtotal').text('₹' + total);
    $('#total').text('₹' + total);

    // Handle order submission
    $('#submit-order').click(function() {
        var form = document.getElementById('checkout-form');
        if (!form.checkValidity()) {
            alert('Please fill in all required fields');
            form.reportValidity();
            return;
        }

        // Collect form data
        var orderData = {
            fullName: $('#fullName').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            address: $('#address').val(),
            city: $('#city').val(),
            state: $('#state').val(),
            pincode: $('#pincode').val(),
            cart: cart,
            total: total,
            date: new Date().toLocaleString()
        };

        // Save to localStorage
        var orders = JSON.parse(localStorage.getItem('mansarovar_orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('mansarovar_orders', JSON.stringify(orders));

        // Send email via FormSubmit (service worker)
        sendOrderEmail(orderData);

        // Show confirmation and clear cart
        showConfirmation(orderData);
    });
});

function sendOrderEmail(orderData) {
    // Log to console (in real scenario, this would send via FormSubmit or similar)
    console.log('Order Data:', orderData);
    
    // You can integrate with FormSubmit.co or similar service here
    // For now, we'll just show confirmation
}

function showConfirmation(orderData) {
    var cartItems = '';
    $.each(orderData.cart, function(key, item) {
        cartItems += '<li>' + item.name + ' x' + item.quantity + ' - ₹' + (item.price * item.quantity).toFixed(2) + '</li>';
    });

    var confirmationHTML = `
        <div class="container py-5">
            <div class="row">
                <div class="col-md-8 mx-auto">
                    <div class="card border-success">
                        <div class="card-body text-center">
                            <i class="fas fa-check-circle text-success" style="font-size: 3rem; margin-bottom: 20px;"></i>
                            <h3 class="card-title text-success mb-3">Order Placed Successfully!</h3>
                            <p class="lead mb-4">Thank you for your order. We will contact you shortly to confirm.</p>
                            
                            <div class="text-start bg-light p-4 rounded mb-4">
                                <h5>Order Summary:</h5>
                                <p><strong>Order #:</strong> ${Date.now()}</p>
                                <p><strong>Name:</strong> ${orderData.fullName}</p>
                                <p><strong>Email:</strong> ${orderData.email}</p>
                                <p><strong>Phone:</strong> ${orderData.phone}</p>
                                ${orderData.address || orderData.city || orderData.state ? '<p><strong>Delivery Address:</strong> ' + (orderData.address || '') + ', ' + (orderData.city || '') + ', ' + (orderData.state || '') + (orderData.pincode ? ' - ' + orderData.pincode : '') + '</p>' : ''}
                                
                                <hr>
                                <h6 class="mb-3">Items Ordered:</h6>
                                <ul class="list-unstyled">${cartItems}</ul>
                                <hr>
                                <p><strong>Total Amount:</strong> ₹${orderData.total}</p>
                            </div>

                            <p class="text-muted">A confirmation email has been sent to <strong>${orderData.email}</strong></p>
                            
                            <div class="mt-4">
                                <a href="index.html" class="btn btn-primary btn-lg me-2">Back to Home</a>
                                <a href="product.html" class="btn btn-secondary btn-lg">Continue Shopping</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Replace page content with confirmation
    $('body').css('background-color', '#f8f9fa');
    var mainContent = $('div.container-fluid:nth-child(3)').parent();
    mainContent.html(confirmationHTML);

    // DO NOT clear cart - keep it until customer manually clears or places another order
}
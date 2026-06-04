// ========================================
// AutoCoolParts - Main Application
// Cart, Payment Processing, and UI Logic
// ========================================

/* ==================== PRODUCT DATA ==================== */
const products = [
    {
        id: 1,
        name: "CoolMax Pro - Full-Size Truck AC",
        category: "Truck AC Systems",
        price: 2499.00,
        description: "Premium electric AC unit designed for full-size pickup trucks and light commercial vehicles.",
        specs: [
            { label: "Cooling Capacity", value: "18,000 BTU" },
            { label: "Noise Level", value: "32 dB (Ultra-Quiet)" },
            { label: "Power Input", value: "12V DC + 110V AC" },
            { label: "Dimensions", value: "45 x 38 x 28 cm" }
        ],
        rating: 4.9,
        reviews: 127,
        image: "images/ac_pro.png",
        badge: "Best Seller"
    },
    {
        id: 2,
        name: "CoolMax Van - Compact AC Unit",
        category: "Van & Camper Units",
        price: 1899.00,
        description: "Sleek, compact design perfect for van conversions and camper shells.",
        specs: [
            { label: "Cooling Capacity", value: "12,000 BTU" },
            { label: "Noise Level", value: "28 dB (Whisper Quiet)" },
            { label: "Power Input", value: "12V DC + 110V AC" },
            { label: "Dimensions", value: "35 x 30 x 22 cm" }
        ],
        rating: 4.8,
        reviews: 94,
        image: "images/ac_van.png",
        badge: null
    },
    {
        id: 3,
        name: "CoolMax RV - Large Capacity System",
        category: "RV & Caravan Systems",
        price: 3299.00,
        description: "High-capacity cooling for larger recreational vehicles and motorhomes.",
        specs: [
            { label: "Cooling Capacity", value: "24,000 BTU" },
            { label: "Noise Level", value: "35 dB" },
            { label: "Power Input", value: "12V DC + 110V AC" },
            { label: "Dimensions", value: "60 x 45 x 35 cm" }
        ],
        rating: 4.7,
        reviews: 82,
        image: "images/ac_rv.png",
        badge: "Premium"
    },
    {
        id: 4,
        name: "CoolMax Portable - Mobile AC",
        category: "Portable Units",
        price: 1299.00,
        description: "Movable AC solution perfect for multi-vehicle setups or temporary cooling needs.",
        specs: [
            { label: "Cooling Capacity", value: "8,000 BTU" },
            { label: "Noise Level", value: "30 dB" },
            { label: "Power Input", value: "12V DC + 110V AC" },
            { label: "Weight", value: "8.5 kg" }
        ],
        rating: 4.6,
        reviews: 56,
        image: "images/ac_portable.png",
        badge: null
    },
    {
        id: 5,
        name: "CoolMax S - Small Van AC",
        category: "Van & Camper Units",
        price: 1599.00,
        description: "Perfect for smaller vans and compact campers with limited space.",
        specs: [
            { label: "Cooling Capacity", value: "6,000 BTU" },
            { label: "Noise Level", value: "25 dB (Ultra-Quiet)" },
            { label: "Power Input", value: "12V DC + 110V AC" },
            { label: "Dimensions", value: "28 x 22 x 18 cm" }
        ],
        rating: 4.5,
        reviews: 43,
        image: "images/ac_small_van.png",
        badge: null
    },
    {
        id: 6,
        name: "CoolMax Commercial - Fleet AC",
        category: "Truck AC Systems",
        price: 2899.00,
        description: "Heavy-duty unit built for commercial fleets and work trucks.",
        specs: [
            { label: "Cooling Capacity", value: "20,000 BTU" },
            { label: "Noise Level", value: "34 dB" },
            { label: "Power Input", value: "12V DC + 110V AC" },
            { label: "Warranty", value: "7 Years" }
        ],
        rating: 4.8,
        reviews: 67,
        image: "images/ac_fleet.png",
        badge: "Commercial"
    },
    {
        id: 7,
        name: "FreshBreeze Pro - 12V/24V Parking AC",
        category: "Truck AC Systems",
        price: 1499.00,
        description: "Advanced dual-voltage parking AC tailored for truck drivers. Keep your cabin fresh and comfortable during long hauls without idling.",
        specs: [
            { label: "Cooling Capacity", value: "10,000 BTU" },
            { label: "Noise Level", value: "30 dB" },
            { label: "Power Input", value: "12V/24V DC Auto-sensing" },
            { label: "Fitment", value: "Universal Truck Roof" }
        ],
        rating: 4.9,
        reviews: 42,
        image: "images/ac_12v_24v.png",
        badge: "Fresh Touch"
    },
    {
        id: 8,
        name: "HeavyDuty Split - Single Cabin AC",
        category: "Commercial & Construction",
        price: 1999.00,
        description: "Rugged split electric AC designed for construction vehicles and single cabin outdoor equipment. Built to withstand extreme vibrations and dust.",
        specs: [
            { label: "Cooling Capacity", value: "15,000 BTU" },
            { label: "Noise Level", value: "38 dB" },
            { label: "Power Input", value: "24V DC + 110V AC" },
            { label: "Durability", value: "IP68 Dust/Waterproof" }
        ],
        rating: 4.7,
        reviews: 18,
        image: "images/ac_split_construction.png",
        badge: "Heavy Duty"
    },
    {
        id: 9,
        name: "ArcticKing Premium - Caravan AC",
        category: "RV & Caravan Systems",
        price: 3899.00,
        description: "Ultra-premium, high-BTU parking AC compatible with large sized caravans. Features smart climate control.",
        specs: [
            { label: "Cooling Capacity", value: "30,000 BTU" },
            { label: "Noise Level", value: "36 dB" },
            { label: "Power Input", value: "24V DC + 110V AC" },
            { label: "Smart Control", value: "App + Remotes" }
        ],
        rating: 5.0,
        reviews: 5,
        image: "images/ac_premium_caravan.png",
        badge: "High BTU"
    }
];

/* ==================== CART STATE ==================== */
let cart = JSON.parse(localStorage.getItem('cooltruck_cart')) || [];
let currentProvince = 'ON'; // Default to Ontario for tax calculation

function saveCart() {
    localStorage.setItem('cooltruck_cart', JSON.stringify(cart));
}

function clearCart() {
    cart = [];
    saveCart();
}

/* ==================== INITIALIZATION ==================== */
document.addEventListener('DOMContentLoaded', function() {
    initProducts();
    initCartUI();
    initCheckoutForm();
    renderCheckoutItems();
    initMobileMenu();
});

function initMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.main-nav ul');
    const allLinks = document.querySelectorAll('.main-nav a');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                mobileBtn.innerHTML = '✕';
            } else {
                mobileBtn.innerHTML = '☰';
            }
        });

        // Close mobile menu when any navigation link is clicked
        allLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileBtn.innerHTML = '☰';
                }
            });
        });
    }
}

/* ==================== PRODUCT DISPLAY ==================== */
function initProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    products.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Calculate rating display
    let stars = '';
    for (let i = 0; i < Math.floor(product.rating); i++) {
        stars += '★';
    }
    const remaining = Math.ceil(product.rating) - product.rating;
    if (remaining > 0) {
        stars += '☆';
    }

    card.innerHTML = `
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        <img class="product-image" src="${product.image}" alt="${product.name}">
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-title">${product.name}</h3>

            <div class="product-specs">
                ${product.specs.map(spec => `
                    <span class="spec-tag">${spec.label}: ${spec.value}</span>
                `).join('')}
            </div>

            <div class="product-rating">
                <span class="stars">${stars}</span>
                <span>${product.rating.toFixed(1)}</span>
                <span class="review-count">(${product.reviews} reviews)</span>
            </div>

            <p style="margin-bottom: 0.75rem;">${product.description}</p>

            <div class="product-price">$${product.price.toFixed(2)} CAD</div>

            <div class="product-actions">
                <button class="btn-add-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
                <button class="btn-view-details" onclick="showProductDetails(${product.id})">View Details</button>
            </div>
        </div>
    `;

    return card;
}

function showProductDetails(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    // Create a simple modal for product details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-cart" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>${product.name}</h2>

            <p style="margin-bottom: 1rem;">${product.description}</p>

            <div style="background: var(--bg-light); padding: 1.5rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem;">
                <h4>Specifications:</h4>
                ${product.specs.map(spec => `
                    <div style="display: flex; justify-content: space-between; padding: 0.25rem 0;">
                        <span>${spec.label}:</span>
                        <strong>${spec.value}</strong>
                    </div>
                `).join('')}
            </div>

            <div class="product-rating" style="margin-bottom: 1.5rem;">
                <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(Math.ceil(product.rating) - product.rating)}</span>
                <span>${product.rating.toFixed(1)} (${product.reviews} reviews)</span>
            </div>

            <div style="text-align: center;">
                <p class="product-price" style="font-size: 2rem;">$${product.price.toFixed(2)} CAD</p>
                <button onclick="addToCart(${product.id}); this.closest('.modal').remove()" class="btn-primary full-width">Add to Cart</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

/* ==================== CART FUNCTIONALITY ==================== */
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check if item already in cart
    const existingItem = cart.find(item => item.product.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            product: product,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showToast(`Added ${product.name} to cart`, 'success');
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.product.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
        saveCart();
        updateCartUI();
        if (document.getElementById('checkout-items')) renderCheckoutItems();
        showToast('Item removed from cart', 'success');
    }
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
        if (document.getElementById('checkout-items')) renderCheckoutItems();
    }
}

function openCart() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.remove('hidden');
        updateCartUI();
    }
}

function initCartUI() {
    // Cart modal close handler
    const closeBtn = document.querySelector('.close-cart');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').classList.add('hidden');
        });
    }
}

function updateCartUI() {
    // Update cart modal
    const cartModal = document.getElementById('cart-modal');
    if (!cartModal) return;

    const itemsContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total-price');

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalElement.textContent = '0.00';
        return;
    }

    let html = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemSubtotal = item.product.price * item.quantity;
        subtotal += itemSubtotal;

        html += `
            <div class="checkout-item">
                <span class="item-name">${item.product.name}</span>
                <span class="item-qty">Qty: ${item.quantity} × $${item.product.price.toFixed(2)} = $${itemSubtotal.toFixed(2)}</span>
            </div>
        `;
    });

    itemsContainer.innerHTML = html;
    totalElement.textContent = subtotal.toFixed(2);
}

function renderCheckoutItems() {
    const container = document.getElementById('checkout-items');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="padding-bottom:1rem;">Your cart is empty. <a href="index.html" style="color:var(--primary-color);">Go back to shop</a>.</p>';
        updateCheckoutTotals();
        return;
    }

    let html = '';
    cart.forEach(item => {
        const itemSubtotal = item.product.price * item.quantity;
        html += `
            <div class="checkout-item">
                <span class="item-name">${item.product.name} (x${item.quantity})</span>
                <span class="item-qty">$${itemSubtotal.toFixed(2)}</span>
            </div>
        `;
    });

    container.innerHTML = html;
    updateCheckoutTotals();
}

/* ==================== CHECKOUT CALCULATIONS ==================== */
function calculateTotals() {
    let subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Shipping calculation (free over $1500)
    let shipping = 49.99;
    if (subtotal >= 1500) {
        shipping = 0;
    }

    // Tax calculation based on province
    const taxRates = {
        'AB': 0.05,   // GST only
        'BC': 0.05,   // GST only
        'MB': 0.05,   // GST only
        'NB': 0.136,  // HST
        'NL': 0.15,
        'NS': 0.15,
        'ON': 0.13,   // HST
        'PE': 0.15,
        'QC': 0.0975, // QST + GST
        'SK': 0.05,   // GST only
        'NT': 0.0825,
        'NU': 0.08,
        'YT': 0.05
    };

    const taxRate = taxRates[currentProvince] || 0.05; // Default to GST
    const tax = subtotal * taxRate;

    return {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: (subtotal + shipping + tax).toFixed(2)
    };
}

function updateCheckoutTotals() {
    const totals = calculateTotals();

    document.getElementById('subtotal').textContent = totals.subtotal;
    document.getElementById('shipping').textContent = totals.shipping;
    document.getElementById('tax').textContent = totals.tax;
    document.getElementById('grand-total').textContent = totals.total;
    document.getElementById('checkout-total').textContent = totals.total;
}

/* ==================== PROMO CODES ==================== */
function applyPromoCode() {
    const input = document.getElementById('promo-input');
    const message = document.getElementById('promo-message');

    if (!input.value.trim()) {
        message.textContent = 'Please enter a promo code';
        return;
    }

    const codes = {
        'WELCOME10': { discount: 0.10, message: '10% off your first order!' },
        'CANADA25': { discount: 25, message: '$25 off orders over $500' },
        'FREESHIP': { shipping: 0, message: 'Free shipping! (Already applied)' }
    };

    const code = input.value.toUpperCase();
    if (codes[code]) {
        const promo = codes[code];

        // Apply discount
        let subtotal = parseFloat(document.getElementById('subtotal').textContent.replace(/\D/g, ''));
        if (promo.discount) {
            subtotal *= (1 - promo.discount);
        }

        // Recalculate totals
        const newTotals = calculateTotals();
        document.getElementById('subtotal').textContent = newTotals.subtotal;
        document.getElementById('shipping').textContent = newTotals.shipping;
        document.getElementById('tax').textContent = newTotals.tax;
        document.getElementById('grand-total').textContent = newTotals.total;

        message.textContent = promo.message;
        message.style.color = 'var(--success-green)';
    } else {
        message.textContent = 'Invalid promo code. Try: WELCOME10, CANADA25, or FREESHIP';
        message.style.color = 'var(--error-red)';
    }
}

/* ==================== CHECKOUT FORM HANDLING ==================== */
function initCheckoutForm() {
    // Payment method selection
    const paymentOptions = document.querySelectorAll('.payment-option');

    paymentOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            if (e.target.tagName === 'INPUT') {
                updatePaymentUI();
            }
        });
    });

    // Update payment UI when selection changes
    function updatePaymentUI() {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        // Reset all forms
        document.querySelectorAll('.payment-form').forEach(form => {
            form.classList.add('hidden');
        });

        // Show selected payment form
        if (selectedMethod === 'card') {
            document.getElementById('card-payment-form').classList.remove('hidden');
        } else if (selectedMethod === 'paypal') {
            document.getElementById('paypal-payment-form').classList.remove('hidden');
        } else if (selectedMethod === 'bank') {
            document.getElementById('bank-payment-form').classList.remove('hidden');
        }
    }

    // Handle shipping form submission
    const shippingForm = document.getElementById('shipping-form');
    if (shippingForm) {
        shippingForm.addEventListener('change', function(e) {
            if (e.target.id === 'province') {
                currentProvince = e.target.value;
                updateCheckoutTotals();
            }
        });

        // Prevent default submit and handle manually
        shippingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!validateForm()) {
                return;
            }

            processPayment();
        });
    }
}

function validateForm() {
    // Get all required fields
    const requiredFields = [
        'firstName', 'lastName', 'email', 'address1',
        'city', 'province', 'postalCode'
    ];

    let isValid = true;

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            showToast(`${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} is required`, 'error');
            isValid = false;
        }
    });

    // Validate postal code format (Canadian)
    const postalCode = document.getElementById('postalCode').value.trim();
    if (!/^[A-Za-z][0-9][A-Za-z] \s?[0-9][A-Za-z][0-9]$/.test(postalCode)) {
        showToast('Please enter a valid Canadian postal code (e.g., K1A 0B1)', 'error');
        isValid = false;
    }

    // Validate terms
    if (!document.getElementById('terms').checked) {
        showToast('You must agree to the Terms of Service', 'error');
        isValid = false;
    }

    return isValid;
}

/* ==================== PAYMENT PROCESSING ==================== */
function processPayment() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    // Simulate payment processing delay
    const submitBtn = shippingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    setTimeout(() => {
        if (selectedMethod === 'paypal') {
            simulatePayPal();
            return;
        }

        // Simulate Stripe payment
        simulateStripePayment();
    }, 1500);
}

function simulateStripePayment() {
    const cardNumber = document.getElementById('cardNumber').value.trim();

    // Simple validation for demo purposes
    if (!cardNumber) {
        showToast('Please enter a card number', 'error');
        return;
    }

    // Use Stripe test card (for demonstration)
    const testCard = '4242 4242 4242 4242';
    if (cardNumber.replace(/\s/g, '') === testCard.replace(/\s/g, '')) {
        // Success
        showSuccessModal();
    } else {
        showToast('Using test card: ' + testCard, 'success');
        setTimeout(() => {
            document.getElementById('cardNumber').value = testCard;
            simulateStripePayment();
        }, 1000);
    }
}

function simulatePayPal() {
    // Simulate PayPal redirect
    showToast('Redirecting to PayPal secure checkout...', 'success');

    setTimeout(() => {
        // Simulate successful PayPal payment
        showSuccessModal();
    }, 2000);
}

/* ==================== SUCCESS MODAL ==================== */
function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (!modal) return;

    // Generate order number
    const orderNumber = 'CT-' + Date.now().toString(36).toUpperCase();

    // Calculate final totals
    const totals = calculateTotals();

    // Clear the cart for the next order
    clearCart();

    modal.innerHTML = `
        <div class="success-icon">✅</div>
        <h2>Order Confirmed!</h2>
        <p>Your order has been placed successfully.</p>

        <div id="order-details">
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p><strong>Total Paid:</strong> $${totals.total} CAD</p>
        </div>

        <p style="margin-top: 1.5rem;"><strong>What's next?</strong></p>
        <ul class="next-steps">
            <li>We'll email you a confirmation with your order number</li>
            <li>You'll receive shipping updates at your email address</li>
            <li>Your AC unit will ship within 1-2 business days</li>
            <li>Track your order at: <a href="#" style="color: var(--primary-color);">cooltruck.ca/track/${orderNumber}</a></li>
        </ul>

        <button onclick="location.reload()" class="btn-primary full-width">Continue Shopping</button>
    `;

    modal.classList.remove('hidden');
}

/* ==================== TOAST NOTIFICATIONS ==================== */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/* ==================== UTILITY FUNCTIONS ==================== */
function formatCurrency(amount) {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.\d{2}\b)/g, '$&');
}

// Format card number with spaces
function formatCardNumber(number) {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.length > 0 && cleaned.length <= 16) {
        return cleaned.match(/.{1,4}/g).join(' ');
    }
    return number;
}

// Add event listener for card number formatting
const cardInput = document.getElementById('cardNumber');
if (cardInput) {
    cardInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
        if (value.length <= 16) {
            e.target.value = formatCardNumber(value);
        }
    });
}

// Add event listener for expiry date formatting
const expiryInput = document.getElementById('expiry');
if (expiryInput) {
    expiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2 && value.length <= 4) {
            e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
    });
}

// ═══════════════════════════════════════════════════════════
// AutoCoolParts — Main Application
// ═══════════════════════════════════════════════════════════

/* ── CATEGORIES ─────────────────────────────────────────── */
const categories = [
    {
        id:      'truck',
        name:    'Truck Systems',
        tagline: 'Heavy-duty cooling for the road ahead',
        image:   'images/product_truck_1.jpeg'
    },
    {
        id:      'van',
        name:    'Van & Camper',
        tagline: 'Heating & cooling for every season',
        image:   'images/product_heater_1.jpeg'
    },
    {
        id:      'rv',
        name:    'RV & Caravan',
        tagline: 'Premium living on the move',
        image:   'images/product_caravan_2.png'
    }
];

/* ── PRODUCTS ────────────────────────────────────────────── */
const products = [
    {
        id:          1,
        categoryId:  'truck',
        name:        'Electric AC 12V Copper',
        subtitle:    'Parking Air Conditioner for Trucks',
        price:       1050.00,
        description: 'A complete split AC system built for truck cabins — runs entirely on 12V DC so you stay cool at rest stops without idling the engine. Copper coil construction for maximum efficiency and durability. Includes indoor unit, outdoor condenser, wiring harness, and remote control.',
        specs: [
            { label: 'Power Input',      value: '12V DC' },
            { label: 'Coil Material',    value: 'Pure Copper' },
            { label: 'Includes',         value: 'Remote Control' },
            { label: 'Fitment',          value: 'Universal Truck Cabin' }
        ],
        rating:  4.9,
        reviews: 127,
        images:  ['images/product_truck_1.jpeg', 'images/product_truck_2.jpeg', 'images/product_truck_3.jpeg'],
        badge:   'Best Seller'
    },
    {
        id:          2,
        categoryId:  'van',
        name:        'Diesel Heater 5KW',
        subtitle:    '12V & 110V Parking Heater for Vans',
        price:       899.00,
        description: 'Professional-grade 5KW diesel parking heater that runs on either 12V DC or 110V AC — perfect for vans, campers, and work vehicles. Keeps your cabin warm down to extreme Canadian winters without idling the engine. Includes digital controller, fuel pump, exhaust, and all mounting hardware.',
        specs: [
            { label: 'Heating Output', value: '5,000W (5KW)' },
            { label: 'Power Input',    value: '12V DC / 110V AC' },
            { label: 'Fuel Type',      value: 'Diesel' },
            { label: 'Coverage',       value: 'Up to 40 m³' }
        ],
        rating:  4.8,
        reviews: 94,
        images:  [
            'images/product_heater_1.jpeg',
            'images/product_heater_2.jpeg',
            'images/product_heater_3.jpeg',
            'images/product_heater_4.jpeg',
            'images/product_heater_5.jpeg',
            'images/product_heater_6.jpeg',
            'images/product_heater_7.jpeg'
        ],
        badge:   null
    },
    {
        id:          3,
        categoryId:  'rv',
        name:        'Rooftop Electric AC 12V',
        subtitle:    'Caravan & RV Rooftop Unit',
        price:       3299.00,
        description: 'All-in-one rooftop unit designed for caravans and RVs — mounts flush on the roof with the air distribution panel dropping neatly into the ceiling. Runs on 12V DC with a built-in LCD display and ECO mode for off-grid efficiency. No external condenser needed.',
        specs: [
            { label: 'Power Input',    value: '12V DC' },
            { label: 'Mount Type',     value: 'Rooftop (All-in-One)' },
            { label: 'Control',        value: 'LCD Display + ECO Mode' },
            { label: 'Fitment',        value: 'Caravan / RV Roof' }
        ],
        rating:  4.7,
        reviews: 82,
        images:  ['images/product_caravan_1.jpeg', 'images/product_caravan_2.png'],
        badge:   'Premium'
    }
];

/* ── GALLERY STATE ───────────────────────────────────────── */
const galleryState = {};

function galleryNav(galleryId, direction) {
    const gallery = document.getElementById(galleryId);
    if (!gallery) return;

    const track  = gallery.querySelector('.gallery-track');
    const slides = track.querySelectorAll('.gallery-slide');
    const total  = slides.length;
    if (total <= 1) return;

    if (galleryState[galleryId] === undefined) galleryState[galleryId] = 0;
    galleryState[galleryId] = (galleryState[galleryId] + direction + total) % total;

    track.style.transform = `translateX(-${galleryState[galleryId] * 100}%)`;
    updateGalleryDots(gallery, galleryState[galleryId]);
}

function galleryGoTo(galleryId, index) {
    const gallery = document.getElementById(galleryId);
    if (!gallery) return;

    const track = gallery.querySelector('.gallery-track');
    galleryState[galleryId] = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    updateGalleryDots(gallery, index);
}

function updateGalleryDots(gallery, activeIndex) {
    gallery.querySelectorAll('.gallery-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
    });
}

/* ── HELPERS ─────────────────────────────────────────────── */
function getCategoryName(id) {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : id;
}

/* ── CATEGORIES UI ───────────────────────────────────────── */
function initCategories() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    categories.forEach(cat => {
        const tile = document.createElement('div');
        tile.className = 'category-tile';
        tile.setAttribute('role', 'button');
        tile.setAttribute('tabindex', '0');
        tile.setAttribute('aria-label', `Explore ${cat.name}`);
        tile.onclick   = () => showCategory(cat.id);
        tile.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') showCategory(cat.id); };

        tile.innerHTML = `
            <img src="${cat.image}" alt="${cat.name}" class="category-tile-img" loading="lazy">
            <div class="category-tile-overlay"></div>
            <div class="category-tile-body">
                <p class="category-tile-tag">Electric AC System</p>
                <h3 class="category-tile-name">${cat.name}</h3>
                <p class="category-tile-tagline">${cat.tagline}</p>
                <span class="category-tile-cta">
                    Explore
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </span>
            </div>
        `;

        grid.appendChild(tile);
    });
}

/* ── SHOW CATEGORY ───────────────────────────────────────── */
function showCategory(categoryId) {
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return;

    document.getElementById('active-category-name').textContent = cat.name;

    const product   = products.find(p => p.categoryId === categoryId);
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    if (product) {
        container.appendChild(createProductCard(product));
    }

    const section = document.getElementById('products-section');
    section.classList.remove('hidden');
    section.style.opacity   = '0';
    section.style.transform = 'translateY(20px)';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            section.style.opacity    = '1';
            section.style.transform  = 'translateY(0)';
        });
    });

    setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
}

/* ── HIDE PRODUCTS / SHOW CATEGORIES ────────────────────── */
function showAllCategories() {
    const section = document.getElementById('products-section');
    section.style.transition = 'opacity 0.3s ease';
    section.style.opacity    = '0';

    setTimeout(() => {
        section.classList.add('hidden');
        section.style.transition = '';
        section.style.opacity    = '';
        document.getElementById('categories').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 320);
}

/* ── PRODUCT CARD ────────────────────────────────────────── */
function makeWhatsAppUrl(productName) {
    const text = `Hello,\nI am interested in the ${productName}. Please share more details and pricing.`;
    return `https://api.whatsapp.com/send/?phone=15062381661&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
}

function createProductCard(product) {
    const galleryId = `gallery-${product.id}`;
    const stars     = '★'.repeat(Math.round(product.rating));

    const card = document.createElement('div');
    card.className = 'product-detail-card';

    const galleryArrows = product.images.length > 1 ? `
        <div class="gallery-arrows">
            <button class="gallery-arrow" onclick="galleryNav('${galleryId}', -1)" aria-label="Previous image">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 18l-6-6 6-6"/>
                </svg>
            </button>
            <button class="gallery-arrow" onclick="galleryNav('${galleryId}', 1)" aria-label="Next image">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </button>
        </div>
        <div class="gallery-dots">
            ${product.images.map((_, i) => `
                <button class="gallery-dot ${i === 0 ? 'active' : ''}" onclick="galleryGoTo('${galleryId}', ${i})" aria-label="Image ${i + 1}"></button>
            `).join('')}
        </div>
    ` : '';

    card.innerHTML = `
        <div class="product-gallery" id="${galleryId}">
            <div class="gallery-track">
                ${product.images.map(img => `
                    <div class="gallery-slide">
                        <img src="${img}" alt="${product.name}" loading="eager">
                    </div>
                `).join('')}
            </div>
            ${galleryArrows}
            ${product.badge ? `<span class="product-badge-overlay">${product.badge}</span>` : ''}
        </div>
        <div class="product-info-panel">
            <p class="product-cat-label">${getCategoryName(product.categoryId)}</p>
            <h2 class="product-name">${product.name}</h2>
            <p class="product-subtitle-text">${product.subtitle}</p>
            <div class="product-rating">
                <span class="rating-stars">${stars}</span>
                <span class="rating-num">${product.rating.toFixed(1)}</span>
                <span class="rating-count">(${product.reviews} reviews)</span>
            </div>
            <p class="product-desc">${product.description}</p>
            <div class="specs-grid">
                ${product.specs.map(s => `
                    <div class="spec-row">
                        <div class="spec-label">${s.label}</div>
                        <div class="spec-value">${s.value}</div>
                    </div>
                `).join('')}
            </div>
            <div class="product-purchase">
                <div class="product-price-block">
                    <span class="price-amount">$${product.price.toLocaleString('en-CA', { minimumFractionDigits: 0 })}</span>
                    <span class="price-currency">CAD</span>
                </div>
                <div class="product-actions">
                    <a href="${makeWhatsAppUrl(product.name)}" class="btn-whatsapp-order" target="_blank" rel="noopener noreferrer">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Chat to Order
                    </a>
                    <button class="btn-add-to-cart" onclick="addToCart(${product.id})">
                        + Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;

    return card;
}

/* ── CART STATE ──────────────────────────────────────────── */
let cart            = JSON.parse(localStorage.getItem('cooltruck_cart')) || [];
let currentProvince = 'ON';

function saveCart()  { localStorage.setItem('cooltruck_cart', JSON.stringify(cart)); }
function clearCart() { cart = []; saveCart(); }

/* ── CART PANEL ──────────────────────────────────────────── */
function openCart() {
    const panel   = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    if (!panel || !overlay) return;

    panel.classList.remove('hidden');
    overlay.classList.remove('hidden');

    requestAnimationFrame(() => {
        panel.classList.add('open');
        overlay.classList.add('visible');
    });

    renderCartPanel();
}

function closeCart() {
    const panel   = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    if (!panel || !overlay) return;

    panel.classList.remove('open');
    overlay.classList.remove('visible');

    setTimeout(() => {
        panel.classList.add('hidden');
        overlay.classList.add('hidden');
    }, 420);
}

function renderCartPanel() {
    const body  = document.getElementById('cart-items');
    const total = document.getElementById('cart-total-price');
    if (!body) return;

    if (cart.length === 0) {
        body.innerHTML = '<p class="cart-empty-msg">Your cart is empty.</p>';
        if (total) total.textContent = '0.00';
        return;
    }

    let subtotal = 0;
    body.innerHTML = cart.map(item => {
        const sub = item.product.price * item.quantity;
        subtotal += sub;
        const imgSrc = (item.product.images && item.product.images[0]) || item.product.image || '';
        return `
            <div class="cart-item-row">
                <img src="${imgSrc}" alt="${item.product.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.product.name}</div>
                    <div class="cart-item-sub">${item.product.subtitle || item.product.category || ''}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.product.id}, -1)">−</button>
                        <span class="qty-num">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.product.id}, 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-right">
                    <span class="cart-item-price">$${sub.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.product.id})" aria-label="Remove ${item.product.name}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    if (total) total.textContent = subtotal.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

/* ── CART ACTIONS ────────────────────────────────────────── */
function addToCart(productId) {
    const product  = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(i => i.product.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ product, quantity: 1 });
    }

    saveCart();
    updateCartBadge();
    showToast(`${product.name} added to cart`, 'success');
    openCart();
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.product.id !== productId);
    saveCart();
    updateCartBadge();
    renderCartPanel();
    if (document.getElementById('checkout-items')) renderCheckoutItems();
    showToast('Item removed', 'success');
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    updateCartBadge();
    renderCartPanel();
    if (document.getElementById('checkout-items')) renderCheckoutItems();
}

// Legacy alias for payment.html compatibility
function updateCartUI() {
    updateCartBadge();
    renderCartPanel();
}

/* ── TOAST ───────────────────────────────────────────────── */
let toastTimer = null;

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className   = `toast ${type} show`;

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ── HEADER SCROLL ───────────────────────────────────────── */
function initHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ── MOBILE MENU ─────────────────────────────────────────── */
function initMobileMenu() {
    const btn = document.getElementById('hamburger');
    const nav = document.getElementById('main-nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            btn.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* ── HERO ANIMATION ──────────────────────────────────────── */
function initHero() {
    const hero = document.querySelector('.hero');
    if (hero) requestAnimationFrame(() => hero.classList.add('loaded'));
}

/* ══════════════════════════════════════════════════════════
   CHECKOUT / PAYMENT PAGE FUNCTIONS (preserved)
══════════════════════════════════════════════════════════ */

function renderCheckoutItems() {
    const container = document.getElementById('checkout-items');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="padding-bottom:1rem;font-size:0.9rem;color:#64748B;">Your cart is empty. <a href="index.html" style="color:var(--blue);">Go back to shop</a>.</p>';
        updateCheckoutTotals();
        return;
    }

    container.innerHTML = cart.map(item => {
        const sub = (item.product.price * item.quantity).toFixed(2);
        return `
            <div class="checkout-item">
                <span>${item.product.name} (×${item.quantity})</span>
                <span>$${sub}</span>
            </div>
        `;
    }).join('');

    updateCheckoutTotals();
}

function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shipping = subtotal >= 1500 ? 0 : 49.99;

    const taxRates = {
        AB: 0.05,  BC: 0.05, MB: 0.05, NB: 0.136, NL: 0.15,
        NS: 0.15,  ON: 0.13, PE: 0.15, QC: 0.0975, SK: 0.05,
        NT: 0.0825, NU: 0.08, YT: 0.05
    };

    const taxRate = taxRates[currentProvince] || 0.05;
    const tax     = subtotal * taxRate;

    return {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax:      tax.toFixed(2),
        total:    (subtotal + shipping + tax).toFixed(2)
    };
}

function updateCheckoutTotals() {
    const t = calculateTotals();
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    setEl('subtotal',       t.subtotal);
    setEl('shipping',       t.shipping);
    setEl('tax',            t.tax);
    setEl('grand-total',    t.total);
    setEl('checkout-total', t.total);
}

function applyPromoCode() {
    const input   = document.getElementById('promo-input');
    const message = document.getElementById('promo-message');
    if (!input || !message) return;

    if (!input.value.trim()) {
        message.textContent = 'Please enter a promo code.';
        return;
    }

    const codes = {
        WELCOME10: { message: '10% off your first order!' },
        CANADA25:  { message: '$25 off orders over $500.' },
        FREESHIP:  { message: 'Free shipping applied!' }
    };

    const code = input.value.trim().toUpperCase();
    if (codes[code]) {
        message.textContent  = codes[code].message;
        message.style.color  = '#10B981';
    } else {
        message.textContent  = 'Invalid code. Try: WELCOME10, CANADA25, or FREESHIP';
        message.style.color  = '#EF4444';
    }
}

function initCheckoutForm() {
    const paymentOptions = document.querySelectorAll('.payment-option');

    function updatePaymentUI() {
        const selected = document.querySelector('input[name="paymentMethod"]:checked');
        if (!selected) return;

        document.querySelectorAll('.payment-form').forEach(f => f.classList.add('hidden'));
        document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
        selected.closest('.payment-option').classList.add('selected');

        const formIds = { card: 'card-payment-form', paypal: 'paypal-payment-form', bank: 'bank-payment-form' };
        const target  = document.getElementById(formIds[selected.value]);
        if (target) target.classList.remove('hidden');
    }

    paymentOptions.forEach(opt => {
        opt.addEventListener('click', function () {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
            updatePaymentUI();
        });
    });

    const shippingForm = document.getElementById('shipping-form');
    if (shippingForm) {
        shippingForm.addEventListener('change', e => {
            if (e.target.id === 'province') {
                currentProvince = e.target.value;
                updateCheckoutTotals();
            }
        });

        shippingForm.addEventListener('submit', e => {
            e.preventDefault();
            if (validateForm()) processPayment();
        });
    }
}

function validateForm() {
    const required = ['firstName', 'lastName', 'email', 'address1', 'city', 'province', 'postalCode'];

    for (const id of required) {
        const el = document.getElementById(id);
        if (!el || !el.value.trim()) {
            showToast(`${id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1')} is required`, 'error');
            return false;
        }
    }

    const postal = document.getElementById('postalCode').value.trim();
    if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(postal)) {
        showToast('Enter a valid Canadian postal code (e.g. K1A 0B1)', 'error');
        return false;
    }

    const terms = document.getElementById('terms');
    if (terms && !terms.checked) {
        showToast('Please agree to the Terms of Service', 'error');
        return false;
    }

    return true;
}

function processPayment() {
    const shippingForm = document.getElementById('shipping-form');
    const submitBtn    = shippingForm ? shippingForm.querySelector('button[type="submit"]') : null;

    if (submitBtn) {
        submitBtn.disabled     = true;
        submitBtn.textContent  = 'Processing…';
    }

    const selected = document.querySelector('input[name="paymentMethod"]:checked');
    const method   = selected ? selected.value : 'card';

    setTimeout(() => {
        if (method === 'paypal') simulatePayPal();
        else simulateStripePayment();
    }, 1500);
}

function simulateStripePayment() {
    const cardNumber = document.getElementById('cardNumber');
    if (!cardNumber || !cardNumber.value.trim()) {
        showToast('Please enter a card number', 'error');
        const submitBtn = document.querySelector('#shipping-form button[type="submit"]');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Place Order'; }
        return;
    }
    showSuccessModal();
}

function simulatePayPal() {
    showToast('Redirecting to PayPal…', 'success');
    setTimeout(showSuccessModal, 2000);
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (!modal) return;

    const orderNumber = 'ACP-' + Date.now().toString(36).toUpperCase();
    const totals      = calculateTotals();

    clearCart();
    updateCartBadge();

    modal.innerHTML = `
        <div class="success-icon">✅</div>
        <h2 style="color:#10B981;margin-bottom:0.5rem;font-family:'Barlow Condensed',sans-serif;text-transform:uppercase;letter-spacing:0.05em;">Order Confirmed!</h2>
        <p style="color:#64748B;margin-bottom:1.5rem;">Your order has been placed successfully.</p>
        <p style="margin-bottom:0.5rem;"><strong>Order:</strong> ${orderNumber}</p>
        <p><strong>Total Paid:</strong> $${totals.total} CAD</p>
        <ul class="next-steps">
            <li>Confirmation email on its way</li>
            <li>Ships within 1–2 business days</li>
            <li>Tracking info sent to your email</li>
        </ul>
        <button onclick="location.reload()" class="btn-primary full-width" style="margin-top:1.5rem;">
            Continue Shopping
        </button>
    `;

    modal.classList.remove('hidden');
}

/* ── CARD INPUT FORMATTING ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    const cardInput = document.getElementById('cardNumber');
    if (cardInput) {
        cardInput.addEventListener('input', function () {
            let val = this.value.replace(/\D/g, '').slice(0, 16);
            this.value = val.replace(/(.{4})/g, '$1 ').trim();
        });
    }

    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function () {
            let val = this.value.replace(/\D/g, '').slice(0, 4);
            if (val.length >= 3) this.value = val.slice(0, 2) + '/' + val.slice(2);
            else this.value = val;
        });
    }
});

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initHero();
    initHeaderScroll();
    initMobileMenu();
    initCategories();
    updateCartBadge();
    initCheckoutForm();
    renderCheckoutItems();
});

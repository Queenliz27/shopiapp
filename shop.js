
console.log('shop.js loaded');

const PRODUCTS = [
      {
        id: 'p1', 
        name: 'Wireless Earbuds', 
        price: 5500, 
        img: 'images/jumia.png', 
        tags: ['audio','portable']
      },
      {
        id: 'p2', 
        name: 'Smart Watch', 
        price: 12000, 
        img: 'https://via.placeholder.com/300x200?text=Smartwatch', 
        tags: ['wearable']
      },
      {
        id: 'p3', 
        name: 'Bluetooth Speaker', 
        price: 8000, 
        img: 'https://via.placeholder.com/300x200?text=Speaker', 
        tags: ['audio']
      },
      {
        id: 'p4', 
        name: 'Power Bank 20,000mAh', 
        price: 9500, img: 'https://via.placeholder.com/300x200?text=Powerbank', 
        tags: ['power']
      },
      {
        id: 'p5', 
        name: 'USB-C Cable 2m', 
        price: 1200, 
        img: 'https://via.placeholder.com/300x200?text=Cable', 
        tags: ['accessory']
      }
    ];


const el = s => document.querySelector(s);
const money = v => `₦${v.toLocaleString()}`;

// ---- State ----
const state = { cart:{}, products: PRODUCTS };

// ---- Render products ----
function renderProducts() {
  el('#productList').innerHTML = state.products.map(p => `
    <div class="card">
      <h4>${p.name}</h4>
      <p>${money(p.price)}</p>
      <button data-id="${p.id}" class="add-btn">Add</button>
    </div>
  `).join('');
}

// ---- Render cart ----
function renderCart() {
  let total = 0;
  el('#cartItems').innerHTML = Object.keys(state.cart).map(id => {
    const p = state.products.find(x => x.id === id);
    const qty = state.cart[id];
    total += p.price * qty;
    return `<div>${p.name} x ${qty}</div>`;
  }).join('');
  el('#cartTotal').textContent = money(total);
}

// ---- Actions ----
function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  renderCart();
}

// ---- Event delegation ----
document.addEventListener('click', e => {
  if (e.target.classList.contains('add-btn')) {
    addToCart(e.target.dataset.id);
  }
});

// ---- Init ----
renderProducts();
renderCart();


/* ===== Mini Jumia (Simplified) ===== */

// Products
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




// Helpers
const $ = (sel) => document.querySelector(sel);
const money = (v) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(v);

// App state
let cart = {}; // { id: qty }

// Render products
function renderProducts(list) {
  document.querySelector('#productList').innerHTML = list.map(p => `
    <div class="card">
      <h4>${p.name}</h4>
      <p>${money(p.price)}</p>
      <button onclick="addToCart('${p.id}')">Add</button>
    </div>
  `).join('');
}

// Render cart
function renderCart() {
  const items = Object.keys(cart);
  let total = 0;

  if (items.length === 0) {
    $('#cartItems').innerHTML = 'Cart is empty';
    $('#cartTotal').textContent = money(0);
    return;
  }

  $('#cartItems').innerHTML = items.map(id => {
    const product = PRODUCTS.find(p => p.id === id);
    const qty = cart[id];
    total += product.price * qty;

    return `
      <div>
        ${product.name} x ${qty}
        <button onclick="changeQty('${id}', -1)">-</button>
        <button onclick="changeQty('${id}', 1)">+</button>
      </div>
    `;
  }).join('');

  $('#cartTotal').textContent = money(total);
}

// Cart actions
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
}

function changeQty(id, value) {
  cart[id] += value;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

// Search
$('#search').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q)
  );
  renderProducts(filtered);
});

// Init
renderProducts(PRODUCTS);
renderCart();

    const PRODUCTS = [
      {
        id: 'p1', name: 'TiLECC BT30 ENC Noise Canceling Wireless Blu.......', 
        price: 4255, 
        img: 'images/TiLECC BT30 ENC Noise Canceling Wireless Bluetooth Earbuds HiFi Stereo Headphones.jpg', 
        tags: ['audio','portable']
      },
      {
        id: 'p2', 
        name: 'Smart Watch Full Touch Screen Watch - For Andr.......',
        price: 8940,
        img: 'images/Smart Watch Full Touch Screen Watch - For Android & IOS.jpg', 
        tags: ['wearable']
      },
      {
        id: 'p3', 
        name: 'Addigoes Portable Bluetooth Speakers with Color.......', 
        price: 7156, 
        img: 'images/addigoes Portable Bluetooth Speakers with Colorful Lights, Loud Sound, Portable with Wireless Stereo Pairing, Mini Gifts for Kids, Teen, Girls, Boys, Women for Christmas.jpg', 
        tags: ['audio' , 'bass']
      },
      {
        id: 'p4', 
        name: 'EASYPIE 30000 MAh Ultra Slim Portable Power Bank', 
        price: 11592, 
        img: 'images/EASYPIE 30000 MAh Ultra Slim Portable Power Bank.jpg', 
        tags: ['power']
      },
      {
        id: 'p5', 
        name: 'USB-C Fast Data Type-C To Type C Cable For Ipho......', 
        price: 1200, 
        img: 'images/USB-C Fast Data Type-C To Type C Cable For Iphone, Android and MacBook 2m long.jpg', 
        tags: ['accessory']
      },
      {
        id: 'p6', 
        name: 'Boscon Dry & Spray Iron', 
        price: 7276, 
        img: 'images/Boscon Dry & Spray Iron.jpg', 
        tags: ['laundry']
      },
      {
        id: 'p7', 
        name: 'SILVER CREST 2L Industrial 8500W Food Crusher Ble.......', 
        price: 24202, 
        img: 'images/SILVER CREST 2L Industrial 8500W Food Crusher Blender With 2 Jar.jpg', 
        tags: ['blending' , 'fast']
      },
      {
        id: 'p8', 
        name: 'Syinix 2.2L Electric Kettle - Silver SKE22U1', 
        price: 6089, 
        img: 'images/Syinix 2.2L Electric Kettle - Silver SKE22U1.jpg', 
        tags: ['boiling' , '2000W' , '2.2l']
      },
      {
        id: 'p9', 
        name: 'Baileys Original Irish Cream 700ml.', 
        price: 18750, 
        img: 'images/Baileys Original Irish Cream 700ml..jpg', 
        tags: ['drink']
      },
      {
        id: 'p10', 
        name: 'XIAOMI Redmi 15C 6.9" 6GBRAM/128GB ROM Android 15 -Midnight Black', 
        //XIAOMI Redmi 15C 6.9" 6GBRAM/128GB ROM Android 15 -Midnight Black
        price: 18750, 
        img: 'images/Redmi 15c.jpg', 
        tags: ['drink']
      },
    ];

    // ---- Utilities ----
    const currency = (v) => new Intl.NumberFormat('en-NG', {style:'currency', currency:'NGN', maximumFractionDigits:0}).format(v);

    const el = (sel) => document.querySelector(sel);
    const els = (sel) => Array.from(document.querySelectorAll(sel));

    // simple debounce to avoid rendering on every keystroke
    const debounce = (fn, wait=250) => {
      let t;
      return (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), wait); };
    };

    // ---- App state ----
    const state = {
      products: [],
      filtered: [],
      cart: {},
    };

    // ---- Persistence ----
    const STORAGE_KEY = 'miniJumiaDemo:v1';
    const saveState = () => localStorage.setItem(STORAGE_KEY, JSON.stringify({cart: state.cart}));
    const loadState = () => {
      try{
        const raw = localStorage.getItem(STORAGE_KEY);
        if(!raw) return;
        const parsed = JSON.parse(raw);
        state.cart = parsed.cart || {};
      }catch(e){console.warn('Could not load state', e)}
    };

    // ---- Rendering ----
    function renderProducts(list){
      const container = el('#productList');
      container.innerHTML = '';
      const fragment = document.createDocumentFragment();
      list.forEach(p => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
          <div class="media"><img src="${p.img}" alt="${p.name}"></div>
          <div class="title">${p.name}</div>
          <div class="meta">${p.tags.join(' • ')}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
            <div class="price">${currency(p.price)}</div>
            <div style="display:flex;gap:8px;min-width:120px">
              <button class="btn btn-ghost" data-action="details" data-id="${p.id}">Details</button>
              <button class="btn btn-accent" data-action="add" data-id="${p.id}">Add</button>
            </div>
          </div>
        `;
        fragment.appendChild(card);
      });
      container.appendChild(fragment);
    }

    function renderCart(){
      const container = el('#cartItems');
      container.innerHTML = '';
      const ids = Object.keys(state.cart);
      if(ids.length === 0){ container.innerHTML = '<p class="meta">Cart is empty</p>'; el('#cartTotal').textContent = currency(0); return; }
      let total = 0;
      const frag = document.createDocumentFragment();
      ids.forEach(id => {
        const qty = state.cart[id];
        const product = state.products.find(p => p.id === id);
        if(!product) return;
        total += product.price * qty;
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
          <img src="${product.img}" alt="${product.name}">
          <div style="flex:1">
            <div style="font-weight:600">${product.name}</div>
            <div class="meta">${currency(product.price)} • <span class="meta">x${qty}</span></div>
          </div>
          <div class="qty">
            <button class="btn btn-ghost" data-action="decrease" data-id="${id}">-</button>
            <button class="btn btn-ghost" data-action="increase" data-id="${id}">+</button>
            <button class="btn btn-ghost" data-action="remove" data-id="${id}">Remove</button>
          </div>
        `;
        frag.appendChild(item);
      });
      container.appendChild(frag);
      el('#cartTotal').textContent = currency(total);
    }

    // ---- Actions ----
    function addToCart(id, qty = 1){
      state.cart[id] = (state.cart[id] || 0) + qty;
      saveState();
      renderCart();
    }
    function increaseQty(id){ addToCart(id, 1); }
    function decreaseQty(id){
      if(!state.cart[id]) return;
      state.cart[id] = Math.max(0, state.cart[id] - 1);
      if(state.cart[id] === 0) delete state.cart[id];
      saveState(); renderCart();
    }
    function removeFromCart(id){ delete state.cart[id]; saveState(); renderCart(); }

    // ---- Search & Sort ----
    function applyFilters(){
      const q = el('#search').value.trim().toLowerCase();
      const sort = el('#sort').value;
      let out = state.products.slice();
      if(q.length){
        out = out.filter(p => p.name.toLowerCase().includes(q) || p.tags.join(' ').includes(q));
      }
      if(sort === 'price-asc') out.sort((a,b)=>a.price-b.price);
      if(sort === 'price-desc') out.sort((a,b)=>b.price-a.price);
      state.filtered = out;
      renderProducts(state.filtered);
    }

    // ---- Event Delegation for product buttons ----
    el('main').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if(!btn) return;
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      if(action === 'add') addToCart(id);
      if(action === 'increase') increaseQty(id);
      if(action === 'decrease') decreaseQty(id);
      if(action === 'remove') removeFromCart(id);
      if(action === 'details') showDetails(id);
    });

    // ---- Details modal (simple alert for demo) ----
    function showDetails(id){
      const p = state.products.find(x => x.id === id);
      if(!p) return;
      alert(`${p.name}\nPrice: ${currency(p.price)}\nTags: ${p.tags.join(', ')}`);
    }

    // ---- Checkout (mock) ----
    el('#checkout').addEventListener('click', ()=>{
      const ids = Object.keys(state.cart);
      if(ids.length === 0){ alert('Your cart is empty. Add an item to cart before you checkout!'); return; }
      // simple mock flow
      alert('Checkout success, Thanks for the purchase.');
      state.cart = {};
      saveState();
      renderCart();
    });

    // ---- Wiring inputs ----
    el('#search').addEventListener('input', debounce(applyFilters, 200));
    el('#sort').addEventListener('change', applyFilters);
    //el('#clearStorage').addEventListener('click', ()=>{ localStorage.removeItem(STORAGE_KEY); location.reload(); });



    // ---- Initialization ----
    async function init(){
      // simulate fetching
      state.products = await fetchProducts();
      loadState();
      state.filtered = state.products.slice();
      renderProducts(state.filtered);
      renderCart();
      runSmallTests();
    }

    function fetchProducts(){
      // simulate network latency
      return new Promise(resolve => setTimeout(()=>resolve(PRODUCTS.slice()), 200));
    }

    // ---- Tiny unit-style tests shown on page for teacher ----
    function assert(cond, msg){
      if(!cond) throw new Error('Assertion failed: '+msg);
    }
    function runSmallTests(){
      const out = [];
      try{
        assert(typeof addToCart === 'function', 'addToCart exists');
        addToCart('p1', 2);
        assert(state.cart['p1'] === 2, 'cart updated after addToCart');
        increaseQty('p1');
        assert(state.cart['p1'] === 3, 'increaseQty works');
        decreaseQty('p1');
        assert(state.cart['p1'] === 2, 'decreaseQty works');
        removeFromCart('p1');
        assert(!state.cart['p1'], 'removeFromCart works');
        out.push('All JS smoke tests passed ✅');
      }catch(err){
        out.push('Tests failed: '+err.message);
        console.error(err);
      }
      //el('#testResults').textContent = out.join('\n');
    }

    // start app
    init();
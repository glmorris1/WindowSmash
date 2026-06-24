import './style.css'
import { APP_NAME, DEFAULT_GOOGLE_MAPS_API_KEY, TIP } from './config.js'
import {
  getState,
  subscribe,
  setState,
  setApiKey,
  addToCart,
  updateCartQty,
  cartTotal,
  cartCount,
  placeOrder,
  clearCart,
} from './store.js'
import { searchNearbyRestaurants, reverseGeocode, getUserLocation, photoUrl } from './api/places.js'
import { generateMenu } from './utils/menus.js'
import { formatPrice, haversineMiles, etaFromDistance, cuisineLabel } from './utils/format.js'

const app = document.getElementById('app')
let toastTimer = null

function getApiKey() {
  const s = getState()
  return s.apiKey || DEFAULT_GOOGLE_MAPS_API_KEY
}

function showToast(msg) {
  let toast = document.querySelector('.toast')
  if (!toast) {
    toast = document.createElement('div')
    toast.className = 'toast'
    app.appendChild(toast)
  }
  toast.textContent = msg
  toast.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000)
}

function icon(name) {
  const icons = {
    pin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>',
    cart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
    orders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  }
  return icons[name] || ''
}

async function loadRestaurants() {
  const key = getApiKey()
  if (!key) {
    setState({ loading: false, error: 'api_key_required' })
    return
  }

  setState({ loading: true, error: null })

  try {
    const loc = await getUserLocation()
    const [label, places] = await Promise.all([
      reverseGeocode(loc.lat, loc.lng, key).catch(() => 'Near you'),
      searchNearbyRestaurants(loc.lat, loc.lng, key),
    ])

    const restaurants = places.map((r) => ({
      ...r,
      distance: haversineMiles(loc.lat, loc.lng, r.lat, r.lng),
      cuisine: cuisineLabel(r.types, r.name),
      eta: etaFromDistance(haversineMiles(loc.lat, loc.lng, r.lat, r.lng)),
      photo: photoUrl(r.photoName, key),
    }))

    restaurants.sort((a, b) => a.distance - b.distance)

    setState({
      location: loc,
      locationLabel: label,
      restaurants,
      loading: false,
      error: null,
    })
  } catch (err) {
    setState({ loading: false, error: err.message })
  }
}

function renderHeader(state, { showBack = false, title = null } = {}) {
  const count = cartCount()
  return `
    <header class="header">
      ${showBack ? `<button class="header-back" data-action="back">${icon('back')}</button>` : ''}
      ${title ? `<div class="logo">${title}</div>` : `<div class="logo">Window<span>Smash</span></div>`}
      ${!showBack ? `
        <div class="location-pill">
          ${icon('pin')}
          <span>${state.locationLabel}</span>
        </div>
      ` : '<div style="flex:1"></div>'}
      <button class="cart-btn" data-action="cart">
        ${icon('cart')}
        ${count > 0 ? `<span class="cart-badge">${count}</span>` : ''}
      </button>
    </header>
  `
}

function renderBottomNav(view) {
  const items = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'cart', label: 'Cart', icon: 'bag' },
    { id: 'tracking', label: 'Orders', icon: 'orders' },
  ]
  return `
    <nav class="bottom-nav">
      ${items.map((item) => `
        <button class="nav-item ${view === item.id || (item.id === 'tracking' && view === 'checkout') ? '' : view === item.id ? 'active' : view === 'home' && item.id === 'home' ? 'active' : view === 'cart' && item.id === 'cart' ? 'active' : view === 'tracking' && item.id === 'tracking' ? 'active' : ''}" data-nav="${item.id}">
          ${icon(item.icon)}
          ${item.label}
        </button>
      `).join('')}
    </nav>
  `
}

function fixNavActive(view) {
  return (id) => {
    if (id === 'home') return view === 'home' || view === 'restaurant'
    if (id === 'cart') return view === 'cart' || view === 'checkout'
    if (id === 'tracking') return view === 'tracking'
    return false
  }
}

function renderApiKeyPanel() {
  return `
    <div class="api-key-panel">
      <label for="api-key">Google Maps API Key</label>
      <input id="api-key" type="password" placeholder="Paste your API key" value="${getState().apiKey}" />
      <p>
        Required for nearby restaurant search. Enable <strong>Places API (New)</strong> and <strong>Geocoding API</strong> in
        <a href="https://console.cloud.google.com/google/maps-apis/" target="_blank" rel="noopener">Google Cloud Console</a>.
        Your key stays on your device.
      </p>
      <button class="small-btn" data-action="save-key" style="margin-top:12px">Save & Find Restaurants</button>
    </div>
  `
}

function renderHome(state) {
  if (state.error === 'api_key_required') {
    return renderApiKeyPanel() + `
      <div class="hero">
        <h1>Craving something?</h1>
        <p>All the thrill of ordering delivery. Zero calories delivered.</p>
        <span class="hero-tag">🪟 Smash the window, not your diet</span>
      </div>
    `
  }

  if (state.loading) {
    return `<div class="loading-state"><div class="loading-spinner"></div><p>Finding restaurants near you…</p></div>`
  }

  if (state.error) {
    return `
      <div class="error-state">
        <p>${state.error}</p>
        <button class="small-btn" data-action="retry" style="margin-top:16px;max-width:200px;margin-inline:auto">Try Again</button>
      </div>
      ${renderApiKeyPanel()}
    `
  }

  const cuisines = [...new Set(state.restaurants.map((r) => r.cuisine))]

  return `
    <div class="hero">
      <h1>Craving something?</h1>
      <p>${state.restaurants.length} spots near ${state.locationLabel}. Pick anything — nothing actually ships.</p>
      <span class="hero-tag">🪟 Zero-calorie dopamine delivery</span>
    </div>
    <div class="filter-bar">
      <button class="chip active" data-filter="all">All</button>
      ${cuisines.map((c) => `<button class="chip" data-filter="${c}">${c}</button>`).join('')}
    </div>
    <h2 class="section-title">Nearby</h2>
    <div class="restaurant-list" id="restaurant-list">
      ${state.restaurants.map((r) => renderRestaurantCard(r)).join('')}
    </div>
  `
}

function renderRestaurantCard(r) {
  const openBadge = r.openNow === true
    ? '<span class="badge-open">Open</span>'
    : r.openNow === false
      ? '<span class="badge-closed">Closed</span>'
      : ''

  const img = r.photo
    ? `<img class="restaurant-img" src="${r.photo}" alt="" loading="lazy" onerror="this.outerHTML='<div class=\\'restaurant-img\\'>🍽️</div>'" />`
    : `<div class="restaurant-img">🍽️</div>`

  return `
    <button class="restaurant-card" data-restaurant="${r.id}" data-cuisine="${r.cuisine}">
      ${img}
      <div class="restaurant-info">
        <div class="restaurant-name">${r.name}</div>
        <div class="restaurant-meta">
          ${r.rating ? `<span class="rating">★ ${r.rating.toFixed(1)}</span>` : ''}
          <span>${r.distance.toFixed(1)} mi</span>
          <span>${r.eta}</span>
          <span>${r.cuisine}</span>
          ${openBadge}
        </div>
      </div>
    </button>
  `
}

function renderRestaurant(state) {
  const r = state.selectedRestaurant
  if (!r) return ''

  const heroImg = r.photo
    ? `<img src="${r.photo}" alt="" /><div class="restaurant-hero-overlay"></div>`
    : ''

  return `
    <div class="restaurant-hero">
      ${heroImg}
      <div class="restaurant-hero-text">
        <h2>${r.name}</h2>
        <p>${r.cuisine} · ${r.distance?.toFixed(1) || '?'} mi · ${r.eta || '25 min'}</p>
      </div>
    </div>
    <h2 class="section-title">Menu</h2>
    <div class="menu-list">
      ${state.menu.map((item) => `
        <div class="menu-item">
          <div class="menu-emoji">${item.image}</div>
          <div class="menu-details">
            <div class="menu-name">${item.name}</div>
            <div class="menu-desc">${item.description}</div>
            <div class="menu-row">
              <span class="menu-price">${formatPrice(item.price)}</span>
              <button class="add-btn" data-add="${item.id}">Add</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    ${state.cart.length > 0 ? `
      <div class="sticky-cta no-nav">
        <button class="cta-btn" data-action="cart">View Cart · ${formatPrice(cartTotal())}</button>
      </div>
    ` : ''}
  `
}

function renderCart(state) {
  if (state.cart.length === 0) {
    return `<div class="empty-state"><p>Your cart is empty</p><p style="margin-top:8px;font-size:0.875rem">Browse nearby restaurants and add some virtual treats!</p></div>`
  }

  const groups = {}
  state.cart.forEach((item) => {
    if (!groups[item.restaurantName]) groups[item.restaurantName] = []
    groups[item.restaurantName].push(item)
  })

  const subtotal = cartTotal()
  const delivery = 0
  const service = 1.99
  const total = subtotal + delivery + service

  return `
    <div class="cart-list">
      ${Object.entries(groups).map(([name, items]) => `
        <div class="cart-group">
          <div class="cart-group-title">${name}</div>
          ${items.map((item) => `
            <div class="cart-item">
              <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
              </div>
              <div class="qty-control">
                <button class="qty-btn" data-qty-minus="${item.id}" data-restaurant="${item.restaurantId}">−</button>
                <span class="qty-num">${item.quantity}</span>
                <button class="qty-btn" data-qty-plus="${item.id}" data-restaurant="${item.restaurantId}">+</button>
              </div>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
    <div class="cart-summary">
      <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
      <div class="summary-row"><span>Delivery</span><span>${delivery === 0 ? 'Free (virtual!)' : formatPrice(delivery)}</span></div>
      <div class="summary-row"><span>Service fee</span><span>${formatPrice(service)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
    </div>
    <div class="sticky-cta">
      <button class="cta-btn" data-action="checkout">Checkout · ${formatPrice(total)}</button>
    </div>
  `
}

function renderCheckout(state) {
  const subtotal = cartTotal()
  const total = subtotal + 1.99

  return `
    <div class="disclaimer">
      🪟 <strong>WindowSmash is simulated.</strong> No restaurant is contacted and no food is ordered or delivered. Enjoy the dopamine, skip the calories.
    </div>
    <div class="checkout-section">
      <h3>Order Summary</h3>
      ${state.cart.map((item) => `
        <div class="summary-row"><span>${item.quantity}× ${item.name}</span><span>${formatPrice(item.price * item.quantity)}</span></div>
      `).join('')}
      <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
    </div>
    <div class="checkout-section">
      <h3>Send a tip 💸</h3>
      <p style="font-size:0.8125rem;color:var(--text-muted);margin-bottom:12px">Enjoying the zero-calorie experience? Tips are optional and go directly to the creator.</p>
      <div class="tip-options">
        <a class="tip-btn" href="${TIP.venmo.url}" target="_blank" rel="noopener">
          <div class="tip-icon venmo">V</div>
          <div>
            <div class="tip-label">${TIP.venmo.label}</div>
            <div class="tip-handle">${TIP.venmo.handle}</div>
          </div>
        </a>
        <a class="tip-btn" href="${TIP.cashapp.url}" target="_blank" rel="noopener">
          <div class="tip-icon cashapp">$</div>
          <div>
            <div class="tip-label">${TIP.cashapp.label}</div>
            <div class="tip-handle">${TIP.cashapp.handle}</div>
          </div>
        </a>
      </div>
    </div>
    <div class="sticky-cta">
      <button class="cta-btn" data-action="place-order">Place Order · ${formatPrice(total)}</button>
    </div>
  `
}

function renderTracking(state) {
  if (!state.order) {
    return `<div class="empty-state"><p>No active orders</p><p style="margin-top:8px;font-size:0.875rem">Place a virtual order to feel the rush!</p></div>`
  }

  const o = state.order
  const elapsed = Math.floor((Date.now() - o.placedAt) / 60000)

  return `
    <div class="tracking">
      <div class="tracking-emoji">🛵💨</div>
      <h2>It's on its way!</h2>
      <p>ETA ~${Math.max(1, o.etaMinutes - elapsed)} min · Order ${o.id}</p>
      <div class="progress-track"><div class="progress-fill"></div></div>
    </div>
    <div class="order-card">
      <h4>Your virtual order</h4>
      ${o.items.map((item) => `
        <div class="order-item-row">
          <span>${item.quantity}× ${item.name}</span>
          <span>${formatPrice(item.price * item.quantity)}</span>
        </div>
      `).join('')}
      <div class="order-item-row" style="font-weight:700;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">
        <span>Total (not charged)</span>
        <span>${formatPrice(o.total + 1.99)}</span>
      </div>
    </div>
    <div class="zero-cal">
      ✅ Zero calories consumed. Maximum satisfaction achieved. The driver is imaginary but your self-control is real.
    </div>
    <div style="padding:0 16px 24px">
      <button class="cta-btn" data-action="home">Order Again</button>
    </div>
  `
}

function render(state) {
  const hideNav = state.view === 'restaurant' || state.view === 'checkout'
  const showBack = ['restaurant', 'cart', 'checkout'].includes(state.view)

  const titles = { cart: 'Cart', checkout: 'Checkout', restaurant: '' }

  let content = ''
  switch (state.view) {
    case 'home': content = renderHome(state); break
    case 'restaurant': content = renderRestaurant(state); break
    case 'cart': content = renderCart(state); break
    case 'checkout': content = renderCheckout(state); break
    case 'tracking': content = renderTracking(state); break
  }

  const isActive = fixNavActive(state.view)

  app.innerHTML = `
    ${renderHeader(state, { showBack, title: titles[state.view] })}
    <main class="main ${hideNav ? 'no-nav' : ''}">${content}</main>
    ${!hideNav ? `
      <nav class="bottom-nav">
        <button class="nav-item ${isActive('home') ? 'active' : ''}" data-nav="home">${icon('home')}Home</button>
        <button class="nav-item ${isActive('cart') ? 'active' : ''}" data-nav="cart">${icon('bag')}Cart</button>
        <button class="nav-item ${isActive('tracking') ? 'active' : ''}" data-nav="tracking">${icon('orders')}Orders</button>
      </nav>
    ` : ''}
  `
}

function bindEvents() {
  app.addEventListener('click', (e) => {
    const state = getState()

    const nav = e.target.closest('[data-nav]')
    if (nav) {
      const id = nav.dataset.nav
      if (id === 'home') setState({ view: 'home', selectedRestaurant: null })
      else if (id === 'cart') setState({ view: state.cart.length ? 'cart' : 'cart' })
      else if (id === 'tracking') setState({ view: 'tracking' })
      return
    }

    const action = e.target.closest('[data-action]')
    if (action) {
      const a = action.dataset.action
      if (a === 'back') {
        if (state.view === 'checkout') setState({ view: 'cart' })
        else if (state.view === 'cart') setState({ view: 'home' })
        else if (state.view === 'restaurant') setState({ view: 'home', selectedRestaurant: null })
      } else if (a === 'cart') setState({ view: 'cart' })
      else if (a === 'checkout') setState({ view: 'checkout' })
      else if (a === 'place-order') { placeOrder(); showToast('Order placed! 🎉') }
      else if (a === 'home') setState({ view: 'home', order: null })
      else if (a === 'retry') loadRestaurants()
      else if (a === 'save-key') {
        const input = document.getElementById('api-key')
        if (input?.value) { setApiKey(input.value); loadRestaurants() }
      }
      return
    }

    const card = e.target.closest('[data-restaurant]')
    if (card && !card.dataset.qtyMinus && !card.dataset.qtyPlus) {
      const restaurant = state.restaurants.find((r) => r.id === card.dataset.restaurant)
      if (restaurant) {
        const menu = generateMenu(restaurant)
        setState({ view: 'restaurant', selectedRestaurant: restaurant, menu })
      }
      return
    }

    const addBtn = e.target.closest('[data-add]')
    if (addBtn && state.selectedRestaurant) {
      const item = state.menu.find((m) => m.id === addBtn.dataset.add)
      if (item) {
        addToCart(item, state.selectedRestaurant)
        showToast(`Added ${item.name}`)
      }
      return
    }

    const minus = e.target.closest('[data-qty-minus]')
    if (minus) {
      updateCartQty(minus.dataset.qtyMinus, minus.dataset.restaurant, -1)
      return
    }

    const plus = e.target.closest('[data-qty-plus]')
    if (plus) {
      updateCartQty(plus.dataset.qtyPlus, plus.dataset.restaurant, 1)
      return
    }

    const chip = e.target.closest('[data-filter]')
    if (chip) {
      document.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'))
      chip.classList.add('active')
      const filter = chip.dataset.filter
      document.querySelectorAll('.restaurant-card').forEach((card) => {
        const show = filter === 'all' || card.dataset.cuisine === filter
        card.style.display = show ? '' : 'none'
      })
    }
  })
}

subscribe(render)
bindEvents()
render(getState())

if (getApiKey()) {
  loadRestaurants()
} else {
  setState({ loading: false, error: 'api_key_required' })
}
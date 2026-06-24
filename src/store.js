const listeners = new Set()

const state = {
  view: 'home',
  location: null,
  locationLabel: 'Finding you…',
  restaurants: [],
  selectedRestaurant: null,
  menu: [],
  cart: [],
  order: null,
  loading: false,
  error: null,
  apiKey: localStorage.getItem('ws_maps_key') || '',
}

export function getState() {
  return state
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function emit() {
  listeners.forEach((fn) => fn(state))
}

export function setState(patch) {
  Object.assign(state, patch)
  emit()
}

export function setApiKey(key) {
  state.apiKey = key.trim()
  localStorage.setItem('ws_maps_key', state.apiKey)
  emit()
}

export function addToCart(item, restaurant) {
  const existing = state.cart.find((c) => c.id === item.id && c.restaurantId === restaurant.id)
  if (existing) {
    existing.quantity += 1
  } else {
    state.cart.push({
      ...item,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      quantity: 1,
    })
  }
  emit()
}

export function updateCartQty(itemId, restaurantId, delta) {
  const idx = state.cart.findIndex((c) => c.id === itemId && c.restaurantId === restaurantId)
  if (idx === -1) return
  state.cart[idx].quantity += delta
  if (state.cart[idx].quantity <= 0) state.cart.splice(idx, 1)
  emit()
}

export function clearCart() {
  state.cart = []
  emit()
}

export function cartTotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function cartCount() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0)
}

export function placeOrder() {
  const items = [...state.cart]
  state.order = {
    id: `WS-${Date.now().toString(36).toUpperCase()}`,
    items,
    total: cartTotal(),
    placedAt: Date.now(),
    etaMinutes: 25 + Math.floor(Math.random() * 20),
    status: 'on_the_way',
  }
  state.cart = []
  state.view = 'tracking'
  emit()
}
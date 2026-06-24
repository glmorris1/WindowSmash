export function formatPrice(n) {
  return `$${n.toFixed(2)}`
}

export function formatDistance(miles) {
  if (miles < 0.1) return '< 0.1 mi'
  return `${miles.toFixed(1)} mi`
}

export function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function etaFromDistance(miles) {
  const mins = Math.max(15, Math.round(miles * 8 + 12))
  return `${mins} min`
}

export function cuisineLabel(types = [], name = '') {
  const blob = [...types, name].join(' ').toLowerCase()
  if (blob.includes('pizza')) return 'Pizza'
  if (blob.includes('chinese')) return 'Chinese'
  if (blob.includes('mexican') || blob.includes('taco')) return 'Mexican'
  if (blob.includes('sushi') || blob.includes('japanese')) return 'Japanese'
  if (blob.includes('thai')) return 'Thai'
  if (blob.includes('indian')) return 'Indian'
  if (blob.includes('burger') || blob.includes('hamburger')) return 'Burgers'
  if (blob.includes('cafe') || blob.includes('coffee')) return 'Café'
  return 'Restaurant'
}
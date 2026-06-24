import { SEARCH_RADIUS_METERS, MAX_RESTAURANTS } from '../config.js'

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.rating',
  'places.userRatingCount',
  'places.types',
  'places.primaryType',
  'places.photos',
  'places.currentOpeningHours',
].join(',')

export async function reverseGeocode(lat, lng, apiKey) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
  const res = await fetch(url)
  const data = await res.json()
  if (data.status !== 'OK' || !data.results?.length) return 'Your area'
  const r = data.results[0]
  const neighborhood = r.address_components?.find((c) =>
    c.types.includes('neighborhood') || c.types.includes('sublocality')
  )
  const city = r.address_components?.find((c) => c.types.includes('locality'))
  return neighborhood?.long_name || city?.long_name || r.formatted_address.split(',')[0]
}

export async function searchNearbyRestaurants(lat, lng, apiKey) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({
      includedTypes: ['restaurant'],
      maxResultCount: MAX_RESTAURANTS,
      rankPreference: 'DISTANCE',
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: SEARCH_RADIUS_METERS,
        },
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Places API error (${res.status})`)
  }

  const data = await res.json()
  return (data.places || []).map(normalizePlace)
}

function normalizePlace(place) {
  const photoName = place.photos?.[0]?.name
  return {
    id: place.id,
    name: place.displayName?.text || 'Restaurant',
    address: place.formattedAddress || '',
    lat: place.location?.latitude,
    lng: place.location?.longitude,
    rating: place.rating ?? null,
    reviewCount: place.userRatingCount ?? 0,
    types: place.types || [],
    primaryType: place.primaryType || '',
    openNow: place.currentOpeningHours?.openNow ?? null,
    photoName,
  }
}

export function photoUrl(photoName, apiKey, maxWidth = 400) {
  if (!photoName || !apiKey) return null
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&key=${apiKey}`
}

export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported on this device'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(new Error(err.message || 'Could not get your location')),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    )
  })
}
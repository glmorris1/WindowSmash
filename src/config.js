export const APP_NAME = 'WindowSmash'

// Set via VITE_GOOGLE_MAPS_API_KEY at build time, or paste in-app (stored in localStorage)
export const DEFAULT_GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

export const TIP = {
  venmo: {
    label: 'Venmo',
    handle: '@glmorris1',
    url: 'https://venmo.com/u/glmorris1',
  },
  cashapp: {
    label: 'Cash App',
    handle: '$glmorris1',
    url: 'https://cash.app/$glmorris1',
  },
}

export const SEARCH_RADIUS_METERS = 5000
export const MAX_RESTAURANTS = 20
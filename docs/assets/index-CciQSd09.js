(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={venmo:{label:`Venmo`,handle:`@glmorris1`,url:`https://venmo.com/u/glmorris1`},cashapp:{label:`Cash App`,handle:`$glmorris1`,url:`https://cash.app/$glmorris1`}},t=5e3,n=new Set,r={view:`home`,location:null,locationLabel:`Finding you…`,restaurants:[],selectedRestaurant:null,menu:[],cart:[],order:null,loading:!1,error:null,apiKey:localStorage.getItem(`ws_maps_key`)||``};function i(){return r}function a(e){return n.add(e),()=>n.delete(e)}function o(){n.forEach(e=>e(r))}function s(e){Object.assign(r,e),o()}function c(e){r.apiKey=e.trim(),localStorage.setItem(`ws_maps_key`,r.apiKey),o()}function l(e,t){let n=r.cart.find(n=>n.id===e.id&&n.restaurantId===t.id);n?n.quantity+=1:r.cart.push({...e,restaurantId:t.id,restaurantName:t.name,quantity:1}),o()}function u(e,t,n){let i=r.cart.findIndex(n=>n.id===e&&n.restaurantId===t);i!==-1&&(r.cart[i].quantity+=n,r.cart[i].quantity<=0&&r.cart.splice(i,1),o())}function d(){return r.cart.reduce((e,t)=>e+t.price*t.quantity,0)}function f(){return r.cart.reduce((e,t)=>e+t.quantity,0)}function p(){let e=[...r.cart];r.order={id:`WS-${Date.now().toString(36).toUpperCase()}`,items:e,total:d(),placedAt:Date.now(),etaMinutes:25+Math.floor(Math.random()*20),status:`on_the_way`},r.cart=[],r.view=`tracking`,o()}var m=[`places.id`,`places.displayName`,`places.formattedAddress`,`places.location`,`places.rating`,`places.userRatingCount`,`places.types`,`places.primaryType`,`places.photos`,`places.currentOpeningHours`].join(`,`);async function h(e,t,n){let r=`https://maps.googleapis.com/maps/api/geocode/json?latlng=${e},${t}&key=${n}`,i=await(await fetch(r)).json();if(i.status!==`OK`||!i.results?.length)return`Your area`;let a=i.results[0],o=a.address_components?.find(e=>e.types.includes(`neighborhood`)||e.types.includes(`sublocality`)),s=a.address_components?.find(e=>e.types.includes(`locality`));return o?.long_name||s?.long_name||a.formatted_address.split(`,`)[0]}async function g(e,n,r){let i=await fetch(`https://places.googleapis.com/v1/places:searchNearby`,{method:`POST`,headers:{"Content-Type":`application/json`,"X-Goog-Api-Key":r,"X-Goog-FieldMask":m},body:JSON.stringify({includedTypes:[`restaurant`],maxResultCount:20,rankPreference:`DISTANCE`,locationRestriction:{circle:{center:{latitude:e,longitude:n},radius:t}}})});if(!i.ok){let e=await i.json().catch(()=>({}));throw Error(e.error?.message||`Places API error (${i.status})`)}return((await i.json()).places||[]).map(_)}function _(e){let t=e.photos?.[0]?.name;return{id:e.id,name:e.displayName?.text||`Restaurant`,address:e.formattedAddress||``,lat:e.location?.latitude,lng:e.location?.longitude,rating:e.rating??null,reviewCount:e.userRatingCount??0,types:e.types||[],primaryType:e.primaryType||``,openNow:e.currentOpeningHours?.openNow??null,photoName:t}}function v(e,t,n=400){return!e||!t?null:`https://places.googleapis.com/v1/${e}/media?maxWidthPx=${n}&key=${t}`}function y(){return new Promise((e,t)=>{if(!navigator.geolocation){t(Error(`Geolocation is not supported on this device`));return}navigator.geolocation.getCurrentPosition(t=>e({lat:t.coords.latitude,lng:t.coords.longitude}),e=>t(Error(e.message||`Could not get your location`)),{enableHighAccuracy:!0,timeout:15e3,maximumAge:6e4})})}var b={pizza:[{name:`Margherita Smash`,desc:`Fresh mozzarella, basil, crushed tomato`,base:14.99},{name:`Pepperoni Window`,desc:`Double pepperoni, extra cheese`,base:16.49},{name:`Meat Lovers Pane`,desc:`Sausage, bacon, ham, pepperoni`,base:18.99},{name:`Garlic Knots (6)`,desc:`Butter, parmesan, marinara dip`,base:6.99},{name:`Caesar Side Salad`,desc:`Romaine, croutons, parmesan`,base:8.49}],chinese:[{name:`Kung Pao Chicken`,desc:`Peanuts, chili, Szechuan pepper`,base:13.99},{name:`Beef & Broccoli`,desc:`Wok-tossed in brown garlic sauce`,base:14.49},{name:`Vegetable Fried Rice`,desc:`Egg, peas, carrots, soy`,base:10.99},{name:`Pork Dumplings (8)`,desc:`Steamed, ginger soy dip`,base:9.99},{name:`Hot & Sour Soup`,desc:`Tofu, mushrooms, vinegar kick`,base:5.49}],mexican:[{name:`Carnitas Burrito`,desc:`Rice, beans, salsa verde, crema`,base:12.99},{name:`Chicken Tacos (3)`,desc:`Corn tortillas, onion, cilantro`,base:11.49},{name:`Queso Fundido`,desc:`Melted cheese, chorizo, tortillas`,base:9.99},{name:`Guacamole & Chips`,desc:`Fresh avo, lime, sea salt`,base:7.99},{name:`Horchata`,desc:`Cinnamon rice milk, iced`,base:4.49}],burger:[{name:`Classic Smash Burger`,desc:`Double patty, american, pickles`,base:11.99},{name:`Bacon Avocado Burger`,desc:`Swiss, chipotle aioli`,base:14.49},{name:`Crispy Chicken Sandwich`,desc:`Slaw, pickles, brioche`,base:12.99},{name:`Truffle Fries`,desc:`Parmesan, herbs, truffle oil`,base:6.99},{name:`Chocolate Shake`,desc:`Thick, whipped cream`,base:5.99}],sushi:[{name:`Salmon Nigiri (2)`,desc:`Fresh Atlantic salmon`,base:7.99},{name:`Spicy Tuna Roll`,desc:`8 pieces, chili mayo`,base:12.99},{name:`Dragon Roll`,desc:`Eel, avocado, unagi sauce`,base:15.99},{name:`Edamame`,desc:`Sea salt, steamed`,base:5.49},{name:`Miso Soup`,desc:`Tofu, wakame, scallion`,base:3.99}],thai:[{name:`Pad Thai`,desc:`Shrimp, peanuts, tamarind`,base:13.99},{name:`Green Curry`,desc:`Chicken, bamboo, basil, jasmine rice`,base:14.49},{name:`Tom Yum Soup`,desc:`Spicy lemongrass broth`,base:6.99},{name:`Spring Rolls (4)`,desc:`Crispy veggie, sweet chili`,base:7.49},{name:`Mango Sticky Rice`,desc:`Coconut cream, toasted sesame`,base:6.99}],indian:[{name:`Butter Chicken`,desc:`Creamy tomato, basmati rice`,base:15.99},{name:`Chicken Tikka Masala`,desc:`Spiced yogurt marinade`,base:15.49},{name:`Garlic Naan (2)`,desc:`Tandoor baked`,base:4.99},{name:`Samosas (3)`,desc:`Potato, pea, mint chutney`,base:6.99},{name:`Mango Lassi`,desc:`Yogurt, cardamom`,base:4.49}],default:[{name:`House Special`,desc:`Chef's signature plate`,base:14.99},{name:`Grilled Chicken Bowl`,desc:`Seasonal veggies, grains`,base:13.49},{name:`Crispy Appetizer`,desc:`Shareable starter`,base:8.99},{name:`Garden Salad`,desc:`Mixed greens, vinaigrette`,base:9.49},{name:`Seasonal Dessert`,desc:`Made fresh daily`,base:6.99},{name:`Fountain Drink`,desc:`Refills on us (virtually)`,base:2.99}]},x=[[`pizza`,[`pizza`,`pizza_restaurant`]],[`chinese`,[`chinese`,`chinese_restaurant`]],[`mexican`,[`mexican`,`mexican_restaurant`,`taco`]],[`burger`,[`hamburger`,`burger`,`fast_food`,`american_restaurant`]],[`sushi`,[`sushi`,`japanese_restaurant`,`japanese`]],[`thai`,[`thai`,`thai_restaurant`]],[`indian`,[`indian`,`indian_restaurant`]]];function S(e){let t=0;for(let n=0;n<e.length;n++)t=(t<<5)-t+e.charCodeAt(n);return Math.abs(t)}function C(e=[],t=``){let n=[...e,t].join(` `).toLowerCase();for(let[e,t]of x)if(t.some(e=>n.includes(e)))return e;return`default`}function w(e){let t=C(e.types,e.name),n=b[t]||b.default,r=S(e.id);return n.map((n,i)=>{let a=(r+i*17)%7*.5,o=Math.round((n.base+a)*100)/100;return{id:`${e.id}-item-${i}`,name:n.name,description:n.desc,price:o,image:T[t][i%T[t].length]}})}var T={pizza:[`🍕`,`🧀`,`🍅`],chinese:[`🥡`,`🍜`,`🥢`],mexican:[`🌮`,`🌯`,`🥑`],burger:[`🍔`,`🍟`,`🥤`],sushi:[`🍣`,`🍱`,`🥢`],thai:[`🍛`,`🌶️`,`🥥`],indian:[`🍛`,`🫓`,`🥭`],default:[`🍽️`,`🥗`,`🍲`]};function E(e){return`$${e.toFixed(2)}`}function D(e,t,n,r){let i=(n-e)*Math.PI/180,a=(r-t)*Math.PI/180,o=Math.sin(i/2)**2+Math.cos(e*Math.PI/180)*Math.cos(n*Math.PI/180)*Math.sin(a/2)**2;return 3958.8*2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o))}function O(e){return`${Math.max(15,Math.round(e*8+12))} min`}function k(e=[],t=``){let n=[...e,t].join(` `).toLowerCase();return n.includes(`pizza`)?`Pizza`:n.includes(`chinese`)?`Chinese`:n.includes(`mexican`)||n.includes(`taco`)?`Mexican`:n.includes(`sushi`)||n.includes(`japanese`)?`Japanese`:n.includes(`thai`)?`Thai`:n.includes(`indian`)?`Indian`:n.includes(`burger`)||n.includes(`hamburger`)?`Burgers`:n.includes(`cafe`)||n.includes(`coffee`)?`Café`:`Restaurant`}var A=document.getElementById(`app`),j=null;function M(){return i().apiKey||``}function N(e){let t=document.querySelector(`.toast`);t||(t=document.createElement(`div`),t.className=`toast`,A.appendChild(t)),t.textContent=e,t.classList.add(`show`),clearTimeout(j),j=setTimeout(()=>t.classList.remove(`show`),2e3)}function P(e){return{pin:`<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>`,cart:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,back:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>`,home:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,search:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,orders:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,bag:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`}[e]||``}async function F(){let e=M();if(!e){s({loading:!1,error:`api_key_required`});return}s({loading:!0,error:null});try{let t=await y(),[n,r]=await Promise.all([h(t.lat,t.lng,e).catch(()=>`Near you`),g(t.lat,t.lng,e)]),i=r.map(n=>({...n,distance:D(t.lat,t.lng,n.lat,n.lng),cuisine:k(n.types,n.name),eta:O(D(t.lat,t.lng,n.lat,n.lng)),photo:v(n.photoName,e)}));i.sort((e,t)=>e.distance-t.distance),s({location:t,locationLabel:n,restaurants:i,loading:!1,error:null})}catch(e){s({loading:!1,error:e.message})}}function I(e,{showBack:t=!1,title:n=null}={}){let r=f();return`
    <header class="header">
      ${t?`<button class="header-back" data-action="back">${P(`back`)}</button>`:``}
      ${n?`<div class="logo">${n}</div>`:`<div class="logo">Window<span>Smash</span></div>`}
      ${t?`<div style="flex:1"></div>`:`
        <div class="location-pill">
          ${P(`pin`)}
          <span>${e.locationLabel}</span>
        </div>
      `}
      <button class="cart-btn" data-action="cart">
        ${P(`cart`)}
        ${r>0?`<span class="cart-badge">${r}</span>`:``}
      </button>
    </header>
  `}function L(e){return t=>t===`home`?e===`home`||e===`restaurant`:t===`cart`?e===`cart`||e===`checkout`:t===`tracking`?e===`tracking`:!1}function R(){return`
    <div class="api-key-panel">
      <label for="api-key">Google Maps API Key</label>
      <input id="api-key" type="password" placeholder="Paste your API key" value="${i().apiKey}" />
      <p>
        Required for nearby restaurant search. Enable <strong>Places API (New)</strong> and <strong>Geocoding API</strong> in
        <a href="https://console.cloud.google.com/google/maps-apis/" target="_blank" rel="noopener">Google Cloud Console</a>.
        Your key stays on your device.
      </p>
      <button class="small-btn" data-action="save-key" style="margin-top:12px">Save & Find Restaurants</button>
    </div>
  `}function z(e){if(e.error===`api_key_required`)return R()+`
      <div class="hero">
        <h1>Craving something?</h1>
        <p>All the thrill of ordering delivery. Zero calories delivered.</p>
        <span class="hero-tag">🪟 Smash the window, not your diet</span>
      </div>
    `;if(e.loading)return`<div class="loading-state"><div class="loading-spinner"></div><p>Finding restaurants near you…</p></div>`;if(e.error)return`
      <div class="error-state">
        <p>${e.error}</p>
        <button class="small-btn" data-action="retry" style="margin-top:16px;max-width:200px;margin-inline:auto">Try Again</button>
      </div>
      ${R()}
    `;let t=[...new Set(e.restaurants.map(e=>e.cuisine))];return`
    <div class="hero">
      <h1>Craving something?</h1>
      <p>${e.restaurants.length} spots near ${e.locationLabel}. Pick anything — nothing actually ships.</p>
      <span class="hero-tag">🪟 Zero-calorie dopamine delivery</span>
    </div>
    <div class="filter-bar">
      <button class="chip active" data-filter="all">All</button>
      ${t.map(e=>`<button class="chip" data-filter="${e}">${e}</button>`).join(``)}
    </div>
    <h2 class="section-title">Nearby</h2>
    <div class="restaurant-list" id="restaurant-list">
      ${e.restaurants.map(e=>B(e)).join(``)}
    </div>
  `}function B(e){let t=e.openNow===!0?`<span class="badge-open">Open</span>`:e.openNow===!1?`<span class="badge-closed">Closed</span>`:``,n=e.photo?`<img class="restaurant-img" src="${e.photo}" alt="" loading="lazy" onerror="this.outerHTML='<div class=\\'restaurant-img\\'>🍽️</div>'" />`:`<div class="restaurant-img">🍽️</div>`;return`
    <button class="restaurant-card" data-restaurant="${e.id}" data-cuisine="${e.cuisine}">
      ${n}
      <div class="restaurant-info">
        <div class="restaurant-name">${e.name}</div>
        <div class="restaurant-meta">
          ${e.rating?`<span class="rating">★ ${e.rating.toFixed(1)}</span>`:``}
          <span>${e.distance.toFixed(1)} mi</span>
          <span>${e.eta}</span>
          <span>${e.cuisine}</span>
          ${t}
        </div>
      </div>
    </button>
  `}function V(e){let t=e.selectedRestaurant;return t?`
    <div class="restaurant-hero">
      ${t.photo?`<img src="${t.photo}" alt="" /><div class="restaurant-hero-overlay"></div>`:``}
      <div class="restaurant-hero-text">
        <h2>${t.name}</h2>
        <p>${t.cuisine} · ${t.distance?.toFixed(1)||`?`} mi · ${t.eta||`25 min`}</p>
      </div>
    </div>
    <h2 class="section-title">Menu</h2>
    <div class="menu-list">
      ${e.menu.map(e=>`
        <div class="menu-item">
          <div class="menu-emoji">${e.image}</div>
          <div class="menu-details">
            <div class="menu-name">${e.name}</div>
            <div class="menu-desc">${e.description}</div>
            <div class="menu-row">
              <span class="menu-price">${E(e.price)}</span>
              <button class="add-btn" data-add="${e.id}">Add</button>
            </div>
          </div>
        </div>
      `).join(``)}
    </div>
    ${e.cart.length>0?`
      <div class="sticky-cta no-nav">
        <button class="cta-btn" data-action="cart">View Cart · ${E(d())}</button>
      </div>
    `:``}
  `:``}function H(e){if(e.cart.length===0)return`<div class="empty-state"><p>Your cart is empty</p><p style="margin-top:8px;font-size:0.875rem">Browse nearby restaurants and add some virtual treats!</p></div>`;let t={};e.cart.forEach(e=>{t[e.restaurantName]||(t[e.restaurantName]=[]),t[e.restaurantName].push(e)});let n=d(),r=1.99,i=n+0+r;return`
    <div class="cart-list">
      ${Object.entries(t).map(([e,t])=>`
        <div class="cart-group">
          <div class="cart-group-title">${e}</div>
          ${t.map(e=>`
            <div class="cart-item">
              <div class="cart-item-info">
                <div class="cart-item-name">${e.name}</div>
                <div class="cart-item-price">${E(e.price)}</div>
              </div>
              <div class="qty-control">
                <button class="qty-btn" data-qty-minus="${e.id}" data-restaurant="${e.restaurantId}">−</button>
                <span class="qty-num">${e.quantity}</span>
                <button class="qty-btn" data-qty-plus="${e.id}" data-restaurant="${e.restaurantId}">+</button>
              </div>
            </div>
          `).join(``)}
        </div>
      `).join(``)}
    </div>
    <div class="cart-summary">
      <div class="summary-row"><span>Subtotal</span><span>${E(n)}</span></div>
      <div class="summary-row"><span>Delivery</span><span>Free (virtual!)</span></div>
      <div class="summary-row"><span>Service fee</span><span>${E(r)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${E(i)}</span></div>
    </div>
    <div class="sticky-cta">
      <button class="cta-btn" data-action="checkout">Checkout · ${E(i)}</button>
    </div>
  `}function U(t){let n=d()+1.99;return`
    <div class="disclaimer">
      🪟 <strong>WindowSmash is simulated.</strong> No restaurant is contacted and no food is ordered or delivered. Enjoy the dopamine, skip the calories.
    </div>
    <div class="checkout-section">
      <h3>Order Summary</h3>
      ${t.cart.map(e=>`
        <div class="summary-row"><span>${e.quantity}× ${e.name}</span><span>${E(e.price*e.quantity)}</span></div>
      `).join(``)}
      <div class="summary-row total"><span>Total</span><span>${E(n)}</span></div>
    </div>
    <div class="checkout-section">
      <h3>Send a tip 💸</h3>
      <p style="font-size:0.8125rem;color:var(--text-muted);margin-bottom:12px">Enjoying the zero-calorie experience? Tips are optional and go directly to the creator.</p>
      <div class="tip-options">
        <a class="tip-btn" href="${e.venmo.url}" target="_blank" rel="noopener">
          <div class="tip-icon venmo">V</div>
          <div>
            <div class="tip-label">${e.venmo.label}</div>
            <div class="tip-handle">${e.venmo.handle}</div>
          </div>
        </a>
        <a class="tip-btn" href="${e.cashapp.url}" target="_blank" rel="noopener">
          <div class="tip-icon cashapp">$</div>
          <div>
            <div class="tip-label">${e.cashapp.label}</div>
            <div class="tip-handle">${e.cashapp.handle}</div>
          </div>
        </a>
      </div>
    </div>
    <div class="sticky-cta">
      <button class="cta-btn" data-action="place-order">Place Order · ${E(n)}</button>
    </div>
  `}function W(e){if(!e.order)return`<div class="empty-state"><p>No active orders</p><p style="margin-top:8px;font-size:0.875rem">Place a virtual order to feel the rush!</p></div>`;let t=e.order,n=Math.floor((Date.now()-t.placedAt)/6e4);return`
    <div class="tracking">
      <div class="tracking-emoji">🛵💨</div>
      <h2>It's on its way!</h2>
      <p>ETA ~${Math.max(1,t.etaMinutes-n)} min · Order ${t.id}</p>
      <div class="progress-track"><div class="progress-fill"></div></div>
    </div>
    <div class="order-card">
      <h4>Your virtual order</h4>
      ${t.items.map(e=>`
        <div class="order-item-row">
          <span>${e.quantity}× ${e.name}</span>
          <span>${E(e.price*e.quantity)}</span>
        </div>
      `).join(``)}
      <div class="order-item-row" style="font-weight:700;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">
        <span>Total (not charged)</span>
        <span>${E(t.total+1.99)}</span>
      </div>
    </div>
    <div class="zero-cal">
      ✅ Zero calories consumed. Maximum satisfaction achieved. The driver is imaginary but your self-control is real.
    </div>
    <div style="padding:0 16px 24px">
      <button class="cta-btn" data-action="home">Order Again</button>
    </div>
  `}function G(e){let t=e.view===`restaurant`||e.view===`checkout`,n=[`restaurant`,`cart`,`checkout`].includes(e.view),r={cart:`Cart`,checkout:`Checkout`,restaurant:``},i=``;switch(e.view){case`home`:i=z(e);break;case`restaurant`:i=V(e);break;case`cart`:i=H(e);break;case`checkout`:i=U(e);break;case`tracking`:i=W(e);break}let a=L(e.view);A.innerHTML=`
    ${I(e,{showBack:n,title:r[e.view]})}
    <main class="main ${t?`no-nav`:``}">${i}</main>
    ${t?``:`
      <nav class="bottom-nav">
        <button class="nav-item ${a(`home`)?`active`:``}" data-nav="home">${P(`home`)}Home</button>
        <button class="nav-item ${a(`cart`)?`active`:``}" data-nav="cart">${P(`bag`)}Cart</button>
        <button class="nav-item ${a(`tracking`)?`active`:``}" data-nav="tracking">${P(`orders`)}Orders</button>
      </nav>
    `}
  `}function K(){A.addEventListener(`click`,e=>{let t=i(),n=e.target.closest(`[data-nav]`);if(n){let e=n.dataset.nav;e===`home`?s({view:`home`,selectedRestaurant:null}):e===`cart`?s({view:(t.cart.length,`cart`)}):e===`tracking`&&s({view:`tracking`});return}let r=e.target.closest(`[data-action]`);if(r){let e=r.dataset.action;if(e===`back`)t.view===`checkout`?s({view:`cart`}):t.view===`cart`?s({view:`home`}):t.view===`restaurant`&&s({view:`home`,selectedRestaurant:null});else if(e===`cart`)s({view:`cart`});else if(e===`checkout`)s({view:`checkout`});else if(e===`place-order`)p(),N(`Order placed! 🎉`);else if(e===`home`)s({view:`home`,order:null});else if(e===`retry`)F();else if(e===`save-key`){let e=document.getElementById(`api-key`);e?.value&&(c(e.value),F())}return}let a=e.target.closest(`[data-restaurant]`);if(a&&!a.dataset.qtyMinus&&!a.dataset.qtyPlus){let e=t.restaurants.find(e=>e.id===a.dataset.restaurant);e&&s({view:`restaurant`,selectedRestaurant:e,menu:w(e)});return}let o=e.target.closest(`[data-add]`);if(o&&t.selectedRestaurant){let e=t.menu.find(e=>e.id===o.dataset.add);e&&(l(e,t.selectedRestaurant),N(`Added ${e.name}`));return}let d=e.target.closest(`[data-qty-minus]`);if(d){u(d.dataset.qtyMinus,d.dataset.restaurant,-1);return}let f=e.target.closest(`[data-qty-plus]`);if(f){u(f.dataset.qtyPlus,f.dataset.restaurant,1);return}let m=e.target.closest(`[data-filter]`);if(m){document.querySelectorAll(`.chip`).forEach(e=>e.classList.remove(`active`)),m.classList.add(`active`);let e=m.dataset.filter;document.querySelectorAll(`.restaurant-card`).forEach(t=>{let n=e===`all`||t.dataset.cuisine===e;t.style.display=n?``:`none`})}})}a(G),K(),G(i()),M()?F():s({loading:!1,error:`api_key_required`});
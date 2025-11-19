import{C as $,m as T}from"./index.js";const P=`<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="coinGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fff7a1"/>
      <stop offset="50%" stop-color="#f7c531"/>
      <stop offset="100%" stop-color="#ffdb62"/>
    </linearGradient>
  </defs>
  <circle cx="32" cy="32" r="28" fill="url(#coinGradient)" stroke="#cf942c" stroke-width="4"/>
  <rect x="28" y="14" width="8" height="36" rx="4" fill="#cf942c"/>
  <rect x="24" y="20" width="16" height="24" rx="4" fill="#ffefba"/>
</svg>
`,z=`<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="starGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fff8a8"/>
      <stop offset="100%" stop-color="#ffce33"/>
    </linearGradient>
  </defs>
  <path d="M40 4l10.4 21.6 23.6 3.4-17 16.6 4 23.4L40 58 18.9 69l4-23.4-17-16.6 23.6-3.4z" fill="url(#starGrad)" stroke="#c68b1e" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="32" cy="36" r="4" fill="#42250b"/>
  <circle cx="48" cy="36" r="4" fill="#42250b"/>
</svg>
`,V=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" role="img" aria-label="Superplumber style mushroom">
  <defs>
    <linearGradient id="capGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ff5f6d" />
      <stop offset="100%" stop-color="#f43834" />
    </linearGradient>
    <linearGradient id="stemGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffe5c4" />
      <stop offset="100%" stop-color="#f2c08c" />
    </linearGradient>
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="160%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#000" flood-opacity="0.25" />
    </filter>
  </defs>

  <g filter="url(#dropShadow)">
    <path d="M26 86c0-44 42-74 84-74s84 30 84 74c0 24-13 44-32 51H58C39 130 26 110 26 86z" fill="url(#capGradient)" stroke="#b01a24" stroke-width="8" stroke-linejoin="round" />
    <circle cx="76" cy="92" r="26" fill="#fff8e4" stroke="#f5d4a4" stroke-width="6" />
    <circle cx="144" cy="92" r="26" fill="#fff8e4" stroke="#f5d4a4" stroke-width="6" />
    <path d="M74 132h72v42c0 18-16 34-36 34s-36-16-36-34z" fill="url(#stemGradient)" stroke="#c48b4c" stroke-width="8" />
    <circle cx="94" cy="158" r="18" fill="#4f2d16" />
    <circle cx="126" cy="158" r="18" fill="#4f2d16" />
  </g>
</svg>
`,B=`<svg width="120" height="140" viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Fire Flower">
  <defs>
    <linearGradient id="petal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff176"/>
      <stop offset="100%" stop-color="#ff8f00"/>
    </linearGradient>
    <linearGradient id="stem" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#66bb6a"/>
      <stop offset="100%" stop-color="#2e7d32"/>
    </linearGradient>
  </defs>
  <ellipse cx="60" cy="50" rx="48" ry="36" fill="url(#petal)" stroke="#f4511e" stroke-width="6"/>
  <ellipse cx="60" cy="50" rx="26" ry="18" fill="#ffe082" stroke="#fdd835" stroke-width="4"/>
  <circle cx="47" cy="50" r="8" fill="#1a237e"/>
  <circle cx="73" cy="50" r="8" fill="#1a237e"/>
  <rect x="54" y="68" width="12" height="26" fill="#8bc34a"/>
  <path d="M40 94h40v8H40z" fill="#43a047"/>
  <path d="M32 102h56v12H32z" fill="#388e3c"/>
  <path d="M40 114h40v10H40z" fill="#2e7d32"/>
  <path d="M45 124h30v10H45z" fill="#1b5e20"/>
  <path d="M40 94c-8 0-14 10-14 22h12c0-6 3-12 8-12z" fill="#66bb6a"/>
  <path d="M80 94c8 0 14 10 14 22H82c0-6-3-12-8-12z" fill="#66bb6a"/>
  <rect x="52" y="90" width="16" height="12" fill="url(#stem)"/>
</svg>
`,x=t=>{if(typeof t!="string")return"";const e=t.replace(/\s+/g," ").trim();return`data:image/svg+xml,${encodeURIComponent(e)}`},H=x(P),U=x(z),q=x(V),E=x(B),R=10,j=5,W=1400,X=2600,J=12,N=[{name:"star",src:U,min:32,max:58},{name:"coin",src:H,min:30,max:48},{name:"mushroom",src:q,min:40,max:60},{name:"flower",src:E,min:36,max:56}],K=30*1e3,Q=2*60*1e3,u=new Map,l={data:null,timestamp:0,promise:null};let v=!1,b=!1,d=null,f=null,h=null,w=null,m=0,p=0;const y=window.matchMedia("(prefers-reduced-motion: reduce)");function C(t){if("requestIdleCallback"in window){window.requestIdleCallback(t,{timeout:1200});return}window.setTimeout(t,0)}function Y(){if(f&&document.body.contains(f))return f;const t=document.createElement("div");return t.className="superplumber-coin-container",document.body.appendChild(t),f=t,t}function A(t){const e=document.createElement("span");e.className="superplumber-coin",e.style.left=`${Math.random()*100}%`,e.style.bottom=`${Math.random()*-30}px`;const n=5+Math.random()*3;e.style.animationDuration=`${n}s`,t.appendChild(e),m+=1;const r=()=>{e.removeEventListener("animationend",r),e.remove(),m=Math.max(0,m-1)};e.addEventListener("animationend",r)}function F(t){const e=document.createElement("span");e.className="superplumber-star",e.style.left=`${Math.random()*100}%`,e.style.bottom=`${Math.random()*-40}px`;const n=6+Math.random()*4;e.style.animationDuration=`${n}s`,t.appendChild(e),p+=1;const r=()=>{e.removeEventListener("animationend",r),e.remove(),p=Math.max(0,p-1)};e.addEventListener("animationend",r)}function g(){h&&(window.clearInterval(h),h=null),w&&(window.clearInterval(w),w=null),f&&(f.remove(),f=null),m=0,p=0,v=!1}function S(t=!1){if(y.matches){g();return}if(v&&!t)return;t&&g(),v=!0;const e=Y();for(let n=0;n<4;n+=1)A(e);for(let n=0;n<2;n+=1)F(e);h=window.setInterval(()=>{document.hidden||m<R&&A(e)},W),w=window.setInterval(()=>{document.hidden||p<j&&F(e)},X)}y.addEventListener("change",t=>{t.matches?(g(),I()):(b=!1,C(()=>{M(),S(!0)}))});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",G,{once:!0}):G();function Z(){if(d&&document.body.contains(d))return d;const t=document.createElement("div");return t.className="superplumber-floating-icons",document.body.appendChild(t),d=t,t}function I(){d&&(d.remove(),d=null),b=!1}function tt(t){for(let e=0;e<20;e+=1){const n=8+Math.random()*74,r=4+Math.random()*92;if(!t.some(o=>{const s=o.left-r,a=o.top-n;return Math.sqrt(s*s+a*a)<10}))return{top:n,left:r}}return{top:10+Math.random()*70,left:6+Math.random()*88}}function M(){if(y.matches){I();return}if(b)return;b=!0;const t=Z(),e=[],n=J;t.textContent="";for(let r=0;r<n;r+=1){const i=N[r%N.length],o=document.createElement("img");o.src=i.src,o.alt="",o.loading="lazy",o.decoding="async",o.className=`superplumber-floating-icon superplumber-floating-icon--${i.name}`;const s=i.min+Math.random()*(i.max-i.min);o.style.width=`${s}px`;const a=tt(e);e.push(a),o.style.top=`${a.top}%`,o.style.left=`${a.left}%`;const c=7+Math.random()*6;o.style.animationDuration=`${c}s`,o.style.animationDelay=`${Math.random()*3}s`,t.appendChild(o)}}function G(){et(),C(()=>{M(),S()})}window.addEventListener("pagehide",()=>{g(),I()});window.addEventListener("pageshow",t=>{t.persisted&&C(()=>{M(),S(!0)})});function et(){var r,i;const t=document.querySelector(".js-superplumber-score"),e=document.querySelector(".js-superplumber-rank");if(!t&&!e)return;if(!Boolean(((r=window==null?void 0:window.init)==null?void 0:r.userId)||((i=window==null?void 0:window.init)==null?void 0:i.teamId))){if(t){const o=Number(t.dataset.superplumberScore||0);t.textContent=_(o)}e&&(e.textContent=D(Number(e.dataset.superplumberRank||0)));return}nt(t,e)}async function nt(t,e){var r,i,o,s;const n=rt();if(!!n)try{const a=await ot(n.account),c=Number((s=(o=(r=a==null?void 0:a.data)==null?void 0:r.score)!=null?o:(i=t==null?void 0:t.dataset)==null?void 0:i.superplumberScore)!=null?s:0),k=await st(a,e);t&&(t.textContent=_(c),t.dataset.superplumberScore=String(c)),e&&(e.textContent=D(k),e.dataset.superplumberRank=String(k))}catch(a){console.warn("Unable to update Superplumber status bar",a)}}function rt(){const t=(window==null?void 0:window.init)||{};return!t.userId&&!t.teamId?null:t.userMode==="teams"&&t.teamId?{account:"/api/v1/teams/me"}:{account:"/api/v1/users/me"}}async function ot(t){var i,o;const e=u.get(t),n=Date.now();if(e&&e.data&&n-e.timestamp<K)return e.data;if(e&&e.promise)return e.promise;const r=L(t).then(s=>(u.set(t,{data:s,timestamp:Date.now(),promise:null}),s)).catch(s=>{const a=u.get(t)||{};throw u.set(t,{data:a.data||null,timestamp:a.timestamp||0,promise:null}),s});return u.set(t,{data:(i=e==null?void 0:e.data)!=null?i:null,timestamp:(o=e==null?void 0:e.timestamp)!=null?o:0,promise:r}),r}async function L(t){var r;const e=((r=window==null?void 0:window.CTFd)==null?void 0:r.fetch)||window.fetch;if(typeof e!="function")throw new Error("Fetch API unavailable");const n=await e(t,{credentials:"same-origin"});if(!n.ok)throw new Error(`Request failed: ${n.status}`);return n.json()}function _(t){return(Number.isFinite(t)?Math.max(0,Math.floor(t)):0).toString().padStart(6,"0")}function D(t){const e=Number.isFinite(t)?Math.max(0,Math.floor(t)):0;return e<=0?"#---":e>=1e3?`#${e}`:`#${e.toString().padStart(3,"0")}`}function it(t){var r,i,o,s,a;const e=(a=(o=(r=t==null?void 0:t.data)==null?void 0:r.place)!=null?o:(i=t==null?void 0:t.data)==null?void 0:i.rank)!=null?a:(s=t==null?void 0:t.data)==null?void 0:s.position,n=Number(e);return Number.isFinite(n)&&n>0?n:null}function at(t){var r,i;const e=(i=(r=t==null?void 0:t.dataset)==null?void 0:r.superplumberRank)!=null?i:0,n=Number(e);return Number.isFinite(n)?n:0}async function st(t,e){const n=it(t);if(n)return n;if(e){const r=await lt(t);if(r)return r}return at(e)}async function lt(t){var i;const e=Number((i=t==null?void 0:t.data)==null?void 0:i.id);if(!Number.isFinite(e)||e<=0)return null;let n;try{n=await ft()}catch(o){return console.warn("Unable to fetch scoreboard for rank fallback",o),null}if(!Array.isArray(n)||n.length===0)return null;const r=dt(t);for(let o=0;o<n.length;o+=1){const s=n[o];if(!!s&&ct(s,e,r))return o+1}return null}function ct(t,e,n){const r=O((t==null?void 0:t.account_url)||(t==null?void 0:t.url)||"");return r&&n&&r===n?!0:[t==null?void 0:t.account_id,t==null?void 0:t.team_id,t==null?void 0:t.user_id,t==null?void 0:t.id].some(o=>Number(o)===e)}function dt(t){var s,a,c;const e=Number((s=t==null?void 0:t.data)==null?void 0:s.id);if(!Number.isFinite(e)||e<=0)return null;const n=(window==null?void 0:window.init)||{},i=(n.userMode||((c=(a=$)==null?void 0:a.config)==null?void 0:c.userMode))==="teams"?"/teams":"/users",o=n.urlRoot||"";return O(`${o}${i}/${e}`)}function O(t){var e;if(typeof t!="string"||t.length===0)return null;try{return new URL(t,window.location.origin).pathname.replace(/\/+$/,"")}catch{const r=((e=window==null?void 0:window.init)==null?void 0:e.urlRoot)||"";return t.replace(r,"").replace(/\/+$/,"")}}async function ft(){const t=Date.now();if(Array.isArray(l.data)&&t-l.timestamp<Q)return l.data;if(l.promise)return l.promise;const e=L("/api/v1/scoreboard").then(n=>{const r=Array.isArray(n==null?void 0:n.data)?n.data:[];return l.data=r,l.timestamp=Date.now(),l.promise=null,r}).catch(n=>{throw l.promise=null,n});return l.promise=e,e}window.CTFd=$;window.Alpine=T;T.start();

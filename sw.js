const SHELL='html-game-shell-v5';
const GAME_CACHE='html-game-files-v1';
const CORE=['./','./index.html','./database/games.json','./manifest.json','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(SHELL);await c.addAll(CORE);await self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('html-game-shell-')&&k!==SHELL).map(k=>caches.delete(k)));await self.clients.claim()})()));
self.addEventListener('fetch',e=>{
 const req=e.request;if(req.method!=='GET')return;const u=new URL(req.url);if(u.origin!==self.location.origin)return;
 if(u.pathname.endsWith('/database/games.json')){e.respondWith((async()=>{try{const fresh=await fetch(req,{cache:'no-store'});if(fresh.ok){const c=await caches.open(SHELL);await c.put(req,fresh.clone())}return fresh}catch(err){return (await caches.match(req))||(await caches.match('./database/games.json'))||Response.error()}})());return}
 e.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;try{const response=await fetch(req);if(response.ok){const c=await caches.open(SHELL);c.put(req,response.clone())}return response}catch(err){return (await caches.match('./index.html'))||Response.error()}})());
});
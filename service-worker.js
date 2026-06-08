/* ========================================
   像素英语世界 - Service Worker
   实现离线缓存和PWA功能
   ======================================== */

const CACHE_NAME = 'pixel-english-world-v1.0';
const CACHE_VERSION = 'v1.0';

// 需要缓存的核心资源
const CORE_RESOURCES = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/manifest.json'
];

// 安装阶段 - 缓存核心资源
self.addEventListener('install', function(event) {
  console.log('[PWA] Service Worker 安装中...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('[PWA] 缓存核心资源');
      return cache.addAll(CORE_RESOURCES).catch(function(error) {
        console.error('[PWA] 缓存资源失败:', error);
      });
    }).then(function() {
      console.log('[PWA] 安装完成，跳过等待');
      return self.skipWaiting();
    })
  );
});

// 激活阶段 - 清理旧缓存
self.addEventListener('activate', function(event) {
  console.log('[PWA] Service Worker 激活中...');
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // 删除旧版本缓存
          return cacheName.startsWith('pixel-english-world-') && 
                 cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          console.log('[PWA] 删除旧缓存:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      console.log('[PWA] 激活完成，立即接管所有客户端');
      return self.clients.claim();
    })
  );
});

// 拦截请求 - 缓存优先策略
self.addEventListener('fetch', function(event) {
  const request = event.request;
  
  // 只处理GET请求
  if (request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(request).then(function(cachedResponse) {
      // 如果缓存中有，直接返回缓存
      if (cachedResponse) {
        console.log('[PWA] 从缓存加载:', request.url);
        return cachedResponse;
      }
      
      // 否则发起网络请求
      console.log('[PWA] 网络请求:', request.url);
      return fetch(request).then(function(networkResponse) {
        // 如果响应有效，添加到缓存
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(request, responseClone);
            console.log('[PWA] 已缓存新资源:', request.url);
          });
        }
        return networkResponse;
      }).catch(function() {
        // 网络失败时，如果是HTML请求，返回首页
        if (request.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
        return null;
      });
    })
  );
});

// 消息监听
self.addEventListener('message', function(event) {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data === 'getVersion') {
    event.ports[0].postMessage({
      version: CACHE_VERSION,
      cacheName: CACHE_NAME
    });
  }
});

console.log('[PWA] Service Worker 脚本已加载');
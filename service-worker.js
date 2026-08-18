self.addEventListener('install', function(event){
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event){
  var data = {};
  try{ data = event.data ? event.data.json() : {}; }catch(e){}
  var title = data.title || 'Mi Planner';
  var options = {
    body: data.body || 'Tienes un pendiente por vencer.',
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    data: { url: data.url || './index.html' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event){
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || './index.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList){
      for(var i = 0; i < clientList.length; i++){
        if('focus' in clientList[i]) return clientList[i].focus();
      }
      if(self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});

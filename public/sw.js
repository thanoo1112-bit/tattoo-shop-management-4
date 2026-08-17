self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.message,
      icon: '/icon.png', // Assuming there's an icon, if not fallback to default
      badge: '/badge.png',
      data: {
        url: data.url || '/'
      },
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      requireInteraction: true // Keeps the notification on screen until user interacts
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

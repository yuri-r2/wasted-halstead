var cacheName = 'GM-v3';
var appShellFiles = [
  './',
  './index.html',
  './favicon.ico',
  './fonts/BRLNSDB.css',
  './fonts/BRLNSDB.eot',
  './fonts/BRLNSDB.otf',
  './fonts/BRLNSDB.svg',
  './fonts/BRLNSDB.ttf',
  './fonts/BRLNSDB.woff',
  './fonts/Pixel.css',
  './fonts/Pixel.woff',
  './sfx/audio-button.m4a',
  './sfx/audio-button.mp3',
  './sfx/audio-button.ogg',
  './sfx/GameOver.mp3',
  './sfx/TrashClose.mp3',
  './sfx/TexasFight.mp3',
  './img/icons/icon-32.png',
  './img/icons/icon-64.png',
  './img/icons/icon-96.png',
  './img/icons/icon-128.png',
  './img/icons/icon-168.png',
  './img/icons/icon-192.png',
  './img/icons/icon-256.png',
  './img/icons/icon-512.png',
  './js/phaser.3.18.1.min.js',
  './js/plugins/webfont.js',
  './js/start.js',
  './js/Boot.js',
  './js/Preloader.js',
  './js/MainMenu.js',
  './js/Story.js',
  './js/Game.js',
  './img/background.png',
  './img/button-back.png',
  './img/button-home.png',
  './img/button-mainmenu.png',
  './img/button-pause.png',
  './img/button-start.png',
  './img/button-tryagain.png',
  './img/trash.png',
  './img/recycle.png',
  './img/compost.png',
  './img/WastedInHalsteadLogo.png',
  './img/loading-background.png',
  './img/overlay.png',
  './img/particle.png',
  './img/pattern.png',
  './img/title.png',

  './img/compost-clamshell.png',
  './img/compost-coffeegrounds.png',
  './img/compost-dylans.png',
  './img/compost-eggshells.png',
  './img/compost-papertowel.png',
  './img/compost-parchment.png',

  './img/trash-plasticbag.png',
  './img/trash-bluebell.png',
  './img/trash-bubblewrap.png',
  './img/trash-chewinggum.png',
  './img/trash-ketchup.png',
  './img/trash-milkcarton.png',

  './img/recycle-spaghettios.png',
  './img/recycle-aluminium.png',
  './img/recycle-cakecontainer.png',
  './img/recycle-cardboard.png',
  './img/recycle-cheerios.png',
  './img/recycle-dasani.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(appShellFiles);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      return r || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
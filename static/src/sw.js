var cacheName = 'EPT-v3';
var appShellFiles = [
  './',
  './static/index.html',
  './static/favicon.ico',
  './static/fonts/BRLNSDB.css',
  './static/fonts/BRLNSDB.eot',
  './static/fonts/BRLNSDB.otf',
  './static/fonts/BRLNSDB.svg',
  './static/fonts/BRLNSDB.ttf',
  './static/fonts/BRLNSDB.woff',
  './static/fonts/Pixel.css',
  './static/fonts/Pixel.woff',
  './static/sfx/audio-button.m4a',
  './static/sfx/audio-button.mp3',
  './static/sfx/audio-button.ogg',
  './static/sfx/GameOver.mp3',
  './static/sfx/TrashClose.mp3',
  './static/sfx/music-bitsnbites-liver.m4a',
  './static/sfx/music-bitsnbites-liver.mp3',
  './static/sfx/music-bitsnbites-liver.ogg',
  './static/sfx/TexasFight.mp3',
  './static/img/icons/icon-32.png',
  './static/img/icons/icon-64.png',
  './static/img/icons/icon-96.png',
  './static/img/icons/icon-128.png',
  './static/img/icons/icon-168.png',
  './static/img/icons/icon-192.png',
  './static/img/icons/icon-256.png',
  './static/img/icons/icon-512.png',
  './static/js/phaser.3.18.1.min.js',
  './static/js/plugins/webfont.js',
  './static/js/start.js',
  './static/js/Boot.js',
  './static/js/Preloader.js',
  './static/js/MainMenu.js',
  './static/js/Settings.js',
  './static/js/Story.js',
  './static/js/Game.js',
  './static/img/background.png',
  './static/img/banner-beer.png',
  './static/img/button-achievements.png',
  './static/img/button-back.png',
  './static/img/button-beer.png',
  './static/img/button-credits.png',
  './static/img/button-home.png',
  './static/img/button-mainmenu.png',
  './static/img/button-music-off.png',
  './static/img/button-music-on.png',
  './static/img/button-pause.png',
  './static/img/button-settings.png',
  './static/img/button-sound-off.png',
  './static/img/button-sound-on.png',
  './static/img/button-start.png',
  './static/img/button-tryagain.png',
  './static/img/clickme.png',
  './static/img/trash.png',
  './static/img/recycle.png',
  './static/img/compost.png',
  './static/img/bear.png',
  './static/img/loading-background.png',
  './static/img/logo-enclave.png',
  './static/img/overlay.png',
  './static/img/particle.png',
  './static/img/pattern.png',
  './static/img/title.png',
  './static/img/bear.png',
  './static/img/compost-clamshell.png',
  './static/img/compost-coffeegrounds.png',
  './static/img/compost-dylans.png',
  './static/img/compost-eggshells.png',
  './static/img/compost-papertowel.png',
  './static/img/compost-parchment.png',
  './static/img/trash-plasticbag.png',
  './static/img/trash-bluebell.png',
  './static/img/trash-bubblewrap.png',
  './static/img/trash-chewinggum.png',
  './static/img/trash-ketchup.png',
  './static/img/trash-milkcarton.png',
  './static/img/recycle-spaghettios.png',
  './static/img/recycle-aluminium.png',
  './static/img/recycle-cakecontainer.png',
  './static/img/recycle-cardboard.png',
  './static/img/recycle-cheerios.png',
  './static/img/recycle-dasani.png'
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
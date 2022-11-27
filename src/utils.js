

const COLOR_PRIMARY = 0xC0C741;
const COLOR_SECONDARY = 0xE4943A;
const COLOR_LIGHT = 0xC0C741;
const COLOR_DARK = 0x1F0E1C;
var GM = {};
GM.Sfx = {
  init: function (game) {
    game.sound.pauseOnBlur = false;
    GM.Sfx.music = game.sound.add('music-theme');
    GM.Sfx.music.volume = 0.3;
    GM.Sfx.sounds = [];
    GM.Sfx.sounds['click'] = game.sound.add('sound-click');
    GM.Sfx.sounds['gameover'] = game.sound.add('sound-gameover');
    GM.Sfx.sounds['trash'] = game.sound.add('sound-trash');
    game.input.on('pointerdown', function () {
      if (!GM.Sfx.music.isPlaying){
        game.sound.unlock();
        if (!game.sound.locked) {
          GM.Sfx.music.play({loop:true});
        }
        else{  // IF Not wait on unlock event 
          game.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
            GM.Sfx.music.play({loop:true});
          })
        }
      }
    }, game);
  },
  play: function(audio, game) {
    if(GM.Sfx.sounds && GM.Sfx.sounds[audio]) {
      if (!game.sound.locked) {
        GM.Sfx.sounds[audio].play();
      }
      else{  // IF Not wait on unlock event 
        game.sound.unlock();
        game.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
          GM.Sfx.sounds[audio].play();
        })
      }
      
    }
  }
}

// GM.Sfx = {
// 	manage: function(type, mode, game, button, label) {
// 		switch(mode) {
// 			case 'init': {
//         GM.Storage.initUnset('GM-'+type, true);
//         GM.Sfx.status = GM.Sfx.status || [];
//         GM.Sfx.status[type] = GM.Storage.get('GM-'+type);
//         if(type == 'sound') {
//           GM.Sfx.sounds = [];
//           GM.Sfx.sounds['click'] = game.sound.add('sound-click');
//         }
//         else { // music
//           if(!GM.Sfx.music || !GM.Sfx.music.isPlaying) {
//             GM.Sfx.music = game.sound.add('music-theme');
//             GM.Sfx.music.volume = 0.5;
//           }
//         }
// 				break;
// 			}
// 			case 'on': {
// 				GM.Sfx.status[type] = true;
// 				break;
// 			}
// 			case 'off': {
// 				GM.Sfx.status[type] = false;
// 				break;
// 			}
// 			case 'switch': {
// 				GM.Sfx.status[type] =! GM.Sfx.status[type];
// 				break;
// 			}
// 			default: {}
//     }
//     GM.Sfx.update(type, button, label);

//     if(type == 'music' && GM.Sfx.music) {
//       if(GM.Sfx.status['music']) {
//         if(!GM.Sfx.music.isPlaying) {
//           GM.Sfx.music.play({loop:true});
//         }
//       }
//       else {
//         GM.Sfx.music.stop();
//       }
//     }

//     GM.Storage.set('GM-'+type, GM.Sfx.status[type]);
// 	},
// 	play: function(audio) {
//     if(audio == 'music') {
//       if(GM.Sfx.status['music'] && GM.Sfx.music && !GM.Sfx.music.isPlaying) {
//         GM.Sfx.music.play({loop:true});
//       }
//     }
//     else { // sound
//       if(GM.Sfx.status['sound'] && GM.Sfx.sounds && GM.Sfx.sounds[audio]) {
//         GM.Sfx.sounds[audio].play();
//       }
//     }
//   },
//   update: function(type, button, label) {
//     if(button) {
//       if(GM.Sfx.status[type]) {
//         button.setTexture('button-'+type+'-on');
//       }
//       else {
//         button.setTexture('button-'+type+'-off');
//       }
//     }
//     if(label) {
//       if(GM.Sfx.status[type]) {
//         label.setText(GM.Lang.text[GM.Lang.current][type+'-on']);
//       }
//       else {
//         label.setText(GM.Lang.text[GM.Lang.current][type+'-off']);
//       }
//     }
//   }
// };

GM.fadeOutIn = function(passedCallback, context) {
  context.cameras.main.fadeOut(250);
  context.time.addEvent({
    delay: 250,
    callback: function() {
      context.cameras.main.fadeIn(250);
      passedCallback(context);
    },
    callbackScope: context
  });  
}
GM.fadeOutScene = function(sceneName, context) {
  context.cameras.main.fadeOut(250);
  context.time.addEvent({
      delay: 250,
      callback: function() {
        context.scene.start(sceneName);
      },
      callbackScope: context
  });
};

class Button extends Phaser.GameObjects.Image {
  constructor(x, y, texture, callback, scene, noframes) {
    super(scene, x, y, texture, 0);
    this.setInteractive({ useHandCursor: true });
    
    this.on('pointerup', function() {
      if(!noframes) {
        this.setFrame(1);
      }
    }, this);

    this.on('pointerdown', function() {
      if(!noframes) {
        this.setFrame(2);
      }

      callback.call(scene);
    }, this);

    this.on('pointerover', function() {
      if(!noframes) {
        this.setFrame(1);
      }
    }, this);

    this.on('pointerout', function() {
      if(!noframes) {
        this.setFrame(0);
      }
    }, this);

    scene.add.existing(this);
  }
};

class GameItem extends Phaser.Physics.Matter.Image {
  constructor(type, texture, scene) {
    super(scene.matter.world, GM.world.centerX, GM.world.centerY-270, texture, 0, {circleRadius: 125, frictionAir: 0.15, label: 'GameItem', ignoreGravity: false});
    this.setScale(0.4, 0.4);
    this.setBounce(0);
    this.setDensity(0.1);
    this.type = type;
    //Add Text Descrption
    var fontItem = { font: '15px '+GM.text['FONT'], fill: '#D6DE49', stroke: '#000', strokeThickness: 4, align: 'center' };
    this.text = new Phaser.GameObjects.Text(scene, GM.world.centerX, GM.world.centerY-100, type, fontItem);
    this.text.setOrigin(0.5,0);
    scene.add.existing(this);
    scene.add.existing(this.text);
  }
}

class GameBin extends Phaser.Physics.Matter.Image {
  constructor(type, x, y, scene) {
    var Bodies = Phaser.Physics.Matter.Matter.Bodies;
    super(scene.matter.world, x, y, type, 0);
    this.setRectangle(160, 40, { label: 'bin', isStatic: true, isSensor: true });
    this.setScale(1, 1);
    
    // this.setExistingBody(this.rect);
    this.type = type;
    this.setInteractive({ useHandCursor: true });
    this.on('pointerup', function() {
      this.setFrame(1);
    }, this);

    this.on('pointerdown', function() {
      this.setFrame(1);
    }, this);

    this.on('pointerover', function() {
      this.setFrame(1);
    }, this);

    this.on('pointerout', function() {
      this.setFrame(0);
    }, this);

    this.setOrigin(0.5,0.5);
    this.setAlpha(0);

    

    scene.add.existing(this);
    scene.tweens.add({targets: this, alpha: 1, duration: 500, ease: 'Linear'});
    // scene.tweens.add({targets: this, scale: 1, duration: 500, ease: 'Back'});

    
  }
}

GM.GameManager = {
  binCollision: function (scene, binType, itemType){
    if (itemType === binType){
      
      GM.Sfx.play('trash', scene);
      GM.GameManager.addPoints(scene);
      GM.GameManager.updateItem(scene);
    }
    else {
      GM.GameManager.endGame(scene);
    }
  },
  endGame: function (scene){
    scene._runOnce = false;
    scene.stateStatus = 'gameover';
    GM.Sfx.play('gameover', scene);
  },
  addPoints: function(scene) {
		scene._score += 1;
    
    scene.textScore.setText(GM.text['gameplay-score']+scene._score);
    var randX = Phaser.Math.Between(200, GM.world.width-200);
    var randY = Phaser.Math.Between(200, GM.world.height-200);
		var pointsAdded = scene.add.text(randX, randY, '+1', { font: '48px '+GM.text['FONT'], fill: '#D6DE49', stroke: '#000', strokeThickness: 10 });
		pointsAdded.setOrigin(0.5, 0.5);
    scene.tweens.add({targets: pointsAdded, alpha: 0, y: randY-50, duration: 1000, ease: 'Linear'});
    scene.cameras.main.shake(100, 0.01, true);
  },
  updateItem: function(scene){
		var randomType = types[Math.floor(Math.random() * types.length)];
		// scene.gameItem.type = randomType;
		var randomItem = null;
		var keys = null; 
		var itemDescription = null;
		switch (randomType){
			case 'compost':
				keys = Object.keys(compost_items)
				randomItem = keys[Math.floor(Math.random() * keys.length)];
				//make sure we are getting a different next item 
				while (scene.gameItem && scene.gameItem.texture.key === randomItem){
					randomItem = keys[Math.floor(Math.random() * keys.length)];
				}
				itemDescription = compost_items[randomItem];
				break;
			case 'trash':
				keys = Object.keys(trash_items)
				randomItem = keys[Math.floor(Math.random() * keys.length)];
				//make sure we are getting a different next item 
				while (scene.gameItem && scene.gameItem.texture.key === randomItem){
					randomItem = keys[Math.floor(Math.random() * keys.length)];
				}
				itemDescription = trash_items[randomItem];
				break;
			case 'recycle':
				keys = Object.keys(recycle_items)
				randomItem = keys[Math.floor(Math.random() * keys.length)];
				//make sure we are getting a different next item 
				while (scene.gameItem && scene.gameItem.texture.key === randomItem){
					randomItem = keys[Math.floor(Math.random() * keys.length)];
				}
				itemDescription = recycle_items[randomItem];
				break;
		}
		// scene.gameItem.setTexture(randomItem);
		// scene.gameItem.text.setText(itemDescription);
    // scene.gameItem.setX(300);
    // scene.gameItem.setY(300);
    if (scene.gameItem){
      scene.gameItem.text.destroy();
      scene.gameItem.destroy();
    }
    scene.gameItem = new GameItem(randomType, randomItem, scene); 
    scene.gameItem.text.setText(itemDescription);
    
	}
}

GM.Storage = {
	availability: function() {
		if(!(!(typeof(window.localStorage) === 'undefined'))) {
			console.log('localStorage not available');
			return null;
		}
	},
	get: function(key) {
		this.availability();
		try {
			return JSON.parse(localStorage.getItem(key));
		}
		catch(e) {
			return window.localStorage.getItem(key);
		}
	},
	set: function(key, value) {
		this.availability();
		try {
			window.localStorage.setItem(key, JSON.stringify(value));
		}
		catch(e) {
			if(e == QUOTA_EXCEEDED_ERR) {
				console.log('localStorage quota exceeded');
			}
		}
	},
	initUnset: function(key, value) {
		if(this.get(key) === null) {
			this.set(key, value);
		}
	},
	getFloat: function(key) {
		return parseFloat(this.get(key));
	},
	setHighscore: function(key, value) {
		if(value > this.getFloat(key)) {
			this.set(key, value);
		}
	},
	remove: function(key) {
		this.availability();
		window.localStorage.removeItem(key);
	},
	clear: function() {
		this.availability();
		window.localStorage.clear();
	}
};

GM.Lang = {
  current: 'en',
  options: ['en', 'pl'],
  parseQueryString: function(query) {
    var vars = query.split('&');
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (typeof query_string[pair[0]] === 'undefined') {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
      } else if (typeof query_string[pair[0]] === 'string') {
        var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
        query_string[pair[0]] = arr;
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }
    return query_string;
  },
  updateLanguage: function(lang) {
    var query = window.location.search.substring(1);
    var qs = GM.Lang.parseQueryString(query);
    if(qs && qs['lang']) {
      console.log('LANG: '+qs['lang']);
      GM.Lang.current = qs['lang'];
    } else {
      if(lang) {
        GM.Lang.current = lang;
      }
      else {
        GM.Lang.current = navigator.language;
      }
    }
    if(GM.Lang.options.indexOf(GM.Lang.current) == -1) {
      GM.Lang.current = 'en';
    }
  },
  text: {
    'en': {
      'FONT': 'Pixel',
      'settings': 'SETTINGS',
      'sound-on': 'Sound: ON',
      'sound-off': 'Sound: OFF',
      'music-on': 'Music: ON',
      'music-off': 'Music: OFF',
      'keyboard-info': 'Press K for keyboard shortcuts',
      'credits': 'CREDITS',
      'madeby': 'GM made by',
      'team': 'THE TEAM',
      'coding': 'coding',
      'design': 'design',
      'testing': 'testing',
      'musicby': 'Music by',
      'key-title': 'KEYBOARD SHORTCUTS',
      'key-settings-title': 'Settings',
      'key-settings-onoff': 'S - show/hide settings',
      'key-audio': 'A - turn sound on/off',
      'key-music': 'M - turn music on/off',
      'key-credits': 'C - show/hide credits',
      'key-shortcuts': 'K - show/hide keyboard shortcuts',
      'key-menu': 'Main menu',
      'key-start': 'Enter - start game',
      'key-continue': 'Enter - continue',
      'key-gameplay': 'Gameplay',
      'key-button': 'Enter - activate CLICK ME button',
      'key-pause': 'P - turn pause screen on/off',
      'key-pause-title': 'Pause screen',
      'key-back': 'B - back to main menu',
      'key-return': 'P - return to the game',
      'key-gameover': 'Game over screen',
      'key-try': 'T - try again',
      'gameplay-score': 'Score: ',
      'gameplay-timeleft': 'Time left: ',
      'gameplay-paused': 'PAUSED',
      'gameplay-gameover': 'GAME OVER',
      'menu-highscore': 'Highscore:  ',
      'menu-rank': 'Rank:  ',
      'menu-username': 'Name:  ',
      'screen-story-howto': 'Click on the appropriate\nbin to dispose of the given item!\n\n\n\nif the item requires special\ndisposal - click on the item\nitself to reject it!'
    },
    'pl': {
      'FONT': 'Arial',
      'settings': 'USTAWIENIA',
      'sound-on': 'Dźwięk: WŁ.',
      'sound-off': 'Dźwięk: WYŁ.',
      'music-on': 'Muzyka: WŁ.',
      'music-off': 'Muzyka: WYŁ.',
      'keyboard-info': 'Wciśnij K by zobaczyć skróty klawiszowe',
      'credits': 'AUTORZY',
      'madeby': 'GM stworzone przez',
      'team': 'ZESPÓŁ',
      'coding': 'kodowanie',
      'design': 'grafika',
      'testing': 'testowanie',
      'musicby': 'Muzyka autorstwa',
      'key-title': 'SKRÓTY KLAWISZOWE',
      'key-settings-title': 'Ustawienia',
      'key-settings-onoff': 'S - pokaż/ukryj ustawienia',
      'key-audio': 'A - włącz/wyłącz dźwięk',
      'key-music': 'M - włącz/wyłącz muzykę',
      'key-credits': 'C - pokaż/ukryj autorów',
      'key-shortcuts': 'K - pokaż/ukryj skróty klawiszowe',
      'key-menu': 'Menu główne',
      'key-start': 'Enter - zacznij grę',
      'key-continue': 'Enter - kontynuuj',
      'key-gameplay': 'Rozgrywka',
      'key-button': 'Enter - aktywuj przycisk CLICK ME',
      'key-pause': 'P - włącz/wyłącz pauzę',
      'key-pause-title': 'Ekran pauzy',
      'key-back': 'B - powrót do menu głównego',
      'key-return': 'P - powrót do gry',
      'key-gameover': 'Ekran końca gry',
      'key-try': 'T - spróbuj ponownie',
      'gameplay-score': 'Wynik: ',
      'gameplay-timeleft': 'Pozostały czas: ',
      'gameplay-paused': 'PAUZA',
      'gameplay-gameover': 'KONIEC GRY',
      'menu-highscore': 'Rekord: ',
      'screen-story-howto': 'Ekran fabuły / jak grać'
    }
  }
};

GM.leaderboardManager = {
 initLeaderboard: function(scene){
  const firebaseConfig = {
      apiKey: "AIzaSyAcKoJiaLeGcwvmJBZ6qiI2H0O0ZyKNTU4",
      authDomain: "phaser-waste-leaderboard.firebaseapp.com",
      projectId: "phaser-waste-leaderboard",
      storageBucket: "phaser-waste-leaderboard.appspot.com",
      messagingSenderId: "417569878265",
      appId: "1:417569878265:web:3dc71c82f6d7273a627228"
    };
    var rexFire = scene.plugins.get('rexfirebaseplugin').initializeApp(firebaseConfig);
    var leaderBoard = rexFire.add.leaderBoard({
      root: 'leaderboard-test',
      timeFilters: false,
      boardID: 'mainBoardID',
      tag: 'mainTag',
      pageItemCount: 10
    })
    GM.leaderBoard = leaderBoard;
  },
  displayTopScores: function(scene) {
    GM.leaderBoard.loadFirstPage()
    .then(function(scores) {
        scores.forEach((el, index) => {
            index = index + 1
            var offsetY = index * 30;
            var fontScore = { font: '30px '+GM.text['FONT'], fill: '#D6DE49', stroke: '#000', strokeThickness: 3 };
            var textScore = scene.add.text(30, GM.world.centerY-150 + offsetY, (index + '. ' + el.userName + ': ' + el.score), fontScore);
        });
    })
    .catch(function(error) {console.log(error)})
  },
  getScoreDialog: function (scene, score){
		var scoreDialog = GM.leaderboardManager.createScoreDialog(scene, {
            x: GM.world.centerX,
            y: GM.world.centerY,
            title: 'Enter your name to\nsubmit this score',
            username: GM.userName,
        })
            .on('submit!', function (username) {
                GM.leaderBoard.setUser({
                  userID: GM.Storage.get('userID'),
                  userName: username
                });
                GM.leaderBoard.post(score)
                .then(function(record) {
                  GM.Sfx.play('click', scene);
                  GM.fadeOutScene('MainMenu', scene);
                })
                .catch(function(error) {console.log(error)})
            })
            //.drawBounds(this.add.graphics(), 0xff0000);
            .popUp(500);
	},
  createScoreDialog: function(scene, config, onSubmit){
    const GetValue = Phaser.Utils.Objects.GetValue;
    var username = GetValue(config, 'username', '');
    var title = GetValue(config, 'title', 'Welcome');
    var x = GetValue(config, 'x', 0);
    var y = GetValue(config, 'y', 0);
    var width = GetValue(config, 'width', undefined);
    var height = GetValue(config, 'height', undefined);

    var background = scene.rexUI.add.roundRectangle(0, 0, 10, 10, 10, COLOR_DARK);
    var titleField = scene.add.text(0, 0, title);

    var userNameField = scene.rexUI.add.label({
        orientation: 'x',
        background: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(2, COLOR_LIGHT),
        icon: scene.add.image(0, 0, 'user'),
        text: scene.rexUI.add.BBCodeText(0, 0, username, { fixedWidth: 150, fixedHeight: 36, valign: 'center' }),
        space: { top: 5, bottom: 5, left: 5, right: 5, icon: 10, }
    })
    .setInteractive()
    .on('pointerdown', function () {
        var config = {
            onTextChanged: function(textObject, text) {
                username = text;
                textObject.text = text;
            }
        }
        scene.rexUI.edit(userNameField.getElement('text'), config);
    });

    var loginButton = scene.rexUI.add.label({
        orientation: 'x',
        background: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 10, COLOR_LIGHT),
        text: scene.add.text(0, 0, 'Submit!'),
        space: { top: 8, bottom: 8, left: 8, right: 8 }
    })
    .setInteractive()
    .on('pointerdown', function () {
        loginDialog.emit('submit!', username);
    });

    var loginDialog = scene.rexUI.add.sizer({
      orientation: 'y',
      x: x,
      y: y,
      width: width,
      height: height,
    })
      .addBackground(background)
      .add(titleField, 0, 'center', { top: 10, bottom: 10, left: 10, right: 10 }, false)
      .add(userNameField, 0, 'left', { bottom: 10, left: 10, right: 10 }, true)
      // .add(passwordField, 0, 'left', { bottom: 10, left: 10, right: 10 }, true)
      .add(loginButton, 0, 'center', { bottom: 10, left: 10, right: 10 }, false)
      .layout();

  return loginDialog;
  }
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

// // Usage tracking - remember to replace with your own!
// var head = document.getElementsByTagName('head')[0];
// var script = document.createElement('script');
// script.type = 'text/javascript';
// script.onload = function() {
//   window.dataLayer = window.dataLayer || [];
//   function gtag(){dataLayer.push(arguments);}
//   gtag('js', new Date());
//   gtag('config', 'UA-30485283-26');
// }
// script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-30485283-26';
// head.appendChild(script);